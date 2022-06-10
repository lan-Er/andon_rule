/**
 * @Description: 安灯安灯规则管理信息--tableDS
 * @Author: wenhao.li<wenhao.li@zone-cloud.com>
 * @Date: 2021-10-30 13:54:33
 * @LastEditors: wenhao.li
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsAndonRule, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonRule.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/andon-rules`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'andonRuleCode',
      type: 'string',
      label: intl.get(`${preCode}.andonRule`).d('安灯规则'),
    },
    {
      name: 'andonRuleName',
      type: 'string',
      label: intl.get(`${preCode}.andonRuleName`).d('安灯规则名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'andonRuleType',
      type: 'string',
      label: intl.get(`${preCode}.andonRuleType`).d('安灯规则类型'),
      lookupCode: lmdsAndonRule.andonRuleType,
      required: true,
    },
    {
      name: 'andonRuleCode',
      type: 'string',
      label: intl.get(`${preCode}.andonRule`).d('安灯规则'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'andonRuleName',
      type: 'intl',
      label: intl.get(`${preCode}.andonRuleName`).d('安灯规则名称'),
      required: true,
    },
    {
      name: 'andonRuleAlias',
      type: 'intl',
      label: intl.get(`${preCode}.andonRuleAlias`).d('安灯规则简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.andonRuleDesc`).d('安灯规则描述'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
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
