import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
// import { NOW_DATE } from 'hlos-front/lib/utils/constants';

const intlPrefix = 'ldab.IqcStatisticalReport.model';
const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/work-times/work-time-report`;

export const queryDs = () => ({
  selection: false,
  autoCreate: true,
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
  },
  data: [
    {
      logonMode: 'EMPTY_TAG',
    },
  ],
  fields: [
    {
      name: 'radioList',
      type: 'string',
      defaultValue: 'autogeneration',
    },
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
    },
    {
      name: 'logonMode',
      type: 'string',
      required: true,
    },
    {
      name: 'tagType',
      type: 'string',
      lookupCode: 'LWMS.TAG_TYPE',
      required: true,
    },
    {
      name: 'labelCategory',
      type: 'object',
      lovCode: 'LMDS.CATEGORIES',
      cascadeMap: { CATEGORY_SET: 'TAG' },
    },
    {
      name: 'methodEnabledFlag',
      type: 'boolean',
      defaultValue: 0,
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'innerTagMethod',
      type: 'string',
      lookupCode: 'LWMS.INNER_TAG_METHOD',
    },
    {
      name: 'containerType',
      type: 'object',
      lovCode: 'LMDS.CONTAINER_TYPE',
      dynamicProps: {
        required: ({ record }) => {
          return record.get('logonMode') === 'CONTAINER_TAG';
        },
      },
    },
    {
      name: 'fullAmount',
      type: 'number',
      label: intl.get(`${intlPrefix}.item`).d('满载数量'),
    },
    {
      name: 'ownerType',
      type: 'string',
      lookupCode: 'LMDS.OWNER_TYPE',
    },
    {
      name: 'tag',
      type: 'string',
    },
    {
      name: 'owner',
      type: 'object',
      lovCode: 'LMDS.PARTY',
      cascadeMap: { partyType: 'ownerType' },
    },
  ],
});

export const inputQueryDs = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'labelCodingRule',
      type: 'object',
      lovCode: 'HMDE.CODE_RULE_LIST',
    },
    {
      name: 'labelNum',
      type: 'number',
      label: intl.get(`${intlPrefix}.item`).d('标签数'),
    },
    {
      name: 'inputLabelNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.item`).d('扫描/输入标签号'),
    },
    {
      name: 'editThePrefix',
      type: 'string',
      label: intl.get(`${intlPrefix}.item`).d('编辑前缀'),
      pattern: '[^\u4e00-\u9fa5]+',
    },
    {
      name: 'startRunningWater',
      type: 'string',
      label: intl.get(`${intlPrefix}.item`).d('起始流水'),
    },
    {
      name: 'printModel',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: 'LMDS.TAG_TEMPLATE',
      label: intl.get(`${intlPrefix}.printModel`).d('打印模板'),
    },
  ],
});
