/*
 * @Description: 图纸平台
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 16:26:44
 * @Copyright: Copyright (c) 2018, Hand
 */

import formatterCollections from 'utils/intl/formatterCollections';
import ListPage from './List';

export default formatterCollections({
  code: ['lisp.drawingPlatform', 'lisp.common'],
})((props) => ListPage(props));
