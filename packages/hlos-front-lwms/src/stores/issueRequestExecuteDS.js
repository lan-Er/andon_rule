/**
 * @Description: 领料执行--捡料ModaltableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-13 14:21:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { DataSet } from 'choerodon-ui/pro';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const commonCode = 'lwms.common.model';

const queryDS = () => {
  return {
    selection: false,
    paging: false,
    queryFields: [
      {
        name: 'organizationId',
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
            { text: '待发出', value: 'PICKED' },
            { text: '待接收', value: 'EXECUTED' },
          ],
        }),
      },
      {
        name: 'requestTypeObj',
        type: 'object',
        lovCode: common.documentType,
        lovPara: {
          documentClass: 'WM_REQUEST',
        },
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
        ignore: 'always',
      },
      {
        name: 'requestTypeId',
        bind: 'requestTypeObj.documentTypeId',
      },
      {
        name: 'requestTypeName',
        bind: 'requestTypeObj.documentTypeName',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${commonCode}.prodLine`).d('申领地点'),
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
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
      },
      {
        name: 'creatorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${commonCode}.worker`).d('制单人'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'creatorId',
        bind: 'creatorObj.workerId',
      },
      {
        name: 'creatorName',
        bind: 'creatorObj.workerName',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/request-headers/issue/execute`,
          method: 'GET',
        };
      },
    },
  };
};

// const LineDS = () => ({
//   autoCreate: true,
//   fields: [
//     {
//       name: 'organizationId',
//     },
//     {
//       name: 'warehouseObj',
//       type: 'object',
//       lovCode: common.warehouse,
//       ignore: 'always',
//       required: true,
//       dynamicProps: {
//         lovPara: ({ record }) => ({
//           organizationId: record.get('organizationId'),
//         }),
//       },
//     },
//     {
//       name: 'warehouseId',
//       bind: 'warehouseObj.warehouseId',
//     },
//     {
//       name: 'warehouseName',
//       bind: 'warehouseObj.warehouseName',
//     },
//     {
//       name: 'wmAreaObj',
//       type: 'object',
//       lovCode: common.wmArea,
//       ignore: 'always',
//       cascadeMap: { warehouseId: 'warehouseId' },
//     },
//     {
//       name: 'wmAreaId',
//       bind: 'wmAreaObj.wmAreaId',
//     },
//     {
//       name: 'wmAreaName',
//       bind: 'wmAreaObj.wmAreaName',
//       ignore: 'always',
//     },
//   ],
//   events: {
//     update: ({ name, record }) => {
//       if (name === 'warehouseObj') {
//         record.set('wmAreaObj', null);
//       }
//     },
//   },
// });

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
            ? `${HLOS_LWMS}/v1/${organizationId}/tag-things/item-tag-thing`
            : `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`;
      } else {
        queryUrl =
          data.itemControlType === 'TAG'
            ? `${HLOS_LWMS}/v1/${organizationId}/tag-things/advise-tags`
            : `${HLOS_LWMS}/v1/${organizationId}/lots/advise-lots`;
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

export { queryDS, modalTableDSConfig };
