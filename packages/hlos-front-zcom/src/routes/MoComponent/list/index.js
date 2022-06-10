/**
 * @Description: MO组件
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-27 15:10:00
 */

import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { MoComponentProvider } from '../store/MoComponentDS';
import MoComponentList from './MoComponentList';

export default formatterCollections({
  code: ['zcom.ticket', 'zcom.common'],
})((props) => {
  return (
    <MoComponentProvider {...props}>
      <MoComponentList />
    </MoComponentProvider>
  );
});
