/**
 * @Description: 用户设置--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 15:31:28
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsUserSetting, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.userSetting.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_LMDS}/v1/${organizationId}/user-settings`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'userObj',
      type: 'object',
      label: intl.get(`${preCode}.userObj`).d('用户'),
      lovCode: common.user,
      textField: 'loginName',
      ignore: 'always',
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
  ],
  fields: [
    {
      name: 'userObj',
      type: 'object',
      label: intl.get(`${preCode}.userObj`).d('用户'),
      lovCode: common.user,
      ignore: 'always',
      required: true,
    },
    {
      name: 'userId',
      type: 'string',
      bind: 'userObj.id',
      order: 'asc',
    },
    {
      name: 'userName',
      type: 'string',
      bind: 'userObj.realName',
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOuObj`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
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
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
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
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
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
    },
    {
      name: 'sopOuId',
      type: 'string',
      bind: 'sopOuObj.sopOuId',
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
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
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
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
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
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLineObj`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
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
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
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
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
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
      ignore: 'always',
      multiple: true,
    },
    {
      name: 'commonItems',
      label: intl.get(`${preCode}.itemObj`).d('常用物料'),
      type: 'string',
    },
    {
      name: 'soTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.soType`).d('销售订单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'SO' },
      ignore: 'always',
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
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});
