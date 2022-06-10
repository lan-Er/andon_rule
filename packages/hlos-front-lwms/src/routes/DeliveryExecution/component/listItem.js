/*
 * @Description: 列表元素组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-10 15:34:28
 * @LastEditors: 赵敏捷
 */

import React from 'react';
import { CheckBox } from 'choerodon-ui/pro';
import { connect } from 'dva';
import moment from 'moment';

import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';

import moIcon from 'hlos-front/lib/assets/icons/order.svg';
import timeIcon from 'hlos-front/lib/assets/icons/clock-gray.svg';
import departmentIcon from 'hlos-front/lib/assets/icons/department.svg';
import { pickedShipOrder } from '@/services/deliveryExecutionService';
import styles from '../index.module.less';

const intlPrefix = 'lwms.deliveryExecution';

export default connect(({ deliveryExecution }) => ({ selectedIds: deliveryExecution.selectedIds }))(
  function ListItem({ recList, rec, dispatch, selectedIds, workerObj, onSearch, history }) {
    const {
      shipOrderNum,
      soNum,
      shipOrderStatus,
      shipOrderType,
      customerName,
      creatorImageUrl,
      salesman,
      planShipDate,
      shipOrderId,
    } = rec;
    const handelCheckBoxClick = (v) => {
      const index = selectedIds.findIndex((i) => i === shipOrderId);
      if (v) {
        if (index === -1) {
          dispatch({
            type: 'deliveryExecution/updateState',
            payload: {
              selectedIds: [...selectedIds, shipOrderId],
            },
          });
        }
      } else if (index !== -1) {
        const _ids = selectedIds.slice();
        _ids.splice(index, 1);
        dispatch({
          type: 'deliveryExecution/updateState',
          payload: {
            selectedIds: _ids,
          },
        });
      }
    };

    const handleClick = () => {
      history.push({
        pathname: `/pub/lwms/delivery-execution-detail/${rec.shipOrderId}`,
        state: {
          rec,
          recList,
        },
      });
    };

    const handleProcessItem = async (e) => {
      e.stopPropagation();
      const res = await pickedShipOrder([
        {
          executedWorkerId: workerObj.workerId,
          executedWorker: workerObj.workerName,
          shipOrderId,
          shipOrderNum,
          executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
        },
      ]);
      if (getResponse(res) && !res.failed) {
        notification.success();
        onSearch('other');
      }
    };

    return (
      <div className={styles['list-item']} onClick={handleClick}>
        <div className={styles.top}>
          {shipOrderStatus === 'PICKED' && (
            <div className={styles['top-left']}>
              <CheckBox
                checked={selectedIds.includes(shipOrderId)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(v) => {
                  handelCheckBoxClick(v);
                }}
              />
            </div>
          )}
          <div className={styles['top-right']}>
            <div className={styles['top-right-number']}>
              <div className={styles.num}>{shipOrderNum}</div>
              <div
                className={shipOrderStatus === 'PICKED' ? styles.pick : styles.issue}
                onClick={shipOrderStatus === 'PICKED' ? handleProcessItem : () => {}}
              >
                {shipOrderStatus === 'PICKED'
                  ? intl.get(`${intlPrefix}.view.message.pick`).d('发出')
                  : intl.get(`${intlPrefix}.view.message.issue`).d('挑库')}
              </div>
            </div>
            <div className={styles['top-right-detail']}>
              {soNum ? (
                <div className={styles['detail-line']}>
                  <img src={moIcon} alt="" />
                  <span className={styles.content}>{soNum}</span>
                </div>
              ) : (
                ''
              )}
              {customerName ? (
                <div className={styles['detail-line']}>
                  <img src={departmentIcon} alt="" />
                  <span className={styles.content}>{customerName}</span>
                </div>
              ) : (
                ''
              )}
              {planShipDate ? (
                <div className={styles['detail-line']}>
                  <img src={timeIcon} alt="" />
                  <span className={styles.content}>{planShipDate}</span>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          {creatorImageUrl ? (
            <img className={styles.avator} src={creatorImageUrl} alt="" />
          ) : (
            <div className={styles.avator}>{salesman?.slice(0, 1)}</div>
          )}
          <div className={styles.name}> {salesman}</div>
          <div className={styles.type}>{shipOrderType}</div>
        </div>
      </div>
    );
  }
);
