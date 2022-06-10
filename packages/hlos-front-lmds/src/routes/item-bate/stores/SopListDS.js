/**
 * @Description: 物料销售页面管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 15:33:09
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
  lovPara: { itemSop },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-sops`;

export default () => ({
  pageSize: 100,
  selection: false,
  queryFields: [
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
      name: 'sopOuId',
      type: 'string',
    },
    {
      name: 'sopOuCode',
      type: 'string',
    },
    {
      name: 'sopOuName',
      type: 'string',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
    },
    {
      name: 'apsOuId',
      type: 'string',
    },
    {
      name: 'apsOuCode',
      type: 'string',
    },
    {
      name: 'apsOuName',
      type: 'string',
      label: intl.get(`${commonCode}.apsOu`).d('计划中心'),
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
      name: 'itemSopType',
      type: 'string',
      label: intl.get(`${preCode}.itemSopType`).d('物料销售类型'),
      lookupCode: lmdsItem.itemSopType,
    },
    {
      name: 'sopCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.sopCategory`).d('物料销售类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemSop },
      ignore: 'always',
    },
    {
      name: 'sopCategoryId',
      type: 'string',
      bind: 'sopCategoryObj.categoryId',
    },
    {
      name: 'sopCategoryCode',
      type: 'string',
      bind: 'sopCategoryObj.categoryCode',
    },
    {
      name: 'sopCategoryName',
      type: 'string',
      bind: 'sopCategoryObj.categoryName',
    },
    {
      name: 'salesmanObj',
      type: 'object',
      label: intl.get(`${preCode}.salesman`).d('销售员'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'salesmanId',
      type: 'string',
      bind: 'salesmanObj.workerId',
    },
    {
      name: 'salesman',
      type: 'string',
      bind: 'salesmanObj.workerCode',
    },
    {
      name: 'salesmanName',
      type: 'string',
      bind: 'salesmanObj.workerName',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.salesUom`).d('销售单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'sopPlanRule',
      type: 'string',
      label: intl.get(`${preCode}.sopPlanRule`).d('销售计划规则'),
      lookupCode: common.sopPlanRule,
    },
    {
      name: 'forecastRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.forecastRule`).d('销售预测规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为FORECAST
      lovPara: {
        ruleType: 'FORECAST',
      },
    },
    {
      name: 'forecastRuleId',
      type: 'string',
      bind: 'forecastRuleObj.ruleId',
    },
    {
      name: 'forecastRuleName',
      type: 'string',
      bind: 'forecastRuleObj.ruleName',
    },
    {
      name: 'minStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
    },
    {
      name: 'maxStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
      // 最大库存量不可小于最小库存量
      validator: (value, name, record) => {
        if (value <= record.get('minStockQty')) {
          return intl.get(`lmds.item.validation.biggerStock`).d('最大库存量必须大于最小库存量');
        }
      },
    },
    {
      name: 'safetyStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyStockQty`).d('安全库存量'),
    },
    {
      name: 'roundQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.roundQty`).d('圆整包装数量'),
    },
    {
      name: 'minOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStartOrderQty`).d('最小起订量'),
    },
    {
      name: 'maxOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxStartOrderQty`).d('最大起订量'),
      // 最大起订量不可小于最小起订量
      validator: (value, name, record) => {
        if (value <= record.get('minOrderQty')) {
          return intl.get(`lmds.item.validation.biggerOrder`).d('最大起订量必须大于最小起订量');
        }
      },
    },
    {
      name: 'fixedOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.fixedOrderQty`).d('固定订货量'),
    },
    {
      name: 'fixedLotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.fixedOrderLotFlag`).d('固定订货标识'),
    },
    {
      name: 'deliveryLeadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.deliveryLeadTime`).d('交货提前期'),
      // 天
    },
    {
      name: 'priceListFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.priceListFlag`).d('启用价目表'),
    },
    {
      name: 'priceList',
      type: 'string',
      label: intl.get(`${preCode}.priceList`).d('价目表'),
    },
    {
      name: 'shipRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.shipRule`).d('发运规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为SHIP
      lovPara: {
        ruleType: 'SHIP',
      },
    },
    {
      name: 'shipRuleId',
      type: 'string',
      bind: 'shipRuleObj.ruleId',
    },
    {
      name: 'shipRuleName',
      type: 'string',
      bind: 'shipRuleObj.ruleName',
    },
    {
      name: 'transportType',
      type: 'string',
      label: intl.get(`${preCode}.transportType`).d('运输方式'),
      lookupCode: common.transportType,
    },
    {
      name: 'maxDayOrder',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxDayOrder`).d('最大日供量'),
    },
    {
      name: 'shipWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.shipWm`).d('默认发货仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'shipWarehouseId',
      type: 'string',
      bind: 'shipWarehouseObj.warehouseId',
    },
    {
      name: 'shipWarehouseCode',
      type: 'string',
      bind: 'shipWarehouseObj.warehouseCode',
    },
    {
      name: 'shipWarehouseName',
      type: 'string',
      bind: 'shipWarehouseObj.warehouseName',
    },
    {
      name: 'shipWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.shipWmArea`).d('默认发货货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'shipWarehouseId' },
    },
    {
      name: 'shipWmAreaId',
      type: 'string',
      bind: 'shipWmAreaObj.wmAreaId',
    },
    {
      name: 'shipWmAreaCode',
      type: 'string',
      bind: 'shipWmAreaObj.wmAreaCode',
    },
    {
      name: 'shipWmAreaName',
      type: 'string',
      bind: 'shipWmAreaObj.wmAreaName',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${preCode}.defaultCustomer`).d('默认客户'),
      lovCode: lmdsItem.customer,
      ignore: 'always',
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerName',
      type: 'string',
      bind: 'customerObj.customerName',
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${preCode}.defaultCustomerItem`).d('默认客户物料'),
      validator: codeValidator,
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.defaultCustomerItemDesc`).d('默认客户物料描述'),
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
        transformResponse(data) {
          const newData = JSON.parse(data);
          if (newData && newData.content && newData.content.length) {
            return {
              ...newData,
              content: newData.content.reverse(),
            };
          } else {
            return {
              ...newData,
            };
          }
        },
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'shipWarehouseObj') {
        record.set('shipWmAreaObj', null);
      }
      if (name === 'customerObj') {
        record.set('customerItemObj', null);
      }
    },
  },
});
