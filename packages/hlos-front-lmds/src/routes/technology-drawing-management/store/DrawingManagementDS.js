/*
 * @Description: 图纸管理DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-02-04 11:24:10
 */
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/drawings`;
const lineUrl = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/drawing-versions`;

const DrawingManagementDS = () => ({
  queryFields: [
    {
      name: 'drawingObj',
      type: 'object',
      label: '图纸',
      // required: true,
      lovCode: 'LMDS.DRAWING',
      ignore: 'always',
    },
    { name: 'drawingId', type: 'string', bind: 'drawingObj.drawingId' },
    { name: 'drawingCode', type: 'string', bind: 'drawingObj.drawingCode' },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
    },
    { name: 'itemId', type: 'string', bind: 'itemObj.itemId' },
    { name: 'itemCode', type: 'string', bind: 'itemObj.itemCode' },
    { name: 'description', type: 'string', bind: 'itemObj.description', ignore: 'always' },
    {
      name: 'productObj',
      type: 'object',
      label: '产品',
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
    },
    { name: 'productId', type: 'string', bind: 'productObj.itemId' },
    { name: 'productCode', type: 'string', bind: 'productObj.itemCode' },
    {
      name: 'operationObj',
      type: 'object',
      label: '工序',
      lovCode: 'LMDS.OPERATION',
      ignore: 'always',
    },
    { name: 'operationId', type: 'string', bind: 'operationObj.operationId' },
    { name: 'operation', type: 'string', bind: 'operationObj.operationCode', ignore: 'always' },
    { name: 'operationName', type: 'string', bind: 'operationObj.operationName', ignore: 'always' },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: '物料类别',
      lovCode: 'LMDS.CATEGORY',
      lovPara: { categorySetCode: 'ITEM_SET' },
    },
    { name: 'itemCategoryId', type: 'string', bind: 'itemCategoryObj.categoryId' },
    { name: 'itemCategoryCode', type: 'string', bind: 'itemCategoryObj.categoryCode' },
    { name: 'itemCategoryName', type: 'string', bind: 'itemCategoryObj.categoryName' },
    {
      name: 'drawingType',
      label: '图纸类型',
      lookupCode: 'LMDS.DRAWING_TYPE',
    },
    {
      name: 'drawingCategoryObj',
      type: 'object',
      label: '图纸类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'DRAWING_SET' },
    },
    { name: 'drawingCategoryId', type: 'string', bind: 'drawingCategoryObj.categoryId' },
    { name: 'drawingCategoryCode', type: 'string', bind: 'drawingCategoryObj.categoryCode' },
    { name: 'drawingCategoryName', type: 'string', bind: 'drawingCategoryObj.categoryName' },
    {
      name: 'supplierObj',
      type: 'object',
      label: '商业伙伴',
      lovCode: 'LMDS.PARTY',
      ignore: 'always',
    },
    { name: 'partyId', type: 'string', bind: 'supplierObj.partyId' },
    { name: 'partyNumber', type: 'string', bind: 'supplierObj.partyNumber' },
    { name: 'partyName', type: 'string', bind: 'supplierObj.partyName', ignore: 'always' },
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      ignore: 'always',
    },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.organizationId' },
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
      name: 'projectNum',
      type: 'string',
      label: '项目',
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: 'WBS',
    },
    {
      name: 'externalNum',
      type: 'string',
      label: '外部编码',
    },
    {
      name: 'creatorObj',
      type: 'object',
      label: '创建人',
      lovCode: common.user,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'creator',
      bind: 'creatorObj.realName',
    },
    {
      name: 'createdBy',
      bind: 'creatorObj.id',
    },
    {
      name: 'creationDateFrom',
      type: 'dateTime',
      label: '创建日期从',
      max: 'creationDateTo',
    },
    {
      name: 'creationDateTo',
      type: 'dateTime',
      label: '创建日期至',
      min: 'creationDateFrom',
    },
    {
      name: 'lastUpdateManObj',
      type: 'object',
      label: '上次更新人',
      lovCode: common.user,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'lastUpdateMan',
      bind: 'lastUpdateManObj.realName',
    },
    {
      name: 'lastUpdatedBy',
      bind: 'lastUpdateManObj.id',
    },
    {
      name: 'lastUpdateDateFrom',
      type: 'dateTime',
      label: '上次更新日期从',
      max: 'lastUpdateDateTo',
    },
    {
      name: 'lastUpdateDateTo',
      type: 'dateTime',
      label: '上次更新日期至',
      min: 'lastUpdateDateFrom',
    },
  ],
  fields: [
    {
      name: 'drawingVersionId',
      type: 'string',
    },
    {
      name: 'drawingVersion',
      type: 'string',
    },
    {
      name: 'drawingTypeMeaning',
      type: 'string',
      label: '图纸类型',
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: '图纸编码',
    },
    {
      name: 'drawingName',
      type: 'string',
      label: '图纸名称',
    },
    {
      name: 'drawingAlias',
      type: 'string',
      label: '图纸简称',
    },
    {
      name: 'description',
      type: 'string',
      label: '图纸描述',
    },
    {
      name: 'drawingCategoryName',
      type: 'string',
      label: '图纸类别',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemCategoryName',
      type: 'string',
      label: '物料类别',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'productCode',
      type: 'string',
      label: '产品',
    },
    {
      name: 'productDescription',
      type: 'string',
      label: '产品描述',
    },
    {
      name: 'operation',
      type: 'string',
      label: '工序',
    },
    {
      name: 'operationName',
      type: 'string',
      label: '工序名称',
    },
    {
      name: 'projectNum',
      type: 'string',
      label: '项目号',
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: 'WBS号',
    },
    {
      name: 'partyNumber',
      type: 'string',
      label: '商业伙伴',
    },
    {
      name: 'partyName',
      type: 'string',
      label: '商业伙伴名称',
    },
    {
      name: 'drawingLevel',
      type: 'string',
      label: '图纸层级',
    },
    {
      name: 'drawingGroup',
      type: 'string',
      label: '图纸分组',
    },
    {
      name: 'relatedDrawing',
      type: 'string',
      label: '关联图纸',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
    },
    {
      name: 'workflowTemplate',
      type: 'string',
      label: '审核流程',
    },
    {
      name: 'assignRule',
      type: 'string',
      label: '分配规则',
    },
    {
      name: 'externalId',
      type: 'string',
      label: '外部ID',
    },
    {
      name: 'externalNum',
      type: 'string',
      label: '外部编号',
    },
    {
      name: 'creator',
      type: 'string',
      label: '创建人',
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: '创建日期',
    },
    {
      name: 'lastUpdateMan',
      type: 'string',
      label: '上次更新人',
    },
    {
      name: 'lastUpdateDate',
      type: 'dateTime',
      label: '上次更新日期',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: '是否有效',
      transformResponse: (value) => (value ? '是' : '否'),
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});

