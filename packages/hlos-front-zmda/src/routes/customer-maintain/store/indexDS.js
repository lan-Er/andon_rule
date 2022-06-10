/**
 * @Description: VMI物料申请平台DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-20 12:31:40
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator } from 'hlos-front/lib/utils/utils';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, orgInfo } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/customers`;
const customerContactsUrl = `${HLOS_ZMDA}/v1/${organizationId}/customer-contactss`;
const customerSiteUnitsUrl = `${HLOS_ZMDA}/v1/${organizationId}/customer-site-units`;
const customerSitesUrl = `${HLOS_ZMDA}/v1/${organizationId}/customer-sites`;

const listDS = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编号'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户名称'),
    },
    {
      name: 'customerShortName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerShortName`).d('客户简称'),
    },
  ],
  fields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编号'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户全名称'),
    },
    {
      name: 'customerShortName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerShortName`).d('客户简称'),
    },
    {
      name: 'unifiedSocialNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.unifiedSocialNum`).d('统一社会信用代码'),
    },
    {
      name: 'defaultTaxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.defaultTaxRate`).d('默认税率（%）'),
    },
    {
      name: 'cooperationFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.cooperationFlag`).d('客户协同'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
  },
});

const createHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编号'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户全名称'),
      required: true,
    },
    {
      name: 'customerShortName',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerShortName`).d('客户简称'),
    },
    {
      name: 'unifiedSocialNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.unifiedSocialNum`).d('统一社会信用代码'),
    },
    {
      name: 'defaultTaxRateObj',
      type: 'object',
      lovCode: common.taxRate,
      label: intl.get(`${intlPrefix}.defaultTaxRate`).d('默认税率（%）'),
      ignore: 'always',
      textField: 'taxRate',
    },
    {
      name: 'defaultTaxId',
      type: 'string',
      bind: 'defaultTaxRateObj.taxId',
    },
    {
      name: 'defaultTaxRate',
      type: 'string',
      bind: 'defaultTaxRateObj.taxRate',
    },
    {
      name: 'cooperationFlag',
      type: 'string',
      // label: intl.get(`${intlPrefix}.cooperationFlag`).d('供应协同'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '1',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { customerId } = data;
      return {
        data: {
          ...data,
          customerId: undefined,
        },
        url: `${url}/${customerId}`,
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
  // events: {
  //   submitSuccess: ({ dataSet }) => {
  //     dataSet.query();
  //   },
  // },
});

const contactsDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编号'),
    },
    {
      name: 'customerId',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户Id'),
    },
    {
      name: 'contactsName',
      type: 'string',
      label: intl.get(`${intlPrefix}.contactsName`).d('姓名'),
      required: true,
    },
    {
      name: 'contactsMobilePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.contactsMobilePhone`).d('移动电话'),
    },
    {
      name: 'contactsPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.contactsPhone`).d('固定电话'),
    },
    {
      name: 'contactsFax',
      type: 'string',
      label: intl.get(`${intlPrefix}.contactsFax`).d('传真'),
    },
    {
      name: 'contactsEmail',
      type: 'string',
      label: intl.get(`${intlPrefix}.contactsEmail`).d('电子邮箱'),
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      required: true,
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      // const { customerId } = data;
      return {
        data: {
          ...data,
          // customerId: undefined,
        },
        url: `${customerContactsUrl}`,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: customerContactsUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: customerContactsUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const addressDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'addressNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.addressNum`).d('地点编号'),
      validator: codeValidator,
    },
    {
      name: 'addressName',
      type: 'string',
      label: intl.get(`${intlPrefix}.addressName`).d('地点名称'),
    },
    {
      name: 'fullAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.fullAddress`).d('详细地址'),
      required: true,
    },
    {
      name: 'country',
      type: 'string',
      label: intl.get(`${intlPrefix}.businessUnitName`).d('国家'),
    },
    {
      name: 'province',
      type: 'string',
      label: intl.get(`${intlPrefix}.province`).d('省'),
    },
    {
      name: 'city',
      type: 'string',
      label: intl.get(`${intlPrefix}.city`).d('市'),
    },
    {
      name: 'county',
      type: 'string',
      label: intl.get(`${intlPrefix}.county`).d('区/县'),
    },
    {
      name: 'addressDetail',
      type: 'string',
      label: intl.get(`${intlPrefix}.addressDetail`).d('详细地址'),
    },
    {
      name: 'customerSiteType',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerSiteType`).d('地点用途'),
      lookupCode: 'ZMDA.CUSTOMER_SITE_TYPE',
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      required: true,
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (
        name === 'country' ||
        name === 'province' ||
        name === 'city' ||
        name === 'county' ||
        name === 'addressDetail'
      ) {
        const {
          country = '',
          province = '',
          city = '',
          county = '',
          addressDetail = '',
        } = record.data;
        record.set(
          'fullAddress',
          `${country || ''}${province || ''}${city || ''}${county || ''}${addressDetail || ''}`
        );
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: `${customerSitesUrl}`,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: customerSitesUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: customerSitesUrl,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: customerSitesUrl,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});

const operationUnitDS = () => ({
  selection: false,
  queryFields: [
    // {
    //   name: 'businessUnitName',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.businessUnitName`).d('业务实体'),
    // },
    {
      name: 'businessUnitObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.businessUnitObj`).d('业务实体'),
      lovCode: orgInfo.bussinessUnit,
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
  ],
  fields: [
    {
      name: 'addressNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.addressNum`).d('地点编号'),
    },
    {
      name: 'businessUnitObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.businessUnitObj`).d('业务实体'),
      lovCode: orgInfo.bussinessUnit,
      ignore: 'always',
      required: true,
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
      name: 'businessUnitName',
      type: 'string',
      bind: 'businessUnitObj.businessUnitName',
    },
    {
      name: 'companyId',
      type: 'string',
      bind: 'businessUnitObj.companyId',
    },
    {
      name: 'companyNum',
      type: 'string',
      bind: 'businessUnitObj.companyNum',
    },
    {
      name: 'groupId',
      type: 'string',
      bind: 'businessUnitObj.groupId',
    },
    {
      name: 'groupNum',
      type: 'string',
      bind: 'businessUnitObj.groupNum',
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      required: true,
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
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
        data,
        url: `${customerSiteUnitsUrl}`,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: customerSiteUnitsUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: customerSiteUnitsUrl,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: customerSiteUnitsUrl,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});

export { listDS, createHeadDS, contactsDS, addressDS, operationUnitDS };
