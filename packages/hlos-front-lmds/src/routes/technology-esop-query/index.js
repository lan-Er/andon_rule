/*
 * @Description: 图纸查询
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-15 13:22:46
 */

import formatterCollections from 'utils/intl/formatterCollections';
import ListPage from './List';

export default formatterCollections({
  code: ['lisp.drawingPlatform', 'lisp.common'],
})((props) => ListPage(props));
