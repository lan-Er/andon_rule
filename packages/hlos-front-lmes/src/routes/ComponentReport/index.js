/**
 * @Description: 构件报工报表--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-05-06 12:26:39
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { ComponentReportProvider } from '@/stores/componentReportDS';
import ReportList from './ReportList';

export default formatterCollections({
  code: ['lmes.componentReport', 'lmes.common'],
})((props) => {
  return (
    <ComponentReportProvider {...props}>
      <ReportList />
    </ComponentReportProvider>
  );
});
