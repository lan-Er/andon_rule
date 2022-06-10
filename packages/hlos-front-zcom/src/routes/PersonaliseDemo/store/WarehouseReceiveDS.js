/**
 * @Description: 仓库收货信息维护DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-29 14:04:44
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonCode = 'zmda.common.model';
const preCode = 'zmda.warehouseReceive.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/warehouse-contacts`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${commonCode}.warehouseName`).d('仓库名称'),
    },
  ],
  fields: [
    {
      name: 'wmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
      lovCode: common.wmOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
    },
    {
      name: 'wmOuCode',
      type: 'string',
      bind: 'wmOuObj.wmOuCode',
    },
    {
      name: 'wmOuName',
      type: 'string',
      bind: 'wmOuObj.wmOuName',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'wmOuObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'wmOuObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'wmOuObj.organizationName',
      label: intl.get(`${commonCode}.organization`).d('组织'),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      textField: 'warehouseCode',
      ignore: 'always',
      required: true,
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      label: intl.get(`${commonCode}.warehouseName`).d('仓库名称'),
    },
    {
      name: 'contactName',
      type: 'string',
      label: intl.get(`${preCode}.contactName`).d('收货人姓名'),
      required: true,
    },
    {
      name: 'realName',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('用户真实姓名'),
      required: true,
    },
    {
      name: 'loginName',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('用户名'),
      required: true,
    },
    {
      name: 'phone',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('手机号'),
      required: true,
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get(`${preCode}.realName`).d('邮箱'),
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'string',
      label: intl.get(`${preCode}.contactPhone`).d('收货人电话'),
      required: true,
    },
    {
      name: 'warehouseAddress',
      type: 'string',
      label: intl.get(`${preCode}.warehouseAddress`).d('仓库收货地址'),
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
        url,
        data,
        method: 'GET',
        transformResponse: (value) => {
          const newValue = JSON.parse(value);

          let content;
          if (newValue && !newValue.failed && newValue.content) {
            content = newValue.content.map((item) => ({
              ...item,
              loginName: 'loginName',
              realName: 'realName',
              email: 'email',
              phone: '123456',
            }));
          }
          return { ...newValue, content };
        },
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          tenantId: organizationId,
        },
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
});
