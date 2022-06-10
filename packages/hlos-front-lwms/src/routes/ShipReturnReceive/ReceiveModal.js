import React, { useEffect, useState } from 'react';
import { Checkbox } from 'choerodon-ui';
import {
  DataSet,
  TextField,
  DatePicker,
  NumberField,
  Form,
  Button,
  Lov,
  Modal,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import { TagDS, LotDS, ReasonDS } from '@/stores/shipReturnReceiveDS';
import { getTag, getLot } from '@/services/shipReturnService';
import styles from './index.less';

const preCode = 'lwms.shipReturnReceive';

const tagDSFactory = () => new DataSet(TagDS());
const lotDSFactory = () => new DataSet(LotDS());
const reasonDSFactory = () => new DataSet(ReasonDS());

const ReceiveModal = ({ type, record, onSave, modalList, returnReasonObj }) => {
  const tagDS = useDataSet(tagDSFactory, ReceiveModal);
  const lotDS = useDataSet(lotDSFactory);
  const reasonDS = useDataSet(reasonDSFactory);

  const [ds, setDS] = useState(tagDS);
  const [list, setList] = useState(modalList || []);
  const [totalQty, setTotalQty] = useState(0);
  const [maxLimit, setMaxLimit] = useState(0);
  const [allChecked, changeAllChecked] = useState(false);
  const [initialReturnQty, setInitialReturnQty] = useState(0);

  useEffect(() => {
    if (type === 'TAG') {
      setDS(tagDS);
    } else {
      setDS(lotDS);
    }
    if (!isEmpty(returnReasonObj)) {
      reasonDS.current.set('returnReasonObj', returnReasonObj);
    }
    let qty = 0;
    if (!isEmpty(modalList)) {
      modalList.forEach((i) => {
        qty += i.receivedQty;
      });
    }
    setTotalQty(qty);
    if (modalList) {
      changeAllChecked(modalList.length ? modalList.every((i) => i.checked) : false);
    }
    if (!isEmpty(record)) {
      setInitialReturnQty((record.shippedQty || 0) - (record.returnedQty || 0));
      setMaxLimit((record.shippedQty || 0) - (record.returnedQty || 0));
    }
  }, []);

  const queryFields = () => {
    if (type === 'TAG') {
      return [
        <TextField name="tagCode" onChange={handleTagChange} />,
        <NumberField name="receivedQty" />,
        <TextField name="lotNumber" />,
        <DatePicker name="madeDate" />,
        <DatePicker name="expireDate" />,
      ];
    }
    return [
      <TextField name="lotNumber" onChange={handleLotChange} />,
      <NumberField name="receivedQty" />,
      <DatePicker name="madeDate" />,
      <DatePicker name="expireDate" />,
    ];
  };

  const handleTagChange = async (val) => {
    const res = await getTag({
      tagCode: val,
      itemId: record.itemId,
    });
    if (res && res.content && res.content[0]) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>
            {intl
              .get(`${preCode}.view.message.exit.tag`)
              .d('您录入的标签在系统中已存在，是否继续接收？')}
          </span>
        ),
      });
      checkDate(res.content[0]);
    }
  };

  const handleLotChange = async (val) => {
    const res = await getLot({
      lotNumber: val,
      itemId: record.itemId,
    });
    if (res && res.content && res.content[0]) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>
            {intl
              .get(`${preCode}.view.message.exit.lot`)
              .d('您录入的批次在系统中已存在，是否继续接收？')}
          </span>
        ),
      });
      checkDate(res.content[0]);
    }
  };

  const checkDate = (rec) => {
    const { madeDate, expireDate } = rec;
    if (madeDate) {
      ds.queryDataSet.current.set('madeDate', madeDate);
      ds.queryDataSet.fields.get('madeDate').set('disabled', true);
    } else {
      ds.queryDataSet.current.set('madeDate', null);
      ds.queryDataSet.fields.get('madeDate').set('disabled', false);
    }
    if (expireDate) {
      ds.queryDataSet.current.set('expireDate', expireDate);
      ds.queryDataSet.fields.get('expireDate').set('disabled', true);
    } else {
      ds.queryDataSet.current.set('expireDate', null);
      ds.queryDataSet.fields.get('expireDate').set('expireDate', false);
    }
  };

  const handleAddLine = async () => {
    const validateValue = await ds.queryDataSet.validate();
    if (!validateValue) return;
    const { lotNumber, tagCode, receivedQty } = ds.queryDataSet.current.toJSONData();
    if (
      (tagCode && list.some((i) => i.tagCode === tagCode)) ||
      (lotNumber && list.some((i) => i.lotNumber === lotNumber))
    ) {
      notification.warning({
        message: '编码已存在',
      });
      return;
    }
    if (receivedQty > maxLimit) {
      notification.warning({
        message: '退货数量总数不可大于可退货数量',
      });
      return;
    }
    setMaxLimit(maxLimit - receivedQty);
    const _modalList = list.slice();
    _modalList.push({
      ...ds.queryDataSet.current.toJSONData(),
      key: uuidv4(),
      checked: true,
    });
    let _qty = 0;
    _modalList.forEach((i) => {
      _qty += i.receivedQty;
    });
    setList(_modalList);
    setTotalQty(_qty);
    changeAllChecked(_modalList.every((i) => i.checked));
    ds.queryDataSet.current.reset();
  };

  function handleDelLine() {
    if (!list.some((i) => i.checked)) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const _list = [];
    list.forEach((i) => {
      if (!i.checked) {
        _list.push(i);
      }
    });
    setList(_list);
    changeAllChecked(false);
  }

  function handleItemCheck(data, e) {
    const idx = list.findIndex((i) => i.key === data.key);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    setList(_list);
    changeAllChecked(_list.every((i) => i.checked));
  }

  function handleAllCheck() {
    const _list = list.slice();
    if (allChecked) {
      _list.map((i) => {
        const _i = i;
        _i.checked = false;
        return _i;
      });
    } else {
      _list.map((i) => {
        const _i = i;
        _i.checked = true;
        return _i;
      });
    }
    setList(_list);
    changeAllChecked(!allChecked);
  }

  return (
    <>
      <div className={styles.title}>
        <div>
          <img src={OrderImg} alt="" />
          <span>
            {record.itemCode}-{record.description}
          </span>
        </div>
        <div>
          <img src={OrderImg} alt="" />
          <span>
            {record.soNum}-{record.soLineNum}
          </span>
        </div>
        <div>可退货数量：{initialReturnQty}</div>
        <div>
          原因：
          <Lov dataSet={reasonDS} name="returnReasonObj" noCache />
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
        <Form
          dataSet={ds.queryDataSet}
          labelLayout="placeholder"
          columns={type === 'LOT' ? 4 : 5}
          style={{ flex: 'auto' }}
        >
          {queryFields()}
        </Form>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
          <Button color="primary" onClick={() => handleAddLine()}>
            {intl.get('lwms.common.button.sure').d('确认')}
          </Button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox checked={allChecked} onChange={handleAllCheck} />
              <span>
                {type === 'TAG' ? '标签' : '批次'}（{list.length}）
              </span>
            </th>
            <th>数量（{totalQty}）</th>
            {type === 'TAG' && <th>批次</th>}
            <th>制造日期</th>
            <th>失效日期</th>
          </tr>
        </thead>
        <tbody>
          {list.map((i) => {
            if (type === 'TAG') {
              return (
                <tr>
                  <td>
                    <Checkbox checked={i.checked} onChange={(e) => handleItemCheck(i, e)} />
                    <span>{i.tagCode}</span>
                  </td>
                  <td> {i.receivedQty} </td>
                  <td> {i.lotNumber} </td>
                  <td>
                    {' '}
                    {i.madeDate ? moment(i.madeDate).format(DEFAULT_DATE_FORMAT) : i.madeDate}{' '}
                  </td>
                  <td>
                    {' '}
                    {i.expireDate
                      ? moment(i.expireDate).format(DEFAULT_DATE_FORMAT)
                      : i.expireDate}{' '}
                  </td>
                </tr>
              );
            }
            return (
              <tr>
                <td>
                  <Checkbox checked={i.checked} onChange={(e) => handleItemCheck(i, e)} />
                  <span>{i.lotNumber}</span>
                </td>
                <td> {i.receivedQty} </td>
                <td>
                  {' '}
                  {i.madeDate ? moment(i.madeDate).format(DEFAULT_DATE_FORMAT) : i.madeDate}{' '}
                </td>
                <td>
                  {' '}
                  {i.expireDate
                    ? moment(i.expireDate).format(DEFAULT_DATE_FORMAT)
                    : i.expireDate}{' '}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles['modal-footer']}>
        <Button onClick={handleDelLine}>{intl.get('hzero.common.button.delete').d('删除')}</Button>
        <Button color="primary" onClick={() => onSave(list, record, type, totalQty, reasonDS)}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </div>
    </>
  );
};

export default ReceiveModal;
