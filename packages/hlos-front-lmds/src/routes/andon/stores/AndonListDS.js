/*
 * @Description: 安灯管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 10:01:00
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsAndon, common, lmdsRuleAssign } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.andonBin.model';
const commonCode = 'lmds.common.model';
const {
  lmds: { andon },
} = statusConfig.statusValue;
const url = `${HLOS_LMDS}/v1/${organizationId}/andons`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonCode`).d('安灯'),
    },
    {
      name: 'andonName',
      type: 'string',
      label: intl.get(`${intlPrefix}.andonName`).d('安灯名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.organization`).d('组织'),
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
      name: 'andonBinObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.andonBin`).d('安灯灯箱'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      lovCode: lmdsAndon.andonBin,
    },
    {
      name: 'andonBinId',
      type: 'string',
      bind: 'andonBinObj.andonBinId',
    },
    {
      name: 'andonBinName',
      type: 'string',
      bind: 'andonBinObj.andonBinName',
    },
    {
      name: 'andonClassObj',
      type: 'object',
      lovCode: lmdsAndon.andonClass,
      label: intl.get(`${intlPrefix}.andonClass`).d('安灯分类'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'andonClassId',
      type: 'string',
      bind: 'andonClassObj.andonClassId',
    },
    {
      name: 'andonClassName',
      type: 'string',
      bind: 'andonClassObj.andonClassName',
    },
    {
      name: 'andonCode',
      type: 'intl',
      label: intl.get(`${intlPrefix}.andonCode`).d('安灯'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      required: true,
    },
    {
      name: 'andonName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.andonName`).d('安灯名称'),
      required: true,
    },
    {
      name: 'andonAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.andonAlias`).d('安灯简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.orderByCode`).d('显示排序'),
      required: true,
    },
    {
      name: 'dataCollectType',
      type: 'string',
      lookupCode: lmdsAndon.dataType,
      label: intl.get(`${intlPrefix}.dataType`).d('数据采集类型'),
      required: true,
    },
    {
      name: 'andonRuleObj',
      type: 'object',
      lovCode: lmdsAndon.andonRule,
      label: intl.get(`${intlPrefix}.andonRule`).d('安灯响应规则'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'andonRuleId',
      type: 'string',
      bind: 'andonRuleObj.andonRuleId',
    },
    {
      name: 'andonRuleName',
      type: 'string',
      bind: 'andonRuleObj.andonRuleName',
    },
    {
      name: 'autoResponseFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.autoResponse`).d('自动响应'),
      defaultValue: false,
    },
    {
      name: 'responseRankCode',
      type: 'string',
      lookupCode: lmdsAndon.responseRank,
      label: intl.get(`${intlPrefix}.responseRank`).d('响应等级'),
    },
    {
      name: 'visibleFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.visible`).d('是否可见'),
      defaultValue: true,
    },
    {
      name: 'defaultStatus',
      type: 'string',
      lookupCode: lmdsAndon.defaultStatus,
      label: intl.get(`${intlPrefix}.defaultStatus`).d('默认状态'),
      defaultValue: andon.closed,
    },
    {
      name: 'stopProductionFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.stopProduction`).d('是否停产'),
      defaultValue: false,
    },
    {
      name: 'affectedByStopFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.acceptStop`).d('受停产影响'),
      defaultValue: false,
    },
    {
      name: 'andonRelType',
      type: 'string',
      lookupCode: lmdsAndon.relatedType,
      label: intl.get(`${intlPrefix}.relatedType`).d('关联类型'),
    },
    {
      name: 'relatedNameObj',
      type: 'object',
      ignore: 'always',
      label: intl.get(`${intlPrefix}.relatedName`).d('关联名称'),
      dynamicProps: {
        lovCode({ record }) {
          const andonRelType = record.get('andonRelType');
          if (andonRelType === 'RESOURCE') {
            return common.resource;
          } else if (andonRelType === 'ITEM') {
            return common.item;
          }
        },
        textField({ record }) {
          const andonRelType = record.get('andonRelType');
          if (andonRelType === 'RESOURCE') {
            return 'resourceName';
          } else if (andonRelType === 'ITEM') {
            return 'description';
          }
        },
        valueField({ record }) {
          const andonRelType = record.get('andonRelType');
          if (andonRelType === 'RESOURCE') {
            return 'resourceId';
          } else if (andonRelType === 'ITEM') {
            return 'itemId';
          }
        },
      },
    },
    {
      name: 'relatedName',
      type: 'string',
      dynamicProps: {
        bind: ({ record }) => {
          const andonRelType = record.get('andonRelType');
          if (andonRelType === 'RESOURCE') {
            return 'relatedNameObj.resourceName';
          } else if (andonRelType === 'ITEM') {
            return 'relatedNameObj.description';
          }
        },
      },
    },
    {
      name: 'andonRelId',
      type: 'string',
      dynamicProps: {
        bind({ record }) {
          const andonRelType = record.get('andonRelType');
          if (andonRelType === 'RESOURCE') {
            return 'relatedNameObj.resourceId';
          } else if (andonRelType === 'ITEM') {
            return 'relatedNameObj.itemId';
          }
        },
      },
    },
    {
      name: 'currentStatus',
      type: 'string',
      lookupCode: lmdsAndon.defaultStatus,
      label: intl.get(`${intlPrefix}.currentStatus`).d('当前状态'),
      defaultValue: andon.closed,
    },
    {
      name: 'currentColor',
      type: 'string',
      label: intl.get(`${intlPrefix}.currentColor`).d('当前颜色'),
    },
    {
      name: 'currentExceptionGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.currentExceptionGroup`).d('当前异常组'),
    },
    {
      name: 'currentException',
      type: 'string',
      label: intl.get(`${intlPrefix}.currentException`).d('当前异常'),
    },
    {
      name: 'pressedTimes',
      type: 'number',
      label: intl.get(`${intlPrefix}.pressedTimes`).d('累计次数'),
    },
    {
      name: 'processRuleObj',
      type: 'object',
      lovCode: lmdsRuleAssign.rule,
      label: intl.get(`${intlPrefix}.processRule`).d('安灯处理规则'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          ruleClass: 'ANDON',
        }),
      },
    },
    {
      name: 'processRuleId',
      type: 'string',
      bind: 'processRuleObj.ruleId',
    },
    {
      name: 'processRuleName',
      type: 'string',
      bind: 'processRuleObj.ruleName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'externalCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalCode`).d('外部编号'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${intlPrefix}.externalId`).d('外部ID'),
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
    update: ({ record, name }) => {
      if (name === 'andonRelType') {
        record.set('relatedNameObj', null);
      }
      if (name === 'organizationObj') {
        record.set('andonBinObj', null);
        record.set('andonRuleObj', null);
      }
    },
  },
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
