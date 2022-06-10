/*
 * @Description: 工厂管理信息--meOuListDs
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-07 19:32:48
 * @LastEditors: Please set LastEditors
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

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/me-ous`;
const intlPrefix = 'lmds.meOu';

export default () => ({
  selection: false,
  autoQuery: true,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'meOu', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => ({
      url,
      method: 'get',
    }),
    create: () => ({
      url,
      method: 'post',
    }),
    submit: () => ({
      url,
      method: 'put',
    }),
  },
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'meOuCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.model.meOu`).d('工厂'),
      order: 'asc',
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'meOuId',
      type: 'string',
    },
    {
      name: 'meOuName',
      type: 'intl',
      required: true,
      label: intl.get(`${intlPrefix}.model.meOuName`).d('工厂名称'),
    },
    {
      name: 'meOuAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.meOuAlias`).d('工厂简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.meOuDesc`).d('工厂描述'),
      validator: descValidator,
    },
    {
      name: 'enterpriseObj',
      type: 'object',
      lovCode: common.enterprise,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.model.enterprise`).d('集团'),
      required: true,
    },
    {
      name: 'enterpriseId',
      type: 'string',
      bind: 'enterpriseObj.enterpriseId',
    },
    {
      name: 'enterpriseCode',
      type: 'string',
      bind: 'enterpriseObj.enterpriseCode',
    },
    {
      name: 'enterprise',
      type: 'string',
      bind: 'enterpriseObj.enterpriseName',
    },
    {
      name: 'apsOuObj',
      type: 'object',
      dynamicProps: {
        lovCode: ({ record }) => {
          return record.get('enterpriseObj') ? common.apsOu : null;
        },
        textField: () => 'apsOuName',
        valueField: () => 'apsOuId',
        lovPara: ({ record }) => {
          const enterpriseId = record.get('enterpriseId');
          if (enterpriseId) {
            return { enterpriseId };
          }
        },
      },
      label: intl.get(`${intlPrefix}.model.apsOu`).d('计划中心'),
      required: true,
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
    },
    {
      name: 'apsOuCode',
      type: 'string',
      bind: 'apsOuObj.apsOuCode',
    },
    {
      name: 'apsOu',
      type: 'string',
      bind: 'apsOuObj.apsOuName',
    },
    {
      name: 'scmOuObj',
      type: 'object',
      dynamicProps: {
        lovCode: ({ record }) => {
          return record.get('enterpriseObj') ? common.scmOu : null;
        },
        textField: () => 'scmOuName',
        valueField: () => 'scmOuId',
        lovPara: ({ record }) => {
          const enterpriseId = record.get('enterpriseId');
          if (enterpriseId) {
            return { enterpriseId };
          }
        },
      },
      label: intl.get(`${intlPrefix}.model.scmOu`).d('采购中心'),
      required: true,
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
    },
    {
      name: 'scmOuCode',
      type: 'string',
      bind: 'scmOuObj.scmOuCode',
    },
    {
      name: 'scmOu',
      type: 'string',
      bind: 'scmOuObj.scmOuName',
    },
    {
      name: 'sopOuObj',
      type: 'object',
      dynamicProps: {
        lovCode: ({ record }) => {
          return record.get('enterpriseObj') ? common.sopOu : null;
        },
        textField: () => 'sopOuName',
        valueField: () => 'sopOuId',
        lovPara: ({ record }) => {
          const enterpriseId = record.get('enterpriseId');
          if (enterpriseId) {
            return { enterpriseId };
          }
        },
      },
      label: intl.get(`${intlPrefix}.model.sopOu`).d('销售中心'),
      required: true,
    },
    {
      name: 'sopOuId',
      type: 'string',
      bind: 'sopOuObj.sopOuId',
    },
    {
      name: 'sopOuCode',
      type: 'string',
      bind: 'sopOuObj.sopOuCode',
    },
    {
      name: 'sopOu',
      type: 'string',
      bind: 'sopOuObj.sopOuName',
    },
    {
      name: 'issueWarehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.model.issueWm`).d('默认发料仓库'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
      noCache: true,
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
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.model.issueWmArea`).d('默认发料仓储区域'),
      ignore: 'always',
      noCache: true,
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
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.model.completeWm`).d('默认完工仓库'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
      noCache: true,
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
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.model.completeWmArea`).d('默认完工仓储区域'),
      ignore: 'always',
      noCache: true,
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
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.model.invWm`).d('默认入库仓库'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseName',
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${intlPrefix}.model.invWmArea`).d('默认入库仓储区域'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'inventoryWmAreaId',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaId',
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaName',
    },
    {
      name: 'locationObj',
      type: 'object',
      lovCode: common.location,
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
      lovPara: { tenantId: organizationId },
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
      label: intl.get(`${intlPrefix}.model.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      defaultValue: true,
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
      // trueValue: 'Y',
      // falseValue: 'N'
    },
  ],
  queryFields: [
    { name: 'meOuCode', type: 'string', label: intl.get(`${intlPrefix}.model.meOu`).d('工厂') },
    {
      name: 'meOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.meOuName`).d('工厂名称'),
    },
  ],
  events: {
    // indexChange: ({ record }) =>
    //   record && console.log('indexChange', record),
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
