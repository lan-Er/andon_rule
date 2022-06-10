/**
 * @Description: 用户设置详情页--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 17:25:59
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
// import { isEmpty } from 'lodash';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmdsUserSetting } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.userSetting.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/user-settings`;

export default () => ({
  primaryKey: 'settingId',
  selection: false,
  fields: [
    {
      name: 'userObj',
      type: 'object',
      label: intl.get(`${preCode}.userObj`).d('用户'),
      lovCode: common.user,
      textField: 'loginName',
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'userId',
      type: 'string',
      bind: 'userObj.id',
    },
    {
      name: 'userName',
      type: 'string',
      bind: 'userObj.loginName',
    },
    {
      name: 'realName',
      type: 'string',
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOuObj`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'apsOuObj',
      type: 'object',
      label: intl.get(`${preCode}.apsOuObj`).d('计划中心'),
      lovCode: common.apsOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
    },
    {
      name: 'apsOuCode',
      type: 'string',
      bind: 'apsOuObj.apsOuCode',
    },
    {
      name: 'apsOuName',
      type: 'string',
      bind: 'apsOuObj.apsOuName',
    },
    {
      name: 'scmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.scmOuObj`).d('采购中心'),
      lovCode: common.scmOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
    },
    {
      name: 'scmOuCode',
      type: 'string',
      bind: 'scmOuObj.scmOuCode',
    },
    {
      name: 'scmOuName',
      type: 'string',
      bind: 'scmOuObj.scmOuName',
    },
    {
      name: 'sopOuObj',
      type: 'object',
      label: intl.get(`${preCode}.sopOuObj`).d('销售中心'),
      lovCode: lmdsUserSetting.sopOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'sopOuId',
      type: 'string',
      bind: 'sopOuObj.sopOuId',
    },
    {
      name: 'sopOuCode',
      type: 'string',
      bind: 'sopOuObj.sopOuCode',
    },
    {
      name: 'sopOuName',
      type: 'string',
      bind: 'sopOuObj.sopOuName',
    },
    {
      name: 'wmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.wmOuObj`).d('仓储中心'),
      lovCode: common.wmOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
    },
    {
      name: 'wmOuCode',
      type: 'string',
      bind: 'wmOuObj.wmOuCode',
    },
    {
      name: 'wmOuName',
      type: 'string',
      bind: 'wmOuObj.wmOuName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouseObj`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      noCache: true,
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
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLineObj`).d('生产线'),
      lovCode: common.prodLine,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${preCode}.workcellObj`).d('工位'),
      lovCode: common.workcell,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${preCode}.workerObj`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'planStartDateFrom',
      type: 'number',
      label: intl.get(`${preCode}.planStartDateFrom`).d('计划开始始'),
    },
    {
      name: 'planStartDateTo',
      type: 'number',
      label: intl.get(`${preCode}.planStartDateTo`).d('计划开始至'),
    },
    {
      name: 'planEndDateFrom',
      type: 'number',
      label: intl.get(`${preCode}.planEndDateFrom`).d('计划结束始'),
    },
    {
      name: 'planEndDateTo',
      type: 'number',
      label: intl.get(`${preCode}.planEndDateTo`).d('计划结束至'),
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${preCode}.itemObj`).d('常用物料'),
      ignore: 'always',
      multiple: true,
      noCache: true,
    },
    {
      name: 'commonItems',
      type: 'string',
    },
    {
      name: 'ids',
      type: 'string',
    },
    {
      name: 'ruleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeLoginRule`).d('报工登陆规则'),
      lovCode: common.rule,
      ignore: 'always',
      noCache: true,
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeLoginRuleId',
      type: 'string',
      bind: 'ruleObj.ruleId',
    },
    {
      name: 'executeLoginRule',
      type: 'string',
      bind: 'ruleObj.ruleJson',
    },
    {
      name: 'executeLoginRuleName',
      type: 'string',
      bind: 'ruleObj.ruleName',
    },
    {
      name: 'soTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.soType`).d('销售订单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'SO' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'soTypeId',
      type: 'string',
      bind: 'soTypeObj.documentTypeId',
    },
    {
      name: 'soTypeCode',
      type: 'string',
      bind: 'soTypeObj.documentTypeCode',
    },
    {
      name: 'soTypeName',
      type: 'string',
      bind: 'soTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'demandTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.demandType`).d('需求订单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'DEMAND' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'demandTypeId',
      type: 'string',
      bind: 'demandTypeObj.documentTypeId',
    },
    {
      name: 'demandTypeCode',
      type: 'string',
      bind: 'demandTypeObj.documentTypeCode',
    },
    {
      name: 'demandTypeName',
      type: 'string',
      bind: 'demandTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'poTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.poType`).d('采购订单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'PO' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'poTypeId',
      type: 'string',
      bind: 'poTypeObj.documentTypeId',
    },
    {
      name: 'poTypeCode',
      type: 'string',
      bind: 'poTypeObj.documentTypeCode',
    },
    {
      name: 'poTypeName',
      type: 'string',
      bind: 'poTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'moTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.moType`).d('MO类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'MO' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'moTypeObj.documentTypeId',
    },
    {
      name: 'moTypeCode',
      type: 'string',
      bind: 'moTypeObj.documentTypeCode',
    },
    {
      name: 'moTypeName',
      type: 'string',
      bind: 'moTypeObj.documentTypeName',
      ignore: 'always',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
  },
  events: {
    update: ({ dataSet, name, record }) => {
      if (name === 'itemObj') {
        const items = dataSet.current.data.itemObj;
        const itemCode = [];
        const itemId = [];
        for (let i = 0; i < items.length; i++) {
          itemCode[i] = items[i].itemCode;
          itemId[i] = items[i].itemId;
        }
        const itemCodes = itemCode.join('#');
        const itemIds = itemId.join('-');
        // eslint-disable-next-line no-param-reassign
        dataSet.current.data.commonItems = itemCodes;
        // eslint-disable-next-line no-param-reassign
        dataSet.current.data.ids = itemIds;
      }
      if (name === 'wmOuObj') {
        record.set('warehouseObj', null);
      }
      if (name === 'userObj') {
        record.set('realName', dataSet.current.data.userObj.realName);
      }
    },
  },
});
