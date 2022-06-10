import React from 'react';
import { TextField, Button, Lov } from 'choerodon-ui/pro';
import intl from 'utils/intl';

export default ({ onSearch, ds }) => {
  return (
    <div className="lwms-purchase-receive-inventory-search">
      <TextField dataSet={ds} name="poNum" placeholder="请输入采购订单号" />
      <TextField dataSet={ds} name="ticketNumLike" placeholder="请输入送货单号" />
      <Lov dataSet={ds} name="itemObj" placeholder="请输入物料号" />
      <Lov dataSet={ds} name="supplierObj" placeholder="请输入供应商" />
      <Lov dataSet={ds} name="supplierSiteObj" placeholder="供应商地点" />
      <Button color="primary" onClick={onSearch}>
        {intl.get('hzero.common.button.search').d('查询')}
      </Button>
    </div>
  );
};
