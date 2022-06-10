import React from 'react';
import { Lov, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';

export default ({ onSearch, onAllCheck, ds }) => {
  return (
    <div className="lwms-finished-product-inventory-search">
      <Lov dataSet={ds} name="prodLineWarehouseObj" noCache placeholder="请选择线边仓" />
      <Lov dataSet={ds} name="prodLineWmAreaObj" noCache placeholder="请选择线边仓货位" />
      <Lov dataSet={ds} name="itemObj" noCache placeholder="请输入物料" />
      <Button color="primary" onClick={onSearch}>
        {intl.get('hzero.common.button.search').d('查询')}
      </Button>
      <Button color="primary" onClick={onAllCheck}>
        {intl.get('hzero.c7nUI.Select.selectAll').d('全选')}
      </Button>
    </div>
  );
};
