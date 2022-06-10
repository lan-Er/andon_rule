/**
 * @Description: 退料执行--SubHeader
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Form, TextField, Lov } from 'choerodon-ui/pro';

import DefaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import OrgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import WarehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import WmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import ReasonIcon from 'hlos-front/lib/assets/icons/reason.svg';
import LockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import UnLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';
import DocumentIcon from 'hlos-front/lib/assets/icons/document.svg';
import orderIcon from 'hlos-front/lib/assets/icons/odd-number.svg';

export default (props) => {
  const {
    queryDS,
    orgLock,
    warehouseLock,
    documentLock,
    onLockClick,
    currentWorker = {},
    onToWhChange,
    onToWmChange,
  } = props;
  return (
    <div className="lwms-material-return-execution-sub-header">
      <div className="avator">
        <img src={DefaultAvatorImg} alt="" />
        <p>{currentWorker.workerName}</p>
      </div>
      <Form dataSet={queryDS} columns={4} labelLayout="placeholder">
        <div className="query-input lock">
          <Lov name="organizationObj" noCache clearButton={false} disabled={orgLock} />
          <img src={OrgIcon} alt="" />
          {orgLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Org')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Org')} />
          )}
        </div>
        <div className="query-input lock">
          <Lov
            name="warehouseObj"
            noCache
            clearButton={false}
            placeholder="执行仓库"
            disabled={warehouseLock}
          />
          <img src={WarehouseIcon} alt="" />
          {warehouseLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Wh')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Wh')} />
          )}
        </div>
        <div className="query-input">
          <Lov name="wmAreaObj" noCache clearButton={false} placeholder="执行货位" />
          <img src={WmAreaIcon} alt="" />
        </div>
        <div className="query-input lock">
          <Lov name="documentTypeObj" noCache clearButton={false} disabled={documentLock} />
          <img src={DocumentIcon} alt="" />
          {documentLock ? (
            <img src={LockIcon} alt="" onClick={() => onLockClick('Doc')} />
          ) : (
            <img src={UnLockIcon} alt="" onClick={() => onLockClick('Doc')} />
          )}
        </div>
        <div className="query-input">
          <Lov
            name="toWarehouseObj"
            noCache
            clearButton={false}
            placeholder="目标仓库"
            onChange={onToWhChange}
          />
          <img src={WarehouseIcon} alt="" />
        </div>
        <div className="query-input">
          <Lov
            name="toWmAreaObj"
            noCache
            clearButton={false}
            placeholder="目标货位"
            onChange={onToWmChange}
          />
          <img src={WmAreaIcon} alt="" />
        </div>
        <div className="query-input">
          <Lov name="moObj" noCache clearButton={false} placeholder="关联单据" />
          <img src={orderIcon} alt="" />
        </div>
        <div className="query-input">
          <TextField name="returnReason" placeholder="退料原因" />
          <img src={ReasonIcon} alt="" />
        </div>
      </Form>
    </div>
  );
};
