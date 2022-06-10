import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LMDS}/v1/${organizationId}/andon-rules`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonRuleCode',
      type: 'string',
      label: '安灯规则',
    },
    {
      name: 'andonRuleName',
      type: 'string',
      label: '安灯规则名称',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
    },
    {
      name: 'andonRuleType',
      type: 'string',
      label: '安灯规则类型',
    },
    {
      name: 'andonRuleCode',
      type: 'string',
      label: '安灯规则',
    },
    {
      name: 'andonRuleName',
      type: 'string',
      label: '安灯规则名称',
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
      type: 'boolen',
      label: '是否有效',
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
  },
});
