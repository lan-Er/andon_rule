/*
 * @Descripttion: 编辑页面DS
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-11 16:58:14
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-03-17 15:14:19
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/programs`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/program-versions`;

const ProgressEditDS = () => ({
  // autoCreate: true,
  primaryKey: 'programId',
  children: {
    programVersionList: new DataSet({ ...CreateLineDS() }),
  },
  fields: [
    {
      name: 'programType',
      type: 'string',
      lookupCode: 'LMDS.PROGRAM_TYPE',
      label: '程序类型',
    },
    {
      name: 'programId',
      type: 'string',
      bind: 'programTypeObj.programId',
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
      name: 'programCategoryObj',
      type: 'object',
      label: '程序类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'PROGRAM' },
    },
    {
      name: 'programCategoryId',
      type: 'string',
      bind: 'programCategoryObj.categoryId',
    },
    {
      name: 'programCategoryCode',
      type: 'string',
      bind: 'programCategoryObj.categoryCode',
    },
    {
      name: 'programCategoryName',
      type: 'string',
      bind: 'programCategoryObj.categoryName',
    },
    {
      name: 'programGroup',
      type: 'string',
      label: '程序分组',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
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
      bind: 'itemObj.description',
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'ITEM_ME' },
      label: '物料类别',
      ignore: 'always',
    },
    {
      name: 'itemCategoryId',
      type: 'string',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'itemCategory',
      type: 'string',
      bind: 'itemCategoryObj.categoryCode',
    },
    {
      name: 'itemCategoryName',
      type: 'string',
      bind: 'itemCategoryObj.categoryName',
    },
    {
      name: 'operationObj',
      type: 'object',
      lovCode: 'LMDS.OPERATION',
      label: '工序',
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operation',
      type: 'string',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operationObj.operationName',
    },
    {
      name: 'productObj',
      type: 'object',
      lovCode: 'LMDS.ITEM',
      label: '产品',
      ignore: 'always',
    },
    {
      name: 'productId',
      type: 'string',
      bind: 'productObj.itemId',
    },
    {
      name: 'productCode',
      type: 'string',
      bind: 'productObj.itemCode',
    },
    {
      name: 'productDescription',
      type: 'string',
      bind: 'productObj.description',
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
      name: 'partyObj',
      type: 'object',
      lovCode: 'LMDS.PARTY',
      label: '商业伙伴',
      ignore: 'always',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
    },
    {
      name: 'partyCode',
      type: 'string',
      bind: 'partyObj.partyCode',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'programLevel',
      type: 'string',
      label: '程序层级',
    },
    // {
    //   name: 'programGroup',
    //   type: 'string',
    //   label: '程序分组',
    // },
    {
      name: 'relatedProgramObj',
      type: 'object',
      lovCode: 'LMDS.PROGRAM',
      label: '关联程序',
      multiple: true,
      ignore: 'always',
    },
    {
      name: 'relatedProgramCode',
      type: 'string',
      bind: 'relatedProgramObj.programCode',
    },
    {
      name: 'relatedProgramId',
      type: 'string',
      bind: 'relatedProgramObj.programId',
    },
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: 'LMDS.ORGANIZATION',
      label: '组织',
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: 'LMDS.PRODLINE',
      label: '生产线',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.prodLineName',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      lovCode: 'LMDS.EQUIPMENT',
      label: '设备',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
    },
    {
      name: 'auditWorkflowObj',
      type: 'object',
      lovCode: 'HWFP.PROCESS_DEFINITION',
      label: '审核流程',
      ignore: 'always',
    },
    {
      name: 'auditWorkflowId',
      type: 'string',
      bind: 'auditWorkflowObj.key',
    },
    {
      name: 'auditWorkflow',
      type: 'string',
      bind: 'auditWorkflowObj.name',
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
      name: 'assignRule',
      type: 'string',
      lookupCode: 'LMDS.PROGRAM_ASSIGN_RULE',
      label: '分配规则',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: '是否有效',
      defauleValue: '1',
      transformRequest: (value) => (value ? '1' : '0'),
      transformResponse: (value) => (value ? '1' : '0'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },

    create: ({ data }) => {
      return {
        url,
        method: 'POST',
        data,
      };
    },

    update: ({ data }) => {
      return {
        url,
        method: 'PUT',
        data,
      };
    },
  },
});

const CreateLineDS = () => ({
  autoQuery: false,
  primaryKey: 'programId',
  selection: false,
  fields: [
    {
      name: 'programVersionId',
      type: 'string',
    },
    {
      name: 'programVersion',
      type: 'string',
      label: '程序版本',
      required: true,
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
      name: 'versionStatus',
      label: '版本状态',
      lookupCode: 'LMDS.PROGRAM_VERSION_STATUS',
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
      name: 'auditWorkerFlowObj',
      type: 'object',
      label: '审核流程',
      lovCode: 'HWFP.PROCESS_DOCUMENT',
      ignore: 'always',
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
      max: 'endDate',
      label: '生效日期',
      required: true,
      defaultValue: moment().format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'endDate',
      type: 'date',
      min: 'startDate',
      label: '失效日期',
    },
    {
      name: 'currentVersionFlag',
      type: 'boolean',
      label: '最新版本',
      defaultValue: true,
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

export { ProgressEditDS, CreateLineDS };
