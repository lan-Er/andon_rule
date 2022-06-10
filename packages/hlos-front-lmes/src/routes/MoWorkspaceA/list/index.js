/**
 * @Description: MO工作台管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { MoProvider } from '@/stores/moWorkspaceADS';
import MoList from './MoList';

export default formatterCollections({
  code: ['lmes.moWorkspace', 'lmes.common'],
})((props) => {
  return (
    <MoProvider {...props}>
      <MoList />
    </MoProvider>
  );
});
