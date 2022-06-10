/**
 * @Description: 发货申请DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 12:38:22
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/query-to-create-execute-order`;

const DeliveryOrderListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'receiptSource',
        type: 'string',
        lookupCode: common.sourceExecuteType,
        label: intl.get(`${intlPrefix}.receiptSource`).d('收货来源'),
        required: true,
      },
      {
        // 客户供应时 客户取值
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        ignore: 'always',
        lovPara: {
          cooperationFlag: 1,
        },
      },
      {
        name: 'recvCustomerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'recvCompanyId',
        type: 'string',
        bind: 'customerObj.companyId',
      },
      {
        name: 'customerTenantId',
        type: 'string',
        bind: 'customerObj.customerTenantId',
      },
      {
        name: 'companyTenantId',
        type: 'string',
        bind: 'customerObj.companyTenantId',
      },
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId:
              record.get('receiptSource') === 'CUSTOMER_SUPPLY'
                ? record.get('customerTenantId')
                : record.get('companyTenantId'),
          }),
          cascadeMap: ({ record }) => ({
            tenantId:
              record.get('receiptSource') === 'CUSTOMER_SUPPLY'
                ? 'customerTenantId'
                : 'companyTenantId',
          }),
        },
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
        name: 'businessUnitObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.businessUnitObj`).d('业务实体'),
        lovCode: common.businessUnit,
        ignore: 'always',
      },
      {
        name: 'businessUnitId',
        type: 'string',
        bind: 'businessUnitObj.businessUnitId',
      },
      {
        name: 'businessUnitCode',
        type: 'string',
        bind: 'businessUnitObj.businessUnitCode',
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poInventoryOrg`).d('收货组织'),
        lovCode: common.inventoryOrg,
        ignore: 'always',
        cascadeMap: { businessUnitId: 'businessUnitId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            businessUnitId: record.get('businessUnitId'),
          }),
        },
      },
      {
        name: 'inventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
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
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源发货单号'),
      },
      {
        name: 'deliveryOrderLineNum',
        type: 'string',
        label: intl.get(`${commonPrefix}.executeLineNum`).d('行号'),
      },
      {
        name: 'recvItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.recvItemCode`).d('物料编码'),
      },
      {
        name: 'recvItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemDesc`).d('物料名称'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'recvUomName',
        type: 'string',
        label: intl.get(`${commonPrefix}.uomName`).d('单位'),
      },
      {
        name: 'recvDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvDeliveryQty`).d('发货数量'),
      },
      {
        name: 'recvAcceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvAcceptableQty`).d('未接收数量'),
      },
      {
        name: 'deliveryOrderDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('发货日期'),
      },
      {
        name: 'arrivalDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.arrivalDate`).d('预计到货日期'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('客户'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'recvBusinessUnitName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvBusinessUnitName`).d('业务实体'),
      },
      {
        name: 'recvInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('收货组织'),
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
        name: 'consignerPhone',
        type: 'string',
        label: intl.get(`${intlPrefix}.consignerPhone`).d('收货人联系电话'),
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
        const {
          deliveryApplyStatusList,
          receiptSource,
          businessUnitId = '',
          inventoryOrgId = '',
        } = data;
        let params;
        if (receiptSource === 'CUSTOMER_SUPPLY') {
          params = {
            recvSupplierTenantId: organizationId,
            recvSupplierBuId: businessUnitId || null,
            recvSupplierOrgId: inventoryOrgId || null,
          };
        }

        if (receiptSource === 'BRANCH_CO_SUPPLY') {
          params = {
            recvTenantId: organizationId,
            recvBusinessUnitId: businessUnitId || null,
            recvInventoryOrgId: inventoryOrgId || null,
          };
        }

        return {
          url: generateUrlWithGetParam(url, {
            deliveryApplyStatusList,
          }),
          data: {
            ...data,
            ...params,
            customerTenantId: null,
            companyTenantId: null,
            inventoryOrgId: null,
            businessUnitId: null,
            deliveryApplyStatusList: null,
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

const DeliveryOrderHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'executeWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeWorker`).d('实际执行人'),
        required: true,
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList } = data;
        return {
          url: generateUrlWithGetParam(url, {
            idList,
          }),
          data: {
            ...data,
            idList: null,
          },
          method: 'GET',
          transformResponse: (value) => {
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = Object.assign({}, newValue.content[0]);
            }
            return {
              ...content,
            };
          },
        };
      },
    },
  };
};

const DeliveryOrderLineDS = () => {
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
        name: 'recvItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.recvItemCode`).d('物料编码'),
      },
      {
        name: 'recvItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemDesc`).d('物料名称'),
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
        name: 'supplierDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDeliveryQty`).d('发货数量'),
      },
      {
        name: 'recvDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvDeliveryQty`).d('发货数量'),
      },
      {
        name: 'recvAcceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvAcceptableQty`).d('未接收数量'),
      },
      // {
      //   name: 'customerAcceptableQty',
      //   type: 'string',
      //   label: intl.get(`${intlPrefix}.customerAcceptableQty`).d('未接收数量'),
      // },
      {
        name: 'recvExecuteQty',
        type: 'number',
        // step: 1,
        validator: positiveNumberValidator,
        label: intl.get(`${intlPrefix}.recvExecuteQty`).d('本次接收数量'),
        required: true,
      },
      {
        name: 'executeDate',
        type: 'date',
        label: intl.get(`${commonPrefix}.executeDate`).d('实际收货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        transformResponse: (val) => val || moment().format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'recvInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvInventoryOrgName`).d('收货组织'),
      },
      {
        name: 'inventoryHouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.inventoryHouseObj`).d('收货库房'),
        lovCode: common.inventoryHouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            inventoryOrgId: record.get('recvInventoryOrgId'),
          }),
        },
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
        name: 'inventorySeatObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.inventoryHouseObj`).d('收货库位'),
        lovCode: common.inventorySeat,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            inventoryHouseId: record.get('inventoryHouseId'),
          }),
        },
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
        name: 'recvUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
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
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
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
          url: generateUrlWithGetParam(url, {
            idList,
          }),
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

export { DeliveryOrderListDS, DeliveryOrderHeadDS, DeliveryOrderLineDS };
