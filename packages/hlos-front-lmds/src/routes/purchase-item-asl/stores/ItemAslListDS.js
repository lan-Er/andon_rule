/*
 * @Author: zhang yang
 * @Description: 货源清单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-11 10:56:26
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import { positiveNumberValidator, descValidator } from 'hlos-front/lib/utils/utils';

const { common, lmdsItemAsl } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemAsl.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-asls`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
  ],
  fields: [
    // { name: 'defaultOrganizationId' },
    {
      name: 'scmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      lovCode: common.scmOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
    },
    {
      name: 'scmOu',
      type: 'string',
      bind: 'scmOuObj.scmOuName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: lmdsItemAsl.item,
      required: true,
      ignore: 'always',
      cascadeMap: { scmOuId: 'scmOuId' },
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
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: lmdsItemAsl.supplier,
      required: true,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'supplier',
      type: 'string',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'supplierSiteObj',
      type: 'object',
      label: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
      lovCode: lmdsItemAsl.supplierSite,
      cascadeMap: { supplierId: 'supplierId' },
      ignore: 'always',
    },
    {
      name: 'supplierSiteId',
      type: 'string',
      bind: 'supplierSiteObj.supplierSiteId',
    },
    {
      name: 'supplierSite',
      type: 'string',
      bind: 'supplierSiteObj.supplierSiteName',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('单位'),
      lovCode: lmdsItemAsl.uom,
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
      bind: 'uomObj.uomName',
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
      name: 'keySupplyFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keySupplyFlag`).d('关键供应'),
      defaultValue: true,
    },
    {
      name: 'supplyType',
      type: 'string',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
      lookupCode: lmdsItemAsl.supplyType,
    },
    {
      name: 'supplySource',
      type: 'string',
      label: intl.get(`${preCode}.supplySource`).d('供应来源'),
      lookupCode: lmdsItemAsl.supplySource,
    },
    {
      name: 'supplyRatio',
      type: 'number',
      label: intl.get(`${preCode}.supplyRatio`).d('供应比例'),
      validator: positiveNumberValidator,
    },
    {
      name: 'priority',
      type: 'number',
      label: intl.get(`${preCode}.priority`).d('优先级'),
      min: 1,
      step: 1,
    },
    {
      name: 'minOrderQty',
      type: 'number',
      label: intl.get(`${preCode}.minOrderQty`).d('最小订货量'),
      min: 0,
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('maxOrderQty'))) {
            return 'maxOrderQty';
          }
        },
      },
    },
    {
      name: 'maxOrderQty',
      type: 'number',
      label: intl.get(`${preCode}.maxOrderQty`).d('最大订货量'),
      dynamicProps: {
        min: ({ record }) => {
          if (!isEmpty(record.get('minOrderQty'))) {
            return 'minOrderQty';
          }
        },
      },
    },
    {
      name: 'dayMaxSupply',
      type: 'number',
      label: intl.get(`${preCode}.dayMaxSupply`).d('日最大供应量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'roundQty',
      type: 'number',
      label: intl.get(`${preCode}.roundQty`).d('圆整数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'calendar',
      type: 'object',
      label: intl.get(`${preCode}.calendar`).d('供货日历'),
      lovCode: lmdsItemAsl.calendar,
      ignore: 'always',
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendar.calendarId',
    },
    {
      name: 'calendarName',
      type: 'string',
      bind: 'calendar.calendarName',
    },
    {
      name: 'windowTime',
      type: 'number',
      label: intl.get(`${preCode}.windowTime`).d('送货窗口时间'),
      validator: positiveNumberValidator,
    },
    {
      name: 'leadTime',
      type: 'number',
      label: intl.get(`${preCode}.leadTime`).d('采购提前期(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'currency',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currency.currencyName',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currency.currencyId',
    },
    {
      name: 'purchasePrice',
      type: 'number',
      label: intl.get(`${preCode}.purchasePrice`).d('采购价格'),
      validator: positiveNumberValidator,
    },
    {
      name: 'receiveRule',
      type: 'string',
      label: intl.get(`${preCode}.receiveRule`).d('接收规则'),
      lookupCode: lmdsItemAsl.receiveRule,
    },
    {
      name: 'bondedFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.bondedFlag`).d('是否保税'),
    },
    {
      name: 'consignFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.consignFlag`).d('是否寄售'),
    },
    {
      name: 'vmiFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.vmiFlag`).d('VMI标识'),
    },
    {
      name: 'vmiMinQty',
      type: 'number',
      label: intl.get(`${preCode}.vmiMinQty`).d('VMI最小库存'),
      min: 0,
    },
    {
      name: 'vmiMaxQty',
      type: 'number',
      label: intl.get(`${preCode}.vmiMaxQty`).d('VMI最大库存'),
      dynamicProps: {
        min: ({ record }) => {
          if (!isEmpty(record.get('vmiMinQty'))) {
            return 'vmiMinQty';
          }
        },
      },
    },
    {
      name: 'vmiSafetyQty',
      type: 'number',
      label: intl.get(`${preCode}.vmiSafetyQty`).d('VMI安全库存'),
      validator: positiveNumberValidator,
    },
    {
      name: 'taxable',
      type: 'boolean',
      label: intl.get(`${preCode}.taxable`).d('含税'),
    },
    {
      name: 'receiveTolerance',
      type: 'number',
      label: intl.get(`${preCode}.receiveTolerance`).d('收货允差'),
    },
    {
      name: 'invoiceTolerance',
      type: 'number',
      label: intl.get(`${preCode}.invoiceTolerance`).d('发票允差'),
    },
    {
      name: 'receiveWarehouse',
      type: 'object',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'receiveWarehouseId',
      type: 'string',
      bind: 'receiveWarehouse.warehouseId',
    },
    {
      name: 'receiveWarehouseName',
      type: 'string',
      bind: 'receiveWarehouse.warehouseName',
    },
    {
      name: 'receiveWmArea',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'receiveWarehouseId' },
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaId',
      type: 'string',
      bind: 'receiveWmArea.wmAreaId',
    },
    {
      name: 'receiveWmAreaName',
      type: 'string',
      bind: 'receiveWmArea.wmAreaName',
    },
    {
      name: 'inventoryWarehouse',
      type: 'object',
      label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouse.warehouseId',
    },
    {
      name: 'inventoryWarehouseName',
      type: 'string',
      bind: 'inventoryWarehouse.warehouseName',
    },
    {
      name: 'inventoryWmArea',
      type: 'object',
      label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'inventoryWarehouseId' },
      ignore: 'always',
    },
    {
      name: 'inventoryWmAreaId',
      type: 'string',
      bind: 'inventoryWmArea.wmAreaId',
    },
    {
      name: 'inventoryWmAreaName',
      type: 'string',
      bind: 'inventoryWmArea.wmAreaName',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${preCode}.supplierItemCode`).d('供应商物料'),
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.supplierItemDesc`).d('供应商物料描述'),
      validator: descValidator,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      max: 'endDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'supplierObj') {
        record.set('supplierSiteObj', null);
      }
      if (name === 'scmOuObj') {
        record.set('itemObj', null);
      }
      if (name === 'receiveWarehouse') {
        record.set('receiveWmArea', null);
      }
      if (name === 'inventoryWarehouse') {
        record.set('inventoryWmArea', null);
      }
      const itemObj = record.get('itemObj');
      if (name === 'itemObj' && !isEmpty(itemObj)) {
        const { uomId, uomName } = itemObj;
        record.set('uomObj', {
          uomId,
          uomName,
        });
      }
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
