import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';

const organizationId = getCurrentOrganizationId();
const { common, lmdsAndonRule } = codeConfig.code;

const url = `${HLOS_LMDS}/v1/${organizationId}/andon-rules`;
const url1 = `${HLOS_LMDS}/v1/${organizationId}/andon-rule-lines`;

export default () => ({
  primaryKey: 'andonRuleId',
  selection: false,
  children: {
    datas: new DataSet({
      autoQuery: false,
      selection: false,
      fields: [
        {
          name: 'andonRankObj',
          type: 'object',
          label: '安灯等级',
          lovCode: lmdsAndonRule.andonRank,
          ignore: 'always',
          required: true,
        },
        {
          name: 'andonRankId',
          type: 'string',
          bind: 'andonRankObj.andonRankId',
        },
        {
          name: 'andonRankName',
          type: 'string',
          bind: 'andonRankObj.andonRankName',
        },
        {
          name: 'relatedPositionObj',
          type: 'object',
          label: '关联岗位',
          lovCode: common.position,
          ignore: 'always',
          required: true,
        },
        {
          name: 'relatedPositionId',
          type: 'string',
          bind: 'relatedPositionObj.positionId',
        },
        {
          name: 'positionName',
          type: 'string',
          bind: 'relatedPositionObj.positionName',
        },
        {
          name: 'relatedUserObj',
          type: 'object',
          label: '关联用户',
          lovCode: common.user,
          ignore: 'always',
          required: true,
        },
        {
          name: 'relatedUserId',
          type: 'string',
          bind: 'relatedPositionObj.id',
        },
        {
          name: 'realName',
          type: 'string',
          label: '真实姓名',
          bind: 'relatedPositionObj.realName',
        },
        {
          name: 'userName',
          type: 'string',
          label: '真实姓名',
          bind: 'relatedPositionObj.loginName',
        },
        {
          name: 'phoneNumber',
          type: 'string',
          label: '电话',
        },
        {
          name: 'email',
          type: 'email',
          label: '邮件',
        },
        {
          name: 'enabledFlag',
          type: 'boolean',
          label: '是否有效',
          required: true,
        },
      ],
      transport: {
        read: (config) => {
          return {
            ...config,
            url: url1,
            method: 'GET',
          };
        },
        destroy: ({ data }) => {
          return {
            url: url1,
            data: data[0],
            method: 'DELETE',
          };
        },
      },
      events: {
        update: ({ record }) => {
          if (!isEmpty(record.get('relatedPositionObj'))) {
            record.fields.get('relatedUserObj').set('required', false);
          } else if (!isEmpty(record.get('relatedUserObj'))) {
            record.fields.get('relatedPositionObj').set('required', false);
          }
        },
      },
    }),
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
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
      label: '安灯规则类型',
      lookupCode: lmdsAndonRule.andonRuleType,
      required: true,
    },
    {
      name: 'andonRuleCode',
      type: 'string',
      label: '安灯规则',
      required: true,
    },
    {
      name: 'andonRuleName',
      type: 'string',
      label: '安灯规则名称',
      required: true,
    },
    {
      name: 'andonRuleAlias',
      type: 'string',
      label: '安灯规则简称',
    },
    {
      name: 'description',
      type: 'string',
      label: '安灯规则描述',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: '是否有效',
      required: true,
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
        dataSet.children.datas.get(0).set('andonRankObj', {});
      }
    },
  },
});
