/*
 * @Description: 采购退货单执行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-28 11:47:00
 */

import React, { useState, useMemo, useEffect } from 'react';
import { DataSet, Modal, Spin } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';

import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import { queryLovData } from 'hlos-front/lib/services/api';
import LogoImg from 'hlos-front/lib/assets/icons/logo.svg';
import SupplierImg from 'hlos-front/lib/assets/icons/supplier.svg';
import LocationImg from 'hlos-front/lib/assets/icons/location.svg';
import RemarkImg from 'hlos-front/lib/assets/icons/remark3.svg';

import { PageQueryDS } from '../../stores/purchaseReturnOrderExecutionDS.js';
import {
  deliveryReturnsHeader,
  deliveryReturnsLines,
  executeDeliveryReturn,
} from '../../services/purchaseReturnOrderExecutionService.js';
import ReturnModal from './returnModal.js';
import SubHeader from './subHeader.js';
import Line from './line.js';
import Footer from './footer.js';
import Time from './Time.js';
import style from './index.less';

const tenantId = getCurrentOrganizationId();
// const queryDS = new DataSet(PageQueryDS());
let modal = null;

function PurchaseReturnOrderExecution(props) {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headerInfo, setHeaderInfo] = useState({});
  const [lineList, setLineList] = useState([]);

  const timeComponent = useMemo(() => <Time />, []);
  const queryDS = useMemo(() => new DataSet(PageQueryDS()), []);

  useEffect(() => {
    handleQueryDefaultInfo();
  }, []);

  const handleQueryDefaultInfo = async () => {
    const orgRes = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    const worRes = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
    if (orgRes && orgRes.content && orgRes.content.length) {
      queryDS.current.set('organizationObj', {
        organizationId: orgRes.content[0].organizationId,
        organizationCode: orgRes.content[0].organizationCode,
        organizationName: orgRes.content[0].organizationName,
      });
    }
    if (worRes && worRes.content && worRes.content.length) {
      queryDS.current.set('workerObj', {
        workerId: worRes.content[0].workerId,
        workerCode: worRes.content[0].workerCode,
        workerName: worRes.content[0].workerName,
      });
      setFileUrl(worRes.content[0].fileUrl);
    }
  };

  const handleQueryInfo = async (searchValue) => {
    const isValid = await queryDS.validate(false, false);
    if (!isValid) return;

    const headRes = await deliveryReturnsHeader({
      organizationId: queryDS.current.get('organizationId'),
      deliveryReturnNum: searchValue,
      tenantId,
    });
    if (headRes && headRes.failed) {
      notification.error({
        message: headRes.message,
      });
    } else if (headRes && headRes.content && headRes.content.length) {
      setHeaderInfo(headRes.content[0]);
      setLoading(true);
      const lineRes = await deliveryReturnsLines({
        organizationId: queryDS.current.get('organizationId'),
        itemControlTypeFlag: 1,
        deliveryReturnId: headRes.content[0].deliveryReturnId,
        tenantId,
      });
      if (getResponse(lineRes)) {
        const list = lineRes.content.map((v) => ({
          ...v,
          checked: true,
          inputQty: v.returnedAwaitQty,
        }));
        setLineList(list);
      }
      setLoading(false);
    }
  };

  const handleQueryChange = (value, name) => {
    if (value && value.workerId && value.fileUrl) {
      setFileUrl(value.fileUrl);
    }

    if (name === 'organizationObj') {
      queryDS.current.set('workerObj', null);
    } else if (name === 'deliveryReturnNum') {
      if (value) {
        handleQueryInfo(value);
      } else {
        setHeaderInfo({});
      }
    }
  };

  const handleOpenModal = (record) => {
    if (record.itemControlType === 'QUANTITY') {
      return;
    }
    modal = Modal.open({
      key: 'purchase-execution-modal',
      title: `${record.itemControlType === 'TAG' ? '标签' : '批次'}退料`,
      className: 'purchase-execution-modal',
      movable: true,
      children: (
        <ReturnModal
          {...record}
          organizationId={queryDS.current.get('organizationId')}
          modal
          onConfirm={(modalList, mDS) => handleModalConfirm(modalList, mDS, record)}
        />
      ),
      footer: null,
      closable: true,
    });
  };

  const handleModalConfirm = (modalList, mDS, record) => {
    const modalRec = mDS.current.toJSONData();
    let list = lineList.slice();
    let totalQty = 0;
    if (record.itemControlType === 'TAG') {
      totalQty = modalList.reduce((val, el) => {
        return val + el.quantity;
      }, 0);
    } else if (record.itemControlType === 'LOT') {
      totalQty = modalList.reduce((val, el) => {
        return val + el.newQuantity;
      }, 0);
    }
    list = list.map((ele) => {
      if (ele.returnLineId === record.returnLineId) {
        return {
          ...record,
          inputQty: modalList.length ? totalQty : ele.inputQty,
          modalList,
          returnWarehouseId: modalRec.warehouseId || null,
          returnWarehouseCode: modalRec.warehouseCode || null,
          returnWarehouseName: modalRec.warehouseName || null,
          returnWmAreaId: modalRec.wmAreaId || null,
          returnWmAreaCode: modalRec.wmAreaCode || null,
          returnWmAreaName: modalRec.wmAreaName || null,
        };
      }
      return { ...ele };
    });
    setLineList(list);
    modal.close();
  };

  const handleLineCheckChange = (rec) => {
    let list = lineList.slice();
    list = list.map((v) => {
      if (v.returnLineId === rec.returnLineId) {
        return { ...v, checked: !v.checked };
      }
      return { ...v };
    });
    setLineList(list);
  };

  const handleUpdateCount = (type, index) => {
    const list = lineList.slice();
    if (type === 'add') {
      list[index].inputQty++;
    } else {
      list[index].inputQty--;
      if (list[index].inputQty <= 0) {
        list[index].inputQty = 0;
      }
    }
    setLineList(list);
  };

  const handleQuantityInput = (value, index) => {
    const list = lineList.slice();
    list[index].inputQty = value;
    setLineList(list);
  };

  const handleClose = () => {
    props.history.push('/workplace');
    closeTab('/pub/lwms/purchase-return-order-execution');
  };

  const handleReset = () => {
    queryDS.current.reset();
    setHeaderInfo({});
    setLineList([]);
    setFileUrl(null);
  };

  const handleAllChecked = () => {
    let list = lineList.slice();
    const allFlag = list.every((v) => v.checked);
    if (allFlag) {
      list = list.map((v) => ({ ...v, checked: false }));
    } else {
      list = list.map((v) => ({ ...v, checked: true }));
    }
    setLineList(list);
  };

  const handleSubmit = async () => {
    const checkedList = lineList.filter((v) => v.checked);
    if (!checkedList.length) {
      notification.warning({
        message: '至少选择一条数据!',
      });
      return;
    }
    const submitLineList = [];
    checkedList.forEach((v) => {
      // LOT && TAG
      if (v.modalList && v.modalList.length) {
        v.modalList.forEach((ele) => {
          let receiveList = [];
          let returnedQty = 0;
          if (v.itemControlType === 'LOT') {
            returnedQty = ele.newQuantity;
          } else if (v.itemControlType === 'TAG') {
            returnedQty = ele.quantity;
          }
          receiveList.push({
            returnedQty: returnedQty || [],
            lotId: ele.lotId || null,
            lotNumber: ele.lotNumber || null,
            tagId: v.itemControlType === 'TAG' ? ele.tagId : null,
            tagCode: v.itemControlType === 'TAG' ? ele.tagCode : null,
            warehouseId: ele.warehouseId,
            warehouseCode: ele.warehouseCode,
            wmAreaId: ele.wmAreaId,
            wmAreaCode: ele.wmAreaCode,
            wmUnitId: ele.wmUnitId,
            wmUnitCode: ele.wmUnitCode,
          });
          if (v.itemControlType === 'QUANTITY') {
            receiveList = [{ returnedQty: v.inputQty }];
          }
          submitLineList.push({
            deliveryReturnLineId: v.returnLineId || null,
            deliveryReturnLineNum: v.returnLineNum || null,
            returnWarehouseId: ele.warehouseId || v.returnWarehouseId || null,
            returnWarehouseCode: ele.warehouseCode || v.returnWarehouseCode || null,
            returnWmAreaId: ele.wmAreaId || v.returnWmAreaId || null,
            returnWmAreaCode: ele.wmAreaCode || v.returnWmAreaCode || null,
            returnWmUnitId: ele.wmUnitId || v.returnWmUnitId || null,
            returnWmUnitCode: ele.wmUnitCode || v.returnWmUnitCode || null,
            lineRemark: v.lineRemark || null,
            receiveList,
          });
        });
      } else {
        submitLineList.push({
          deliveryReturnLineId: v.returnLineId || null,
          deliveryReturnLineNum: v.returnLineNum || null,
          returnWarehouseId: v.returnWarehouseId || null,
          returnWarehouseCode: v.returnWarehouseCode || null,
          returnWmAreaId: v.returnWmAreaId || null,
          returnWmAreaCode: v.returnWmAreaCode || null,
          returnWmUnitId: v.returnWmUnitId || null,
          returnWmUnitCode: v.returnWmUnitCode || null,
          lineRemark: v.lineRemark || null,
          receiveList: v.itemControlType === 'QUANTITY' ? [{ returnedQty: v.inputQty }] : [],
        });
      }
    });
    const params = [
      {
        deliveryReturnId: headerInfo.deliveryReturnId,
        deliveryReturnNum: headerInfo.deliveryReturnNum,
        returnedWorkerId: queryDS.current.get('workerId'),
        returnedWorker: queryDS.current.get('workerCode'),
        lineList: submitLineList,
      },
    ];
    const res = await executeDeliveryReturn(params);
    if (getResponse(res)) {
      notification.success({
        message: '提交成功',
      });
      const list = lineList.slice().filter((v) => !v.checked);
      setLineList(list);
      queryDS.current.set('deliveryReturnNum', '');
    }
  };

  return (
    <div className={style['purchase-return-order-execution']}>
      <div className={style['purchase-execution-header']}>
        <div className={style['header-left']}>
          <img src={LogoImg} alt="" />
        </div>
        <div className={style['header-right']}>
          <span className={style['date-time']}>{timeComponent}</span>
        </div>
      </div>
      <div className={style['purchase-execution-sub-header']}>
        <div className={style['avatar-img']}>
          <img src={fileUrl || defaultAvatarIcon} alt="" />
        </div>
        <div className={style['right-part']}>
          <SubHeader headerDS={queryDS} onQuery={handleQueryChange} />
          {Object.keys(headerInfo).length ? (
            <div className={style['sub-header-info']}>
              <div>
                <img src={SupplierImg} alt="" />
                <span>
                  {headerInfo.partyName || ''} {headerInfo.partyNumber || ''}
                </span>
              </div>
              <div>
                <img src={LocationImg} alt="" />
                <span>{headerInfo.partySiteName || ''}</span>
              </div>
              <div>
                <img src={RemarkImg} alt="" />
                <span>{headerInfo.remark || ''}</span>
              </div>
            </div>
          ) : (
            <div className={style['sub-header-edit-info']}>请录入退货单信息</div>
          )}
        </div>
      </div>
      <div className={style['purchase-execution-content']}>
        <Spin spinning={loading}>
          {lineList.length
            ? lineList.map((rec, index) => (
              <Line
                {...rec}
                onOpen={() => handleOpenModal(rec)}
                onLineCheckChange={() => handleLineCheckChange(rec)}
                handleUpdateCount={(type) => handleUpdateCount(type, index)}
                handleQuantityInput={(value) => handleQuantityInput(value, index)}
              />
              ))
            : null}
        </Spin>
      </div>
      <div className={style['purchase-execution-buttons']}>
        <Footer
          onClose={handleClose}
          onReset={handleReset}
          onAllChecked={handleAllChecked}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default PurchaseReturnOrderExecution;
