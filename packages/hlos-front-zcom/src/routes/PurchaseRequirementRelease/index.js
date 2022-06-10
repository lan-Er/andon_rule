/**
 * @Description: 采购协同-需求发布
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-21 14:12:52
 */

import formatterCollections from 'utils/intl/formatterCollections';
import ListPage from './List';

export default formatterCollections({
  code: ['zcom.purchaseRequirementRelease', 'zcom.common'],
})((props) => ListPage(props));
