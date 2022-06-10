/**
 * @Description: 生产执行明细--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-28 10:05:33
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { ProductionExecutionProvider } from '@/stores/productionExecutionDS';
import ProductionExecutionList from './ProductionExecutionList';

export default formatterCollections({
  code: ['lmes.productionExecution', 'lmes.common'],
})((props) => {
  return (
    <ProductionExecutionProvider {...props}>
      <ProductionExecutionList />
    </ProductionExecutionProvider>
  );
});
