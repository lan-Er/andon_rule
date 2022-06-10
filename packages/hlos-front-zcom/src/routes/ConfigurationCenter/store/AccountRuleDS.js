/* 对账规则列表
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 14:39:13
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-22 09:48:58
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId, getCurrentUser, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.configurationCenter.model';
const { configurationCenter } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const headerUrl = `${HLOS_ZCOM}/v1/${organizationId}/order-configs`;

// 无需对账
const NoAccountRuleDS = () => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: configurationCenter.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('采购订单类型'),
        required: true,
      },
      {
        name: 'customerTenantName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantName`).d('客户租户'),
        defalut: getCurrentUser().tenantName,
      },
      {
        name: 'customerTenantId',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantId`).d('客户租户'),
        defalut: getCurrentUser().tenantId,
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
    ],
    transport: {
      read: (config) => {
        const params = {
          orderConfigType: 'NO_RECONCILIATION',
          tenantId: organizationId,
        };
        return {
          ...config,
          url: generateUrlWithGetParam(headerUrl, params),
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

// 对账规则
const AccountRuleDS = () => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: configurationCenter.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('采购订单类型'),
        required: true,
      },
      {
        name: 'customerTenantName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantName`).d('客户租户'),
        defalut: getCurrentUser().tenantName,
      },
      {
        name: 'customerTenantId',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantId`).d('客户租户'),
        defalut: getCurrentUser().tenantId,
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
    ],
    transport: {
      read: (config) => {
        const params = {
          orderConfigType: 'RECONCILIATION',
          tenantId: organizationId,
        };
        return {
          ...config,
          url: generateUrlWithGetParam(headerUrl, params),
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

// 价格列表
const PriceListDS = () => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: configurationCenter.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('采购订单类型'),
        required: true,
      },
      {
        name: 'customerTenantName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantName`).d('客户租户'),
        defalut: getCurrentUser().tenantName,
      },
      {
        name: 'customerTenantId',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerTenantId`).d('客户租户'),
        defalut: getCurrentUser().tenantId,
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
    ],
    transport: {
      read: (config) => {
        const params = {
          orderConfigType: 'ADJUST_PRICE',
          tenantId: organizationId,
        };
        return {
          ...config,
          url: generateUrlWithGetParam(headerUrl, params),
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: headerUrl,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

export { NoAccountRuleDS, AccountRuleDS, PriceListDS };
