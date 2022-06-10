/*
 * @Description: 配置模版
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 16:26:44
 * @Copyright: Copyright (c) 2018, Hand
 */

import { connect } from 'dva';
import ListPage from './ConfigurationTemplate';

export default connect()((props) => ListPage(props));
