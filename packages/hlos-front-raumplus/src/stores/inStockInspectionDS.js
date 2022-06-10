/*
 * @Description: 在库检验DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-04 17:42:54
 */

import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;
const url = `${HLOS_LMESS}/v1/${organizationId}/raumplus/inspection-docs/inspection-doc`;

export const QueryDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: common.organization,
      label: '组织',
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      noCache: true,
      lovCode: common.warehouse,
      label: '仓库',
      cascadeMap: { organizationId: 'organizationId' },
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
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: '货位',
      cascadeMap: { warehouseId: 'warehouseId' },
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
      ignore: 'always',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: '物料',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: '报检人',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'declarerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'declarerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'declarerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'createDateMin',
      type: 'dateTime',
      max: 'createDateMax',
      format: 'YYYY-MM-DD HH:mm:ss',
      label: '报检时间>=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'createDateMax',
      type: 'dateTime',
      min: 'createDateMin',
      format: 'YYYY-MM-DD HH:mm:ss',
      label: '报检时间<=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url,
        method: 'get',
        params: {
          ...params,
          size: 20,
          qcStatusList: 'NEW',
          inspectionDocType: 'WQC',
        },
      };
    },
  },
});

export const pageDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'judgeObj',
      type: 'object',
      lovCode: common.worker,
      label: '判定人',
      dynamicProps: {
        lovPara: ({ record }) => ({
          workerType: 'INSPECTOR',
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'judgeObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'judgeObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'judgeObj.workerName',
    },
    {
      name: 'allChecked',
      type: 'Boolean',
    },
  ],
});
