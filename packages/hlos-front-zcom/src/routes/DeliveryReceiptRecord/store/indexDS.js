/*
 * @Descripttion: 收货记录DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-27 14:01:17
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-27 14:02:55
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
// GET /v1/{organizationId}/execute-lines
const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/execute-lines`;

const ReceiptListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'executeOrderType',
        type: 'string',
        lookupCode: common.executeOrderType,
        label: intl.get(`${intlPrefix}.executeOrderType`).d('收货单类型'),
        required: true,
      },
      {
        name: 'receiptSource',
        type: 'string',
        lookupCode: common.sourceExecuteType,
        label: intl.get(`${intlPrefix}.receiptSource`).d('收货来源'),
      },
      {
        name: 'companyObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
        lovCode: common.company,
        ignore: 'always',
      },
      {
        name: 'supplierCompanyId',
        type: 'string',
        bind: 'companyObj.companyId',
      },
      {
        name: 'customerObj',
        type: 'object',
        // lovCode: common.customer,
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            companyId: record.get('supplierCompanyId'),
          }),
        },
      },
      {
        name: 'customerId',
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
            tenantId: record.get('customerTenantId') || record.get('companyTenantId'),
          }),
          cascadeMap: ({ record }) => {
            const { executeOrderType, receiptSource } = record.data;
            if (executeOrderType === 'PURCHASE_ACCEPTANCE') {
              return {};
            }

            if (executeOrderType === 'PURCHASE_ACCEPTANCE') {
              return {
                tenantId: 'customerTenantId',
              };
            }

            if (
              executeOrderType === 'THIRD_PARTY_ACCEPTANCE' &&
              receiptSource === 'CUSTOMER_SUPPLY'
            ) {
              return { tenantId: 'customerTenantId' };
            }

            if (
              executeOrderType === 'THIRD_PARTY_ACCEPTANCE' &&
              receiptSource === 'BRANCH_CO_SUPPLY'
            ) {
              return { tenantId: 'companyTenantId' };
            }
          },
        },
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'executeOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeOrderNum`).d('收货单号'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('来源发货单号'),
      },
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('关联订单号'),
      },
      {
        name: 'businessUnitObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.businessUnitObj`).d('业务实体'),
        lovCode: common.businessUnit,
        dynamicProps: {
          lovPara: ({ record }) => ({
            companyId: record.get('supplierCompanyId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'businessUnitId',
        type: 'string',
        bind: 'businessUnitObj.businessUnitId',
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
        name: 'executeWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeWorker`).d('实际执行人'),
      },
      {
        name: 'executeDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.executeDate`).d('实际执行日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'executeDateEnd',
        type: 'date',
        bind: 'executeDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'executeOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeOrderNum`).d('收货单号'),
      },
      {
        name: 'executeLineNum',
        type: 'string',
        label: intl.get(`${commonPrefix}.executeLineNum`).d('行号'),
      },
      // {
      //   name: 'customerName',
      //   type: 'string',
      //   label: intl.get(`${commonPrefix}.customerName`).d('客户'),
      // },
      {
        name: 'executeOrderTypeMeaning',
        type: 'string',
        label: intl.get(`${commonPrefix}.executeOrderTypeMeaning`).d('收货单类型'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCode`).d('物料信息'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemCode`).d('物料信息'),
      },
      {
        name: 'itemAttr',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'recvExecuteQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.recvExecuteQty`).d('收货数量'),
      },
      {
        name: 'customerExecuteQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerExecuteQty`).d('收货数量'),
      },
      {
        name: 'supplierExecuteQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierExecuteQty`).d('收货数量'),
      },
      {
        name: 'executeDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('执行日期'),
      },
      {
        name: 'customerBusinessUnitName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerBusinessUnitName`).d('业务实体'),
      },
      {
        name: 'customerInventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerInventoryOrg`).d('收货组织'),
      },
      {
        name: 'executeWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivingAddress`).d('实际执行人'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源发货单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('来源行号'),
      },

      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('关联订单号'),
      },
      {
        name: 'poLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poLineNum`).d('关联订单行号'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料信息'),
      },
      {
        name: 'customerExecuteQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerExecuteQty`).d('客户收货数量'),
      },
      {
        name: 'customerExecuteQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerExecuteQty`).d('客户发货数量'),
      },
      {
        name: 'inventoryOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.inventoryOrgName`).d('客户组织'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料信息'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { executeOrderType, receiptSource, businessUnitId = '', inventoryOrgId = '' } = data;
        let params;
        if (executeOrderType === 'PURCHASE_ACCEPTANCE') {
          params = {
            customerBusinessUnitId: businessUnitId || null,
            customerInventoryOrgId: inventoryOrgId || null,
          };
        }

        if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
          params = {
            deliveryView: 'TO_SUPPLIER',
            supplierTenantId: organizationId,
            supplierBusinessUnitId: businessUnitId || null,
            supplierInventoryOrgId: inventoryOrgId || null,
            receiptSource: null,
          };
        }

        if (executeOrderType === 'THIRD_PARTY_ACCEPTANCE' && receiptSource === 'CUSTOMER_SUPPLY') {
          params = {
            recvSupplierBuId: businessUnitId || null,
            recvSupplierOrgId: inventoryOrgId || null,
            recvSupplierTenantId: organizationId,
          };
        }

        if (executeOrderType === 'THIRD_PARTY_ACCEPTANCE' && receiptSource === 'BRANCH_CO_SUPPLY') {
          params = {
            recvBusinessUnitId: businessUnitId || null,
            recvInventoryOrgId: inventoryOrgId || null,
            recvTenantId: organizationId,
          };
        }
        return {
          url,
          data: {
            ...data,
            ...params,
            inventoryOrgId: null,
            businessUnitId: null,
            executeDateStart: data.executeDateStart ? `${data.executeDateStart} 00:00:00` : null,
            executeDateEnd: data.executeDateEnd ? `${data.executeDateEnd} 23:59:59` : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

export { ReceiptListDS };
