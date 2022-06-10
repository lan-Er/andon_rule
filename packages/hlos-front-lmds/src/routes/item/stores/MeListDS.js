/**
 * @Description: 物料制造页面管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 14:20:50
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsItem, common } = codeConfig.code;
const {
  lovPara: { itemMe },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-mes`;

export default () => ({
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.meCategory`).d('制造类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_ME' },
      ignore: 'always',
    },
    {
      name: 'meCategoryId',
      type: 'string',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: '是否有效',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        selection: 'single',
        data: [
          { text: '有效', value: '1' },
          { text: '无效', value: '0' },
        ],
      }),
      defaultValue: '1',
    },
  ],
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
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
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      validator: descValidator,
    },
    {
      name: 'itemMeType',
      type: 'string',
      label: intl.get(`${preCode}.itemMeType`).d('物料制造类型'),
      lookupCode: lmdsItem.itemMeType,
    },
    {
      name: 'meCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.meCategory`).d('物料制造类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemMe },
      ignore: 'always',
    },
    {
      name: 'meCategoryId',
      type: 'string',
      bind: 'meCategoryObj.categoryId',
    },
    {
      name: 'meCategoryCode',
      type: 'string',
      bind: 'meCategoryObj.categoryCode',
    },
    {
      name: 'meCategoryName',
      type: 'string',
      bind: 'meCategoryObj.categoryName',
    },
    {
      name: 'makeBuyCode',
      type: 'string',
      label: intl.get(`${preCode}.makeBuyCode`).d('自制外购属性'),
      lookupCode: lmdsItem.makeBuy,
    },
    {
      name: 'supplyType',
      type: 'string',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
      lookupCode: common.supplyType,
    },
    {
      name: 'outsourcingFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.outsourcingFlag`).d('委外加工'),
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为EXECUTE
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRuleName',
      type: 'string',
      bind: 'executeRuleObj.ruleName',
    },
    {
      name: 'inspectionRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为INSPECTION
      lovPara: {
        ruleType: 'INSPECTION',
      },
    },
    {
      name: 'inspectionRuleId',
      type: 'string',
      bind: 'inspectionRuleObj.ruleId',
    },
    {
      name: 'inspectionRuleName',
      type: 'string',
      bind: 'inspectionRuleObj.ruleName',
    },
    {
      name: 'dispatchRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为DISPATCH
      lovPara: {
        ruleType: 'DISPATCH',
      },
    },
    {
      name: 'dispatchRuleId',
      type: 'string',
      bind: 'dispatchRuleObj.ruleId',
    },
    {
      name: 'dispatchRuleName',
      type: 'string',
      bind: 'dispatchRuleObj.ruleName',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('装箱打包规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为PACKING
      lovPara: {
        ruleType: 'PACKING',
      },
    },
    {
      name: 'packingRuleId',
      type: 'string',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRuleName',
      type: 'string',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'reworkRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为REWORK
      lovPara: {
        ruleType: 'REWORK',
      },
    },
    {
      name: 'reworkRuleId',
      type: 'string',
      bind: 'reworkRuleObj.ruleId',
    },
    {
      name: 'reworkRuleName',
      type: 'string',
      bind: 'reworkRuleObj.ruleName',
    },
    {
      name: 'numberRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.numberRule`).d('编号规则'),
      lovCode: lmdsItem.ruleList,
      ignore: 'always',
    },
    {
      name: 'numberRuleId',
      type: 'string',
      bind: 'numberRuleObj.ruleId',
    },
    {
      name: 'numberRuleName',
      type: 'string',
      bind: 'numberRuleObj.ruleName',
    },
    {
      name: 'numberRule',
      type: 'string',
      bind: 'numberRuleObj.ruleCode',
    },
    {
      name: 'lotControlType',
      type: 'string',
      label: intl.get(`${preCode}.lotControlType`).d('批次控制类型'),
      lookupCode: lmdsItem.lotControlType,
    },
    {
      name: 'issueControlType',
      type: 'string',
      label: intl.get(`${preCode}.issueControlType`).d('投料限制类型'),
      lookupCode: lmdsItem.issueControlType,
    },
    {
      name: 'issueControlValue',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.issueControlValue`).d('投料限制值'),
    },
    {
      name: 'completeControlType',
      type: 'string',
      label: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
      lookupCode: lmdsItem.completeControlType,
    },
    {
      name: 'completeControlValue',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
    },
    {
      name: 'supplyWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.supplyWm`).d('默认供应仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'supplyWarehouseId',
      type: 'string',
      bind: 'supplyWarehouseObj.warehouseId',
    },
    {
      name: 'supplyWarehouseCode',
      type: 'string',
      bind: 'supplyWarehouseObj.warehouseCode',
    },
    {
      name: 'supplyWarehouseName',
      type: 'string',
      bind: 'supplyWarehouseObj.warehouseName',
    },
    {
      name: 'supplyWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.supplyWmArea`).d('默认供应仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'supplyWarehouseId' },
    },
    {
      name: 'supplyWmAreaId',
      type: 'string',
      bind: 'supplyWmAreaObj.wmAreaId',
    },
    {
      name: 'supplyWmAreaCode',
      type: 'string',
      bind: 'supplyWmAreaObj.wmAreaCode',
    },
    {
      name: 'supplyWmAreaName',
      type: 'string',
      bind: 'supplyWmAreaObj.wmAreaName',
    },
    {
      name: 'issueWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'issueWarehouseId',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseId',
    },
    {
      name: 'issueWarehouseCode',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseCode',
    },
    {
      name: 'issueWarehouseName',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseName',
    },
    {
      name: 'issueWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'issueWarehouseId' },
    },
    {
      name: 'issueWmAreaId',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaId',
    },
    {
      name: 'issueWmAreaCode',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaCode',
    },
    {
      name: 'issueWmAreaName',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaName',
    },
    {
      name: 'completeWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'completeWarehouseId',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseId',
    },
    {
      name: 'completeWarehouseCode',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseCode',
    },
    {
      name: 'completeWarehouseName',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseName',
    },
    {
      name: 'completeWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'completeWarehouseId' },
    },
    {
      name: 'completeWmAreaId',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaId',
    },
    {
      name: 'completeWmAreaCode',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaCode',
    },
    {
      name: 'completeWmAreaName',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaName',
    },
    {
      name: 'inventoryWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouseName',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseName',
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'inventoryWarehouseId' },
    },
    {
      name: 'inventoryWmAreaId',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaId',
    },
    {
      name: 'inventoryWmAreaCode',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaCode',
    },
    {
      name: 'inventoryWmAreaName',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaName',
    },
    {
      name: 'tagTemplate',
      type: 'string',
      label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.referenceDocument`).d('作业指导书'),
    },
    {
      name: 'fileName',
      type: 'string',
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
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'completeWarehouseObj') {
        record.set('completeWmAreaObj', null);
      }
      if (name === 'inventoryWarehouseObj') {
        record.set('inventoryWmAreaObj', null);
      }
      if (name === 'issueWarehouseObj') {
        record.set('issueWmAreaObj', null);
      }
      if (name === 'supplyWarehouseObj') {
        record.set('supplyWmAreaObj', null);
      }
    },
  },
});
