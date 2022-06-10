/**
 * @Description: 安灯安灯规则详情页面--detailDS
 * @Author: wenhao.li<wenhao.li@zone-cloud.com>
 * @Date: 2021-10-25 14:06:38
 * @LastEditors: wenhao.li
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ChildrenDS from './RuleLineDS';

const { lmdsAndonRule, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonRule.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/andon-rules`;

export default () => ({
  primaryKey: 'andonRuleId',
  selection: false,
  children: {
    lineList: new DataSet({ ...ChildrenDS() }),
  },
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
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, dataSet }) => {
      if (name === 'organizationObj') {
        dataSet.children.lineList.get(0).set('andonRankObj', {});
      }
    },
  },
});
