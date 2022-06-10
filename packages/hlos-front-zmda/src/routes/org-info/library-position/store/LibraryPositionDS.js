/**
 * @Description: 库位DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-09 11:53:29
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { orgInfo } = codeConfig.code;
const commonCode = 'zmda.common.model';
const preCode = 'zmda.libraryPosition.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/inventory-seats`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'inventorySeatCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventorySeatCode`).d('库位编码'),
    },
    {
      name: 'inventorySeatName',
      type: 'string',
      label: intl.get(`${commonCode}.inventorySeatName`).d('库位名称'),
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
      name: 'inventorySeatCode',
      type: 'string',
      label: intl.get(`${commonCode}.inventorySeatCode`).d('库位编码'),
      required: true,
    },
    {
      name: 'inventorySeatName',
      type: 'string',
      label: intl.get(`${commonCode}.inventorySeatName`).d('库位名称'),
      required: true,
    },
    {
      name: 'inventoryHouseObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryHouseObj`).d('库房'),
      lovCode: orgInfo.inventoryHouse,
      ignore: 'always',
      required: true,
    },
    {
      name: 'inventoryHouseId',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryHouseId',
    },
    {
      name: 'inventoryHouseCode',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryHouseCode',
    },
    {
      name: 'inventoryHouseName',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryHouseName',
    },
    {
      name: 'inventoryOrgId',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryOrgId',
    },
    {
      name: 'inventoryOrgCode',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryOrgCode',
    },
    {
      name: 'inventoryOrgName',
      type: 'string',
      bind: 'inventoryHouseObj.inventoryOrgName',
      label: intl.get(`${preCode}.inventoryOrg`).d('库存组织'),
    },
    {
      name: 'businessUnitId',
      type: 'string',
      bind: 'inventoryHouseObj.businessUnitId',
    },
    {
      name: 'businessUnitCode',
      type: 'string',
      bind: 'inventoryHouseObj.businessUnitCode',
    },
    {
      name: 'businessUnitName',
      type: 'string',
      bind: 'inventoryHouseObj.businessUnitName',
      label: intl.get(`${commonCode}.businessUnit`).d('业务实体'),
    },
    {
      name: 'companyId',
      type: 'string',
      bind: 'inventoryHouseObj.companyId',
    },
    {
      name: 'companyNum',
      type: 'string',
      bind: 'inventoryHouseObj.companyNum',
    },
    {
      name: 'groupId',
      type: 'string',
      bind: 'inventoryHouseObj.groupId',
    },
    {
      name: 'groupNum',
      type: 'string',
      bind: 'inventoryHouseObj.groupNum',
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
