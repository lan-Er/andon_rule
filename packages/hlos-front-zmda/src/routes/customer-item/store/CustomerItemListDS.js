/**
 * @Description: 制造协同-客户物料主数据DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-23 10:57:53
 */

import moment from 'moment';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.customerItem.model';
const commonCode = 'zmda.common.model';
const { zmdaCustomerItem } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/customer-items`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${preCode}.customer`).d('客户'),
    },
  ],
  fields: [
    {
      name: 'sopOuObj',
      type: 'object',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      lovCode: zmdaCustomerItem.sopOu,
      ignore: 'always',
      required: true,
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
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: zmdaCustomerItem.sopItem,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          sopOuId: record.get('sopOuId'),
        }),
      },
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${preCode}.customer`).d('客户'),
      lovCode: zmdaCustomerItem.customer,
      textField: 'customerName',
      valueField: 'customerId',
      ignore: 'always',
      required: true,
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
      name: 'customerSiteObj',
      type: 'object',
      label: intl.get(`${preCode}.customerSite`).d('客户地点'),
      lovCode: zmdaCustomerItem.customer,
      ignore: 'always',
      textField: 'customerSiteName',
      valueField: 'customerSiteId',
      dynamicProps: {
        lovPara: ({ record }) => ({
          customerId: record.get('customerId'),
        }),
      },
    },
    {
      name: 'customerSiteId',
      type: 'string',
      bind: 'customerSiteObj.customerSiteId',
    },
    {
      name: 'customerSiteName',
      type: 'string',
      bind: 'customerSiteObj.customerSiteName',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('单位'),
      lovCode: zmdaCustomerItem.uom,
      ignore: 'always',
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
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: zmdaCustomerItem.organization,
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
      name: 'customerItemObj',
      type: 'object',
      label: intl.get(`${preCode}.customerItem`).d('客户物料'),
      lovCode: zmdaCustomerItem.customerItem,
      dynamicProps: {
        lovPara: ({ record }) => ({
          customerId: record.get('customerId'),
        }),
      },
      ignore: 'always',
      required: true,
    },
    // {
    //   name: 'customerItemId',
    //   type: 'string',
    //   bind: 'customerItemObj.itemId',
    // },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${preCode}.customerItemDesc`).d('客户物料编码'),
      bind: 'customerItemObj.itemCode',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      bind: 'customerItemObj.description',
    },
    {
      name: 'terminalProduct',
      type: 'string',
      label: intl.get(`${preCode}.terminalProduct`).d('终端产品'),
    },
    {
      name: 'customerSpecification',
      type: 'string',
      label: intl.get(`${preCode}.customerSpecification`).d('客户物料规格'),
    },
    {
      name: 'customerFeature',
      type: 'string',
      label: intl.get(`${preCode}.customerFeature`).d('客户物料特征值'),
    },
    {
      name: 'priority',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${preCode}.priority`).d('优先级'),
    },
    {
      name: 'keyCustomerFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyCustomerFlag`).d('关键客户'),
    },
    {
      name: 'salesChannel',
      type: 'string',
      label: intl.get(`${preCode}.salesChannel`).d('销售渠道'),
      lookupCode: zmdaCustomerItem.salesChannel,
    },
    {
      name: 'salesBrand',
      type: 'string',
      label: intl.get(`${preCode}.salesBrand`).d('销售品牌'),
      lookupCode: zmdaCustomerItem.salesBrand,
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${preCode}.calendar`).d('发货日历'),
      lovCode: zmdaCustomerItem.calendar,
      ignore: 'always',
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendarObj.calendarId',
    },
    {
      name: 'calendarName',
      type: 'string',
      bind: 'calendarObj.calendarName',
    },
    {
      name: 'salesmanObj',
      type: 'object',
      label: intl.get(`${preCode}.planner`).d('销售员'),
      lovCode: zmdaCustomerItem.user,
      ignore: 'always',
    },
    {
      name: 'salesmanId',
      type: 'string',
      bind: 'salesmanObj.id',
    },
    {
      name: 'salesmanName',
      type: 'string',
      bind: 'salesmanObj.realName',
    },
    {
      name: 'sopPlanRule',
      type: 'string',
      label: intl.get(`${preCode}.sopPlanRule`).d('计划规则'),
      lookupCode: zmdaCustomerItem.sopPlanRule,
    },
    {
      name: 'forecastRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.forecastRule`).d('预测规则'),
      lovCode: zmdaCustomerItem.rule,
      ignore: 'always',
      lovPara: {
        ruleType: 'SOP_FORECAST',
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
      name: 'shipRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.shipRule`).d('发运规则'),
      lovCode: zmdaCustomerItem.rule,
      ignore: 'always',
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
      name: 'minStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
    },
    {
      name: 'maxStockQty',
      type: 'number',
      min: 'minStockQty',
      label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
    },
    {
      name: 'safetyStockQty',
      type: 'number',
      label: intl.get(`${preCode}.safetyStockQty`).d('安全库存量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'roundQty',
      type: 'number',
      label: intl.get(`${preCode}.roundQty`).d('圆整数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'minOrderQty',
      type: 'number',
      label: intl.get(`${preCode}.minOrderQty`).d('最小订货量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maxOrderQty',
      type: 'number',
      min: 'minOrderQty',
      label: intl.get(`${preCode}.maxOrderQty`).d('最大订货量'),
    },
    {
      name: 'fixedLotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.fixedLotFlag`).d('固定批次标识'),
    },
    {
      name: 'fixedOrderQty',
      type: 'number',
      label: intl.get(`${preCode}.fixedOrderQty`).d('固定订货量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'dayMaxSupply',
      type: 'number',
      label: intl.get(`${preCode}.dayMaxSupply`).d('日最大供应量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'deliveryLeadTime',
      type: 'number',
      label: intl.get(`${preCode}.deliveryLT`).d('交货提前期(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: zmdaCustomerItem.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currencyObj.currencyName',
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
      name: 'salesPrice',
      type: 'number',
      label: intl.get(`${preCode}.salesPrice`).d('销售价格'),
    },
    {
      name: 'freightPrice',
      type: 'number',
      label: intl.get(`${preCode}.freightPrice`).d('运费'),
    },
    {
      name: 'taxable',
      type: 'boolean',
      label: intl.get(`${preCode}.taxable`).d('含税'),
    },
    {
      name: 'consignFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.consignFlag`).d('是否寄售'),
    },
    {
      name: 'fobType',
      type: 'string',
      label: intl.get(`${preCode}.fobType`).d('FOB类型'),
      lookupCode: zmdaCustomerItem.fobType,
    },
    {
      name: 'transportType',
      type: 'string',
      label: intl.get(`${preCode}.transportType`).d('运输方式'),
      lookupCode: zmdaCustomerItem.transportType,
    },
    {
      name: 'transportDays',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.transportDays`).d('运输天数'),
    },
    {
      name: 'shipWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.shipWarehouse`).d('发运仓库'),
      lovCode: zmdaCustomerItem.warehouse,
      ignore: 'always',
    },
    {
      name: 'shipWarehouseName',
      type: 'string',
      bind: 'shipWarehouseObj.warehouseName',
    },
    {
      name: 'shipWarehouseId',
      type: 'string',
      bind: 'shipWarehouseObj.warehouseId',
    },
    {
      name: 'shipWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.shipWmArea`).d('发运货位'),
      lovCode: zmdaCustomerItem.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('shipWarehouseId'),
        }),
      },
    },
    {
      name: 'shipWmAreaId',
      type: 'string',
      bind: 'shipWmAreaObj.wmAreaId',
    },
    {
      name: 'shipWmAreaName',
      type: 'string',
      bind: 'shipWmAreaObj.wmAreaName',
    },
    {
      name: 'transitWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.transitWarehouse`).d('中转仓库'),
      lovCode: zmdaCustomerItem.warehouse,
      ignore: 'always',
    },
    {
      name: 'transitWarehouseName',
      type: 'string',
      bind: 'transitWarehouseObj.warehouseName',
    },
    {
      name: 'transitWarehouseId',
      type: 'string',
      bind: 'transitWarehouseObj.warehouseId',
    },
    {
      name: 'outsideWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.outsideWarehouse`).d('外部仓库'),
      lovCode: zmdaCustomerItem.warehouse,
      ignore: 'always',
    },
    {
      name: 'outsideWarehouseName',
      type: 'string',
      bind: 'outsideWarehouseObj.warehouseName',
    },
    {
      name: 'outsideWarehouseId',
      type: 'string',
      bind: 'outsideWarehouseObj.warehouseId',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('包装规则'),
      lovCode: zmdaCustomerItem.rule,
      ignore: 'always',
      lovPara: {
        ruleType: 'SOP_PACKING',
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
      name: 'packingFormat',
      type: 'string',
      label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      lookupCode: zmdaCustomerItem.packingFormat,
    },
    {
      name: 'packingMaterial',
      type: 'string',
      label: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
    },
    {
      name: 'minPackingQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
    },
    {
      name: 'packingQty',
      type: 'number',
      min: 'minPackingQty',
      label: intl.get(`${preCode}.packingQty`).d('包装数'),
    },
    {
      name: 'containerQty',
      type: 'number',
      label: intl.get(`${preCode}.containerQty`).d('装箱数'),
      validator: positiveNumberValidator,
    },
    {
      name: 'palletContainerQty',
      type: 'number',
      label: intl.get(`${preCode}.palletContainerQty`).d('托盘箱数'),
      validator: positiveNumberValidator,
    },
    {
      name: 'tagTemplate',
      type: 'string',
      label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      defaultValue: NOW_DATE,
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('endDate'))) {
          return {
            max: 'endDate',
          };
        }
      },
      transformRequest: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      defaultValue: new Date(Date.parse('2100-1-1'.replace(/-/g, '/'))),
      min: 'startDate',
      transformRequest: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'sopOuObj') {
        record.set('itemObj', null);
      }
      if (name === 'customerObj') {
        record.set('customerSiteObj', null);
        record.set('customerItemObj', null);
      }
      if (name === 'shipWarehouseObj') {
        record.set('shipWmAreaObj', null);
      }
      if (name === 'itemObj' && !isEmpty(record.get('itemObj'))) {
        record.set('uomObj', {
          uomId: record.get('itemObj').uomId,
          uomName: record.get('itemObj').uom,
        });
      }
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
