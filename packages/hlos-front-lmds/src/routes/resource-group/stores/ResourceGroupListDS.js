/**
 * @Description: 资源组管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-08 14:55:24
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsResourceGroup, common } = codeConfig.code;
const {
  lovPara: { resourceGroup },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/resource-groups`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'resourceGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.resourceGroup`).d('资源组'),
    },
    {
      name: 'resourceGroupName',
      type: 'string',
      label: intl.get(`${preCode}.resourceGroupName`).d('资源组名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: lmdsResourceGroup.organization,
      ignore: 'always',
      required: true,
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
      name: 'resourceGroupType',
      type: 'string',
      label: intl.get(`${preCode}.resourceGroupType`).d('资源组类型'),
      lookupCode: lmdsResourceGroup.resourceGroupType,
      required: true,
    },
    {
      name: 'resourceGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.resourceGroup`).d('资源组'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'resourceGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.resourceGroupName`).d('资源组名称'),
      required: true,
    },
    {
      name: 'resourceGroupAlias',
      type: 'intl',
      label: intl.get(`${preCode}.resourceGroupAlias`).d('资源组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.resourceGroupDesc`).d('资源组描述'),
      validator: descValidator,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.resourceGroupCategory`).d('资源类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: resourceGroup },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderBy`).d('排序'),
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
    submitSuccess: ({ dataSet }) => {
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
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'resourceGroup', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
  },
});
