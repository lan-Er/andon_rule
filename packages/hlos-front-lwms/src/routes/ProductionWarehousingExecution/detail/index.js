/**
 * @Description: 生产入库执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { TextField, Button, Spin, Modal } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import { getResponse } from 'utils/utils';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import {
  getRequestLines,
  getDocReservation,
  executeProductionWm,
  confirmProductionWm,
} from '@/services/productionWarehousingExecutionService';
import { requestItemTag, requestItemLot } from '@/services/issueRequestExecuteService';
import ListItem from './ListItem';
import Footer from './Footer';
import LotOrTagModal from './LotOrTagModal';
import styles from './index.less';

const preCode = 'lwms.productionWarehousingExecution';

let modal = null;

const ProductionWarehousingExecutionDetail = ({ history, location, dispatch, lineList }) => {
  const [headerData, setHeaderData] = useState({});
  const [itemCode, setItemCode] = useState(null);
  const [lineListLoading, setLineListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lineDisabled, setLineDisabled] = useState(false);

  useEffect(() => {
    const { state = {} } = location;
    async function queryDocReservation() {
      let disabled = false;
      const res = await getDocReservation({
        documentId: state?.requestId,
      });
      if (res && res.content && res.content.length) {
        setLineDisabled(true);
        disabled = true;
      } else {
        setLineDisabled(false);
        disabled = false;
      }
      return disabled;
    }
    setHeaderData(state);
    queryDocReservation().then((res) => {
      handleSearchLine(state?.organizationId, state?.requestId, res);
    });
    return () => {
      handleExit();
    };
  }, []);

  function handleExit(flag = -1) {
    history.push({
      pathname: '/lwms/production-warehousing-execution/list',
      state: {
        _back: flag,
      },
    });
    closeTab('/pub/lwms/production-warehousing-execution/detail');
  }

  function handleReset() {
    setItemCode(null);
    handleSearchLine();
  }

  async function handleSubmit() {
    setSubmitLoading(true);
    let res = {};
    if (lineDisabled) {
      const confirmProductionWmLineDTOList = [];
      lineList.forEach((i) => {
        confirmProductionWmLineDTOList.push({
          requestLineId: i.requestLineId,
          requestLineNum: i.requestLineNum,
          toWarehouseId: i.toWarehouseId,
          toWarehouseCode: i.toWarehouseCode,
          toWmAreaId: i.toWmAreaId,
          toWmAreaCode: i.toWmAreaCode,
        });
      });
      res = await confirmProductionWm([
        {
          requestId: headerData?.requestId,
          requestNum: headerData?.requestNum,
          executedWorkerId: headerData?.workerId,
          executedWorker: headerData?.worker,
          executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
          toWarehouseId: headerData?.headerWarehouseId,
          toWarehouseCode: headerData?.headerWarehouseCode,
          toWmAreaId: headerData?.headerWmAreaId,
          toWmAreaCode: headerData?.headerWmAreaCode,
          confirmProductionWmLineDTOList,
        },
      ]);
    } else {
      const executeProductionWmLineDTOList = [];
      lineList.forEach((i) => {
        const detailDTOList = [];
        i.modalList.forEach((v) => {
          if (v.checked) {
            detailDTOList.push({
              executedQty: v.receiveQty,
              tagId: v.tagId,
              tagCode: v.tagCode,
              lotId: v.lotId,
              lotNumber: v.lotNumber,
            });
          }
        });
        executeProductionWmLineDTOList.push({
          requestLineId: i.requestLineId,
          requestLineNum: i.requestLineNum,
          toWarehouseId: i.toWarehouseId,
          toWarehouseCode: i.toWarehouseCode,
          toWmAreaId: i.toWmAreaId,
          toWmAreaCode: i.toWmAreaCode,
          warehouseId: i.warehouseId,
          warehouseCode: i.warehouseCode,
          wmAreaId: i.wmAreaId,
          wmAreaCode: i.wmAreaCode,
          detailDTOList,
        });
      });
      res = await executeProductionWm([
        {
          requestId: headerData?.requestId,
          requestNum: headerData?.requestNum,
          executedWorkerId: headerData?.workerId,
          executedWorker: headerData?.worker,
          executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
          toWarehouseId: headerData?.headerWarehouseId,
          toWarehouseCode: headerData?.headerWarehouseCode,
          toWmAreaId: headerData?.headerWmAreaId,
          toWmAreaCode: headerData?.headerWmAreaCode,
          executeProductionWmLineDTOList,
        },
      ]);
    }
    if (getResponse(res)) {
      notification.success();
      handleExit(1);
    }
    setSubmitLoading(false);
  }

  async function handleSearchLine(organizationId, requestId, disabledFlag) {
    setLineListLoading(true);
    const res = await getRequestLines({
      organizationId: organizationId || headerData?.organizationId,
      requestId: requestId || headerData?.requestId,
      itemCode,
      page: -1,
    });
    setLineListLoading(false);
    if (res && res.content) {
      if (disabledFlag || lineDisabled) {
        res.content.forEach((i) => {
          const _i = i;
          _i.receiveQty = _i.applyQty;
        });
      }
      dispatch({
        type: 'productionWarehousingExecution/updateState',
        payload: {
          lineList: res.content,
        },
      });
    }
  }

  function updateLineList(list, record, flag, totalElements, disOpenFlag) {
    const idx = lineList.findIndex((i) => i.requestId === record.requestId);
    const cloneLineList = [...lineList];
    if (!record.modalList) {
      dispatch({
        type: 'productionWarehousingExecution/updateState',
        payload: {
          modalList: list,
        },
      });
    }
    const newRecord = {
      ...record,
      modalList: list,
    };
    cloneLineList.splice(idx, 1, newRecord);
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        lineList: cloneLineList,
      },
    });
    if (!disOpenFlag) {
      showModal(record, flag, totalElements);
    }
  }

  async function handleIconClick(record) {
    if (!lineDisabled) {
      queryLine(record);
    } else {
      const res = await getDocReservation({
        documentId: record?.requestId,
        documentLineId: record?.requestLineId,
        lotFlag: record.itemControlType === 'LOT',
        page: 0,
        size: 10,
      });
      if (res && res.content && res.content.length) {
        res.content.forEach((i) => {
          const _i = i;
          _i.checked = true;
          _i.receiveQty = _i.reservationQty;
        });
        updateLineList(res.content, record, true, res.totalElements);
      } else {
        queryLine(record);
      }
    }
  }

  async function queryLine(record, value, flag) {
    let detailRes = {};
    if (record.itemControlType === 'LOT') {
      detailRes = await requestItemLot({
        organizationId: headerData?.organizationId,
        warehouseId: record?.warehouseId,
        itemCode: record?.itemCode,
        itemId: record?.itemId,
        itemControlType: 'LOT',
        lotNumber: value,
        page: -1,
        size: 10,
      });
    } else if (record.itemControlType === 'TAG') {
      detailRes = await requestItemTag({
        organizationId: headerData?.organizationId,
        warehouseId: record?.warehouseId,
        itemCode: record?.itemCode,
        tagCode: value,
        page: -1,
        size: 10,
      });
    }
    if (detailRes && detailRes.content && detailRes.content.length) {
      detailRes.content.forEach((i) => {
        const _i = i;
        _i.receiveQty = _i.quantity || 0;
      });
      updateLineList(detailRes.content, record, false, detailRes.totalElements, flag);
    } else {
      notification.warning({
        message: intl.get(`hzero.hzeroUI.Table.emptyText`).d('暂无数据'),
      });
    }
  }

  function handleCancel() {
    modal.close();
  }

  function handleOk(list, lineRec, qty) {
    const idx = lineList.findIndex((i) => i.requestLineId === lineRec.requestLineId);
    const cloneLineList = [...lineList];
    cloneLineList.splice(idx, 1, {
      ...lineRec,
      receiveQty: qty,
      modalList: list,
    });
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        lineList: cloneLineList,
      },
    });
    modal.close();
  }

  function handleItemClick(val, record, itemControlType, list) {
    const cloneModalList = [...list];
    let idx = -1;
    if (itemControlType === 'TAG') {
      idx = list.findIndex((i) => i.tagCode === record.tagCode);
    } else {
      idx = list.findIndex((i) => i.lotNumber === record.lotNumber);
    }
    cloneModalList.splice(idx, 1, {
      ...record,
      checked: val,
    });
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        modalList: cloneModalList,
      },
    });
  }

  function handleCheckAll(val, list) {
    const cloneModalList = [...list];
    cloneModalList.forEach((i) => {
      const _i = i;
      _i.checked = val;
    });
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        modalList: cloneModalList,
      },
    });
  }

  function showModal(record, disabledFlag = false, totalElements) {
    const type = record.itemControlType;
    modal = Modal.open({
      title: intl
        .get(`${preCode}.pick.${type.toLowerCase()}`)
        .d(`${type === 'LOT' ? '批次' : '标签'}拣料`),
      className: styles['lwms-production-warehousing-execution-detail-modal'],
      children: (
        <LotOrTagModal
          headerData={record}
          totalElements={totalElements}
          disabledFlag={disabledFlag}
          onCancel={handleCancel}
          onOk={handleOk}
          onItemClick={handleItemClick}
          onAllCheckClick={handleCheckAll}
          onSearch={handleModalSearch}
        />
      ),
      closable: false,
      footer: null,
    });
  }

  function handleNumChange(val, record) {
    const idx = lineList.findIndex((i) => i.requestId === record.requestId);
    const cloneLineList = [...lineList];
    if (idx >= 0) {
      cloneLineList.splice(idx, 1, {
        ...record,
        receiveQty: val,
        modalList: [{ receiveQty: val, checked: true }],
      });
      dispatch({
        type: 'productionWarehousingExecution/updateState',
        payload: {
          lineList: cloneLineList,
        },
      });
    }
  }

  function handleItemChange(val) {
    setItemCode(val);
  }

  function handleCopyNum() {
    const copyDOM = document.getElementById('request-num');

    const range = document.createRange(); // 创建一个range
    window.getSelection().removeAllRanges(); // 清楚页面中已有的selection
    range.selectNode(copyDOM); // 选中需要复制的节点
    window.getSelection().addRange(range); // 执行选中元素
    const successful = document.execCommand('copy'); // 执行 copy 操作

    if (successful) {
      notification.success({
        message: intl.get(`${preCode}.notification.success.copy`).d('复制成功'),
      });
    } else {
      notification.error({
        message: intl.get(`${preCode}.notification.fail.copy`).d('复制失败'),
      });
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges();
  }

  function handleWarehouseChange(obj, record) {
    const idx = lineList.findIndex((i) => i.requestLineId === record.requestLineId);
    const cloneList = [...lineList];
    if (idx >= 0) {
      let params = { ...record };
      if (obj) {
        params = {
          ...record,
          toWarehouseId: obj.warehouseId,
          toWarehouseCode: obj.warehouseCode,
          toWarehouseName: obj.warehouseName,
        };
      } else {
        params = {
          ...record,
          toWarehouseId: null,
          toWarehouseCode: null,
          toWarehouseName: null,
        };
      }
      cloneList.splice(idx, 1, params);
    }
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        lineList: cloneList,
      },
    });
  }

  function handleWmAreaChange(obj, record) {
    const idx = lineList.findIndex((i) => i.requestLineId === record.requestLineId);
    const cloneList = [...lineList];
    if (idx >= 0) {
      let params = { ...record };
      if (obj) {
        params = {
          ...record,
          toWmAreaId: obj.wmAreaId,
          toWmAreaCode: obj.wmAreaCode,
          toWmAreaName: obj.wmAreaName,
        };
      } else {
        params = {
          ...record,
          toWmAreaId: null,
          toWmAreaCode: null,
          toWmAreaName: null,
        };
      }
      cloneList.splice(idx, 1, params);
    }
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        lineList: cloneList,
      },
    });
  }

  function handleModalSearch(val, record) {
    queryLine(record, val, true);
  }

  return (
    <div className={styles['lwms-production-warehousing-execution-detail']}>
      <CommonHeader title="生产入库执行" />
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.worker}>
            <img src={headerData.fileUrl || defaultAvatorImg} alt="" />
            <span>{headerData.workerName}</span>
          </div>
          <div className={styles.main}>
            <div>
              <span id="request-num">{headerData.requestNum}</span>
              {headerData.requestNum && (
                <Icons type="copy" size="32" color="#999" onClick={handleCopyNum} />
              )}
            </div>
            <div>
              <Icons type="tubiao_gongyingshangbeifen3" size="32" color="#999" />
              <span>{headerData.requestTypeName}</span>
            </div>
            <div>
              <Icons type="copy" size="32" color="#999" />
              <span>
                {headerData.warehouseName}
                {headerData.wmAreaName && <span>-{headerData.wmAreaName}</span>}
              </span>
            </div>
            <div>
              <Icons type="copy" size="32" color="#999" />
              <span>
                {headerData.toWarehouseName}
                {headerData.toWmAreaName && <span>-{headerData.toWmAreaName}</span>}
              </span>
            </div>
            <div>
              <Icons type="clock" size="32" color="#999" />
              <span>{headerData.creator}</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.item}>
            <TextField
              placeholder={intl.get(`${preCode}.validation.itemCode`).d('请输入物料号')}
              onChange={handleItemChange}
              suffix={<Icons type="scan1" size="24" color="#0C6B7E" />}
              disabled={lineDisabled}
            />
            <Button color="primary" onClick={handleSearchLine} disabled={lineDisabled}>
              {intl.get(`hzero.common.button.search`).d('查询')}
            </Button>
          </div>
          <Spin spinning={lineListLoading}>
            {lineList.length ? (
              <div className={styles.list}>
                {lineList.map((i) => {
                  return (
                    <ListItem
                      key={i.requestLineId}
                      disabled={lineDisabled}
                      record={i}
                      headerData={headerData}
                      onIconClick={handleIconClick}
                      onNumChange={handleNumChange}
                      onWarehouseChange={handleWarehouseChange}
                      onWmAreaChange={handleWmAreaChange}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                {intl.get(`hzero.hzeroUI.Table.emptyText`).d('暂无数据')}
              </div>
            )}
          </Spin>
        </div>
      </div>
      <Footer
        lineDisabled={lineDisabled}
        onExit={handleExit}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />
      {submitLoading && <Loading />}
    </div>
  );
};

export default connect(({ productionWarehousingExecution }) => ({
  lineList: productionWarehousingExecution?.lineList || [],
  modalList: productionWarehousingExecution?.modalList || [],
}))(
  formatterCollections({
    code: ['lwms.productionWarehousingExecution'],
  })(ProductionWarehousingExecutionDetail)
);
