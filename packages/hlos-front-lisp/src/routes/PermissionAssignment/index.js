/**
 * @Description: 方案包权限分配--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-02 15:38:25
 * @LastEditors: yu.na
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { PermissionAssignmentProvider } from '@/stores/permissionAssignmentDS';
import List from './List';

export default formatterCollections({
  code: ['lisp.permissionAssignment', 'lisp.common'],
})((props) => {
  return (
    <PermissionAssignmentProvider {...props}>
      <List />
    </PermissionAssignmentProvider>
  );
});
