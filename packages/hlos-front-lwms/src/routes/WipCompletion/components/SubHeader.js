/**
 * @Description: 完工入库--SubHeader
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Form, TextField, Lov, Select } from 'choerodon-ui/pro';

import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import MeOuIcon from 'hlos-front/lib/assets/icons/me-ou.svg';
import ProdLineIcon from 'hlos-front/lib/assets/icons/prodline.svg';
import WorkcellIcon from 'hlos-front/lib/assets/icons/workcell.svg';
import WarehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import WmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import DocumentClassIcon from 'hlos-front/lib/assets/icons/document-type.svg';
import DocumentIcon from 'hlos-front/lib/assets/icons/document.svg';
import RemarkIcon from 'hlos-front/lib/assets/icons/remark.svg';
import LockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import UnLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';

export default (props) => {
  const { queryDS, orgLock, prodLineLock, wmAreaLock, onLockClick, currentWorker = {} } = props;
  return (
    <div className="lwms-wip-completion-sub-header">
      <div className="avator">
        <img src={DefaultAvatorImg} alt="" />
        <p>{currentWorker.workerName}</p>
      </div>
      <Form dataSet={queryDS} columns={4} labelLayout="placeholder">
        <div className="query-input lock">
          <Lov name="orgObj" noCache disabled={orgLock} placeholder="工厂" />
          <img src={MeOuIcon} alt="" />
          {orgLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Org')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Org')} />
          )}
        </div>
        <div className="query-input lock">
          <Lov name="prodLineObj" noCache placeholder="产线" disabled={prodLineLock} />
          <img src={ProdLineIcon} alt="" />
          {prodLineLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('ProdLine')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('ProdLine')} />
          )}
        </div>
        <div className="query-input">
          <Lov name="workcellObj" noCache placeholder="工位" />
          <img src={WorkcellIcon} alt="" />
        </div>
        <div className="query-input">
          <Lov name="warehouseObj" noCache placeholder="仓库" />
          <img src={WarehouseIcon} alt="" />
        </div>
        <div className="query-input lock">
          <Lov name="wmAreaObj" noCache disabled={wmAreaLock} placeholder="货位" />
          <img src={WmAreaIcon} alt="" />
          {wmAreaLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('WmArea')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('WmArea')} />
          )}
        </div>
        <div className="query-input">
          <Select name="documentClass" placeholder="单据类型" />
          <img src={DocumentClassIcon} alt="" />
        </div>
        <div className="query-input">
          <Lov name="documentObj" noCache placeholder="单据号" />
          <img src={DocumentIcon} alt="" />
        </div>
        <div className="query-input">
          <TextField name="remark" placeholder="备注" />
          <img src={RemarkIcon} alt="" />
        </div>
      </Form>
    </div>
  );
};
