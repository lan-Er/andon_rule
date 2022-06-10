/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-02-18 15:50:16
 */
/*
 * @Description: 转移单平台 DataSet
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-06 13:59:38
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const { lwmsTransferRequest, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lwms.transferRequestPlatform.model';
const commonIntlPrefix = 'lwms.common.model';
const listUrl = `${HLOS_LWMS}/v1/${organizationId}/request-headers/transfer`;

// common fields of queryFields and fields
const getCommonFields = (isQueryFields) => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${commonIntlPrefix}.org`).d('组织'),
    lovCode: common.organization,
    required: true,
  },
  {
    name: 'organizationId',
    type: 'string',
    bind: 'organizationObj.organizationId',
  },
  {
    name: 'organizationName',
    type: 'string',
    ignore: 'always',
    bind: 'organizationObj.organizationName',
  },
  {
    name: 'transferRequestNumObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: lwmsTransferRequest.transferRequestNum,
    label: intl.get(`${intlPrefix}.transferRequestNum`).d('转移单号'),
  },
  {
    name: 'requestNum',
    type: 'string',
    ignore: 'always',
    bind: 'transferRequestNumObj.requestNum',
  },
  {
    name: 'requestId',
    type: 'string',
    bind: 'transferRequestNumObj.requestId',
  },
  {
    name: 'warehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    cascadeMap: { organizationId: 'organizationId' },
    label: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
  },
  {
    name: 'warehouseId',
    type: 'string',
    bind: 'warehouseObj.warehouseId',
  },
  {
    name: 'warehouseName',
    type: 'string',
    ignore: 'always',
    bind: 'warehouseObj.warehouseName',
  },
  {
    name: 'requestStatusList',
    type: 'string',
    multiple: true,
    defaultValue: isQueryFields ? ['NEW', 'RELEASED', 'PICKED', 'EXECUTED'] : [],
    lookupCode: lwmsTransferRequest.transferRequestStatus,
    label: intl.get(`${intlPrefix}.transferRequestStatus`).d('转移单状态'),
  },
  {
    name: 'toOrganizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.organization,
    label: intl.get(`${intlPrefix}.toOrganization`).d('目标组织'),
  },
  {
    name: 'toOrganizationId',
    type: 'string',
    bind: 'toOrganizationObj.organizationId',
  },
  {
    name: 'toOrganizationName',
    type: 'string',
    ignore: 'always',
    bind: 'toOrganizationObj.organizationName',
  },
  {
    name: 'toWarehouseObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.warehouse,
    label: intl.get(`${commonIntlPrefix}.toWarehouse`).d('目标仓库'),
    dynamicProps: {
      lovPara({ record }) {
        if (record.get('toOrganizationObj')) {
          return {
            organizationId: `${record.get('toOrganizationObj').organizationId}`,
          };
        }
      },
    },
  },
  {
    name: 'toWarehouseId',
    type: 'string',
    bind: 'toWarehouseObj.warehouseId',
  },
  {
    name: 'toWarehouseName',
    type: 'string',
    ignore: 'always',
    bind: 'toWarehouseObj.warehouseName',
  },
  {
    name: 'itemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.item,
    label: intl.get(`${commonIntlPrefix}.item`).d('物料'),
  },
  {
    name: 'itemId',
    type: 'string',
    bind: 'itemObj.itemId',
  },
  {
    name: 'itemCode',
    type: 'string',
    bind: 'itemObj.itemCode',
  },
  {
    name: 'requestTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.documentType,
    label: intl.get(`${intlPrefix}.transferRequestType`).d('转移单类型'),
    lovPara: {
      documentClass: 'WM_TRANSFER',
    },
  },
  {
    name: 'requestTypeId',
    type: 'string',
    bind: 'requestTypeObj.documentTypeId',
  },
  {
    name: 'requestTypeCode',
    type: 'string',
    ignore: 'always',
    bind: 'requestTypeObj.documentTypeCode',
  },
  {
    name: 'wmMoveTypeObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.wmMoveType,
    label: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
  },
  {
    name: 'wmMoveTypeName',
    type: 'string',
    ignore: 'always',
    bind: 'wmMoveTypeObj.moveTypeName',
  },
  {
    name: 'wmMoveTypeId',
    type: 'string',
    bind: 'wmMoveTypeObj.moveTypeId',
  },
  {
    name: 'creatorObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    lovCode: common.worker,
    label: intl.get(`${intlPrefix}.creator`).d('制单员工'),
  },
  {
    name: 'creatorId',
    type: 'string',
    bind: 'creatorObj.workerId',
  },
  {
    name: 'creator',
    type: 'string',
    ignore: 'always',
    bind: 'creatorObj.workerName',
  },
  {
    name: 'startCreationDate',
    type: 'date',
    label: intl.get(`${intlPrefix}.greaterThanCreationDate`).d('制单时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('endCreationDate')) {
          return 'endCreationDate';
        }
      },
    },
  },
  {
    name: 'endCreationDate',
    type: 'date',
    label: intl.get(`${intlPrefix}.lessThanCreationDate`).d('制单时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('startCreationDate')) {
          return 'startCreationDate';
        }
      },
    },
  },
];

// 转移单头表DS
const VmiMasterApplyPlatformDS = () => ({
  autoQuery: false,
  queryFields: getCommonFields(true),
  fields: [
    ...getCommonFields(),
    // 以下几个为按需求的拼接字段，仅作展示
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.org`).d('组织'),
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.creationDate`).d('制单时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'executedTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.executedTime`).d('执行时间'),
      format: DEFAULT_DATETIME_FORMAT,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonIntlPrefix}.remark`).d('备注'),
    },
  ],
  events: {},
  transport: {
    read: (config) => {
      return {
        ...config,
        url: listUrl,
        method: 'GET',
        paramsSerializer: (params) => {
          const tmpParams = filterNullValueObject(params);
          const queryParams = new URLSearchParams();
          Object.keys(tmpParams).forEach((key) => {
            queryParams.append(key, tmpParams[key]);
          });
          queryParams.append('requestOperationType', 'TRANSFER');
          return queryParams.toString();
        },
      };
    },
  },
});

export { VmiMasterApplyPlatformDS };
