/*
 * @Description: 发货执行详情
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-13 14:34:28
 * @LastEditors: Please set LastEditors
 */

import { connect } from 'dva';
import React, { Fragment as div, useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import {
  Button,
  DataSet,
  DateTimePicker,
  Modal,
  Select,
  Spin,
  TextField,
  Lov,
} from 'choerodon-ui/pro';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryLovData } from 'hlos-front/lib/services/api';
// import { headerSearchDSConfig } from '@/stores/deliveryExecutionDS';
import { shipOrderInfoDSConfig, shipLineSearchDSConfig } from '@/stores/deliveryExecutionDS';
import {
  pickShipOrder,
  executeShipOrder,
  pickedShipOrder,
} from '@/services/deliveryExecutionService';
import defaultAvatorIcon from 'hlos-front/lib/assets/img-default-avator.png';
import { Progress } from 'hlos-front/lib/components';
import Icons from 'components/Icons';

import logoIcon from 'hlos-front/lib/assets/icons/logo.svg';
import buttonExitIcon from 'hlos-front/lib/assets/icons/exit.svg';
import buttonResetIcon from 'hlos-front/lib/assets/icons/reset.svg';
import buttonPickIcon from 'hlos-front/lib/assets/icons/pick.svg';
import buttonSubmiIcon from 'hlos-front/lib/assets/icons/submit.svg';
import shipDetailButtonIcon from 'hlos-front/lib/assets/icons/ship-detail.svg';
import copyIcon from 'hlos-front/lib/assets/icons/copy.svg';
import { closeTab } from 'utils/menuTab';
import { Clock, Line } from '../component';
import styles from '../index.module.less';

const intlPrefix = 'lwms.deliveryExecution';
const commonPrefix = 'lwms.common';
const key = Modal.key();
let modalInstance = null;

async function queryAvator() {
  const workerRes = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
  if (getResponse(workerRes)) {
    return workerRes?.content?.[0] || {};
  }
  return {};
}

