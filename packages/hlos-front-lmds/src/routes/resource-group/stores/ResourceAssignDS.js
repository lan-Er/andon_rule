/**
 * @Description: 资源组管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-08 14:55:24
 * @LastEditors: yu.na
 */


import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/resource-group-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.resource,
      textField: 'resourceCode',
      ignore: 'always',
      required: true,
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${preCode}.resourceName`).d('资源名称'),
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderBy`).d('排序'),
    },

    {
      name: 'preferredFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.preferredFlag`).d('优选资源'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submit: ({ dataSet, data }) => {
      data.map(item => {
        const dataItem = item;
        dataItem.resourceGroupId = dataSet.queryParameter.resourceGroupId;
        return dataItem;
      });
    },
    submitSuccess: ({dataSet}) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});
