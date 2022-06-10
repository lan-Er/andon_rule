/**
 * @Description: 公司DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-07 18:05:41
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.company';
const { zmdaCompany } = codeConfig.code;

const CompanyListDS = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'companyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyNum`).d('公司编码'),
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyName`).d('公司名称'),
    },
  ],
  fields: [
    {
      name: 'companyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyNum`).d('公司编码'),
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyName`).d('公司名称'),
    },
    {
      name: 'companyShortName',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyShortName`).d('公司简称'),
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/companys`,
        data,
        method: 'GET',
      };
    },
  },
});

const CompanyCreateFormDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'inCountryFlag',
      type: 'boolean',
    },
    {
      name: 'unifiedSocialNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.unifiedSocialNum`).d('统一社会信用代码号'),
      dynamicProps: {
        required: ({ record }) => record.get('inCountryFlag'),
      },
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyName`).d('企业名称'),
      required: true,
    },
    {
      name: 'companyShortName',
      type: 'string',
      label: intl.get(`${intlPrefix}.companyShortName`).d('企业简称'),
    },
    {
      name: 'orgInstitutionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.orgInstitutionCode`).d('组织机构代码'),
    },
    {
      name: 'dunsCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.dunsCode`).d('邓白氏编码'),
    },
    {
      name: 'dunsCodeAbroad',
      type: 'string',
      label: intl.get(`${intlPrefix}.dunsCode`).d('邓白氏编码'),
      dynamicProps: {
        required: ({ record }) => !record.get('inCountryFlag'),
      },
    },
    {
      name: 'companyType',
      type: 'string',
      lookupCode: zmdaCompany.companyType,
      label: intl.get(`${intlPrefix}.companyType`).d('企业类型'),
      dynamicProps: {
        required: ({ record }) => record.get('inCountryFlag'),
      },
    },
    {
      name: 'taxpayerType',
      type: 'string',
      lookupCode: zmdaCompany.taxpayerType,
      label: intl.get(`${intlPrefix}.taxpayerType`).d('纳税人标识'),
      dynamicProps: {
        required: ({ record }) => record.get('inCountryFlag'),
      },
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
      label: intl.get(`${intlPrefix}.country`).d('国家'),
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
      name: 'legalPerson',
      type: 'string',
      label: intl.get(`${intlPrefix}.legalPerson`).d('法定代表人'),
      required: true,
    },
    {
      name: 'registeredCapital',
      type: 'string',
      label: intl.get(`${intlPrefix}.registeredCapital`).d('注册资本'),
    },
    {
      name: 'buildDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.buildDate`).d('成立日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      required: true,
    },
    {
      name: 'businessEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.businessEndDate`).d('营业期限'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'businessLongFlag',
      type: 'boolean',
    },
    {
      name: 'businessScope',
      type: 'string',
      label: intl.get(`${intlPrefix}.businessScope`).d('经营范围'),
    },
    {
      name: 'licenceUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.licenceUrl`).d('营业执照'),
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('状态'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (['country', 'province', 'city', 'county', 'addressDetail'].includes(name)) {
        const { country, province, city, county, addressDetail } = record.toData();
        record.set(
          'fullAddress',
          `${country || ''}${province || ''}${city || ''}${county || ''}${addressDetail || ''}`
        );
      }
    },
  },
});

export { CompanyListDS, CompanyCreateFormDS };
