/*
 * @Descripttion: 供应商列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 14:39:13
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-04 17:35:41
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.configurationCenter.model';
const { common, configurationCenter } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/order-config-details`;

// 无需对账规则供应商列表
const NoReconcileListDS = () => {
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
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
    ],
    fields: [
      {
        name: 'supplierNumber',
        type: 'string',
        lookupCode: configurationCenter.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('供应商编码'),
      },
      {
        name: 'supplierDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantName`).d('供应商描述'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: lineUrl,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

// 对账规则供应商列表
const ReconcileListDS = () => {
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
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
    ],
    fields: [
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDescription`).d('供应商描述'),
      },
      {
        name: 'customerVerificationFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.customerVerificationFlag`).d('核企触发对账'),
        defaultValue: 1,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'supplierVerificationFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.supplierVerificationFlag`).d('供应商触发对账'),
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'auditFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.auditFlag`).d('是否需要审核'),
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: lineUrl,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

// 对账规则供应商列表
const PriceListDS = () => {
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
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
    ],
    fields: [
      {
        name: 'supplierNumber',
        type: 'string',
        lookupCode: configurationCenter.poType,
        label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDescription`).d('供应商描述'),
      },
      {
        name: 'orderPriceFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.customerVerificationFlag`).d('整单调价'),
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'allocationRule',
        type: 'string',
        lookupCode: configurationCenter.allocationRule,
        label: intl.get(`${intlPrefix}.supplierVerificationFlag`).d('分摊规则'),
        dynamicProps: {
          required: ({ record }) => {
            if (record.get('orderPriceFlag') === 1) {
              return true;
            }
          },
        },
      },
      {
        name: 'linePirceFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.auditFlag`).d('单行调价'),
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: lineUrl,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: lineUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

export { NoReconcileListDS, ReconcileListDS, PriceListDS };
