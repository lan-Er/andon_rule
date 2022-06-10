/*
 * @Description:员工工时统计报表
 * @Author: hongming。zhang@hand-china.com
 * @Date: 2020-12-21 12:53:30
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-12-23 13:34:13
 */

import formatterCollections from 'utils/intl/formatterCollections';
import EmployeeHourStatisticPage from './EmployeeHourStatisticPage';

export default formatterCollections({
  code: ['ldab.employeeHourStatistic'],
})((props) => EmployeeHourStatisticPage(props));
