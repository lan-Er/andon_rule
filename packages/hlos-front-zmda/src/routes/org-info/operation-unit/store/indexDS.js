/**
 * @Description: 仓库收货信息维护DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-29 14:04:44
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator } from 'hlos-front/lib/utils/utils';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.warehouseReceive.model';
const { orgInfo } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/business-units`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'businessUnitCode',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitCode`).d('业务实体编码'),
    },
    {
      name: 'businessUnitName',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitName`).d('业务实体名称'),
    },
  ],
  fields: [
    {
      name: 'businessUnitCode',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitCode`).d('业务实体编码'),
      required: true,
    },
    {
      name: 'businessUnitName',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitName`).d('业务实体名称'),
      required: true,
    },
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${preCode}.company`).d('公司'),
      lovCode: orgInfo.company,
      ignore: 'always',
      required: true,
    },
    {
      name: 'companyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'companyNum',
      type: 'string',
      bind: 'companyObj.companyNum',
    },
    {
      name: 'companyName',
      type: 'string',
      bind: 'companyObj.companyName',
    },
    {
      name: 'groupId',
      type: 'string',
      bind: 'companyObj.groupId',
    },
    {
      name: 'groupNum',
      type: 'string',
      bind: 'companyObj.groupNum',
    },
    {
      name: 'addressNum',
      type: 'string',
      label: intl.get(`${commonCode}.addressNum`).d('地点编号'),
      validator: codeValidator,
    },
    {
      name: 'addressName',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitName`).d('地点名称'),
    },
    {
      name: 'fullAddress',
      type: 'string',
      label: intl.get(`${commonCode}.fullAddress`).d('详细地址'),
      // transformResponse: (val, object) => {
      //   console.log('object', object);
      //   return `${object.country || ''}${object.province || ''}${object.city || ''}${object.county || ''}${
      //       object.addressDetail || ''
      //     }`;
      // },
      required: true,
    },
    {
      name: 'country',
      type: 'string',
      label: intl.get(`${commonCode}.businessUnitName`).d('国家'),
    },
    {
      name: 'province',
      type: 'string',
      label: intl.get(`${commonCode}.province`).d('省'),
    },
    {
      name: 'city',
      type: 'string',
      label: intl.get(`${commonCode}.city`).d('市'),
    },
    {
      name: 'county',
      type: 'string',
      label: intl.get(`${commonCode}.county`).d('区/县'),
    },
    {
      name: 'addressDetail',
      type: 'string',
      label: intl.get(`${commonCode}.addressDetail`).d('详细地址'),
    },
    {
      name: 'sourceCode',
      type: 'string',
      label: intl.get(`${commonCode}.sourceCode`).d('系统编码'),
      defaultValue: 'HZERO',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${commonCode}.enabledFlag`).d('状态'),
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
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
