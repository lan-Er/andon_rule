/**
 * @Description: 在制品管理--Index
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-11
 * @LastEditors: leying.yan
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { InProcessProvider } from '@/stores/inProcessManagementDS';
import InProcessList from './InProcessList';

export default formatterCollections({
  code: ['lmes.inProcessManagement', 'lmes.common'],
})((props) => {
  return (
    <InProcessProvider {...props}>
      <InProcessList />
    </InProcessProvider>
  );
});
