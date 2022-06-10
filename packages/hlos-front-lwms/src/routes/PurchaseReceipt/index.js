/*
 * @Description: 采购接收
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-03 15:05:28
 * @LastEditors: 赵敏捷
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DataSet, Lov, TextField, notification, Modal } from 'choerodon-ui/pro';
import { connect } from 'dva';
import moment from 'moment';

import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
// import ImgUpload from 'hlos-front/lib/components/ImgUpload';
// import ImgUpload from '@/components/ImgUpload';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryLovData } from 'hlos-front/lib/services/api';
import Loading from 'hlos-front/lib/components/Loading';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { headFormDSConfig, headerSearchDSConfig } from '@/stores/purchaseReceiptDS';
import defaultAvatorIcon from 'hlos-front/lib/assets/img-default-avator.png';
import workerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import orgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import warehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import wmIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import lockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import unlockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import logoIcon from 'hlos-front/lib/assets/icons/logo.svg';
import buttonExitIcon from 'hlos-front/lib/assets/icons/exit.svg';
// import buttonImageIcon from 'hlos-front/lib/assets/icons/image.svg';
// import buttonRemarkIcon from 'hlos-front/lib/assets/icons/remark.svg';
import buttonResetIcon from 'hlos-front/lib/assets/icons/reset.svg';
import buttonSubmiIcon from 'hlos-front/lib/assets/icons/submit.svg';

import styles from './index.module.less';
import { Clock, VirtualScrollList } from './components';
// import { BUCKET_NAME_WMS } from '../../../../hlos-front/lib/utils/config';

const intlPrefix = 'lwms.purchaseReceipt.model';
const { common } = codeConfig.code;

async function queryAvator() {
  const workerRes = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
  if (getResponse(workerRes)) {
    return workerRes?.content?.[0] || {};
  }
  return {};
}

function PurchaseReceipt({
  recList = [],
  dispatch,
  history,
  selectedKeys,
  dataSetDataArr,
  quantityRecCount,
}) {
  const headFormDS = useMemo(() => new DataSet(headFormDSConfig()), []);
  const headerSearchDS = useMemo(() => new DataSet(headerSearchDSConfig()), []);
  const [avatorUrl, setAvatorUrl] = useState(' ');
  const [workerLock, setWorkerLock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orgLock, setOrgLock] = useState(true);
  const [warehouseLock, setWarehouseLock] = useState(true);
  const [wmLock, setWmLock] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  // const [remark, setRemark] = useState('');
  // const [pictures, setPictures] = useState([]);
  const clock = useMemo(() => <Clock />, []);

  const handleToggleLock = useCallback(
    (evt, type) => {
      evt.nativeEvent.preventDefault();
      evt.nativeEvent.stopImmediatePropagation();
      switch (type) {
        case 'worker':
          setWorkerLock(!workerLock);
          break;
        case 'org':
          setOrgLock(!orgLock);
          break;
        case 'warehouse':
          setWarehouseLock(!warehouseLock);
          break;
        case 'wm':
          setWmLock(!wmLock);
          break;
        default:
          break;
      }
    },
    [workerLock, orgLock, warehouseLock, wmLock]
  );

  const handleSearch = useCallback(async () => {
    const { current } = headerSearchDS;
    const poNum = current.get('poNum');
    const supplierId = current.get('supplierId');
    if (!poNum && !supplierId) {
      notification.warning({
        message: intl
          .get(`${intlPrefix}.view.message.input.poNum.or.pary.required`)
          .d('采购订单和供应商两者必输其一'),
      });
      return;
    }
    setLoading(true);
    dispatch({
      type: 'purchaseReceipt/updateDataSetDataArr',
      payload: {
        dataSetDataArr: [],
      },
    });
    dispatch({
      type: 'deliveryExecution/updateSelectedList',
      payload: {
        selectedIds: [],
      },
    });
    await dispatch({
      type: 'purchaseReceipt/fetchLines',
      payload: {
        ...(headerSearchDS.current?.toJSONData() || {}),
        poStatusArray: ['APPROVED', 'RECEIVING', 'COMPLETED'],
        poLineStatusArray: ['APPROVED', 'RECEIVING', 'RECEIVED', 'COMPLETED'],
        itemControlWarehouseId: headFormDS.current.get('warehouseId'),
        page: -1,
      },
    });
    setLoading(false);
  }, [headerSearchDS, dispatch]);

  const handleExit = () => {
    Modal.confirm({
      key: Modal.key(),
      children: (
        <span>
          {intl
            .get(`${intlPrefix}.view.message.exit.no.saving`)
            .d('退出后不保存当前编辑，确认退出？')}
        </span>
      ),
    }).then((button) => {
      if (button === 'ok') {
        history.push('/workplace');
        dispatch({
          type: 'purchaseReceipt/initialState',
        });
      }
    });
  };

  const handleReset = useCallback(() => {
    const { current } = headFormDS;
    let worker = null;
    let org = null;
    let warehouse = null;
    let wm = null;

    if (workerLock) {
      worker = current.get('workerObj');
    }
    if (orgLock) {
      org = current.get('receiveOrgObj');
    }
    if (warehouseLock) {
      warehouse = current.get('warehouseObj');
    }
    if (wmLock) {
      wm = current.get('wmAreaObj');
    }
    current.reset();
    current.set('workerObj', worker);
    current.set('receiveOrgObj', org);
    current.set('warehouseObj', warehouse);
    current.set('wmAreaObj', wm);
  }, [headFormDS, workerLock, orgLock, warehouseLock, wmLock]);

  const handleSubmit = async () => {
    const validateValue = await headFormDS.validate(false, false);
    if (!validateValue) return;
    if (selectedKeys.length === 0) {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.message.select.receipt.info`).d('请选中接收信息'),
      });
    } else {
      const headFormData = headFormDS.current?.toJSONData() || {};
      const otherPoLineInfo = {
        warehouseId: headFormData.warehouseId || '',
        warehouseCode: headFormData.warehouseCode || '',
        wmAreaId: headFormData.wmAreaId || '',
        wmAreaCode: headFormData.wmAreaCode || '',
      };
      const otherHeadInfo = {
        receiveWorkerId: headFormData.receiveWorkerId || '',
        receiveWorker: headFormData.receiveWorker || '',
        organizationCode: headFormData.organizationCode || '',
        organizationId: headFormData.organizationId || '',
      };
      // LOT TAG
      const partialSelectedRecs = selectedKeys.reduce((acc, key) => {
        const dsData = dataSetDataArr.find((data) => data.key === key);
        if (dsData) {
          acc.push({
            key,
            data: dsData.table.selected.map((i) => i.toJSONData()),
          });
        }
        return acc;
      }, []);
      const toSubmitRec = recList.reduce((acc, rec) => {
        if (selectedKeys.includes(rec.key)) {
          acc.push(rec);
        }
        return acc;
      }, []);
      /**
       * {
       *   [poId: string]: {
       *     [otherHeadProp: string]: string,
       *     lineList: <Array>{
       *       [otherLineProp: string]: string,
       *       receivedList: <Array>{
       *         [receiveLine: string]: string,
       *       }
       *     }
       *   }
       * }
       */
      const poHeadLineList = {};
      toSubmitRec.forEach((rec) => {
        const { poHeaderId: poId } = rec;
        const head = {
          ...otherHeadInfo,
          poId: poId || '',
          poNum: rec.poNum || '',
          deliveryAreaId: rec.deliveryAreaId || '',
          deliveryArea: rec.deliveryArea || '',
          carrier: rec.carrier || '',
          carrierContact: rec.carrierContact || '',
          plateNum: rec.plateNum || '',
          shipTicket: rec.shipTicket || '',
          shippedDate: rec.shippedDate || null,
          remark: rec.remark || '',
          validateLevel: rec.validateLevel || '',
          actualArrivalTime: moment().format(DEFAULT_DATETIME_FORMAT),
        };
        let processPictures = '';
        if (rec.pictures) {
          rec.pictures.forEach((item) => {
            processPictures = processPictures === '' ? item.url : `${processPictures}#${item.url}`;
          });
        }
        const line = {
          ...otherPoLineInfo,
          poLineId: rec.poLineId || '',
          poLineNum: rec.poLineNum || '',
          itemControlType: rec.itemControlType || '',
          pictures: processPictures || '',
          lineRemark: rec.lineRemark || '',
          receivedList:
            rec.itemControlType === 'QUANTITY'
              ? [{ receivedQty: quantityRecCount?.find((i) => i.key === rec.key)?.value || 0 }]
              : partialSelectedRecs.find((i) => i.key === rec.key)?.data || [],
        };
        if (poHeadLineList[poId]) {
          poHeadLineList[poId].lineList.push(line);
        } else {
          poHeadLineList[poId] = {
            ...head,
            lineList: [line],
          };
        }
      });
      const finalDataStructure = Object.keys(poHeadLineList).reduce((acc, key) => {
        acc.push({
          ...poHeadLineList[key],
        });
        return acc;
      }, []);
      setSubmitLoading(true);
      const res = await dispatch({
        type: 'purchaseReceipt/submitLines',
        payload: finalDataStructure,
      });
      setSubmitLoading(false);
      if (res) {
        notification.success({
          message: intl
            .get(`${intlPrefix}.view.message.receipt.completed.generate.deliveryTicket`)
            .d('完成接收，送货单已生成'),
        });
        dispatch({
          type: 'purchaseReceipt/updateSelectedList',
          payload: {
            selectedKeys: [],
          },
        });
        handleReset();
        handleSearch();
      }
    }
  };

  useEffect(() => {
    const { current } = headFormDS;
    const lovCodes = [common.worker, common.organization, common.warehouse];
    Promise.all(lovCodes.map((i) => queryLovData({ lovCode: i, defaultFlag: 'Y' })))
      .then((resArr) => {
        resArr.forEach((v, i) => {
          if (getResponse(v) && v.totalElements === 1) {
            const val = v?.content?.[0];
            if (val) {
              switch (i) {
                case 0:
                  current.set('workerObj', {
                    workerId: val.workerId,
                    workerCode: val.workerCode,
                    workerName: val.workerName,
                  });
                  break;
                case 1:
                  current.set('receiveOrgObj', {
                    organizationId: val.organizationId,
                    organizationCode: val.organizationCode,
                    organizationName: val.organizationName,
                  });
                  break;
                case 2:
                  current.set('warehouseObj', {
                    warehouseId: val.warehouseId,
                    warehouseCode: val.warehouseCode,
                    warehouseName: val.warehouseName,
                  });
                  break;
                default:
                  break;
              }
            }
          }
        });
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e.message);
      });
  }, [headFormDS]);

  useEffect(() => {
    (async function anonymouse() {
      const res = await queryAvator();
      setAvatorUrl(res.fileUrl);
    })();
  }, []);

  return (
    <div className={styles['purchase-receipt-wrapper']}>
      <div className={styles['purchase-receipt']}>
        <div className={styles.header}>
          <img src={logoIcon} alt="" />
          {clock}
        </div>
        <div className={styles['search-form']}>
          <img src={avatorUrl || defaultAvatorIcon} alt="" className={styles.avatar} />
          <div className={styles['column-wrap']}>
            <Lov
              name="workerObj"
              dataSet={headFormDS}
              onChange={(record) => setAvatorUrl(record.fileUrl)}
              prefix={<img src={workerIcon} alt="" />}
            />
            <img
              className={styles.suffix}
              src={workerLock ? lockIcon : unlockIcon}
              alt=""
              onClick={(e) => handleToggleLock(e, 'worker')}
            />
          </div>
          <div className={styles['column-wrap']}>
            <Lov name="receiveOrgObj" dataSet={headFormDS} prefix={<img src={orgIcon} alt="" />} />
            <img
              className={styles.suffix}
              src={orgLock ? lockIcon : unlockIcon}
              alt=""
              onClick={(e) => handleToggleLock(e, 'org')}
            />
          </div>
          <div className={styles['column-wrap']}>
            <Lov
              name="warehouseObj"
              dataSet={headFormDS}
              prefix={<img src={warehouseIcon} alt="" />}
            />
            <img
              className={styles.suffix}
              src={warehouseLock ? lockIcon : unlockIcon}
              alt=""
              onClick={(e) => handleToggleLock(e, 'warehouse')}
            />
          </div>
          <div className={styles['column-wrap']}>
            <Lov name="wmAreaObj" dataSet={headFormDS} prefix={<img src={wmIcon} alt="" />} />
            <img
              className={styles.suffix}
              src={wmLock ? lockIcon : unlockIcon}
              alt=""
              onClick={(e) => handleToggleLock(e, 'wm')}
            />
          </div>
        </div>
        <div className={styles['filter-form']}>
          <TextField
            name="poNum"
            dataSet={headerSearchDS}
            placeholder={intl.get(`${intlPrefix}.view.message.input.poNumer`).d('请输入采购订单号')}
          />
          <Lov
            name="itemObj"
            dataSet={headerSearchDS}
            placeholder={intl.get(`${intlPrefix}.view.message.input.itemCode`).d('请输入物料号')}
          />
          <Lov
            name="supplierObj"
            dataSet={headerSearchDS}
            placeholder={intl.get(`${intlPrefix}.view.message.input.party`).d('请输入供应商')}
          />
          <Lov
            name="supplierSiteObj"
            dataSet={headerSearchDS}
            placeholder={intl.get(`${intlPrefix}.view.message.input.partySite`).d('供应商地点')}
          />
          <button className={styles.button} type="button" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </button>
        </div>
        <VirtualScrollList
          recList={recList}
          headerSearchDS={headerSearchDS}
          headFormDS={headFormDS}
          loading={loading}
        />
        <div className={styles['action-area']}>
          <div className={`${styles['exit-button']} ${styles.button}`} onClick={handleExit}>
            <img src={buttonExitIcon} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.exit`).d('退出')}</span>
          </div>
          <div className={`${styles['reset-button']} ${styles.button}`} onClick={handleReset}>
            <img src={buttonResetIcon} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.reset`).d('重置')}</span>
          </div>
          <div className={`${styles['submit-button']} ${styles.button}`} onClick={handleSubmit}>
            <img src={buttonSubmiIcon} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.submit`).d('提交')}</span>
          </div>
        </div>
      </div>
      {submitLoading && <Loading title="提交中..." />}
    </div>
  );
}

export default connect(({ purchaseReceipt }) => ({
  recList: purchaseReceipt?.recList || [],
  selectedKeys: purchaseReceipt?.selectedKeys || [],
  dataSetDataArr: purchaseReceipt?.dataSetDataArr || [],
  quantityRecCount: purchaseReceipt?.quantityRecCount || [],
}))(
  formatterCollections({
    code: ['lwms.purchaseReceipt', 'lwms.common'],
  })(PurchaseReceipt)
);
