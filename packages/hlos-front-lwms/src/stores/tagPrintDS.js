/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-22 14:50:31
 */
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lwmsTag } = codeConfig.code;
const preCode = 'lwms.tag.model';
const commonCode = 'lwms.common.model';

const loadOptionData = [
  { text: '是', value: 1 },
  { text: '否', value: 0 },
];
const printedFlagData = [
  { text: '是', value: true },
  { text: '否', value: false },
];
const loadOptionDs = new DataSet({
  data: loadOptionData,
  selection: 'single',
});
const printedFlagDs = new DataSet({
  data: printedFlagData,
  selection: 'single',
});
const HeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagType',
      type: 'string',
      lookupCode: 'LWMS.TAG_PRIMARY_TYPE',
      label: '标签大类',
      defaultValue: 'TEMPLATE_TAG',
      required: true,
      noCache: true,
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
const ItemTagDS = () => ({
  pageSize: 100,
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
      name: 'wmsOrganizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'item',
      type: 'object',
      ignore: 'always',
      lovCode: common.item,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      label: intl.get(`${commonCode}.lot`).d('批次'),
      name: 'lotNumberObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.lot,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('wmsOrganizationId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotNumberObj.lotNumber',
    },
    {
      name: 'tagType',
      type: 'string',
      noCache: true,
      multiple: true,
      lookupCode: 'LWMS.TAG_TYPE',
      label: '类型',
    },
    {
      label: '类别',
      name: 'tagCategoryObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: {
        categorySetCode: 'TAG',
      },
    },
    {
      name: 'tagCategoryId',
      type: 'string',
      bind: 'tagCategoryObj.categoryId',
    },
    {
      name: 'elatedDocTypeObj',
      type: 'object',
      label: '关联单据类型',
      lovCode: common.documentType,
      ignore: 'always',
    },
    {
      label: '关联单据',
      name: 'documentNum',
      type: 'string',
    },
    {
      name: 'madeDateLeft',
      type: 'date',
      label: '生产日期>=',
      max: 'madeDateRight',
    },
    {
      name: 'madeDateRight',
      type: 'date',
      label: '生产日期<=',
      min: 'madeDateLeft',
    },
    {
      name: 'expireDateLeft',
      type: 'date',
      label: '失效日期>=',
      max: 'expireDateRight',
    },
    {
      name: 'expireDateRight',
      type: 'date',
      label: '失效日期<=',
      min: 'expireDateLeft',
    },
    {
      name: 'creationDateLeft',
      type: 'dateTime',
      label: '创建时间>=',
      max: 'creationDateRight',
    },
    {
      name: 'creationDateRight',
      type: 'dateTime',
      label: '创建时间<=',
      min: 'creationDateLeft',
    },
    {
      name: 'qcStatusList',
      type: 'string',
      label: intl.get(`${preCode}.qcStatus`).d('质量状态'),
      lookupCode: lwmsTag.qcStatus,
    },
    {
      label: '是否装载',
      name: 'loadThingFlag',
      type: 'number',
      textField: 'text',
      valueField: 'value',
      options: loadOptionDs,
    },
    {
      name: 'documentTypeId',
      type: 'string',
      bind: 'elatedDocTypeObj.documentTypeId',
    },
    {
      label: '打印标识',
      name: 'printedFlag',
      type: 'number',
      textField: 'text',
      valueField: 'value',
      options: printedFlagDs,
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
      name: 'supplierCategoryObj',
      type: 'object',
      label: '供应商分类',
      noCache: true,
      lovCode: 'LMDS.CATEGORIES',
      ignore: 'always',
      lovPara: {
        categorySetCode: 'SUPPLIER',
      },
    },
    {
      name: 'supplierCategoryId',
      type: 'string',
      bind: 'supplierCategoryObj.categoryId',
    },
    {
      label: '供应商批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
    {
      label: '创建人',
      name: 'createdByName',
      type: 'string',
    },
    {
      label: '采购订单',
      name: 'poNum',
      type: 'string',
    },
  ],
  fields: [
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'item',
      transformResponse: (val, object) =>
        `${val || ''} ${object.itemCode || ''} - ${object.itemDescription || ''}`,
    },
    {
      label: '数量',
      name: 'quantity',
      type: 'number',
      align: 'left',
    },
    {
      label: '单位',
      name: 'uomName',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.lot`).d('批次'),
      name: 'lotNumber',
      type: 'string',
    },
    {
      label: '是否装载',
      name: 'loadThingFlag',
    },
    // add
    {
      label: '关联单据类型',
      name: 'documentTypeName',
      type: 'string',
    },
    {
      label: '关联单据',
      name: 'documentNum',
      type: 'string',
    },
    {
      label: '位置',
      name: 'location',
      type: 'string',
    },
    {
      label: '工序',
      name: 'operation',
      type: 'string',
    },
    {
      label: '资源',
      name: 'resource',
      type: 'string',
    },
    {
      label: '所有者',
      name: 'owner',
      type: 'string',
    },
    {
      label: '特征值',
      name: 'featureValue',
      type: 'string',
    },
    {
      label: '项目号',
      name: 'projectNum',
      type: 'string',
    },
    {
      label: '来源编号',
      name: 'sourceNum',
      type: 'string',
    },
    {
      // label: '质量状态',
      name: 'qcStatus',
      type: 'string',
    },
    {
      label: '质量状态',
      name: 'qcStatusMeaning',
      type: 'string',
    },
    {
      label: '生产日期',
      name: 'madeDate',
      type: 'date',
    },
    {
      label: '接收日期',
      name: 'receiveDate',
      type: 'date',
    },
    {
      label: '赋值日期',
      name: 'assignedTime',
      type: 'date',
    },
    {
      label: '失效日期',
      name: 'expireDate',
      type: 'date',
    },
    {
      label: intl.get(`${commonCode}.org`).d('组织'),
      name: 'organizationName',
      type: 'string',
    },
    {
      // label: '标签类型',
      name: 'tagType',
      type: 'string',
    },
    {
      label: '标签类型',
      name: 'tagTypeMeaning',
      type: 'string',
    },
    {
      label: '标签类别',
      name: 'tagCategoryName',
      type: 'string',
    },
    {
      name: 'tagStatus',
      type: 'string',
    },
    {
      label: '标签状态',
      name: 'tagStatusMeaning',
      type: 'string',
    },
    {
      label: '打印标识',
      name: 'printedFlag',
      type: 'number',
    },
    {
      label: '打印日期',
      name: 'printedDate',
      type: 'date',
    },
    {
      label: '创建时间',
      name: 'creationDate',
      type: 'dateTime',
    },
    {
      label: '创建人',
      name: 'createdByName',
      type: 'string',
    },
    {
      label: '供应商分类',
      name: 'supplierCategory',
      type: 'string',
    },
    {
      label: '供应商批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
    {
      name: 'supplierName',
      type: 'string',
      label: '供应商',
    },
    {
      name: 'supplierCategoryName',
      type: 'string',
      label: '供应商分类',
    },
    {
      label: '供应商批次',
      name: 'supplierLotNumber',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { tagType: tagTypeList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/print`,
          {
            tagTypeList,
          }
        ),
        data: {
          ...data,
          tagType: undefined,
        },
        method: 'GET',
      };
    },
  },
  events: {},
});
const ContainerTagDS = () => ({
  pageSize: 100,
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
      name: 'wmsOrganizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: '容器类型',
      name: 'containerType',
      type: 'string',
      ignore: 'always',
      lookupCode: 'LMDS.CONTAINER_TAG',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'tagType',
      type: 'object',
      noCache: true,
      ignore: 'always',
      multiple: true,
      lookupCode: 'LWMS.TAG_TYPE',
      label: '类型',
    },
    {
      label: '类别',
      name: 'tagCategoryObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: {
        CATEGORY_SET: 'TAG',
      },
    },
    {
      name: 'tagCategoryId',
      type: 'string',
      bind: 'tagCategoryObj.categoryId',
    },
    {
      label: '是否装载',
      name: 'loadThingFlag',
      type: 'number',
    },
    {
      label: '关联单据',
      name: 'documentNum',
      type: 'string',
    },
    {
      name: 'madeDateLeft',
      type: 'date',
      label: '生产日期>=',
      max: 'madeDateRight',
    },
    {
      name: 'madeDateRight',
      type: 'date',
      label: '生产日期<=',
      min: 'madeDateLeft',
    },
    {
      name: 'expireDateLeft',
      type: 'date',
      label: '失效日期>=',
      max: 'expireDateRight',
    },
    {
      name: 'expireDateRight',
      type: 'date',
      label: '失效日期<=',
      min: 'expireDateLeft',
    },
  ],
  fields: [
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: '容器',
      name: 'container',
      type: 'string',
      // transformResponse: (val, object) => `${val || ''} ${object.itemCode || ''} - ${object.itemDescription || ''}`,
    },
    {
      label: '容器类型',
      name: 'containerType',
      type: 'number',
    },
    {
      label: '容器所有者',
      name: 'containerOwner',
      type: 'string',
    },
    {
      label: '是否装载',
      name: 'loadThingFlag',
    },
    {
      label: '关联单据类型',
      name: 'documentTypeName',
      type: 'string',
    },
    {
      label: '关联单据',
      name: 'documentNum',
      type: 'string',
    },
    {
      label: '位置',
      name: 'location',
      type: 'string',
      // warehouseName、wmAreaName、wmUnitCode
      // bind: `loadThingFlag`,
    },
    {
      label: '工序',
      name: 'operation',
      type: 'string',
    },
    {
      label: '资源',
      name: 'resource',
      type: 'string',
    },
    {
      label: '所有者',
      name: 'owner',
      type: 'string',
    },
    {
      label: '特征值',
      name: 'featureValue',
      type: 'string',
    },
    {
      label: '项目号',
      name: 'projectNum',
      type: 'string',
    },
    {
      label: '来源编号',
      name: 'sourceNum',
      type: 'string',
    },
    {
      label: '质量状态',
      name: 'qcStatus',
      type: 'string',
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
      label: intl.get(`${commonCode}.org`).d('组织'),
      name: 'organizationName',
      type: 'string',
    },
    {
      label: '标签类型',
      name: 'tagType',
      type: 'string',
    },
    {
      label: '标签类别',
      name: 'tagTypeMeaning',
      type: 'string',
    },
    {
      name: 'tagStatus',
      type: 'string',
    },
    {
      label: '状态',
      name: 'tagStatusMeaning',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { tagType: tagTypeList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/print`,
          {
            tagTypeList,
            tagType: undefined,
          }
        ),
        data: {
          ...data,
        },
        method: 'GET',
      };
    },
  },
  events: {},
});
const ModalDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'boxPrintObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: 'LWMS.OUTER_TAG_REPORT',
      label: '模板编码',
      textField: 'templateName',
      required: true,
    },
    {
      name: 'boxPrintId',
      type: 'string',
      bind: 'boxPrintObj.templateId',
    },
    {
      name: 'boxPrintCode',
      type: 'string',
      bind: 'boxPrintObj.templateCode',
    },
    {
      name: 'boxPrintName',
      type: 'string',
      bind: 'boxPrintObj.templateName',
    },
  ],
  transport: {},
});
export { HeadDS, ItemTagDS, ContainerTagDS, ModalDS };
