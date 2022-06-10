/**
 * @Description: MO工作台新建/详情页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-16 18:38:08
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { MoProvider } from '@/stores/moWorkspaceADS';
import MoDetail from './MoDetail';

export default formatterCollections({
  code: ['lmes.moWorkspace', 'lmes.common'],
})((props) => {
  return (
    <MoProvider {...props}>
      <MoDetail />
    </MoProvider>
  );
});
