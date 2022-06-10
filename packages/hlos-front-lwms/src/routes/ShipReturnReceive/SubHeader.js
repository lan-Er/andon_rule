/**
 * @Description: 销售退货接收--SubHeader
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Form, TextField, Lov } from 'choerodon-ui/pro';

import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import WarehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import OrgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import CustomerIcon from 'hlos-front/lib/assets/icons/work-type.svg';
import SiteIcon from 'hlos-front/lib/assets/icons/place.svg';
import WorkerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import WmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import ReasonIcon from 'hlos-front/lib/assets/icons/reason.svg';
import RemarkIcon from 'hlos-front/lib/assets/icons/remark2.svg';
import LockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import UnLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';

import styles from './index.less';

export default (props) => {
  const {
    ds,
    workerLock,
    orgLock,
    warehouseLock,
    onLockClick,
    currentWorker = {},
    onOrgChange,
    onWarehouseChange,
    onReasonChange,
  } = props;
  return (
    <div className={styles['lwms-ship-return-receive-sub-header']}>
      <div className={styles.avator}>
        <img src={currentWorker.fileUrl || DefaultAvatorImg} alt="" />
      </div>
      <Form dataSet={ds} columns={4} labelLayout="placeholder">
        <div className={`${styles['query-input']} ${styles.lock}`}>
          <Lov name="workerObj" noCache disabled={workerLock} placeholder="操作工" />
          <img src={WorkerIcon} alt="" />
          {workerLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Worker')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Worker')} />
          )}
        </div>
        <div className={`${styles['query-input']} ${styles.lock}`}>
          <Lov
            name="organizationObj"
            noCache
            placeholder="接收组织"
            disabled={orgLock}
            onChange={onOrgChange}
          />
          <img src={OrgIcon} alt="" />
          {orgLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Org')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Org')} />
          )}
        </div>
        <div className={`${styles['query-input']} ${styles.lock}`}>
          <Lov
            name="warehouseObj"
            noCache
            disabled={warehouseLock}
            placeholder="仓库"
            onChange={onWarehouseChange}
          />
          <img src={WarehouseIcon} alt="" />
          {warehouseLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Warehouse')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Warehouse')} />
          )}
        </div>
        <div className={styles['query-input']}>
          <Lov name="wmAreaObj" noCache placeholder="货位" />
          <img src={WmAreaIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="customerObj" noCache placeholder="客户" />
          <img src={CustomerIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="customerSiteObj" noCache placeholder="客户地点" />
          <img src={SiteIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="returnReasonObj" placeholder="退货原因" onChange={onReasonChange} />
          <img src={ReasonIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <TextField name="remark" placeholder="备注" />
          <img src={RemarkIcon} alt="" />
        </div>
      </Form>
    </div>
  );
};
