/*
 * @Description: 图片编辑DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-22 14:02:14
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { HZERO_HFLE } from 'utils/config';
import { getEnvConfig } from 'utils/iocUtils';

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/esops`;
const lineUrl = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/esop-versions`;

const EsopEditDS = () => ({
  // autoCreate: true,
  primaryKey: 'esopId',
  children: {
    esopVersionList: new DataSet({ ...CreateLineDS() }),
  },
  fields: [
    {
      name: 'esopType',
      label: 'ESOP类型',
      lookupCode: 'LMDS.ESOP_TYPE',
      required: true,
    },
    {
      name: 'esopCode',
      type: 'string',
      label: 'ESOP编码',
      required: true,
    },
    {
      name: 'esopName',
      type: 'string',
      label: 'ESOP名称',
      required: true,
    },
    {
      name: 'esopAlias',
      type: 'string',
      label: 'ESOP简称',
    },
    {
      name: 'description',
      type: 'string',
      label: 'ESOP描述',
    },
    {
      name: 'esopGroup',
      type: 'string',
      label: 'ESOP分组',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      textField: 'item',
      ignore: 'always',
      lovQueryAxiosConfig: (code, config, { dataSet, params, data }) => {
        console.log(code, config, { dataSet, params, data });
        const { API_HOST } = getEnvConfig();
        let urlPath = `${API_HOST}${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/lovs/sql/data?lovCode=LMDS.ITEM`;
        if (data.item) {
          urlPath += `&itemCode=${data.item}`;
        }
        return {
          url: urlPath,
          method: 'GET',
          transformResponse: (res, headers) => {
            const queryData = JSON.parse(res).content;
            const newData = [];
            queryData.forEach((i) => {
              newData.push({
                ...i,
                textField: i.item,
              });
            });
            return {
              content: newData,
              headers,
            };
          },
        };
      },
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
      name: 'operationObj',
      type: 'object',
      label: '工序',
      lovCode: 'LMDS.OPERATION',
      ignore: 'always',
    },
    { name: 'operationId', type: 'string', bind: 'operationObj.operationId' },
    { name: 'operation', type: 'string', bind: 'operationObj.operationCode' },
    { name: 'operationName', type: 'string', bind: 'operationObj.operationName' },
    {
      name: 'esopCategoryObj',
      type: 'object',
      label: 'ESOP类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: {
        categorySetCode: 'ESOP_SET',
      },
      ignore: 'always',
    },
    { name: 'esopCategoryId', type: 'string', bind: 'esopCategoryObj.categoryId' },
    { name: 'esopCategory', type: 'string', bind: 'esopCategoryObj.categoryCode' },
    { name: 'esopCategoryName', type: 'string', bind: 'esopCategoryObj.categoryName' },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: '物料类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'ITEM_SET' },
      ignore: 'always',
    },
    { name: 'itemCategoryId', type: 'string', bind: 'itemCategoryObj.categoryId' },
    { name: 'itemCategory', type: 'string', bind: 'itemCategoryObj.categoryCode' },
    { name: 'itemCategoryName', type: 'string', bind: 'itemCategoryObj.categoryName' },
    {
      name: 'productObj',
      type: 'object',
      label: '产品',
      lovCode: 'LMDS.ITEM',
      textField: 'item',
      ignore: 'always',
      lovQueryAxiosConfig: (code, config, { dataSet, params, data }) => {
        console.log(code, config, { dataSet, params, data });
        const { API_HOST } = getEnvConfig();
        let urlPath = `${API_HOST}${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/lovs/sql/data?lovCode=LMDS.ITEM`;
        if (data.item) {
          urlPath += `&itemCode=${data.item}`;
        }
        return {
          url: urlPath,
          method: 'GET',
          transformResponse: (res, headers) => {
            const queryData = JSON.parse(res).content;
            const newData = [];
            queryData.forEach((i) => {
              newData.push({
                ...i,
                textField: i.item,
              });
            });
            return {
              content: newData,
              headers,
            };
          },
        };
      },
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
      label: '项目',
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: 'WBS号',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: '商业伙伴',
      lovCode: 'LMDS.PARTY',
      textField: 'party',
      ignore: 'always',
    },
    { name: 'partyId', type: 'string', bind: 'supplierObj.partyId' },
    { name: 'partyNumber', type: 'string', bind: 'supplierObj.partyNumber' },
    { name: 'partyName', type: 'string', bind: 'supplierObj.partyName' },
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      ignore: 'always',
    },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.organizationId' },
    { name: 'organizationCode', type: 'string', bind: 'organizationObj.organizationCode' },
    { name: 'organizationName', type: 'string', bind: 'organizationObj.organizationName' },
    {
      name: 'esopLevel',
      type: 'string',
      label: 'ESOP层级',
    },
    {
      name: 'esopObj',
      type: 'object',
      label: '关联ESOP',
      lovCode: 'LMDS.ESOP',
      ignore: 'always',
      multiple: true,
    },
    { name: 'relatedEsop', type: 'string', bind: 'esopObj.esopCode' },
    {
      name: 'drawingObj',
      type: 'object',
      label: '关联图纸',
      lovCode: 'LMDS.DRAWING',
      ignore: 'always',
      multiple: true,
    },
    { name: 'relatedDrawing', type: 'string', bind: 'drawingObj.drawingCode' },
    {
      name: 'externalId',
      type: 'string',
      label: '外部ID',
    },
    {
      name: 'externalNum',
      type: 'string',
      label: '外部编码',
    },
    {
      name: 'examineObj',
      type: 'object',
      label: '审核流程',
      lovCode: 'HWFP.PROCESS_DEFINITION',
      ignore: 'always',
      lovPara: {
        tenantId: getCurrentOrganizationId(),
      },
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('auditWorkflowFlag')) {
            return true;
          } else {
            return false;
          }
        },
        disabled: ({ record }) => {
          if (record.get('auditWorkflowFlag')) {
            return false;
          } else {
            return true;
          }
        },
      },
    },
    { name: 'auditWorkflowId', type: 'string', bind: 'examineObj.category' },
    { name: 'auditWorkflowCode', type: 'string', bind: 'examineObj.key' },
    { name: 'auditWorkflowName', type: 'string', bind: 'examineObj.name' },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: '是否有效',
      defaultValue: true,
    },
    {
      name: 'auditWorkflowFlag',
      label: '是否启用审批流',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },

    submit: ({ data }) => {
      const { relatedEsop, relatedDrawing } = data[0];
      const submitData = {
        ...data[0],
        relatedEsop: relatedEsop.join(';'),
        relatedDrawing: relatedDrawing.join(';'),
      };
      return {
        url,
        method: 'POST',
        data: submitData,
      };
    },

    // update: ({ data }) => {
    //   const { relatedEsop, relatedDrawing } = data[0];
    //   const submitData = {
    //     ...data[0],
    //     relatedEsop: relatedEsop.join(';'),
    //     relatedDrawing: relatedDrawing.join(';'),
    //   };
    //   console.log(relatedEsop, relatedDrawing);
    //   console.log(data);
    //   return {
    //     url,
    //     method: 'POST',
    //     data: submitData,
    //   };
    // },
  },
});

const CreateLineDS = () => ({
  autoQuery: false,
  primaryKey: 'esopId',
  fields: [
    {
      name: 'esopVersionId',
      type: 'string',
    },
    {
      name: 'esopVersion',
      type: 'string',
      label: '图纸版本',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      label: '版本描述',
    },
    {
      name: 'versionStatus',
      label: '版本状态',
      lookupCode: 'LMDS.ESOP_VERSION_STATUS',
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: 'ESOP文件',
    },
    {
      name: 'designer',
      type: 'string',
      label: '设计者',
    },
    {
      name: 'auditWorkerFlowObj',
      type: 'object',
      label: '审核流程编号',
      lovCode: 'HWFP.PROCESS_DOCUMENT',
      ignore: 'always',
      textField: 'auditWorkflowId',
    },
    { name: 'auditWorkflowId', type: 'string', bind: 'auditWorkerFlowObj.auditWorkflowId' },
    {
      name: 'approver',
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

const EsopFileDS = () => ({
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
        url: `${HZERO_HFLE}/v1/${getCurrentOrganizationId()}/files/summary`,
        method: 'GET',
        data: { ...data, size: 10 },
      };
    },
  },
});
export { EsopEditDS, CreateLineDS, EsopFileDS };
