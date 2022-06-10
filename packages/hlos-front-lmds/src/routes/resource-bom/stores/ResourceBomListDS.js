/*
 * @Author: zhang yang
 * @Description:  - List
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:33
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsResourceBom, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceBom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/resource-boms`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'resourceBomCode',
      type: 'string',
      label: intl.get(`${preCode}.resourceBom`).d('资源BOM'),
    },
    {
      name: 'resourceBomName',
      type: 'string',
      label: intl.get(`${preCode}.resourceBomName`).d('BOM名称'),
    },
  ],
  fields: [
    {
      name: 'resourceBomType',
      type: 'string',
      label: intl.get(`${preCode}.resourceBomType`).d('BOM类型'),
      lookupCode: lmdsResourceBom.resourceBomType,
      required: true,
    },
    {
      name: 'resourceBomCode',
      type: 'string',
      label: intl.get(`${preCode}.resourceBom`).d('资源BOM'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'resourceBomName',
      type: 'intl',
      label: intl.get(`${preCode}.resourceBomName`).d('BOM名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.resourceBomDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'resourceBomVersion',
      type: 'string',
      label: intl.get(`${preCode}.resourceBomVersion`).d('版本'),
      required: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
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
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: lmdsResourceBom.resource,
      ignore: 'always',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resource.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resource.resourceCode',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resource.resourceName',
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
    create: () => {
      return {
        url,
        method: 'post',
      };
    },
    update: () => {
      return {
        url,
        method: 'put',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
