/**
 * @Description: 采购接收DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-26 17:11:45
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.purchaseAccept.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/query-to-create-execute-order`;

const PurchaseAcceptListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('来源发货单号'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
      },
      {
        name: 'customerBusinessUnitIdObj',
        type: 'object',
        lovCode: common.businessUnit,
        label: intl.get(`${commonPrefix}.businessUnit`).d('业务实体'),
        ignore: 'always',
      },
      {
        name: 'customerBusinessUnitId',
        type: 'string',
        bind: 'customerBusinessUnitIdObj.businessUnitId',
      },
      {
        name: 'customerInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('收货组织'),
        cascadeMap: { businessUnitId: 'customerBusinessUnitId' },
        ignore: 'always',
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'deliveryOrderDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deliveryOrderDateEnd',
        type: 'date',
        bind: 'deliveryOrderDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'arrivalDateEnd',
        type: 'date',
        bind: 'arrivalDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('来源发货单号'),
      },
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'customerUomName',
        type: 'string',
        label: intl.get(`${commonPrefix}.uom`).d('单位'),
      },
      {
        name: 'customerDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('发货数量'),
      },
      {
        name: 'customerAcceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerAcceptableQty`).d('未接收数量'),
      },
      {
        name: 'deliveryOrderDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发货日期'),
      },
      {
        name: 'arrivalDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('收货组织'),
      },
      {
        name: 'consignerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.consignerName`).d('发货人'),
      },
      {
        name: 'consignerPhone',
        type: 'string',
        label: intl.get(`${intlPrefix}.consignerPhone`).d('发货人联系电话'),
      },
      {
        name: 'receivingAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
      },
      {
        name: 'consigneeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
      },
      {
        name: 'consigneePhone',
        type: 'string',
        label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源订单行号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            customerTenantId: organizationId,
            deliveryOrderDateStart: data.deliveryOrderDateStart
              ? `${data.deliveryOrderDateStart} 00:00:00`
              : null,
            deliveryOrderDateEnd: data.deliveryOrderDateEnd
              ? `${data.deliveryOrderDateEnd} 23:59:59`
              : null,
            arrivalDateStart: data.arrivalDateStart ? `${data.arrivalDateStart} 00:00:00` : null,
            arrivalDateEnd: data.arrivalDateEnd ? `${data.arrivalDateEnd} 23:59:59` : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const PurchaseAcceptHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'executeWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeWorker`).d('实际执行人'),
        required: true,
      },
    ],
  };
};

const PurchaseAcceptLineDS = () => {
  return {
    autoQuery: false,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('来源发货单号'),
      },
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${commonPrefix}.itemDesc`).d('物料说明'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'customerDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('发货数量'),
      },
      {
        name: 'customerAcceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerAcceptableQty`).d('未接收数量'),
      },
      {
        name: 'customerExecuteQty',
        type: 'number',
        step: 1,
        validator: positiveNumberValidator,
        label: intl.get(`${intlPrefix}.customerExecuteQty`).d('本次接收数量'),
        required: true,
      },
      {
        name: 'executeDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.executeDate`).d('实际收货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        transformResponse: (val) => val || moment().format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('收货组织'),
      },
      {
        name: 'inventoryHouseObj',
        type: 'object',
        lovCode: common.inventoryHouse,
        label: intl.get(`${intlPrefix}.inventoryHouse`).d('收货库房'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            inventoryOrgId: record.get('customerInventoryOrgId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'inventoryHouseId',
        type: 'string',
        bind: 'inventoryHouseObj.inventoryHouseId',
      },
      {
        name: 'inventoryHouseCode',
        type: 'string',
        bind: 'inventoryHouseObj.inventoryHouseCode',
      },
      {
        name: 'inventoryHouseName',
        type: 'string',
        bind: 'inventoryHouseObj.inventoryHouseName',
      },
      {
        name: 'inventoryOrgId',
        type: 'string',
        bind: 'inventoryHouseObj.inventoryOrgId',
      },
      {
        name: 'inventoryOrgCode',
        type: 'string',
        bind: 'inventoryHouseObj.inventoryOrgCode',
      },
      {
        name: 'businessUnitId',
        type: 'string',
        bind: 'inventoryHouseObj.businessUnitId',
      },
      {
        name: 'businessUnitCode',
        type: 'string',
        bind: 'inventoryHouseObj.businessUnitCode',
      },
      {
        name: 'inventorySeatObj',
        type: 'object',
        lovCode: common.inventorySeat,
        label: intl.get(`${intlPrefix}.inventorySeat`).d('收货库位'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            inventoryOrgId: record.get('customerInventoryOrgId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'inventorySeatId',
        type: 'string',
        bind: 'inventorySeatObj.inventorySeatId',
      },
      {
        name: 'inventorySeatCode',
        type: 'string',
        bind: 'inventorySeatObj.inventorySeatCode',
      },
      {
        name: 'inventorySeatName',
        type: 'string',
        bind: 'inventorySeatObj.inventorySeatName',
      },
      {
        name: 'customerUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uom`).d('单位'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('订单行号'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'executeRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeRemark`).d('行备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList } = data;
        return {
          url: generateUrlWithGetParam(url, { idList }),
          data: {
            ...data,
            idList: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

export { PurchaseAcceptListDS, PurchaseAcceptHeadDS, PurchaseAcceptLineDS };
