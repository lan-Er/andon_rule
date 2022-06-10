/**
 * @Description: 采购退货接收--SubHeader
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Form, Lov, TextField } from 'choerodon-ui/pro';

import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import WarehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import OrgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import CustomerIcon from 'hlos-front/lib/assets/icons/work-type.svg';
import SiteIcon from 'hlos-front/lib/assets/icons/place.svg';
import WorkerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import WmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import RemarkIcon from 'hlos-front/lib/assets/icons/remark2.svg';

import styles from './index.less';

export default (props) => {
  const { ds, currentWorker = {}, onOrgChange, onWarehouseChange, onWorkerChange } = props;
  return (
    <div className={styles['lwms-delivery-return-receive-sub-header']}>
      <div className={styles.avator}>
        <img src={currentWorker.fileUrl || DefaultAvatorImg} alt="" />
      </div>
      <Form dataSet={ds} columns={4} labelLayout="placeholder">
        <div className={styles['query-input']}>
          <Lov name="workerObj" noCache placeholder="操作工" onChange={onWorkerChange} />
          <img src={WorkerIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="organizationObj" noCache placeholder="退货组织" onChange={onOrgChange} />
          <img src={OrgIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="warehouseObj" noCache placeholder="仓库" onChange={onWarehouseChange} />
          <img src={WarehouseIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="wmAreaObj" noCache placeholder="货位" />
          <img src={WmAreaIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="supplierObj" noCache placeholder="供应商" />
          <img src={CustomerIcon} alt="" />
        </div>
        <div className={styles['query-input']}>
          <Lov name="supplierSiteObj" noCache placeholder="供应商地点" />
          <img src={SiteIcon} alt="" />
        </div>
        <div className={`${styles['query-input']} ${styles.remark}`}>
          <TextField name="remark" placeholder="备注" />
          <img src={RemarkIcon} alt="" />
        </div>
      </Form>
    </div>
  );
};
