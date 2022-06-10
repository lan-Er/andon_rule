/**
 * @Description: 配置中心DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 10:41:01
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.configurationCenter.model';
const { common, moConfigurationCenter } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/verification-rules`;

// 代工业务对账规则配置DS
const FoundryRuleDS = () => {
  return {
    autoQuery: true,
    fields: [
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
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
      },
      {
        name: 'supplierTenantId',
        type: 'string',
        bind: 'supplierObj.supplierTenantId',
      },
      {
        name: 'supplierDocumentTypeObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.supplierDocumentType`).d('MO类型'),
        lovCode: moConfigurationCenter.moType,
        ignore: 'always',
        required: true,
        cascadeMap: {
          tenantId: 'supplierTenantId',
        },
        lovPara: {
          documentClass: 'MO',
        },
      },
      {
        name: 'supplierDocumentTypeId',
        type: 'string',
        bind: 'supplierDocumentTypeObj.documentTypeId',
      },
      {
        name: 'supplierDocumentTypeCode',
        type: 'string',
        bind: 'supplierDocumentTypeObj.documentTypeCode',
      },
      {
        name: 'supplierDocumentTypeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDocumentTypeName`).d('MO类型描述'),
        bind: 'supplierDocumentTypeObj.documentTypeName',
      },
      {
        name: 'verificationFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.verificationFlag`).d('需要对账'),
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'pricingCode',
        type: 'string',
        lookupCode: moConfigurationCenter.pricingRule,
        label: intl.get(`${intlPrefix}.pricingCode`).d('定价规则'),
        dynamicProps: {
          required: ({ record }) => {
            if (record.get('verificationFlag')) {
              return true;
            }
          },
        },
      },
      {
        name: 'itemPrefix',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemPrefix`).d('接口物料前缀'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url,
          data: {
            ...data[0],
            tenantId: organizationId,
            supplierDocumentClass: 'MO',
          },
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url,
          data: data[0],
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url,
          data,
          method: 'DELETE',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

export { FoundryRuleDS };
