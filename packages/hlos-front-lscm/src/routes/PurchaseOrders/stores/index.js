/*
 * @Author: tanjianjun
 * @Description: 采购订单
 * @E-mail: jianjun.tan@hand-china.com
 * @Date: 2020-08-20 10:11:04
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { ScmPoQtyDS, ScmPoLineDS, ScmPoDetailDS } from '@/stores/purchaseOrdersDS';

const Store = createContext();

export default Store;

export const StoreProvider = (props) => {
  const { children } = props;
  const dataSet = useDataSet(() => new DataSet(ScmPoQtyDS()));
  const lineDataSet = useMemo(() => new DataSet(ScmPoLineDS()), []);
  const detailDataSet = useMemo(() => new DataSet(ScmPoDetailDS()), []);
  const value = {
    ...props,
    dataSet,
    lineDataSet,
    detailDataSet,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
