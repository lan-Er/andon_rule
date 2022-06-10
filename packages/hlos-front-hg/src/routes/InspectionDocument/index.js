/**
 * @Description: 检验单平台--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:03:52
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { InspectionDocProvider } from '@/stores/inspectionDocDS';
import InspectionDocList from './InspectionDocList';

export default formatterCollections({
  code: ['lmes.InspectionDoc', 'lmes.common'],
})((props) => {
  return (
    <InspectionDocProvider {...props}>
      <InspectionDocList />
    </InspectionDocProvider>
  );
});
