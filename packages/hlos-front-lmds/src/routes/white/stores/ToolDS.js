/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-02-23 19:36:13
 */
/*
 * @Description: 租户站点白名单
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-12-31 13:38:45
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'lmds.whiteList.model';

export default () => ({
  autoQuery: true,
  fields: [
    {
      name: 'tenantObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.tenantName`).d('租户名称'),
      lovCode: common.tenant,
      ignore: 'always',
      unique: true,
      required: true,
    },
    {
      name: 'tenantName',
      type: 'string',
      bind: 'tenantObj.tenantName',
    },
    {
      name: 'tenantNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.tenantNum`).d('租户编码'),
      bind: 'tenantObj.tenantNum',
      disabled: true,
    },
    {
      name: 'tenantId',
      type: 'string',
      bind: 'tenantObj.tenantId',
    },
    {
      name: 'whiteListIp',
      type: 'string',
      multiple: ',',
      label: intl.get(`${intlPrefix}.whiteListIp`).d('IP白名单'),
    },
  ],
});
