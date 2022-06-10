/*
 * @Description: 资源管理信息--ResourceListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsResource } = codeConfig.code;

const intlPrefix = 'lmds.resource';
const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/resources`;

export default () => ({
  autoQuery: true,
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
  queryFields: [
    {
      name: 'resourceCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源编码'),
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get('lmds.common.model.org').d('组织'),
    },
    {
      name: 'organizationCode',
      type: 'string',
    },
    {
      name: 'resourceCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'resourceName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
    },
    {
      name: 'resourceAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceAlias`).d('资源简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceDesc`).d('资源描述'),
      validator: descValidator,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourcePicture`).d('图片'),
    },
    {
      name: 'resourceClassMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceClass`).d('资源分类'),
      lookupCode: lmdsResource.resourceClass,
    },
    {
      name: 'resourceTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceType`).d('资源类型'),
      lookupCode: lmdsResource.resourceType,
    },
    {
      name: 'resourceCategoryCode',
      type: 'string',
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceCategory`).d('资源类别'),
    },
    {
      name: 'chiefPosition',
      type: 'string',
    },
    {
      name: 'chiefPositionName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceChiefPosition`).d('主管岗位'),
    },
    {
      name: 'locationCode',
      type: 'string',
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('资源地点'),
    },
    {
      name: 'resourceStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceStatus`).d('资源状态'),
      lookupCode: lmdsResource.resourceStatus,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
});
