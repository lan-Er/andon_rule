/*
 * @Description: 组织管理信息--OrganizationListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

const intelPrefix = 'lmds.organization';
const commonPrefix = 'lmds.common';
const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/organizations`;

export default () => ({
  pageSize: 10,
  autoQuery: true,
  transport: {
    read: () => ({
      url,
      method: 'get',
    }),
  },
  queryFields: [
    {
      name: 'organizationCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.name`).d('名称'),
    },
  ],
  fields: [
    {
      name: 'organizationCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'organizationLevel',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgLevel`).d('级别'),
    },
    {
      name: 'organizationName',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgName`).d('名称'),
    },
    {
      name: 'organizationAlias',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgAlias`).d('简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intelPrefix}.model.orgDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'organizationClassMeaning',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgClass`).d('分类'),
    },
    {
      name: 'organizationTypeMeaning',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.orgType`).d('类型'),
    },
    {
      name: 'parentOrganizationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.parentOrg`).d('父组织'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${intelPrefix}.model.externalOrg`).d('外部组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intelPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
});
