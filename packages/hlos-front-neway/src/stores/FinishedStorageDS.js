/**
 * 完工入库单
 * @since：2021/6/2
 * @author：jxy <xiaoyan.jin@hand-china.com>
 * @copyright Copyright (c) 2021,Hand
 */

import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const preCode = 'neway.finishedStorage.model';
const { common, newayLov, newayValue } = codeConfig.code;

const finishedListDS = () => {
  return {
    pageSize: 100,
    queryFields: [
      {
        name: 'organizationLov',
        type: 'object',
        label: intl.get(`${preCode}.meOu`).d('工厂'),
        lovCode: common.meOu,
        required: true,
        ignore: 'always',
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationLov.meOuId',
      },
      {
        name: 'shipInNumLov',
        type: 'object',
        label: intl.get(`${preCode}.requestNum`).d('入库单号'),
        lovCode: newayLov.requestNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'requestId',
        type: 'string',
        bind: 'shipInNumLov.requestId',
        ignore: 'always',
      },
      {
        name: 'requestNum',
        type: 'string',
        bind: 'shipInNumLov.requestNum',
      },
      {
        name: 'moNumLov',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('生产订单'),
        lovCode: common.moNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumLov.moId',
        ignore: 'always',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumLov.moNum',
      },
      {
        name: 'requestStatus',
        type: 'string',
        label: intl.get(`${preCode}.requestStatus`).d('入库单状态'),
        lookupCode: newayValue.requestStatus,
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LWMSS}/v1/${organizationId}/neway-product-wm`,
          data,
          method: 'GET',
        };
      },
    },
  };
};

const detailFormDS = () => ({
  selection: false,
  autoCreate: true,
  paging: false,
  fields: [
    {
      name: 'organizationLov',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationLov.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationLov.meOuCode',
    },
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${preCode}.requestNum`).d('入库单号'),
      disabled: true,
    },
    {
      name: 'requestStatus',
      type: 'string',
      label: intl.get(`${preCode}.requestStatus`).d('入库单状态'),
      lookupCode: newayValue.requestStatus,
      defaultValue: 'NEW',
      disabled: true,
    },
    {
      name: 'moNumLov',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('生产订单'),
      lovCode: common.moNum,
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
      name: 'moId',
      type: 'string',
      bind: 'moNumLov.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moNumLov.moNum',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
      disabled: true,
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      disabled: true,
      ignore: 'always',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('销售订单号'),
      disabled: true,
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocLineNum`).d('销售订单行号'),
      disabled: true,
    },
    {
      name: 'docTypeLov',
      type: 'object',
      label: intl.get(`${preCode}.requestType`).d('入库单类型'),
      required: true,
      lovCode: common.documentType,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          documentClass: 'WM_PRODUCTION',
        }),
      },
    },
    {
      name: 'requestTypeId',
      type: 'string',
      bind: 'docTypeLov.documentTypeId',
    },
    {
      name: 'requestTypeCode',
      type: 'string',
      bind: 'docTypeLov.documentTypeCode',
    },
    {
      name: 'applyQty',
      type: 'number',
      disabled: true,
      label: intl.get(`${preCode}.applyQty`).d('可入库数量'),
    },
    {
      name: 'qty',
      type: 'number',
      label: intl.get(`${preCode}.qty`).d('本次入库数量'),
      required: true,
      step: 1,
      min: 0,
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('序列号'),
      disabled: true,
    },
    {
      name: 'wmName',
      type: 'string',
      label: intl.get(`${preCode}.completedWorkerCenter`).d('完工工位'),
      disabled: true,
    },
    {
      name: 'warehouseLov',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('建议入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'warehouseLov.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'warehouseLov.warehouseCode',
    },
    {
      name: 'wmAreaLov',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('建议入库货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'toWmAreaId',
      type: 'string',
      bind: 'wmAreaLov.wmAreaId',
    },
    {
      name: 'toWmAreaCode',
      type: 'string',
      bind: 'wmAreaLov.wmAreaCode',
    },
  ],
  transport: {
    submit: ({ data }) => {
      return {
        url: `${HLOS_LWMSS}/v1/${organizationId}/neway-product-wm/newayCreateProductWm`,
        data: data[0],
        method: 'POST',
      };
    },
  },
});

export { finishedListDS, detailFormDS };
