/*
 * @Description:
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-02 18:26:50
 */
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import { DataSet } from 'choerodon-ui/pro';

const { common } = codeConfig.code;
const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/transfer`;

const headerSearchDSConfig = () => ({
  autoCreate: true,
  pageSize: 12,
  queryFields: [
    {
      name: 'requestNum',
      type: 'string',
    },
    {
      name: 'shipOrderStatus',
      type: 'string',
      defaultValue: 'RELEASED',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        selection: 'single',
        data: [
          { text: '待挑库', value: 'RELEASED' },
          { text: '待转移', value: 'PICKED' },
          { text: '待接收', value: 'EXECUTED' },
        ],
      }),
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      ignore: 'always',
    },
    {
      name: 'creatorId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'documentTypeObj',
      type: 'object',
      lovCode: 'LMDS.DOCUMENT_TYPE',
      lovPara: {
        documentClass: 'WM_TRANSFER',
      },
      ignore: 'always',
    },
    {
      name: 'requestTypeId',
      type: 'string',
      bind: 'documentTypeObj.documentTypeId',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      bind: 'documentTypeObj.documentTypeCode',
      ignore: 'always',
    },
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: 'LMDS.ORGANIZATION',
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
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
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
      lovCode: 'LMDS.WM_AREA',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          warehouseId: record.get('warehouseId'),
        }),
      },
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
      name: 'toWarehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'toWarehouseObj.warehouseCode',
      ignore: 'always',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});

const lineDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
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
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
  ],
});

const warehouseDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
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
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
  ],
});

const modalTableDSConfig = () => ({
  autoQuery: false,
  paging: false,
  selection: 'multiple',
  fields: [
    {
      name: 'tagOrLotNumber', // '标签/批次号
      type: 'string',
    },
    {
      name: 'count',
      type: 'string',
    },
    {
      name: 'expireDate',
      type: 'date',
    },
    {
      name: 'madeDate',
      type: 'date',
    },
    {
      name: 'receivedDate',
      type: 'dateTime',
    },
    {
      name: 'assignedTime',
      type: 'dateTime',
    },
    {
      name: 'wmAreaName',
      type: 'string',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
    },
    {
      name: 'quantity',
      type: 'number',
    },
    {
      name: 'pickedQty',
      type: 'number',
    },
    {
      name: 'applyQty',
      type: 'number',
    },
    {
      name: 'advisedQty',
      type: 'number',
    },
  ],
  transport: {
    read: ({ data }) => {
      let queryUrl = '';
      if (!data.useAdvise) {
        queryUrl =
          data.itemControlType === 'TAG'
            ? `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-tag-thing`
            : `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys`;
      } else {
        queryUrl =
          data.itemControlType === 'TAG'
            ? `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/advise-tags`
            : `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/advise-lots`;
      }
      return {
        url: queryUrl,
        method: 'GET',
        transformResponse: (responseData) => {
          if (!data.useAdvise) {
            const { content, failed, ...otherProps } = JSON.parse(responseData);
            if (failed) {
              return;
            }
            return {
              ...otherProps,
              content: content.map((record) => {
                const { initialQty, quantity } = record;
                return {
                  ...record,
                  // tempQty: initialQty || quantity,
                  applyQty: initialQty || quantity,
                };
              }),
            };
          } else if (
            responseData &&
            JSON.parse(responseData) &&
            JSON.parse(responseData).length > 0
          ) {
            return {
              content: JSON.parse(responseData).map((record) => {
                const { initialQty, quantity } = record;
                return {
                  ...record,
                  // tempQty: initialQty || quantity,
                  applyQty: initialQty || quantity,
                };
              }),
            };
          } else {
            return [];
          }
        },
      };
    },
  },
});

export { headerSearchDSConfig, lineDSConfig, warehouseDSConfig, modalTableDSConfig };
