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
const { orgInfo } = codeConfig.code;
const organizationId = getCurrentOrganizationId(); // PUT /v1/{organizationId}/inventory-houses
const url = `${HLOS_ZMDA}/v1/${organizationId}/inventory-houses`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'inventoryHouseCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryHouseCode`).d('库房编码'),
    },
    {
      name: 'inventoryHouseName',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryHouseName`).d('库房名称'),
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
      name: 'inventoryHouseCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryHouseCode`).d('库房编码'),
      required: true,
    },
    {
      name: 'inventoryHouseName',
      type: 'string',
      label: intl.get(`${commonCode}.inventoryHouseName`).d('库房名称'),
      required: true,
    },
    {
      name: 'inventoryOrgObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryOrgObj`).d('库存组织'),
      lovCode: orgInfo.inventoryOrg,
      ignore: 'always',
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
      name: 'businessUnitName',
      type: 'string',
      bind: 'inventoryOrgObj.businessUnitName',
      label: intl.get(`${commonCode}.sourceCode`).d('业务实体'),
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
    // {
    //   name: 'businessUnitName',
    //   type: 'string',
    //   label: intl.get(`${commonCode}.sourceCode`).d('业务实体'),
    // },
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
