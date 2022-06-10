/**
 * @Description: 不合格品处理--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-10-16 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Lov, DatePicker, DataSet, Spin, Select, Modal } from 'choerodon-ui/pro';
import { Icon, Checkbox, Popover } from 'choerodon-ui';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import Icons from 'components/Icons';
// import { submitApi } from '../services/nonconformingProcessingService';
import { submitApi } from '../../services/nonconformingProcessingService';
// import // nonconformingProcessApi,
// '@/services/nonconformingProcessingService.js';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HeaderDS, ProcessorDS } from '@/stores/nonconformingProcessiongDS';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import processorIcon from 'hlos-front/lib/assets/icons/processor.svg';
import documentTypeIcon from 'hlos-front/lib/assets/icons/document-type.svg';
import documentIcon from 'hlos-front/lib/assets/icons/document.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import DetailModal from './DetailModal';
import styles from './index.less';

import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const commonCode = 'lmes.common';
const modalKey = Modal.key();
let modal = null;

const headerDS = () => new DataSet(HeaderDS());
const processorDS = () => new DataSet(ProcessorDS());

const NonconformingProcessiong = ({ history, dispatch, inspectDocList }) => {
  const ds = useDataSet(headerDS, NonconformingProcessiong);
  const workerDS = useDataSet(processorDS);
  const [allChecked, setAllChecked] = useState(false);
  const [processorLock, changeProcessorLock] = useState(false);
  const [documentLock, changeDocumentLock] = useState(false);
  const [itemLock, changeItemLock] = useState(false);
  const [avator, setAvator] = useState(null);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        workerDS.current.set('processorObj', res.content[0]);
        setAvator(res.content[0].fileUrl);
      }
      const orgRes = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        ds.queryDataSet.current.set('organizationId', orgRes.content[0].organizationId);
      }
    }
    queryDefaultSetting();
    changeProcessorLock(
      JSON.parse(window.localStorage.getItem('nonconfirmingProcessing/processorLock'))
    );
  }, [workerDS, ds]);

  useEffect(() => {
    return () => {
      if (ds.current) {
        ds.current.reset();
      }
      ds.queryDataSet.current.reset();
      workerDS.current.reset();
      dispatch({
        type: 'nonconformingProcessing/updateState',
        payload: {
          inspectDocList: [],
          lotList: [],
        },
      });
    };
  }, []);

  const suffixRender = (flag, type) => {
    return (
      <Fragment>
        <Icon type="search" />
        <img src={flag ? lockIcon : unLockIcon} alt="" onClick={(e) => handleLockClick(type, e)} />
      </Fragment>
    );
  };

  const handleLockClick = (type, e) => {
    if (e) e.stopPropagation();
    if (type === 'processor') {
      window.localStorage.setItem('nonconfirmingProcessing/processorLock', !processorLock);
      changeProcessorLock(!processorLock);
    } else if (type === 'document') {
      changeDocumentLock(!documentLock);
    } else if (type === 'item') {
      changeItemLock(!itemLock);
    }
  };

  const handleExit = () => {
    Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${commonCode}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    }).then((button) => {
      if (button === 'ok') {
        history.push('/workplace');
        closeTab('/pub/lmes/nonconforming-processing');
      }
    });
  };

  const handleCheckItem = (rec, e) => {
    const _list = inspectDocList.slice();
    const idx = _list.findIndex((i) => i.inspectionDocId === rec.inspectionDocId);
    _list.splice(idx, 1, {
      ...rec,
      checked: e.target.checked,
    });
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: _list,
      },
    });
    setAllChecked(_list.every((i) => i.checked));
  };

  const handleCheckAll = () => {
    const _list = inspectDocList.slice();
    _list.forEach((el) => {
      const _el = el;
      _el.checked = !allChecked;
    });
    setAllChecked(!allChecked);
  };

  const handleQueryReset = () => {
    const { itemObj, poObj, organizationId } = ds.queryDataSet.current.data;
    const { processorObj } = workerDS.current.data;
    ds.queryDataSet.current.reset();
    ds.queryDataSet.current.set('organizationId', organizationId);
    if (processorLock) {
      ds.queryDataSet.current.set('processorObj', processorObj);
    } else {
      workerDS.current.set('processorObj', null);
    }
    if (documentLock) {
      ds.queryDataSet.current.set('poObj', poObj);
    }
    if (itemLock) {
      ds.queryDataSet.current.set('itemObj', itemObj);
    }
  };

  const handleReset = () => {
    handleQueryReset();
    dispatch({
      type: 'nonconformingProcessing/updateState',
      payload: {
        inspectDocList: [],
      },
    });
  };

  const handleSubmit = async () => {
    const _inspectDocList = JSON.parse(JSON.stringify(inspectDocList));
    const checkedList = _inspectDocList.filter((i) => i.checked);
    if (!checkedList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    checkedList.forEach((item) => {
      item.lineDTOList = item && item.lineList ? JSON.parse(JSON.stringify(item.lineList)) : [];
      delete item.lineList;
    });

    console.log('checkedList', JSON.stringify(checkedList));
    checkedList.forEach((header) => {
      header.delayQty = 0;
      if (header.lineDTOList && header.lineDTOList.length) {
        header.lineDTOList.forEach((line) => {
          if (line.detailLine && line.detailLine.length) {
            line.detailLine.forEach((detail) => {
              header.delayQty += detail.delayQty;
            });
          }
        });
      }
    });
    console.log('checkedList', JSON.stringify(checkedList));
    if (!checkedList.every((i) => (i.delayQty || 0) === (i.qcNgQty || 0))) {
      notification.warning({
        message: '处理数量必须等于不合格数量!',
      });
      return;
    }
    try {
      setListLoading(true);
      const res = await submitApi(checkedList);
      setListLoading(false);
      if (!res || !res.failed) {
        notification.success({
          message: '提交成功！',
        });
        handleSearch();
      } else {
        notification.error({
          message: (res && res.message) || '网络请求失败！',
        });
      }
    } catch (err) {
      setListLoading(false);
    }
    // console.log(checkedList);
  };

  const handleSearch = async () => {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) return;

    setListLoading(true);
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      dispatch({
        type: 'nonconformingProcessing/updateState',
        payload: {
          inspectDocList: res.content,
        },
      });
    }
    setListLoading(false);
  };

  const handleProcessorChange = (rec) => {
    setAvator(rec.fileUrl);
  };

  const handleOrderKeyDown = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const formRender = () => {
    return [
      <Lov
        dataSet={workerDS}
        name="processorObj"
        key="processorObj"
        placeholder="处理人"
        prefix={<img src={processorIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(processorLock, 'processor')}
        clearButton={false}
        noCache
        disabled={processorLock}
        onChange={handleProcessorChange}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="itemObj"
        key="itemObj"
        placeholder="物料"
        prefix={<img src={documentTypeIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(itemLock, 'item')}
        noCache
        disabled={itemLock}
        onKeyDown={handleOrderKeyDown}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="poObj"
        key="poObj"
        placeholder="采购单号"
        prefix={<img src={documentIcon} alt="" style={{ margin: '0 8px' }} />}
        suffix={suffixRender(documentLock, 'document')}
        noCache
        disabled={documentLock}
        onKeyDown={handleOrderKeyDown}
      />,
      <Lov
        dataSet={ds.queryDataSet}
        name="inspectionDocumentObj"
        key="inspectionDocumentObj"
        placeholder="检验单号"
        prefix={<img src={documentIcon} alt="" style={{ margin: '0 8px' }} />}
        noCache
        onKeyDown={handleOrderKeyDown}
      />,
    ];
  };

  const handleShowModal = async (rec) => {
    const headerData = {
      inspectionDocId: rec.inspectionDocId,
      inspectionDocNum: rec.inspectionDocNum,
      relatedDocNum: rec.relatedDocNum,
      itemCode: rec.itemCode,
      description: rec.description,
    };
    modal = Modal.open({
      key: modalKey,
      title: '查看明细',
      className: styles['lmes-nonconforming-processing-modal'],
      children: <DetailModal headerData={headerData} onModalClose={handleModalClose} />,
      closable: true,
      footer: null,
    });
  };

  const handleModalClose = () => {
    modal.close();
  };

  const handleFilterModalShow = () => {
    Modal.open({
      key: modalKey,
      title: intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选'),
      className: styles['lmes-nonconforming-processing-filter-modal'],
      children: (
        <Form dataSet={ds.queryDataSet} labelLayout="placeholder">
          <Lov name="itemCategoryObj" key="itemCategoryObj" placeholder="物料类别" />
          <DatePicker
            name="createDateMin"
            key="createDateMin"
            placeholder={['报检时间>=', '报检时间<=']}
          />
          <Lov name="supplierCategoryObj" key="supplierCategoryObj" placeholder="供应商类别" />
          <Select
            name="inspectionTemplateTypeList"
            key="inspectionTemplateTypeList"
            placeholder="检验类型"
          />
          <Lov name="declarerObj" key="declarerObj" placeholder="报检人" noCache />
        </Form>
      ),
      onOk: () => handleSearch(),
    });
  };

  return (
    <div className={styles['lmes-nonconforming-processing']}>
      <CommonHeader title="不合格品处理" />
      <div className={styles['lmes-nonconforming-processing-sub-header']}>
        <img className={styles.avator} src={avator || defaultAvatorImg} alt="" />
        <div className={styles['form-area']}>
          <Form columns={4} labelLayout="placeholder">
            {formRender()}
          </Form>
        </div>
      </div>
      <Spin spinning={listLoading}>
        <div className={styles['lmes-nonconforming-processing-list']}>
          {inspectDocList.map((el) => {
            return (
              <div className={styles['list-item']} key={el.inspectionDocId}>
                <div className={styles.top}>
                  <div>
                    <Checkbox checked={el.checked} onChange={(e) => handleCheckItem(el, e)} />
                    <p className={styles.order}>{el.inspectionDocNum}</p>
                    {/* <p>{el.poNum}</p> */}
                    <p className={styles.order}>{el.relatedDocNum}</p>
                  </div>
                  <div>
                    <span>批次数 {el.batchQty}</span>
                    <span>
                      <span className={`${styles.circle} ${styles.ok}`} /> 合格 {el.qcOkQty}
                    </span>
                    <span>
                      <span className={`${styles.circle} ${styles.ng}`} /> 不合格 {el.qcNgQty}
                    </span>
                    <a
                      style={{ color: '#1c879c', marginTop: '2px' }}
                      onClick={() => handleShowModal(el)}
                    >
                      查看明细
                    </a>
                    {/* {el.itemControlType &&
                      (el.itemControlType === 'LOT' || el.itemControlType === 'TAG') && (

                      )} */}
                  </div>
                </div>
                <div className={styles.bottom}>
                  <Popover content={`${el.itemCode} ${el.description}`} placement="bottom">
                    <span>
                      {el.itemCode} {el.description}
                    </span>
                  </Popover>
                  <span>{el.sourceDocNum}</span>
                  <span>
                    <span>报检人：{el.declarerName}</span>
                    <span>{el.creationDate}</span>
                  </span>
                  <span>
                    <span>判定人：{el.inspectorName || el.inspector}</span>
                    <span>{el.judgedDate}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Spin>
      <div className={styles['lmes-nonconforming-processing-footer']}>
        <div className={styles.icon} onClick={handleExit}>
          <Icons type="exit" size="48" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div>
          <div className={styles.icon} onClick={handleReset}>
            <Icons type="reset" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>重置</p>
          </div>
          <div className={styles.icon} onClick={handleCheckAll}>
            <Icons type="check" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>全选</p>
          </div>
          <div className={styles.icon} onClick={handleSubmit}>
            <Icons type="submit" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>提交</p>
          </div>
          <div className={styles.icon} onClick={handleFilterModalShow}>
            <Icons type="ziyuan23" size="48" />
            <div className={styles.line} />
            <p className={styles.text}>筛选</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ nonconformingProcessing }) => ({
  inspectDocList: nonconformingProcessing?.inspectDocList || [],
}))(NonconformingProcessiong);
