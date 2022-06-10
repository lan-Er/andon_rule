/**
 * @Description: 任务外协--Index
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-21 09:53:14
 * @LastEditors: leying.yan
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { ProcessOutsourceProvider } from '@/stores/processOutsourcePlatformDS';
import ProcessDetail from './ProcessDetail';

export default formatterCollections({
  code: ['lmes.processOutsourcePlatform', 'lmes.common'],
})((props) => {
  return (
    <ProcessOutsourceProvider {...props}>
      <ProcessDetail />
    </ProcessOutsourceProvider>
  );
});
