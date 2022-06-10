/*
 * @Description: 接口详情--InterfaceCofig
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-06-06 11:20:42
 */

import formatterCollections from 'utils/intl/formatterCollections';
import InterfaceConfigDetail from './InterfaceConfigDetail';

export default formatterCollections({
  code: ['lisp.interfaceConfig'],
})((props) => InterfaceConfigDetail(props));