const DrawingManagementLineDS = () => ({
  fields: [
    {
      name: 'lineNum',
      type: 'string',
      label: '行号',
    },
    {
      name: 'drawingVersion',
      type: 'string',
      label: '图纸版本',
    },
    {
      name: 'description',
      type: 'string',
      label: '版本描述',
    },
    {
      name: 'versionStatusMeaning',
      type: 'string',
      label: '版本状态',
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: '图纸文件',
    },
    {
      name: 'designer',
      type: 'string',
      label: '设计者',
    },
    {
      name: 'auditWorkerFlow',
      type: 'string',
      label: '审核流程',
    },
    {
      name: 'auditor',
      type: 'string',
      label: '审核人',
    },
    {
      name: 'issuedDate',
      type: 'date',
      label: '签发日期',
    },
    {
      name: 'startDate',
      type: 'date',
      label: '生效日期',
    },
    {
      name: 'endDate',
      type: 'date',
      label: '失效日期',
    },
    {
      name: 'currentVersionFlag',
      type: 'boolean',
      label: '最新版本',
    },
    {
      name: 'creator',
      type: 'string',
      label: '创建人',
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: '创建日期',
    },
    {
      name: 'lastUpdateMan',
      type: 'string',
      label: '上次更新人',
    },
    {
      name: 'lastUpdateDate',
      type: 'dateTime',
      label: '上次更新日期',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: lineUrl,
        method: 'GET',
        data: { ...data, size: 100 },
      };
    },
  },
});

export { DrawingManagementDS, DrawingManagementLineDS };
