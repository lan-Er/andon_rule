/*
 * @Description: 销售订单详情 - 供应商侧
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-25 13:24:13
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-25 13:24:47
 * @Copyright: Copyright (c) 2018, Hand
 */

import formatterCollections from 'utils/intl/formatterCollections';
import ListPage from './List';

export default formatterCollections({
  code: ['lisp.drawingPlatform', 'lisp.common'],
})((props) => ListPage(props));
