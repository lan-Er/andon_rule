/**
 * @Description: 资源BOM分配--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-06 16:35:40
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'lmds.bomAllocation';
const commonCode = 'lmds.common';
const { lmdsBomAllocation, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/resource-bom-assigns`;

export default () => ({
  autoQuery: true,
  primaryKey: 'assignId',
  queryFields: [
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.model.resourceObj`).d('资源'),
      ignore: 'always',
      lovCode: lmdsBomAllocation.resource,
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'resourceGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.model.resourceGroupObj`).d('资源组'),
      ignore: 'always',
      lovCode: common.resourceGroup,
    },
    {
      name: 'resourceGroupId',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupId',
    },
    {
      name: 'resourceGroupName',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupName',
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.org`).d('组织'),
      required: true,
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.model.resourceObj`).d('资源'),
      ignore: 'always',
      lovCode: lmdsBomAllocation.resource,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId:
            record.get('organizationObj') && record.get('organizationObj').organizationId,
        }),
      },
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
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'resourceGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.model.resourceGroupObj`).d('资源组'),
      ignore: 'always',
      lovCode: common.resourceGroup,
      dynamicProps: ({ record }) => {
        return {
          required: isEmpty(record.get('resourceObj')),
        };
      },
    },
    {
      name: 'resourceGroupId',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupId',
    },
    {
      name: 'resourceGroupCode',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupCode',
    },
    {
      name: 'resourceGroupName',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupName',
    },
    {
      name: 'resourceBomObj',
      type: 'object',
      label: intl.get(`${preCode}.model.resourceBomObj`).d('资源BOM'),
      ignore: 'always',
      lovCode: common.resourceBom,
      required: true,
    },
    {
      name: 'resourceBomId',
      type: 'string',
      bind: 'resourceBomObj.resourceBomId',
    },
    {
      name: 'resourceBomCode',
      type: 'string',
      bind: 'resourceBomObj.resourceBomCode',
    },
    {
      name: 'resourceBomName',
      type: 'string',
      bind: 'resourceBomObj.resourceBomName',
    },
    {
      name: 'primaryFalg',
      type: 'boolean',
      label: intl.get(`${preCode}.model.primaryFlag`).d('主要标识'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.model.startDate`).d('开始日期'),
      defaultValue: NOW_DATE,
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('endDate'))) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.model.endDate`).d('结束日期'),
      min: 'startDate',
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
