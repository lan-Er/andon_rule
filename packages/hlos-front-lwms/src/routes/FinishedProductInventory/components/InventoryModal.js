import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { TextField, Button, Tooltip, Select } from 'choerodon-ui/pro';
import { Checkbox, Spin } from 'choerodon-ui';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { requestItemLot, requestItemTag } from '@/services/finishedProductInventoryService';

import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';
import LocationImg from 'hlos-front/lib/assets/icons/location.svg';
import NumImg from 'hlos-front/lib/assets/icons/quantity.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';
// import notification from 'utils/notification';
import CommonInput from 'hlos-front/lib/components/CommonInput';

function InventoryModal(props) {
  const { data = {}, ds } = props;
  const [allChecked, changeAllChecked] = useState(false);
  const [selectedQty, setSelectedQty] = useState(0);
  const [checkedList, setCheckedList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [totalElements, setTotalNum] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  useEffect(() => {
    query();
  }, []);

  async function query(value) {
    let res = {};
    const { organizationId, warehouseId, wmAreaId } = ds.queryDataSet.current.toJSONData();
    const qcStatus = ds.queryDataSet.current.get('qcStatus');
    const lotStatus = ds.queryDataSet.current.get('lotStatus');
    const params = {
      itemId: data.itemId,
      itemCode: data.itemCode,
      organizationId,
      warehouseId,
      wmAreaId,
      page: -1,
    };
    setLoading(true);
    if (data.itemControlType === 'LOT') {
      res = await requestItemLot({
        ...params,
        size: 6,
        lotNumber: value,
        lotStatus,
        queryLotNumberFlag: 'Y',
      });
    } else if (data.itemControlType === 'TAG') {
      res = await requestItemTag({
        ...params,
        qcStatus,
        size: 10,
        tagCode: value,
      });
    }
    let qty = 0;
    if (getResponse(res) && res && res.content) {
      res.content.forEach((el) => {
        const _el = el;
        _el.checked = false;
        // if (props.controlType === 'LOT') {
        //   qty += _el.initialQty;
        //   _el.productionWmQty = _el.initialQty;
        // } else if (props.controlType === 'TAG') {
        //   qty += _el.quantity;
        //   _el.productionWmQty = _el.quantity;
        // }
        qty += _el.quantity;
        _el.productionWmQty = _el.quantity;
      });
      props.dispatch({
        type: 'finishedProductInventory/updateState',
        payload: {
          modalList: res.content,
        },
      });
      setTotalNum(res.totalElements);
      setTotalQty(qty);
    }
    setLoading(false);
  }

  const handleInputChange = async (e) => {
    e.persist();
    if (e.keyCode === 13) {
      query(e.target.value);
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    query();
    setLoading(false);
  };

  const handleItemCheck = (record, e) => {
    let index = -1;
    if (data.itemControlType === 'LOT') {
      index = props.modalList.findIndex((i) => i.onhandId === record.onhandId);
    } else {
      index = props.modalList.findIndex((i) => i.tagCode === record.tagCode);
    }
    const list = [];
    let qty = 0;
    props.modalList.forEach((i, idx) => {
      if (idx === index) {
        list.push({
          ...i,
          checked: e.target.checked,
        });
      } else {
        list.push(i);
      }
    });
    const _allChecked = list.every((i) => i.checked);
    const selectedList = list.filter((i) => i.checked);
    selectedList.forEach((i) => {
      if (props.controlType === 'LOT') {
        qty += i.productionWmQty || 0;
      } else {
        qty += i.quantity || 0;
      }
    });
    changeAllChecked(_allChecked);
    props.dispatch({
      type: 'finishedProductInventory/updateState',
      payload: {
        modalList: list,
      },
    });
    setSelectedQty(qty);
    setCheckedList(selectedList);
  };

  const handleAllCheck = (e) => {
    const list = props.modalList.slice();
    let qty = 0;
    list.forEach((i) => {
      const _i = i;
      _i.checked = e.target.checked;
      if (e.target.checked) {
        if (props.controlType === 'LOT') {
          qty += i.productionWmQty || 0;
        } else {
          qty += i.quantity || 0;
        }
      }
    });
    changeAllChecked(e.target.checked);
    props.dispatch({
      type: 'finishedProductInventory/updateState',
      payload: {
        modalList: list,
      },
    });
    setSelectedQty(qty);
    setCheckedList(list.filter((i) => i.checked));
  };

  const handleNumChange = (val, record) => {
    const index = props.modalList.findIndex((item) => item.onhandId === record.onhandId);
    const list = [];
    props.modalList.forEach((i) => {
      list.push(i);
    });
    list.splice(index, 1, {
      ...record,
      productionWmQty: val,
    });
    let qty = 0;
    list.forEach((i) => {
      const _i = i;
      if (_i.checked) {
        qty += _i.quantity || 0;
      }
    });
    setSelectedQty(qty);
    props.dispatch({
      type: 'finishedProductInventory/updateState',
      payload: {
        modalList: list,
      },
    });
  };

  return (
    <Fragment>
      <div className="order-info">
        <div>
          <img src={OrderImg} alt="" />
          {props.data.itemCode} - {props.data.itemDescription}
        </div>
        <div>
          <img src={LocationImg} alt="" />
          <p>{props.data.warehouseName}</p>
        </div>
        <div>
          <img src={NumImg} alt="" />
          <p>
            {selectedQty} {props.data.uomName}
          </p>
        </div>
        <div className="input-scan">
          <TextField
            placeholder={`请扫描输入物料${props.controlType === 'LOT' ? '批次' : '标签'}号`}
            onKeyDown={(e) => handleInputChange(e)}
          />
          <img src={ScanImg} alt="" />
        </div>
      </div>
      <dev className="select-info">
        状态：
        {props.controlType === 'LOT' ? (
          <Select
            dataSet={ds.queryDataSet}
            name="lotStatus"
            key="lotStatus"
            onChange={() => handleStatusChange()}
          />
        ) : (
          <Select
            dataSet={ds.queryDataSet}
            name="qcStatus"
            key="qcStatus"
            onChange={() => handleStatusChange()}
          />
        )}
      </dev>
      <div className="lwms-finished-product-inventory-modal-list">
        <Spin spinning={isLoading}>
          <table>
            <thead>
              <tr className={props.controlType}>
                <th>
                  <Checkbox checked={allChecked} onChange={handleAllCheck} />
                  {props.controlType === 'LOT' ? '批次' : '标签'}数：{checkedList.length}/
                  {totalElements}
                </th>
                <th>总数：{totalQty}</th>
                <th>状态</th>
                <th>库位</th>
              </tr>
            </thead>
            <tbody>
              {props.modalList.map((i) => {
                return (
                  <tr key={i.onhandId || i.tagCode} className={props.controlType}>
                    <td className="td-left">
                      <Checkbox checked={i.checked} onChange={(e) => handleItemCheck(i, e)} />
                      <div>
                        <Tooltip title={props.controlType === 'LOT' ? i.lotNumber : i.tagCode}>
                          {props.controlType === 'LOT' ? i.lotNumber : i.tagCode}
                        </Tooltip>
                      </div>
                    </td>
                    {props.controlType === 'LOT' ? (
                      <td className="td-center-lot">
                        <CommonInput
                          record={i}
                          step={0.000001}
                          value={i.productionWmQty || i.quantity || 0}
                          onChange={handleNumChange}
                        />
                        <Tooltip title={i.quantity || 0}>
                          <span className="on-hand-qty">{i.quantity}</span>
                        </Tooltip>
                        <span>{i.uomName}</span>
                      </td>
                    ) : (
                      <td className="td-center-tag">
                        <span className="qty-block">{i.quantity || 0}</span>
                        <span>{i.uomName}</span>
                      </td>
                    )}
                    {props.controlType === 'LOT' ? (
                      <td className="td-right">{i.lotStatusMeaning}</td>
                    ) : (
                      <td className="td-right">{i.qcStatusMeaning}</td>
                    )}
                    <td className="td-right">
                      {data.warehouseName}
                      {data.wmAreaName && <span> -{data.wmAreaName}</span>}
                      {data.wmUnitCode && <span> -{data.wmUnitCode}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Spin>
      </div>
      <div className="lwms-finished-product-inventory-modal-footer">
        <Button onClick={props.onModalCancel}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button
          color="primary"
          onClick={() => props.onModalOk(props.data.itemId, selectedQty, checkedList)}
        >
          {intl.get('hzero.common.button.sure').d('确定')}
        </Button>
      </div>
    </Fragment>
  );
}

export default connect(({ finishedProductInventory }) => ({
  modalList: finishedProductInventory?.modalList || [],
  totalNum: finishedProductInventory?.totalNum || 0,
}))(InventoryModal);
