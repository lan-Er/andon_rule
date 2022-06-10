/**
 * @Description: 生产入库执行--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */
import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'lwms.productionWarehousingExecution.model';
const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMS}/v1/${organizationId}/request-headers`;

export const ListDS = () => ({
  pageSize: 12,
  autoCreate: true,
  transport: {
    read: ({ data }) => {
      const { requestStatus: requestStatusList } = data;
      return {
        url: generateUrlWithGetParam(url, {
          requestStatusList,
        }),
        data: {
          ...data,
          requestStatus: undefined,
        },
        method: 'GET',
      };
    },
  },
  queryFields: [
    {
      name: 'organizationId',
    },
    {
      name: 'sortFlag',
      defaultValue: 'Y',
    },
    {
      name: 'requestOperationType',
      defaultValue: 'PRODUCTION',
    },
    {
      name: 'requestStatus',
      defaultValue: ['RELEASED', 'APPROVED'],
    },
    {
      name: 'moObj',
      type: 'object',
      label: intl.get(`${preCode}.mo`).d('MO'),
      lovCode: common.mo,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'moId',
      bind: 'moObj.moId',
    },
    {
      name: 'moNum',
      bind: 'moObj.moNum',
    },

    {
      name: 'requestObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryRequest`).d('入库单号'),
      lovCode: common.document,
      ignore: 'always',
      noCache: true,
      lovPara: {
        documentClass: 'WM_PRODUCTION',
      },
    },
    {
      name: 'requestId',
      bind: 'requestObj.documentId',
    },
    {
      name: 'requestNum',
      bind: 'requestObj.documentNum',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.completeProdLine`).d('完工产线'),
      lovCode: common.prodLine,
      noCache: true,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'createDate',
      type: 'date',
      label: intl.get(`${preCode}.createDate`).d('创建时间'),
    },
  ],
});

export const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.executeWorker`).d('执行员工'),
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'fileUrl',
      bind: 'workerObj.fileUrl',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      ignore: 'always',
      noCache: true,
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

export const LineDS = () => ({
  autoCreate: true,
  transport: {
    read: () => ({
      url: `${HLOS_LWMS}/v1/${organizationId}/request-lines`,
      method: 'GET',
    }),
  },
  fields: [
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});
