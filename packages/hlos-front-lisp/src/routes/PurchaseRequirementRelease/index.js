/*
 * @Description: 采购需求发布与确认
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 10:57:01
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 11:35:29
 * @Copyright: Copyright (c) 2018, Hand
 */

import formatterCollections from 'utils/intl/formatterCollections';
import ListPage from './List';

export default formatterCollections({
  code: ['lisp.purchaseRequirementRelease', 'lisp.common'],
})((props) => ListPage(props));
