/**
 * @Description: 备件现有量--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:43:30
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { SparePartsOnhandProvider } from '@/stores/sparePartsOnhandDS';
import List from './List';

export default formatterCollections({
  code: ['lisp.sparePartsOnhand', 'lisp.common'],
})((props) => {
  return (
    <SparePartsOnhandProvider {...props}>
      <List />
    </SparePartsOnhandProvider>
  );
});
