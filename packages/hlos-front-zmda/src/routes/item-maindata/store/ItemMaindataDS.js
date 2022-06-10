/**
 * @Description: 基础数据-物料DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-12 10:12:30
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.item';
const organizationId = getCurrentOrganizationId();
const { common, zmdaItemMaindata, orgInfo } = codeConfig.code;
const orgUrl = `${HLOS_ZMDA}/v1/${organizationId}/item-inv-orgs`;
const attrUrl = `${HLOS_ZMDA}/v1/${organizationId}/item-attributes`;

const ItemListDS = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
  ],
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'categoryCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.categoryCode`).d('物料类别'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.categoryName`).d('物料类别说明'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
    },
    {
      name: 'sequenceFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.sequenceFlag`).d('是否序列控制'),
    },
    {
      name: 'batchFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.batchFlag`).d('是否批次控制'),
    },
    {
      name: 'planner',
      type: 'string',
      label: intl.get(`${intlPrefix}.planner`).d('计划员'),
    },
    {
      name: 'buyer',
      type: 'string',
      label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
    },
    {
      name: 'defaultTaxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.defaultTaxRate`).d('默认税率（%）'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/items`,
        data,
        method: 'GET',
      };
    },
  },
});

const ItemDetailDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      required: true,
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
      required: true,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.category`).d('物料类别'),
      lovCode: zmdaItemMaindata.category,
      lovPara: {
        enabledFlag: 1,
      },
      textField: 'categoryCode',
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
      label: intl.get(`${intlPrefix}.categoryName`).d('物料类别说明'),
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
      lovCode: zmdaItemMaindata.uom,
      ignore: 'always',
      required: true,
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uomCode',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'sequenceFlag',
      type: 'number',
      lookupCode: common.isOrNo,
      label: intl.get(`${intlPrefix}.sequenceFlag`).d('是否序列控制'),
      defaultValue: 0,
    },
    {
      name: 'batchFlag',
      type: 'number',
      lookupCode: common.isOrNo,
      label: intl.get(`${intlPrefix}.batchFlag`).d('是否批次控制'),
      defaultValue: 0,
    },
    // {
    //   name: 'planner',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.planner`).d('计划员'),
    // },
    // {
    //   name: 'buyer',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
    // },
    {
      name: 'defaultTaxRateObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.defaultTaxRate`).d('默认税率（%）'),
      lovCode: common.taxRate,
      textField: 'taxRate',
      ignore: 'always',
    },
    {
      name: 'defaultTaxRateId',
      type: 'string',
      bind: 'defaultTaxRateObj.taxId',
    },
    {
      name: 'defaultTaxRateCode',
      type: 'string',
      bind: 'defaultTaxRateObj.taxCode',
    },
    {
      name: 'defaultTaxRate',
      type: 'string',
      bind: 'defaultTaxRateObj.taxRate',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { itemId } = data;
      return {
        data: {
          ...data,
          itemId: undefined,
        },
        url: `${HLOS_ZMDA}/v1/${organizationId}/items/${itemId}`,
        method: 'GET',
      };
    },
  },
});

const ItemOrgListDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'inventoryOrgObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.inventoryOrgCode`).d('组织代码'),
      lovCode: orgInfo.inventoryOrg,
      ignore: 'always',
      textField: 'inventoryOrgCode',
      required: true,
    },
    {
      name: 'inventoryOrgId',
      type: 'string',
      bind: 'inventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'inventoryOrgCode',
      type: 'string',
      bind: 'inventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'inventoryOrgName',
      type: 'string',
      bind: 'inventoryOrgObj.inventoryOrgName',
      label: intl.get(`${intlPrefix}.inventoryOrgName`).d('组织名称'),
    },
    {
      name: 'businessUnitId',
      type: 'string',
      bind: 'inventoryOrgObj.businessUnitId',
    },
    {
      name: 'businessUnitCode',
      type: 'string',
      bind: 'inventoryOrgObj.businessUnitCode',
    },
    {
      name: 'companyId',
      type: 'string',
      bind: 'inventoryOrgObj.companyId',
    },
    {
      name: 'companyNum',
      type: 'string',
      bind: 'inventoryOrgObj.companyNum',
    },
    {
      name: 'groupId',
      type: 'string',
      bind: 'inventoryOrgObj.groupId',
    },
    {
      name: 'groupNum',
      type: 'string',
      bind: 'inventoryOrgObj.groupNum',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '1',
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: orgUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: orgUrl,
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: orgUrl,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: orgUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});

const SupplierItemListDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.company`).d('公司'),
      lovCode: orgInfo.company,
      ignore: 'always',
      required: true,
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'customerCompanyNum',
      type: 'string',
      bind: 'companyObj.companyNum',
    },
    {
      name: 'customerCompanyName',
      type: 'string',
      bind: 'companyObj.companyName',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编号'),
      lovCode: common.supplier,
      lovPara: {
        cooperationFlag: 1,
      },
      ignore: 'always',
      textField: 'supplierNumber',
      required: true,
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.supplierNumber',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplierObj.supplierName',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
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
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料编码'),
    },
    {
      name: 'supplierUomCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierUomCode`).d('供应商物料单位'),
    },
    {
      name: 'conversionRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.conversionRate`).d('单位转换率'),
    },
    {
      name: 'customerConversionRate',
      type: 'string',
      required: true,
    },
    {
      name: 'supplierConversionRate',
      type: 'string',
      required: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations`,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations/create-supplier-item`,
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations/update-supplier-item`,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations`,
        data,
        method: 'DELETE',
      };
    },
  },
});

const CustomerItemListDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.company`).d('公司'),
      lovCode: orgInfo.company,
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'supplierCompanyNum',
      type: 'string',
      bind: 'companyObj.companyNum',
    },
    {
      name: 'supplierCompanyName',
      type: 'string',
      bind: 'companyObj.companyName',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编号'),
      lovCode: common.customer,
      lovPara: {
        cooperationFlag: 1,
      },
      ignore: 'always',
      textField: 'customerNumber',
      required: true,
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerNumber',
      type: 'string',
      bind: 'customerObj.customerNumber',
    },
    {
      name: 'customerName',
      type: 'string',
      bind: 'customerObj.customerName',
      label: intl.get(`${intlPrefix}.customerName`).d('客户名称'),
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
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码'),
    },
    {
      name: 'customerUomCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUomCode`).d('客户物料单位'),
    },
    {
      name: 'conversionRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.conversionRate`).d('单位转换率'),
    },
    {
      name: 'customerConversionRate',
      type: 'string',
      required: true,
    },
    {
      name: 'supplierConversionRate',
      type: 'string',
      required: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations`,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations/create-customer-item`,
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations/update-customer-item`,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${organizationId}/item-relations`,
        data,
        method: 'DELETE',
      };
    },
  },
});

const ItemAttributeDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'attributeObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.attribute`).d('属性'),
      lovCode: zmdaItemMaindata.attribute,
      lovPara: {
        enabledFlag: '1',
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'attributeId',
      type: 'string',
      bind: 'attributeObj.attributeId',
    },
    {
      name: 'attributeCode',
      type: 'string',
      bind: 'attributeObj.attributeCode',
    },
    {
      name: 'attributeDesc',
      type: 'string',
      bind: 'attributeObj.attributeDesc',
    },
    {
      name: 'itemAttributeValueList',
      type: 'object',
      label: intl.get(`${intlPrefix}.attributeValue`).d('属性可选值'),
      lovCode: zmdaItemMaindata.attributeValue,
      cascadeMap: {
        attributeId: 'attributeId',
      },
      multiple: true,
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '1',
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'attributeObj') {
        record.set('itemAttributeValueList', null);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: attrUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: attrUrl,
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: attrUrl,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
  },
});

export {
  ItemListDS,
  ItemDetailDS,
  ItemOrgListDS,
  SupplierItemListDS,
  CustomerItemListDS,
  ItemAttributeDS,
};
