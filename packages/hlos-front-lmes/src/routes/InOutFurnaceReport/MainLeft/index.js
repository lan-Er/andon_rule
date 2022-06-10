/**
 * @Description: 进出炉报工--MainLeft
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Modal } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import orderIcon from 'hlos-front/lib/assets/icons/order-icon3.svg';
import operationIcon from 'hlos-front/lib/assets/icons/operation-gray.svg';
import DetailModal from './DetailModal';
import styles from './index.less';

export default ({ currentActive, data, tagData, detailList }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (detailList.length) {
      setList(detailList.length > 4 ? detailList.slice(0, 4) : detailList);
    }
  }, [detailList]);

  const qty =
    (data.processOkQty || 0) +
    (data.processNgQty || 0) +
    (data.scrappedQty || 0) +
    (data.reworkQty || 0) +
    (data.pendingQty || 0) +
    (data.wipQty || 0);

  function handleShowDetailModal() {
    Modal.open({
      key: 'lmes-one-piece-flow-report-detail-modal',
      title: '查看详情',
      className: styles['lmes-one-piece-flow-report-detail-modal'],
      children: <DetailModal list={detailList} />,
      okCancel: false,
    });
  }
  return (
    <div className={styles['main-left']}>
      <div className={styles['mo-info']}>
        <p className={styles.order}>
          <span>
            <img src={orderIcon} alt="" />
            {data.moNum}
          </span>
          <span>
            <img src={orderIcon} alt="" />
            {data.taskNum}
          </span>
        </p>
        <div>
          <div>
            <p>{tagData.tagCode}</p>
            <p>{data.itemCode}</p>
            <p>{data.itemDescription}</p>
          </div>
          <div className={styles.url}>
            <img src={data.itemFileUrl} alt="" />
          </div>
        </div>
        <p className={styles.remark}>{data.moRemark}</p>
        {currentActive.value !== 'INSPECT' ? (
          <div className={styles['progress-wrapper']}>
            <div className={styles.progress}>
              <div style={{ width: `${(qty * 100) / data.taskQty}%` }} />
            </div>
            <span>
              {qty}/{data.taskQty}
            </span>
          </div>
        ) : (
          <div className={styles['inspect-progress']}>
            <div>
              <p className={styles['progress-title']}>待检验</p>
              <div className={styles['progress-wrapper']}>
                <div className={`${styles.progress} ${styles['ing-progress']}`}>
                  <div style={{ width: `${((data.processOkQty || 0) * 100) / data.taskQty}%` }} />
                </div>
                <span>
                  {data.processOkQty || 0}/{data.taskQty}
                </span>
              </div>
            </div>
            <div>
              <p className={styles['progress-title']}>已检验</p>
              <div className={styles['progress-wrapper']}>
                <div className={styles.progress}>
                  <div style={{ width: `${(qty * 100) / data.taskQty}%` }} />
                </div>
                <span>
                  {qty}/{data.taskQty}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {currentActive.value === 'IN' || currentActive.value === 'OUT' ? (
        <div className={styles['sn-timeline']}>
          <div className={styles.timeline}>
            {list.map((i) => {
              return (
                <div className={styles['dot-item']} key={uuidv4()}>
                  <p>{i.eventTypeName}</p>
                  <div>
                    <div className={styles['circle-wrapper']}>
                      <span className={styles.circle} />
                    </div>
                    <span className={styles.line} />
                  </div>
                  <p>{i.worker}</p>
                  <p className={styles.time}>{i.executeTime}</p>
                </div>
              );
            })}
          </div>
          <p onClick={handleShowDetailModal}>查看详情</p>
        </div>
      ) : (
        !isEmpty(tagData) &&
        currentActive.value === 'CLEAN' && (
          <div className={styles['sn-item']}>
            <p>{tagData.itemCode}</p>
            <p>{tagData.itemDescription}</p>
            <div>
              <p>
                <img src={operationIcon} alt="" />
                批次：{tagData.lotNumber}
              </p>
              <p>
                <img src={operationIcon} alt="" />
                供应商：{tagData.supplierName}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};
