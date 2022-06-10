/**
 * @Description: 工序外协平台--Index
 *  @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-20 09:53:14
 * @LastEditors: leying.yan
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { ProcessOutsourceProvider } from '@/stores/processOutsourcePlatformDS';
import ProcessList from './ProcessList';

export default formatterCollections()((props) => {
  return (
    <ProcessOutsourceProvider {...props}>
      <ProcessList />
    </ProcessOutsourceProvider>
  );
});
