/**
 * @Description: 发货预约DS（外协物料）
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-15 16:01:33
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

const OutSourceLineDS = (roleType) => {
  const qArr = [
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源订单号'),
    },
    {
      name: 'customerPromiseDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.customerPromiseDate`).d('预计到货日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'customerPromiseDateEnd',
      type: 'date',
      bind: 'customerPromiseDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
  ];
  const fArr = [
    {
      name: 'customerItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItem',
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
      name: 'poOutsourceNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poOutsourceNum`).d('订单外协行号'),
    },
    {
      name: 'customerPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPromiseDate`).d('预计到货日期'),
    },
  ];
  const queryArr = qArr.concat([]);
  const fieldArr = fArr.concat([]);
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
        name: 'customerPromiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'customerShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
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
        name: 'supplierPromiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'supplierShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('未发货数量'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      }
    );
  }
  return {
    autoQuery: false,
    queryFields: queryArr,
    fields: fieldArr,
    transport: {
      read: ({ data }) => {
        const outsrcTypeList = ['UNSPECIFIED', 'CUSTOMER']; // 未指定供料或者采购方供料
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/po-outsources/query-out-to-create-delivery-apply-order`,
            { outsrcTypeList }
          ),
          data: {
            ...data,
            customerTenantId: roleType === 'customer' ? organizationId : null,
            supplierTenantId: roleType === 'supplier' ? organizationId : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryApplyOutHeadDS = () => {
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
      },
      {
        name: 'deliveryApplyStatus',
        type: 'string',
        lookupCode: deliveryApply.deliveryApplyStatus,
        label: intl.get(`${intlPrefix}.deliveryApplyStatus`).d('预约单状态'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'customerInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('客户组织'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('customerTenantId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'customerInventoryOrgCode',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgCode',
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        bind: 'customerInventoryOrgObj.inventoryOrgName',
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
        transformRequest: (val) =>
          val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : '',
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
        transformRequest: (val) =>
          val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : '',
        required: true,
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'supplierInventoryOrgObj',
        type: 'object',
        lovCode: common.inventoryOrg,
        label: intl.get(`${intlPrefix}.supplierInventoryOrg`).d('供应商组织'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: record.get('supplierTenantId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgId',
      },
      {
        name: 'supplierInventoryOrgCode',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgCode',
      },
      {
        name: 'supplierInventoryOrgName',
        type: 'string',
        bind: 'supplierInventoryOrgObj.inventoryOrgName',
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
    transport: {
      read: ({ data }) => {
        const { idList, deliveryApplyId } = data;
        return {
          url: deliveryApplyId
            ? `${HLOS_ZCOM}/v1/${organizationId}/delivery-applys/${deliveryApplyId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/po-outsources/query-out-to-create-delivery-apply-order`,
                { idList }
              ),
          data: {
            ...data,
            idList: undefined,
            deliveryApplyId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryApplyId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = Object.assign({}, newValue.content[0]);
            }
            return {
              ...content,
              deliveryApplyType: 'CUSTOMER_SUPPLY_APPOINTMENT',
            };
          },
        };
      },
    },
  };
};

const DeliveryApplyOutLineDS = (roleType) => {
  const arr = [
    {
      name: 'deliveryApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryApplyLineNum`).d('行号'),
    },
    {
      name: 'customerItem',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
    },
    {
      name: 'supplierItem',
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
      label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('外协行号'),
    },
    {
      name: 'supplierPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('预计到货日期'),
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
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'customerShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('外协未发货数量'),
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
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'supplierShippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('外协未发货数量'),
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
    });
    fieldArr.push({
      name: 'supplierDeliveryQty',
      type: 'number',
      validator: positiveNumberValidator,
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
                `${HLOS_ZCOM}/v1/${organizationId}/po-outsources/query-out-to-create-delivery-apply-order`,
                { idList }
              ),
          data: {
            ...data,
            idList: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryApplyId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((v) => ({
                ...v,
                sourceDocLineId: v.poOutsourceId,
                sourceDocLineNum: v.poOutsourceNum,
                supplierDemandQty: v.supplierPromiseQty,
                customerDemandQty: v.customerPromiseQty,
                customerDemandDate: v.customerPromiseDate,
                supplierPromiseDate: v.customerPromiseDate,
                supplierDeliveryQty: null,
                customerDeliveryQty: null,
              }));
            }
            return {
              ...newValue,
              content,
            };
          },
        };
      },
    },
  };
};

export { OutSourceLineDS, DeliveryApplyOutHeadDS, DeliveryApplyOutLineDS };
