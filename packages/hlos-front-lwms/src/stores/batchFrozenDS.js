/*
 * @Description: 批次冻结DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-13 14:12:04
 */
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/freeze-lot-query-pc`;
const lineUrl = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/freeze-lot-query-detail-pc`;

const BatchFrozenDS = () => ({
  selection: 'multiple',
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      required: true,
      lovCode: 'LMDS.ORGANIZATION',
      label: '组织',
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: 'LMDS.ITEM',
      label: '物料',
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'lotObj',
      type: 'object',
      lovCode: 'LWMS.LOT',
      ignore: 'always',
      label: '批次',
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'lotStatus',
      type: 'string',
      label: '批次状态',
      lookupCode: 'LWMS.LOT_QC_STATUS',
    },
    {
      name: 'sourceLotObj',
      type: 'object',
      lovCode: 'LWMS.LOT',
      ignore: 'always',
      label: '来源批次',
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'sourceLotNumber',
      type: 'string',
      bind: 'sourceLotObj.lotNumber',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: '供应商',
      lovCode: 'LMDS.SUPPLIER',
      ignore: 'always',
    },
    {
      name: 'supplierId',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'supplierLotNumber',
      label: '供应商批次',
      type: 'string',
    },
    {
      name: 'receivedDateLeft',
      type: 'dateTime',
      label: '接收日期>=',
      max: 'receivedDateRight',
      transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT}`) : ''),
    },
    {
      name: 'receivedDateRight',
      type: 'dateTime',
      label: '接收日期<=',
      min: 'receivedDateLeft',
      transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT}`) : ''),
    },
    {
      name: 'expireDateLeft',
      type: 'dateTime',
      label: '失效日期>=',
      max: 'expireDateRight',
      transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT}`) : ''),
    },
    {
      name: 'expireDateRight',
      type: 'dateTime',
      label: '失效日期<=',
      min: 'expireDateLeft',
      transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT}`) : ''),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      required: true,
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
    },
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: 'LMDS.ITEM',
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
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料',
      bind: 'itemObj.description',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'initialQty',
      type: 'number',
      label: '初始数量',
    },
    {
      name: 'uom',
      type: 'string',
      label: '单位',
    },
    {
      name: 'lotTypeMeaning',
      type: 'string',
      label: '批次类型',
    },
    {
      name: 'lotStatusMeaning',
      type: 'string',
      label: '批次状态',
    },
    {
      name: 'sourceLotNumber',
      type: 'string',
      label: '来源批次',
    },
    {
      name: 'parentLotNumber',
      type: 'string',
      label: '父批次',
    },
    {
      name: 'receivedDate',
      type: 'string',
      label: '接收日期',
    },
    {
      name: 'madeDate',
      type: 'string',
      label: '生产日期',
    },
    {
      name: 'expireDate',
      type: 'string',
      label: '失效日期',
    },
    {
      name: 'supplierName',
      type: 'string',
      label: '供应商',
    },
    {
      name: 'supplierLotNumber',
      type: 'string',
      label: '供应商批次',
    },
    {
      name: 'material',
      type: 'string',
      label: '材质',
    },
    {
      name: 'materialSupplier',
      type: 'string',
      label: '材料供应商',
    },
    {
      name: 'materialLotNumber',
      type: 'string',
      label: '材料批次',
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: '制造商',
    },
    {
      name: 'featureType',
      type: 'string',
      label: '特征值类型',
    },
    {
      name: 'featureValue',
      type: 'string',
      label: '特征值',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url,
        method: 'GET',
        params,
      };
    },
  },
});

const lineTableDS = () => ({
  fields: [
    {
      name: 'organizationName',
      label: '组织',
      type: 'string',
    },
    {
      name: 'itemCode',
      label: '物料',
      type: 'string',
    },
    {
      name: 'lotNumber',
      label: '批次',
      type: 'string',
    },
    {
      name: 'itemDescription',
      label: '物料描述',
      type: 'string',
    },
    {
      name: 'onhandQty',
      label: '现有量',
      type: 'number',
    },
    {
      name: 'uomName',
      label: '单位',
      type: 'string',
    },
    {
      name: 'warehouseName',
      label: '仓库',
      type: 'string',
    },
    {
      name: 'wmAreaName',
      label: '货位',
      type: 'string',
    },
    {
      name: 'wmUnit',
      label: '货格',
      type: 'string',
    },
    {
      name: 'receivedDate',
      label: '接收日期',
      type: 'string',
    },
    {
      name: 'expireDate',
      label: '失效日期',
      type: 'string',
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: lineUrl,
        method: 'GET',
        params,
      };
    },
  },
});

export { BatchFrozenDS, lineTableDS };
