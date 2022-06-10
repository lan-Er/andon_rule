/*
 * @Descripttion: 生产程序管理DS
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-11 16:57:58
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-16 09:48:44
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { HZERO_HFLE } from 'utils/config';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/programs`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/program-versions`;

const ProgressManageDS = () => ({
  queryFields: [
    {
      name: 'programObj',
      type: 'object',
      label: '生产程序',
      lovCode: 'LMDS.PROGRAM',
      ignore: 'always',
    },
    {
      name: 'programId',
      type: 'string',
      bind: 'programObj.programId',
    },
    {
      name: 'programCode',
      type: 'string',
      bind: 'programObj.programCode',
    },
    {
      name: 'programVersion',
      type: 'string',
      bind: 'programObj.programVersion',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
    },
    { name: 'itemId', type: 'string', bind: 'itemObj.itemId' },
    { name: 'itemCode', type: 'string', bind: 'itemObj.itemCode' },
    { name: 'itemDescription', type: 'string', bind: 'itemObj.description', ignore: 'always' },
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
      name: 'productDescription',
      type: 'string',
      bind: 'productObj.description',
      ignore: 'always',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: '工序',
      lovCode: 'LMDS.OPERATION',
      ignore: 'always',
    },
    { name: 'operationId', type: 'string', bind: 'operationObj.operationId' },
    { name: 'operation', type: 'string', bind: 'operationObj.operationCode' },
    { name: 'operationName', type: 'string', bind: 'operationObj.operationName', ignore: 'always' },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: '物料类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'ITEM_SET' },
    },
    { name: 'itemCategoryId', type: 'string', bind: 'itemCategoryObj.categoryId' },
    { name: 'itemCategoryCode', type: 'string', bind: 'itemCategoryObj.categoryCode' },
    { name: 'itemCategoryName', type: 'string', bind: 'itemCategoryObj.categoryName' },
    {
      name: 'programType',
      label: '程序类型',
      lookupCode: 'LMDS.PROGRAM_TYPE',
    },
    {
      name: 'programCateGoryObj',
      type: 'object',
      label: '程序类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'PROGRAM' },
    },
    { name: 'programCategoryId', type: 'string', bind: 'programCateGoryObj.categoryId' },
    { name: 'programCateGoryCode', type: 'string', bind: 'programCateGoryObj.categoryCode' },
    {
      name: 'programCateGoryName',
      type: 'string',
      bind: 'programCateGoryObj.categoryName',
      ignore: 'always',
    },
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
  ],
  fields: [
    {
      name: 'programType',
      type: 'string',
      label: '程序类型',
    },
    {
      name: 'programCode',
      type: 'string',
      label: '程序编码',
    },
    {
      name: 'programName',
      type: 'string',
      label: '程序名称',
    },
    {
      name: 'programAlias',
      type: 'string',
      label: '程序简称',
    },
    {
      name: 'description',
      type: 'string',
      label: '程序描述',
    },
    {
      name: 'programCategory',
      type: 'string',
      label: '程序类别',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'itemCategory',
      type: 'string',
      label: '物料类别',
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
      name: 'operationName',
      type: 'string',
      label: '工序',
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
      name: 'partyName',
      type: 'string',
      label: '商业伙伴',
    },
    {
      name: 'programLevel',
      type: 'string',
      label: '程序层级',
    },
    {
      name: 'programGroup',
      type: 'string',
      label: '程序分组',
    },
    {
      name: 'relatedProgram',
      type: 'string',
      label: '关联程序',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
    },
    {
      name: 'prodLine',
      type: 'string',
      label: '生产线',
    },
    {
      name: 'equmentName',
      type: 'string',
      label: '设备',
    },
    {
      name: 'auditWorkflow',
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

const ProgressLineDS = () => ({
  fields: [
    {
      name: 'lineNum',
      type: 'number',
      label: '行号',
    },
    {
      name: 'programVersion',
      type: 'string',
      label: '程序版本',
    },
    {
      name: 'description',
      type: 'string',
      label: '版本描述',
    },
    {
      name: 'currentVersionFlag',
      type: 'string',
      label: '最新版本',
    },
    {
      name: 'versionStatusMeaning',
      label: '版本状态',
      // lookupCode: 'LMDS.PROGRAM_VERSION_STATUS',
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: '程序文件',
    },
    {
      name: 'designer',
      type: 'string',
      label: '设计者',
    },
    {
      name: 'auditor',
      type: 'string',
      label: '审核者',
    },
    {
      name: 'auditWorkerFlow',
      type: 'string',
      label: '审核流程',
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
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: lineUrl,
        method: 'GET',
        data,
        // body: params,
      };
    },
  },
});

const ProgressFileDS = () => ({
  autoQuery: false,
  primaryKey: 'fileId',
  selection: false,
  fields: [
    {
      name: 'fileName',
      type: 'string',
      label: '文件名称',
    },
    {
      name: 'realName',
      type: 'string',
      label: '上传人',
    },
    {
      name: 'creationDate',
      type: 'string',
      label: '上传时间',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HZERO_HFLE}/v1/${organizationId}/files/summary`,
        method: 'GET',
        data: { ...data, size: 10 },
      };
    },
  },
});

export { ProgressManageDS, ProgressLineDS, ProgressFileDS };
