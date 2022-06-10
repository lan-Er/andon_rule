/*
 * @Description: 发货执行DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-10 15:34:28
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { DataSet } from 'choerodon-ui/pro';

const { common, lwmsDeliveryExecution } = codeConfig.code;
const intlPrefix = 'lwms.deliveryExecution.model';

const headerSearchDSConfig = () => {
  return {
    autoCreate: true,
    fields: [
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
          ],
        }),
      },
      {
        name: 'shipOrderNum',
        type: 'string',
      },
      {
        name: 'organizationId',
        type: 'string',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.customer`).d('客户'),
        lovCode: common.customer,
        textField: 'customerName',
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'sellerObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.seller`).d('销售员'),
        lovCode: common.worker,
        lovPara: { workerType: 'SALESMAN' },
        ignore: 'always',
      },
      {
        name: 'salesmanId',
        type: 'string',
        bind: 'sellerObj.workerId',
      },
      {
        name: 'workerCode',
        type: 'string',
        bind: 'sellerObj.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'sellerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        lovCode: common.documentType,
        lovPara: { documentClass: 'WM_SHIP_ORDER' },
        label: intl.get(`${intlPrefix}.documentType`).d('单据类型'),
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'documentTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        lovCode: common.warehouse,
        ignore: 'always',
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
    ],
  };
};

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
      let url = '';
      if (!data.useAdvise) {
        url =
          data.itemControlType === 'TAG'
            ? `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-tag-thing`
            : `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys`;
      } else {
        url =
          data.itemControlType === 'TAG'
            ? `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/advise-tags`
            : `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/advise-lots`;
      }
      return {
        url,
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
          } else if (JSON.parse(responseData) && JSON.parse(responseData).length > 0) {
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

const shipOrderInfoDSConfig = () => ({
  fields: [
    {
      name: 'shipTicket',
      type: 'string',
    },
    {
      name: 'shippingMethod',
      type: 'string',
      lookupCode: lwmsDeliveryExecution.shippingMethod,
    },
    {
      name: 'carrier',
      type: 'string',
    },
    {
      name: 'shippedDate',
      type: 'date',
    },
  ],
});

const shipLineSearchDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
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
  ],
});

const shipLineDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
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
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     warehouseId: record.get('warehouseId'),
      //     // organizationId: record.get('organizationId'),
      //   }),
      // },
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
});

export {
  headerSearchDSConfig,
  modalTableDSConfig,
  shipOrderInfoDSConfig,
  shipLineDSConfig,
  shipLineSearchDSConfig,
};
