/**
 * @Description: 车间管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
// import { getEnvConfig } from 'utils/iocUtils';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.meArea.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/me-areas`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'meAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.meArea`).d('车间'),
    },
    {
      name: 'meAreaName',
      type: 'string',
      label: intl.get(`${preCode}.meAreaName`).d('车间名称'),
    },
  ],
  fields: [
    {
      name: 'meAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.meArea`).d('车间'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'meAreaName',
      type: 'intl',
      label: intl.get(`${preCode}.meAreaName`).d('车间名称'),
      required: true,
    },
    {
      name: 'meAreaAlias',
      type: 'intl',
      label: intl.get(`${preCode}.meAreaAlias`).d('车间简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.meAreaDesc`).d('车间描述'),
      validator: descValidator,
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOu',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'issueWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'issueWarehouseId',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseId',
    },
    {
      name: 'issueWarehouseCode',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseCode',
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseName',
    },
    {
      name: 'issueWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'issueWarehouseId' },
      // dynamicProps: {
      //   lovQueryAxiosConfig: ({ record }) => {
      //     const { API_HOST } = getEnvConfig();
      //     let url = `${API_HOST}${HLOS_LMDS}/v1/lovs/sql/data?lovCode=${common.wmArea}`;
      //     if(record.get('issueWarehouseId')){
      //       url += `&warehouseId=${record.get('issueWarehouseId')}`
      //     }
      //     return {
      //       url,
      //       method: 'GET',
      //     };
      //   },
      // },
    },
    {
      name: 'issueWmAreaId',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaId',
    },
    {
      name: 'issueWmAreaCode',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaCode',
    },
    {
      name: 'issueWmArea',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaName',
    },
    {
      name: 'completeWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'completeWarehouseId',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseId',
    },
    {
      name: 'completeWarehouseCode',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseCode',
    },
    {
      name: 'completeWarehouse',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseName',
    },
    {
      name: 'completeWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'completeWarehouseId' },
    },
    {
      name: 'completeWmAreaId',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaId',
    },
    {
      name: 'completeWmAreaCode',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaCode',
    },
    {
      name: 'completeWmArea',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaName',
    },
    {
      name: 'inventoryWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseName',
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'inventoryWarehouseId' },
    },
    {
      name: 'inventoryWmAreaId',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaId',
    },
    {
      name: 'inventoryWmAreaCode',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaCode',
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaName',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get('lmds.common.model.location').d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${commonCode}.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'meArea', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
