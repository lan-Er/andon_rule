/*
 * @Description: 租户站点白名单
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-12-31 13:38:45
 */

import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'lmds.whiteList.model';
const url = `${HLOS_LMDS}/v1/white-list`;

export default () => ({
  selection: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'tenantName',
      type: 'string',
      label: intl.get(`${intlPrefix}.tenantName`).d('租户名称'),
    },
  ],
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
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    submit: ({ data }) => {
      return {
        url,
        method: 'POST',
        data: data[0],
      };
    },
    update: ({ data }) => {
      return {
        url,
        method: 'PUT',
        data: data[0],
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        method: 'DELETE',
        data: data[0],
      };
    },
  },
});
