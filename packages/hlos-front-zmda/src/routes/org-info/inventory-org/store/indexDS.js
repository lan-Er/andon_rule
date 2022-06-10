/**
 * @Description: 组织信息库存组织
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
const organizationId = getCurrentOrganizationId(); // DELETE /v1/{organizationId}/inventory-orgs
const url = `${HLOS_ZMDA}/v1/${organizationId}/inventory-orgs`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'inventoryOrgCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryOrgCode`).d('库存组织编码'),
    },
    {
      name: 'inventoryOrgName',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryOrgName`).d('库存组织名称'),
    },
    {
      name: 'businessUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.businessUnitObj`).d('业务实体'),
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
      name: 'inventoryOrgCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryOrgCode`).d('库存组织编码'),
      required: true,
    },
    {
      name: 'inventoryOrgName',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryOrgName`).d('库存组织名称'),
      required: true,
    },
    {
      name: 'businessUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.businessUnitObj`).d('业务实体'),
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
