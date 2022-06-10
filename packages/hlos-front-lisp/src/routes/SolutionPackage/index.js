/**
 * @Description: 方案包基础数据
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-28 17:20:37
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { SolutionPackageProvider } from '@/stores/solutionPackageDS';
import List from './List';

export default formatterCollections({
  code: ['lisp.solutionPackage', 'lisp.common'],
})((props) => {
  return (
    <SolutionPackageProvider {...props}>
      <List />
    </SolutionPackageProvider>
  );
});
