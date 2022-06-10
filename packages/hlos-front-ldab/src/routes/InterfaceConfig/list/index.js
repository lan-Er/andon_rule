/*
 * @Description: 接口配置--InterfaceCofig
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-06-10 11:20:42
 */

import formatterCollections from 'utils/intl/formatterCollections';
import InterfaceConfigPage from './InterfaceConfigPage';

export default formatterCollections({
  code: ['lisp.interfaceConfig'],
})((props) => InterfaceConfigPage(props));
