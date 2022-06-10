import React from 'react';
import { Lov } from 'choerodon-ui/pro';
import DefaultAvator from 'hlos-front/lib/assets/img-default-avator.png';
import WarehouseIcon from 'hlos-front/lib/assets/icons/warehouse.svg';
import WmAreaIcon from 'hlos-front/lib/assets/icons/wm-area.svg';
import OrgIcon from 'hlos-front/lib/assets/icons/operation.svg';
import WorkerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import LockIcon from 'hlos-front/lib/assets/icons/lock.svg';
import UnLockIcon from 'hlos-front/lib/assets/icons/un-lock.svg';

export default ({
  workerLock,
  orgLock,
  warehouseLock,
  wmAreaLock,
  onLockClick,
  ds,
  avatorUrl,
  setAvator,
}) => {
  return (
    <div className="lwms-purchase-receive-inventory-sub-header">
      <div className="sub-header-avator">
        <img src={avatorUrl || DefaultAvator} alt="" />
      </div>
      <div className="lov-suffix-wrap">
        <Lov
          dataSet={ds}
          name="workerObj"
          placeholder="操作工"
          prefix={<img src={WorkerIcon} alt="" style={{ margin: '0 8px' }} />}
          disabled={workerLock}
          onChange={(record) => setAvator(record.fileUrl)}
        />
        <img
          src={workerLock ? LockIcon : UnLockIcon}
          alt=""
          onClick={() => onLockClick('Worker')}
        />
      </div>
      <div className="lov-suffix-wrap">
        <Lov
          dataSet={ds}
          name="organizationObj"
          placeholder="接收组织"
          prefix={<img src={OrgIcon} alt="" style={{ margin: '0 8px' }} />}
          disabled={orgLock}
        />
        <img src={orgLock ? LockIcon : UnLockIcon} alt="" onClick={() => onLockClick('Org')} />
      </div>
      <div className="lov-suffix-wrap">
        <Lov
          dataSet={ds}
          name="warehouseObj"
          placeholder="仓库"
          prefix={<img src={WarehouseIcon} alt="" style={{ margin: '0 8px' }} />}
          disabled={warehouseLock}
        />
        <img
          src={warehouseLock ? LockIcon : UnLockIcon}
          alt=""
          onClick={() => onLockClick('Warehouse')}
        />
      </div>
      <div className="lov-suffix-wrap">
        <Lov
          dataSet={ds}
          name="wmAreaObj"
          placeholder="货位"
          prefix={<img src={WmAreaIcon} alt="" style={{ margin: '0 8px' }} />}
          disabled={wmAreaLock}
        />
        <img
          src={wmAreaLock ? LockIcon : UnLockIcon}
          alt=""
          onClick={() => onLockClick('WmArea')}
        />
      </div>
    </div>
  );
};