function DeliveryExecution({ dispatch, submitData, match, history }) {
  const { shipOrderId } = match.params;
  const shipOrderInfoDS = useMemo(() => new DataSet(shipOrderInfoDSConfig()), []);
  const shipLineSearchDS = useMemo(() => new DataSet(shipLineSearchDSConfig()), []);
  const [recList, setRecList] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(2);
  // const [avatorUrl, setAvatorUrl] = useState(' ');
  const [loading, setLoading] = useState(false);
  const detailInfo = history.location.state.rec;
  const [workerObj, setWorker] = useState({});
  const clock = useMemo(() => <Clock />, []);
  const [isExpand, setIsExpand] = useState(false);
  shipLineSearchDS.current.set('organizationId', detailInfo.organizationId);
  const handleSearch = useCallback(async () => {
    setLoading(true);
    const params = {
      itemCode: shipLineSearchDS.current.get('itemCode'),
      warehouseId: shipLineSearchDS.current.get('warehouseId'),
    };
    const detail = await queryDetailList(params);
    setRecList(detail?.content || []);
    dispatch({
      type: 'deliveryExecution/updateState',
      payload: {
        submitData: detail?.content || [],
      },
    });
    setLoading(false);
  }, [shipLineSearchDS, dispatch]);

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
        sessionStorage.setItem('headResultList', JSON.stringify(history.location.state.recList));
        history.push({
          pathname: '/lwms/delivery-execution/list',
          state: {
            headResultList: history.location.state.recList,
          },
        });
        closeTab(`/pub/lwms/delivery-execution-detail/${shipOrderId}`);
      }
    });
  };

  const handleReset = () => {
    setLoading(true);
    setCurrentProgress(2);
    queryDetailList().then((res) => {
      setRecList(res?.content || []);
      dispatch({
        type: 'deliveryExecution/updateState',
        payload: {
          submitData: [],
        },
      });
      setLoading(false);
    });
  };

  const handlePick = async () => {
    setLoading(true);
    const data = [];
    submitData.forEach((i) => {
      const _i = i;
      if (_i.receiveList) {
        _i.receiveList.forEach((el) => {
          const _el = el;
          if (_i.itemControlType === 'LOT') {
            _el.pickedQty = _el.advisedQty || 0;
          }
          if (_i.itemControlType === 'TAG') {
            _el.pickedQty = _el.applyQty || 0;
          }
          if (_i.itemControlType === 'QUANTITY') {
            _el.pickedQty = _el.pickedQty || _el.executedQty;
            // 数量类型取行上的仓库和货位，这么写是为了减少改动
            el.warehouseId = i.warehouseId || null;
            el.warehouseCode = i.warehouseCode || null;
            el.warehouseName = i.warehouseName || null;
            el.wmAreaId = i.wmAreaId || null;
            el.wmAreaCode = i.wmAreaCode || null;
            el.wmAreaName = i.wmAreaName || null;
            el.wmUnitId = i.wmUnitId || null;
            el.wmUnitCode = i.wmUnitCode || null;
            el.wmUnitName = i.wmUnitName || null;
          }
          delete _el.executedQty;
          if (el.warehouseId) {
            i.warehouseId = el.warehouseId;
            i.warehouseCode = el.warehouseCode;
            i.warehouseName = el.warehouseName;
          } else {
            i.warehouseId = null;
            i.warehouseCode = null;
            i.warehouseName = null;
          }
          if (el.wmAreaId) {
            i.wmAreaId = el.wmAreaId;
            i.wmAreaCode = el.wmAreaCode;
            i.wmAreaName = el.wmAreaName;
          } else {
            i.wmAreaId = null;
            i.wmAreaCode = null;
            i.wmAreaName = null;
          }
          if (el.wmUnitId) {
            i.wmUnitId = el.wmUnitId;
            i.wmUnitCode = el.wmUnitCode;
            i.wmUnitName = el.wmUnitName;
          } else {
            i.wmUnitId = null;
            i.wmUnitCode = null;
            i.wmUnitName = null;
          }
          data.push({
            ...i,
            receiveList: [_el],
            shipOrderLineId: i.shipLineId,
            shipOrderLineNum: i.no,
          });
        });
      }
      // else if (_i.itemControlType === 'QUANTITY') {
      //   _i.receiveList = [
      //     {
      //       pickedQty: 0,
      //       executedQty: 0,
      //     },
      //   ];
      //   data.push({
      //     ...i,
      //     shipOrderLineId: i.shipLineId,
      //     shipOrderLineNum: i.no,
      //   });
      // }
    });
    const res = await pickShipOrder([
      {
        shipOrderId,
        shipOrderNum: detailInfo?.shipOrderNum,
        pickedWorkerId: workerObj?.workerId,
        pickedWorker: workerObj?.workerCode,
        pickedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        lineList: data,
      },
    ]);

    setLoading(false);
    if (getResponse(res) && !res.failed) {
      notification.success();
      sessionStorage.setItem('deliveryExecutionSubmit', true);
      setCurrentProgress(3);
    }
  };

  // const handleRevert = () => {
  //   setLoading(true);
  //   setCurrentProgress(2);
  //   setTimeout(() => setLoading(false), 300);
  // };

  const handleSubmit = async () => {
    setLoading(true);
    const data = [];
    submitData.forEach((i) => {
      const _i = i;
      if (_i.receiveList) {
        _i.receiveList.forEach((el) => {
          const _el = el;
          // if (_el.applyQty) {
          //   _el.executedQty = _el.applyQty;
          //   _el.pickedQty = _el.applyQty;
          // }
          if (_i.itemControlType === 'LOT') {
            _el.pickedQty = _el.advisedQty || 0;
            _el.executedQty = _el.advisedQty || 0;
          }
          if (_i.itemControlType === 'TAG') {
            _el.executedQty = _el.applyQty;
            _el.pickedQty = _el.applyQty;
          }
          if (_i.itemControlType === 'QUANTITY') {
            _el.executedQty = _el.pickedQty;
            // 数量类型取行上的仓库和货位，这么写是为了减少改动
            el.warehouseId = i.warehouseId || null;
            el.warehouseCode = i.warehouseCode || null;
            el.warehouseName = i.warehouseName || null;
            el.wmAreaId = i.wmAreaId || null;
            el.wmAreaCode = i.wmAreaCode || null;
            el.wmAreaName = i.wmAreaName || null;
            el.wmUnitId = i.wmUnitId || null;
            el.wmUnitCode = i.wmUnitCode || null;
            el.wmUnitName = i.wmUnitName || null;
          }
          if (el.warehouseId) {
            i.warehouseId = el.warehouseId;
            i.warehouseCode = el.warehouseCode;
            i.warehouseName = el.warehouseName;
          } else {
            i.warehouseId = null;
            i.warehouseCode = null;
            i.warehouseName = null;
          }
          if (el.wmAreaId) {
            i.wmAreaId = el.wmAreaId;
            i.wmAreaCode = el.wmAreaCode;
            i.wmAreaName = el.wmAreaName;
          } else {
            i.wmAreaId = null;
            i.wmAreaCode = null;
            i.wmAreaName = null;
          }
          if (el.wmUnitId) {
            i.wmUnitId = el.wmUnitId;
            i.wmUnitCode = el.wmUnitCode;
            i.wmUnitName = el.wmUnitName;
          } else {
            i.wmUnitId = null;
            i.wmUnitCode = null;
            i.wmUnitName = null;
          }
          data.push({
            ...i,
            receiveList: [_el],
            shipOrderLineId: i.shipLineId,
            shipOrderLineNum: i.no,
          });
        });
      }
      // else if (_i.itemControlType === 'QUANTITY') {
      //   _i.receiveList = [
      //     {
      //       pickedQty: 0,
      //       executedQty: 0,
      //     },
      //   ];
      //   data.push({
      //     ...i,
      //     shipOrderLineId: i.shipLineId,
      //     shipOrderLineNum: i.no,
      //   });
      // }
    });
    let res = {};
    if (currentProgress === 2) {
      res = await executeShipOrder([
        {
          shipOrderId,
          shipOrderNum: detailInfo?.shipOrderNum,
          executedWorkerId: workerObj?.workerId,
          executedWorker: workerObj?.workerCode,
          executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
          lineList: data,
        },
      ]);
    } else {
      res = await pickedShipOrder([
        {
          shipOrderId,
          shipOrderNum: detailInfo?.shipOrderNum,
          executedWorkerId: workerObj?.workerId,
          executedWorker: workerObj?.workerCode,
          executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        },
      ]);
    }

    setLoading(false);
    if (getResponse(res) && !res.failed) {
      notification.success();
      sessionStorage.setItem('deliveryExecutionSubmit', true);
      if (currentProgress === 3) {
        setCurrentProgress(4);
      }
    }
  };

  function handleChangeExpand() {
    setIsExpand(!isExpand);
  }

  const handleFillInShipInfo = () => {
    modalInstance = Modal.open({
      key,
      title: intl.get(`${intlPrefix}.button.shipInfo`).d('发运信息'),
      children: (
        <div className={styles['ship-order-info']}>
          <TextField
            name="shipTicket"
            dataSet={shipOrderInfoDS}
            placeholder={intl
              .get(`${intlPrefix}.view.message.input.ship.order.no`)
              .d('请输入发运单号')}
          />
          <Select name="shippingMethod" dataSet={shipOrderInfoDS} placeholder="请输入发运方式" />
          <TextField name="carrier" dataSet={shipOrderInfoDS} placeholder="请输入承运人" />
          <DateTimePicker
            name="shippedDate"
            dataSet={shipOrderInfoDS}
            placeholder={intl.get(`${intlPrefix}.view.message.input.ship.date`).d('请输入发运日期')}
          />
          <Button
            style={{
              fontSize: '22px',
              color: '#fff',
              backgroundColor: '#1C879C',
              height: '56px',
              width: '100%',
            }}
            onClick={() => {
              if (modalInstance) {
                notification.success({
                  message: '发运明细保存成功',
                });
                modalInstance.close();
              }
            }}
          >
            {intl.get(`${intlPrefix}.view.message.sure`).d('确定')}
          </Button>
        </div>
      ),
      footer: null,
    });
  };

  const handleCopyNum = (v) => {
    // The clipboard-write permission is granted automatically to pages when they are in the active tab.
    if (window.isSecureContext) {
      navigator.clipboard
        .writeText(v)
        .then(() => {
          notification.success({
            message: intl.get(`${intlPrefix}.view.message.copy.success`).d('复制成功'),
          });
        })
        .catch(({ message }) => {
          notification.error({
            message,
          });
        });
    } else {
      const tmpEl = document.createElement('textarea');
      tmpEl.value = v;
      tmpEl.style.position = 'fixed';
      tmpEl.style.top = '10000px';
      document.body.appendChild(tmpEl);
      tmpEl.focus();
      tmpEl.select();
      try {
        // clipboard access is synchronous, and can only read and write to the DOM
        const res = document.execCommand('copy');
        if (res) {
          notification.success({
            message: intl.get(`${intlPrefix}.view.message.copy.success`).d('复制成功'),
          });
        }
      } catch ({ message }) {
        notification.error({
          message,
        });
      }
      document.body.removeChild(tmpEl);
    }
  };

  const queryDetailList = useCallback(
    async (params) => {
      return dispatch({
        type: 'deliveryExecution/fetchDetail',
        payload: {
          shipOrderId,
          itemCode: '',
          page: -1,
          ...params,
        },
      });
    },
    [shipOrderId]
  );

  useEffect(() => {
    (async function _queryAvator() {
      const res = await queryAvator();
      // setAvatorUrl(res.creatorImageUrl);
      setWorker(res);
    })();
    return () => {
      closeTab(`/pub/lwms/delivery-execution-detail/${shipOrderId}`);
    };
  }, []);

  useEffect(() => {
    (async function _queryDetailList() {
      const detail = await queryDetailList();
      if (detailInfo && detailInfo.shipOrderStatus === 'PICKED') {
        setCurrentProgress(3);
      }
      setRecList(detail?.content || []);
      dispatch({
        type: 'deliveryExecution/updateState',
        payload: {
          submitData: detail?.content || [],
        },
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div className={styles['deliver-execution-detail']}>
      <div className={styles.header}>
        <img src={logoIcon} alt="" />
        {clock}
      </div>
      <div className={styles['progress-bar']}>
        <Progress
          currentProgress={currentProgress}
          progressName={[
            [
              intl.get(`${intlPrefix}.view.message.submitted`).d('已提交'),
              intl.get(`${intlPrefix}.view.message.toPick`).d('待挑库'),
              intl.get(`${intlPrefix}.view.message.toShip`).d('待发出'),
              intl.get(`${intlPrefix}.view.message.toReceive`).d('待接收'),
            ],
            [
              intl.get(`${intlPrefix}.view.message.submitted`).d('已提交'),
              intl.get(`${intlPrefix}.view.message.toPick`).d('待挑库'),
              intl.get(`${intlPrefix}.view.message.toShip`).d('待发出'),
              intl.get(`${intlPrefix}.view.message.toReceive`).d('待接收'),
            ],
            [
              intl.get(`${intlPrefix}.view.message.submitted`).d('已提交'),
              intl.get(`${intlPrefix}.view.message.picked`).d('已挑库'),
              intl.get(`${intlPrefix}.view.message.toShip`).d('待发出'),
              intl.get(`${intlPrefix}.view.message.toReceive`).d('待接收'),
            ],
            [
              intl.get(`${intlPrefix}.view.message.submitted`).d('已提交'),
              intl.get(`${intlPrefix}.view.message.picked`).d('已挑库'),
              intl.get(`${intlPrefix}.view.message.shipped`).d('已发出'),
              intl.get(`${intlPrefix}.view.message.toReceive`).d('待接收'),
            ],
          ]}
        />
      </div>
      <div className={styles.content}>
        {isExpand ? (
          <div className={styles['order-detail']}>
            <div className={styles.head}>
              <img
                className={styles.avator}
                src={detailInfo?.creatorImageUrl || defaultAvatorIcon}
                alt=""
              />
              <div className={styles.name}>{detailInfo?.salesman || ''}</div>
              <div className={styles.button} onClick={handleFillInShipInfo}>
                <img src={shipDetailButtonIcon} alt="" />
                {intl.get(`${intlPrefix}.button.shipDetial`).d('发运明细')}
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.order}>
                <div className={styles['order-num']}>{detailInfo?.shipOrderNum || ''}</div>
                <img
                  src={copyIcon}
                  alt=""
                  onClick={() => handleCopyNum(detailInfo?.shipOrderNum || '')}
                />
              </div>
              <div className={styles['detail-list']}>
                <div className={styles.line}>
                  <Icons type="banzuguanli-1" size="32" color="#9E9E9E" />
                  <span>{detailInfo?.shipOrderType || ''}</span>
                </div>
                <div className={styles.line}>
                  <Icons type="cube-blue" size="32" color="#9E9E9E" />
                  <span>{detailInfo?.customerName || ''}</span>
                </div>
                <div className={styles.line}>
                  <Icons type="location" size="32" color="#9E9E9E" />
                  <span>{detailInfo?.customerSiteName || ''}</span>
                </div>
                <div className={styles.line}>
                  <Icons type="odd-number" size="32" color="#9E9E9E" />
                  <span>{detailInfo?.soNum || ''}</span>
                </div>
                <div className={styles.line}>
                  <Icons type="workcell" size="32" color="#9E9E9E" />
                  <span>{detailInfo?.customerContactPhone || ''}</span>
                </div>
              </div>
            </div>
            <div
              className={styles['lwms-delivery-execute-content-expand-icon']}
              onClick={handleChangeExpand}
            >
              {'<<'}
            </div>
          </div>
        ) : (
          <div
            className={styles['lwms-delivery-execute-content-bottom-left-hide']}
            onClick={handleChangeExpand}
          >
            <Icons type="arrow-right-white" color="#fff" />
          </div>
        )}
        <div className={styles['order-list']}>
          <div className={styles['search-field']}>
            <TextField
              dataSet={shipLineSearchDS}
              name="itemCode"
              clearButton
              placeholder={intl.get(`${intlPrefix}.view.message.input.itemCode`).d('请输入物料号')}
              // onChange={(v) => setItemCode(v)}
            />
            <Lov
              style={{ marginLeft: '15px' }}
              dataSet={shipLineSearchDS}
              name="warehouseObj"
              clearButton
              // placeholder={intl.get(`${intlPrefix}.view.message.input.itemCode`).d('请输入物料号')}
              // onChange={(v) => handleWarehouseChange(v)}
            />
            <button className={styles.button} type="button" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </button>
          </div>

          <div className={styles['line-wrap']}>
            <Spin spinning={loading}>
              {recList.length === 0 && (
                <div className={styles['no-data']}>
                  {intl.get('hzero.common.components.noticeIcon.null').d('暂无数据')}
                </div>
              )}
            </Spin>
            {recList.map((i) => (
              <Line
                record={i}
                key={i.shipLineId}
                currentProgress={currentProgress}
                detailInfo={detailInfo}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${styles['action-area']} ${
          currentProgress === 3 ? styles['action-area-ship'] : ''
        }`}
      >
        <div className={`${styles['exit-button']} ${styles.button}`} onClick={handleExit}>
          <img src={buttonExitIcon} alt="" />
          <div className={styles['split-line']} />
          <span>{intl.get(`${intlPrefix}.button.exit`).d('退出')}</span>
        </div>
        {currentProgress === 2 && (
          <Fragment>
            <div className={`${styles['reset-button']} ${styles.button}`} onClick={handleReset}>
              <img src={buttonResetIcon} alt="" />
              <div className={styles['split-line']} />
              <span>{intl.get(`${intlPrefix}.button.reset`).d('重置')}</span>
            </div>
            <div className={`${styles['pick-button']} ${styles.button}`} onClick={handlePick}>
              <img src={buttonPickIcon} alt="" />
              <div className={styles['split-line']} />
              <span>{intl.get(`${intlPrefix}.button.pick`).d('拣料')}</span>
            </div>
          </Fragment>
        )}
        {/* {currentProgress === 3 && (
          <div className={`${styles['revert-button']} ${styles.button}`} onClick={handleRevert}>
            <img src={buttonRevertIcon} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.revert`).d('撤销')}</span>
          </div>
        )} */}
        {currentProgress < 4 && (
          <div
            className={`${styles['submit-button']} ${styles.button}`}
            style={{
              gridColumnStart: currentProgress === 3 ? 'pick-start' : 'submit-start',
              columnStart: currentProgress === 3 ? 'pick-start' : 'submit-start',
            }}
            onClick={handleSubmit}
          >
            <img src={buttonSubmiIcon} alt="" />
            <div className={styles['split-line']} />
            <span>{intl.get(`${intlPrefix}.button.ship`).d('发出')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default connect(({ deliveryExecution: { submitData } }) => ({ submitData }))(
  formatterCollections({
    code: [`${intlPrefix}`, `${commonPrefix}`],
  })(DeliveryExecution)
);
