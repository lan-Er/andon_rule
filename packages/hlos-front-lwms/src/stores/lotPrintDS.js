/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-23 11:09:12
 */
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'lwms.common.model';

const HeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagType',
      type: 'string',
      // lookupCode: 'LWMS.TAG_PRIMARY_TYPE',
      // label: '打印类型',
      // defaultValue: 'TEMPLATE_TAG',
      // required: true,
      // noCache: true,
    },
    {
      name: 'printModel',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: 'LMDS.TAG_TEMPLATE',
      label: '打印模板',
      required: true,
    },
  ],
  transport: {},
});
const LotPrintDS = () => ({
  queryFields: [
    {
      label: intl.get(`${commonCode}.org`).d('组织'),
      name: 'organizationObj',
      type: 'object',
      ignore: 'always',
      required: true,
      lovCode: common.organization,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'itemObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.item,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      label: intl.get(`${commonCode}.lot`).d('批次'),
      name: 'lotNumber',
      type: 'string',
    },
    {
      name: 'lotStatus',
      type: 'string',
      noCache: true,
      multiple: true,
      lookupCode: 'LWMS.LOT_QC_STATUS',
      label: '批次状态',
    },
    {
      name: 'sourceLotNumberObj',
      type: 'object',
      label: '来源批次',
      noCache: true,
      lovCode: 'LWMS.LOT',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'sourceLotNumber',
      type: 'string',
      bind: 'sourceLotNumberObj.sourceLotNumber',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: '供应商',
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      label: '供应商批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
    {
      name: 'receivedDateStart',
      type: 'date',
      label: '接收日期>=',
      max: 'receivedDateEnd',
    },
    {
      name: 'receivedDateEnd',
      type: 'date',
      label: '接收日期<=',
      min: 'receivedDateStart',
    },
    {
      name: 'expireDateStart',
      type: 'date',
      label: '失效日期>=',
      max: 'expireDateEnd',
    },
    {
      name: 'expireDateEnd',
      type: 'date',
      label: '失效日期<=',
      min: 'expireDateStart',
    },
  ],
  fields: [
    {
      label: '组织',
      name: 'organizationName',
      type: 'string',
    },
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'organization',
      type: 'string',
    },
    {
      name: 'itemId',
      type: 'string',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'itemDescription',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'item',
      transformResponse: (val, object) =>
        `${val || ''} ${object.itemCode || ''} - ${object.itemDescription || ''}`,
    },
    {
      label: '批次',
      name: 'lotNumber',
      type: 'string',
    },
    {
      label: '初始数量',
      name: 'initialQty',
      type: 'number',
      align: 'left',
    },
    {
      name: 'uom',
      type: 'string',
    },
    {
      name: 'uomId',
      type: 'string',
    },
    {
      label: '单位',
      name: 'uomName',
      type: 'string',
    },
    {
      // label: '批次类型',
      name: 'lotType',
      type: 'string',
    },
    {
      label: '批次类型',
      name: 'lotTypeMeaning',
      type: 'string',
    },
    {
      label: '来源批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
    {
      label: '父批次',
      name: 'parentLotNumber',
      type: 'string',
    },
    {
      label: '接收日期',
      name: 'receivedDate',
      type: 'date',
    },
    {
      label: '生产日期',
      name: 'madeDate',
      type: 'date',
    },
    {
      label: '失效日期',
      name: 'expireDate',
      type: 'date',
    },
    {
      label: '供应商',
      name: 'supplier',
      type: 'string',
    },
    {
      label: '供应商批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
    {
      label: '材质',
      name: 'material',
      type: 'string',
    },
    {
      label: '材质供应商',
      name: 'materialSupplier',
      type: 'string',
    },
    {
      label: '材质批次',
      name: 'materialLotNumber',
      type: 'string',
    },
    {
      label: '制造商',
      name: 'manufacturer',
      type: 'string',
    },
    {
      name: 'lotStatus',
      type: 'string',
    },
    {
      label: '批次状态',
      name: 'lotStatusMeaning',
      type: 'string',
    },
    {
      name: 'featureType',
      type: 'string',
    },
    {
      label: '特征值类型',
      name: 'featureTypeMeaning',
      type: 'string',
    },
    {
      label: '特征值',
      name: 'featureValue',
      type: 'string',
    },
    {
      label: '备注',
      name: 'remark',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { lotStatus: lotStatusList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/select-print-lot`,
          {
            lotStatusList,
          }
        ),
        data: {
          ...data,
          lotStatus: undefined,
        },
        method: 'GET',
      };
    },
  },
  events: {},
});
export { HeadDS, LotPrintDS };
