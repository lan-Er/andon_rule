/**
 * @Description: 发货预约DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 12:38:22
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryApply.model';
const { common, deliveryApply } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const SourceLineDS = (roleType) => {
  const arr = [
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
    },
    {
      name: 'demandDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.demandDate`).d('期望到货日期'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'demandDateEnd',
      type: 'date',
      bind: 'demandDateStart.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'promiseDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.promiseDate`).d('承诺到货日期'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'promiseDateEnd',
      type: 'date',
      bind: 'promiseDateStart.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ];
  const arr1 = [
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
      name: 'customerItemCode',
      type: 'string',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerDemandDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDemandDate`).d('期望到货日期'),
    },
    {
      name: 'supplierPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺到货日期'),
    },
  ];
  const queryArr = arr.concat([]);
  const fieldArr = arr1.concat([]);
  if (roleType === 'customer') {
    queryArr.splice(
      1,
      0,
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovPara: { cooperationFlag: 1 },
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierTenantId',
        type: 'string',
        bind: 'supplierObj.supplierTenantId',
      },
      {
        name: 'supplierCompanyId',
        type: 'string',
        bind: 'supplierObj.supplierCompanyId',
      },
      {
        name: 'customerInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('收货组织'),
        ignore: 'always',
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商组织'),
        cascadeMap: { companyId: 'supplierCompanyId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('supplierTenantId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'customerItemObj',
        type: 'object',
        lovCode: common.itemMaindata,
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
        cascadeMap: { inventoryOrgId: 'customerInventoryOrgId' },
        ignore: 'always',
      },
      {
        name: 'customerItemId',
        type: 'string',
        bind: 'customerItemObj.itemId',
      }
    );
    fieldArr.splice(
      5,
      0,
      {
        name: 'customerUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uom`).d('单位'),
      },
      {
        name: 'customerDemandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('总数量'),
      },
      {
        name: 'customerShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrgName`).d('收货组织'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrgName`).d('供应商组织'),
      }
    );
  }
  if (roleType === 'supplier') {
    queryArr.splice(
      1,
      0,
      {
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovPara: { cooperationFlag: 1 },
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerTenantId',
        type: 'string',
        bind: 'customerObj.customerTenantId',
      },
      {
        name: 'customerCompanyId',
        type: 'string',
        bind: 'customerObj.customerCompanyId',
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('发货组织'),
        ignore: 'always',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'customerInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
        cascadeMap: { companyId: 'customerCompanyId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'supplierItemObj',
        type: 'object',
        lovCode: common.itemMaindata,
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
        cascadeMap: { inventoryOrgId: 'supplierInventoryOrgId' },
        ignore: 'always',
      },
      {
        name: 'supplierItemId',
        type: 'string',
        bind: 'supplierItemObj.itemId',
      }
    );
    fieldArr.splice(
      5,
      0,
      {
        name: 'supplierUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uom`).d('单位'),
      },
      {
        name: 'supplierDemandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('总数量'),
      },
      {
        name: 'supplierShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrgName`).d('发货组织'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrgName`).d('客户组织'),
      }
    );
  }
  return {
    autoQuery: false,
    queryFields: queryArr,
    fields: fieldArr,
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/po-lines/query-to-create-delivery-order`,
          data: {
            ...data,
            demandDateStart: data.demandDateStart ? `${data.demandDateStart} 00:00:00` : null,
            demandDateEnd: data.demandDateEnd ? `${data.demandDateEnd} 23:59:59` : null,
            promiseDateStart: data.promiseDateStart ? `${data.promiseDateStart} 00:00:00` : null,
            promiseDateEnd: data.promiseDateEnd ? `${data.promiseDateEnd} 23:59:59` : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryApplyListDS = (roleType) => {
  const arr = [
    {
      name: 'deliveryApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryApplyNum`).d('预约单号'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
    },
    {
      name: 'deliveryApplyStatusList',
      type: 'string',
      lookupCode: deliveryApply.deliveryApplyStatus,
      multiple: true,
      label: intl.get(`${intlPrefix}.deliveryApplyStatus`).d('预约单状态'),
    },
    {
      name: 'receiverObj',
      type: 'object',
      lovCode: deliveryApply.receiver,
      label: intl.get(`${intlPrefix}.receiver`).d('接收方'),
      cascadeMap: roleType === 'customer' ? {} : { tenantId: 'customerTenantId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: roleType === 'customer' ? organizationId : record.get('customerTenantId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'receiverSupplierId',
      type: 'string',
      bind: 'receiverObj.recvSupplierId',
    },
    {
      name: 'receiverCompanyId',
      type: 'string',
      bind: 'receiverObj.recvCompanyId',
    },
    {
      name: 'receiverNumber',
      type: 'string',
      bind: 'receiverObj.recvNumber',
    },
    {
      name: 'receiverName',
      type: 'string',
      bind: 'receiverObj.recvName',
    },
    {
      name: 'receiverTenantId',
      type: 'string',
      bind: 'receiverObj.recvTenantId',
    },
    {
      name: 'receivingType',
      type: 'string',
      bind: 'receiverObj.receivingType',
    },
    {
      name: 'deliveryApplyDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.deliveryApplyDate`).d('预约发货日期'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'deliveryApplyDateEnd',
      type: 'date',
      bind: 'deliveryApplyDateStart.end',
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
    {
      name: 'deliveryApplyType',
      type: 'string',
      lookupCode: deliveryApply.deliveryApplyType,
      label: intl.get(`${intlPrefix}.deliveryApplyType`).d('预约单类型'),
    },
  ];
  const queryArr = arr.concat([]);
  if (roleType === 'customer') {
    queryArr.splice(
      2,
      0,
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovPara: { cooperationFlag: 1 },
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      }
    );
  }
  if (roleType === 'supplier') {
    queryArr.splice(
      2,
      0,
      {
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovPara: { cooperationFlag: 1 },
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerTenantId',
        type: 'string',
        bind: 'customerObj.customerTenantId',
      }
    );
  }
  return {
    autoQuery: false,
    queryFields: queryArr,
    fields: [
      {
        name: 'deliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryApplyNum`).d('预约单号'),
      },
      {
        name: 'deliveryApplyType',
        type: 'string',
        lookupCode: deliveryApply.deliveryApplyType,
        label: intl.get(`${intlPrefix}.deliveryApplyType`).d('预约单类型'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'recvName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiver`).d('接收方'),
      },
      {
        name: 'deliveryApplyDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryApplyDate`).d('预约发货日期'),
      },
      {
        name: 'arrivalDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
      },
      {
        name: 'deliveryApplyStatus',
        type: 'string',
        lookupCode: deliveryApply.deliveryApplyStatus,
        label: intl.get(`${intlPrefix}.deliveryApplyStatus`).d('预约单状态'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { deliveryApplyStatusList } = data;
        let recvObj;
        // 有接收方
        if (data.receiverNumber) {
          // 接收方是供应商
          if (data.receivingType === 'THIRD_SUPPLIER') {
            recvObj = Object.assign(
              {},
              {
                recvSupplierId: data.receiverSupplierId,
                recvSupplierCompanyId: data.receiverCompanyId,
                recvSupplierNumber: data.receiverNumber,
                recvSupplierTenantId: data.receiverTenantId,
              }
            );
          }
          // 接收方是子公司
          if (data.receivingType === 'SUB_COMPANY') {
            recvObj = Object.assign(
              {},
              {
                recvTenantId: data.receiverTenantId,
                recvCompanyId: data.receiverCompanyId,
              }
            );
          }
        }
        return {
          url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys`, {
            deliveryApplyStatusList,
          }),
          data: {
            ...data,
            ...recvObj,
            deliveryApplyStatusList: null,
            deliveryApplyDateStart: data.deliveryApplyDateStart
              ? `${data.deliveryApplyDateStart} 00:00:00`
              : null,
            deliveryApplyDateEnd: data.deliveryApplyDateEnd
              ? `${data.deliveryApplyDateEnd} 23:59:59`
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

const DeliveryApplyHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'deliveryApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryApplyNum`).d('预约单号'),
      },
      {
        name: 'deliveryApplyType',
        type: 'string',
        lookupCode: deliveryApply.deliveryApplyType,
        label: intl.get(`${intlPrefix}.deliveryApplyType`).d('预约单类型'),
        required: true,
      },
      {
        name: 'deliveryApplyStatus',
        type: 'string',
        lookupCode: deliveryApply.deliveryApplyStatus,
        label: intl.get(`${intlPrefix}.deliveryApplyStatus`).d('预约单状态'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商发货组织'),
      },
      {
        name: 'deliveryAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryAddress`).d('发货地点'),
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
        name: 'deliveryWarehouse',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryWarehouse`).d('发货仓库'),
      },
      {
        name: 'deliveryApplyDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.deliveryApplyDate`).d('预约发货日期'),
        min: moment(new Date()).format(DEFAULT_DATE_FORMAT),
        max: 'arrivalDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'arrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.arrivalDate`).d('预计到货日期'),
        dynamicProps: {
          min: ({ record }) => {
            if (record.get('deliveryApplyDate')) {
              return 'deliveryApplyDate';
            }
            return moment(new Date()).format(DEFAULT_DATE_FORMAT);
          },
        },
        min: 'deliveryApplyDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
      },
      {
        name: 'receiverObj',
        type: 'object',
        lovCode: deliveryApply.receiver,
        label: intl.get(`${intlPrefix}.receiver`).d('接收方'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
            supplierTenantId: record.get('supplierTenantId'),
            recvCompanyId: record.get('customerCompanyId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'receiverSupplierId',
        type: 'string',
        bind: 'receiverObj.recvSupplierId',
      },
      {
        name: 'receiverCompanyId',
        type: 'string',
        bind: 'receiverObj.recvCompanyId',
      },
      {
        name: 'receiverNumber',
        type: 'string',
        bind: 'receiverObj.recvNumber',
      },
      {
        name: 'receiverName',
        type: 'string',
        bind: 'receiverObj.recvName',
      },
      {
        name: 'receiverTenantId',
        type: 'string',
        bind: 'receiverObj.recvTenantId',
      },
      {
        name: 'receivingType',
        type: 'string',
        bind: 'receiverObj.receivingType',
      },
      {
        name: 'recvOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.recvOrg`).d('接收组织'),
        cascadeMap: { tenantId: 'receiverTenantId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            companyId: record.get('receiverCompanyId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'recvOrgId',
        type: 'string',
        bind: 'recvOrgObj.inventoryOrgId',
      },
      {
        name: 'recvOrgCode',
        type: 'string',
        bind: 'recvOrgObj.inventoryOrgCode',
      },
      {
        name: 'recvOrgName',
        type: 'string',
        bind: 'recvOrgObj.inventoryOrgName',
      },
      {
        name: 'recvBuId',
        type: 'string',
        bind: 'recvOrgObj.businessUnitId',
      },
      {
        name: 'recvBuCode',
        type: 'string',
        bind: 'recvOrgObj.businessUnitCode',
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
        name: 'receivingWarehouse',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivingWarehouse`).d('收货仓库'),
      },
      {
        name: 'operationOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.operationOpinion`).d('审批意见'),
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'receiverObj') {
          record.set('recvOrgObj', null);
        }
      },
    },
    transport: {
      read: ({ data }) => {
        const { idList, deliveryApplyId } = data;
        return {
          url: deliveryApplyId
            ? `${HLOS_ZCOM}/v1/${organizationId}/delivery-applys/${deliveryApplyId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/po-lines/query-to-create-delivery-order`,
                { idList }
              ),
          data: {
            ...data,
            idList: undefined,
            deliveryApplyId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            let recvObj;
            if (deliveryApplyId) {
              const headValue = JSON.parse(value);
              // 接收方是供应商
              if (headValue.receivingType === 'THIRD_SUPPLIER') {
                recvObj = Object.assign(
                  {},
                  {
                    receiverSupplierId: headValue.recvSupplierId,
                    receiverCompanyId: headValue.recvSupplierCompanyId,
                    receiverNumber: headValue.recvSupplierNumber,
                    receiverTenantId: headValue.recvSupplierTenantId,
                    receiverName: headValue.recvSupplierName,
                    receiverBuId: headValue.recvSupplierBuId,
                    receiverBuCode: headValue.recvSupplierBuCode,
                    recvOrgId: headValue.recvSupplierOrgId,
                    recvrOrgCode: headValue.recvSupplierOrgCode,
                    recvOrgName: headValue.recvSupplierOrgName,
                  }
                );
              }
              // 接收方是子公司
              if (headValue.receivingType === 'SUB_COMPANY') {
                recvObj = Object.assign(
                  {},
                  {
                    receiverCompanyId: headValue.recvCompanyId,
                    receiverTenantId: headValue.recvTenantId,
                    receiverName: headValue.recvCompanyName,
                    receiverBuId: headValue.recvBusinessUnitId,
                    receiverBuCode: headValue.recvBusinessUnitCode,
                    recvOrgId: headValue.recvInventoryOrgId,
                    recvOrgCode: headValue.recvInventoryOrgCode,
                    recvOrgName: headValue.recvInventoryOrgName,
                  }
                );
              }
              return {
                ...headValue,
                ...recvObj,
              };
            }
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

const DeliveryApplyLineDS = (roleType) => {
  const arr = [
    {
      name: 'deliveryApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryApplyLineNum`).d('行号'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
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
      name: 'customerDemandDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDemandDate`).d('期望到货日期'),
    },
    {
      name: 'supplierPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺到货日期'),
    },
  ];
  const fieldArr = arr.concat([]);
  if (roleType === 'customer') {
    fieldArr.splice(
      4,
      0,
      {
        name: 'customerUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'customerDemandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('总数量'),
      },
      {
        name: 'customerShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('订单未发货数量'),
      }
    );
    fieldArr.push({
      name: 'customerTotalDeliveryQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerTotalDeliveryQty`).d('预约单已发货数量'),
    });
    fieldArr.push({
      name: 'customerUnshippedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUnshippedQty`).d('已预约未发货数量'),
    });
    fieldArr.push({
      name: 'deliveryApplyLineStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryApplyLineStatusMeaning`).d('状态'),
      // defaultValue: 'NEW',
    });
    fieldArr.push({
      name: 'customerDeliveryQty',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${intlPrefix}.deliveryQty`).d('预约发货数量'),
      required: true,
    });
  }
  if (roleType === 'supplier') {
    fieldArr.splice(
      4,
      0,
      {
        name: 'supplierUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'supplierDemandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('总数量'),
      },
      {
        name: 'supplierShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('订单未发货数量'),
      }
    );
    fieldArr.push({
      name: 'supplierTotalDeliveryQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierTotalDeliveryQty`).d('预约单已发货数量'),
    });
    fieldArr.push({
      name: 'supplierUnshippedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierUnshippedQty`).d('已预约未发货数量'),
    });
    fieldArr.push({
      name: 'deliveryApplyLineStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryApplyLineStatusMeaning`).d('状态'),
      // defaultValue: 'NEW',
    });
    fieldArr.push({
      name: 'supplierDeliveryQty',
      type: 'number',
      validator: positiveNumberValidator,
      // max: 'supplierShippableQty',
      label: intl.get(`${intlPrefix}.deliveryQty`).d('预约发货数量'),
      required: true,
    });
  }
  return {
    autoQuery: false,
    fields: fieldArr,
    transport: {
      read: ({ data }) => {
        const { idList, deliveryApplyId } = data;
        return {
          url: deliveryApplyId
            ? `${HLOS_ZCOM}/v1/${organizationId}/delivery-apply-lines`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/po-lines/query-to-create-delivery-order`,
                { idList }
              ),
          data: {
            ...data,
            idList: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

export { SourceLineDS, DeliveryApplyListDS, DeliveryApplyHeadDS, DeliveryApplyLineDS };
