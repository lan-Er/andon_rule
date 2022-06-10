/*
 * @Description: 图片编辑DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-28 18:45:50
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { HZERO_HFLE } from 'utils/config';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getEnvConfig } from 'utils/iocUtils';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/drawings`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/drawing-versions`;

const DrawingEditDS = () => ({
  // autoCreate: true,
  primaryKey: 'drawingId',
  children: {
    lineList: new DataSet({ ...CreateLineDS() }),
  },
  fields: [
    {
      name: 'drawingType',
      label: '图纸类型',
      lookupCode: 'LMDS.DRAWING_TYPE',
      required: true,
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: '图纸编码',
      required: true,
    },
    {
      name: 'drawingName',
      type: 'string',
      label: '图纸名称',
      required: true,
      maxLength: 60,
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
      name: 'drawingCategoryObj',
      type: 'object',
      label: '图纸类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: {
        // categoryClass: 'DRAWING_SET',
        categorySetCode: 'DRAWING_SET',
      },
      ignore: 'always',
    },
    { name: 'drawingCategoryId', type: 'string', bind: 'drawingCategoryObj.categoryId' },
    { name: 'drawingCategoryCode', type: 'string', bind: 'drawingCategoryObj.categoryCode' },
    { name: 'drawingCategoryName', type: 'string', bind: 'drawingCategoryObj.categoryName' },
    {
      name: 'drawingGroup',
      type: 'string',
      label: '图纸分组',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      textField: 'item',
      ignore: 'always',
      lovQueryAxiosConfig: (code, config, { data }) => {
        const { API_HOST } = getEnvConfig();
        let urlPath = `${API_HOST}${HLOS_LMDS}/v1/${organizationId}/lovs/sql/data?lovCode=LMDS.ITEM`;
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
      name: 'item',
      type: 'string',
      bind: 'itemObj.item',
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
      name: 'itemCategoryObj',
      type: 'object',
      label: '物料类别',
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'ITEM_ME' },
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
      lovQueryAxiosConfig: (code, config, { data }) => {
        const { API_HOST } = getEnvConfig();
        let urlPath = `${API_HOST}${HLOS_LMDS}/v1/${organizationId}/lovs/sql/data?lovCode=LMDS.ITEM`;
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
      name: 'productName',
      type: 'string',
      bind: 'productObj.itemName',
    },
    {
      name: 'productDescription',
      type: 'string',
      bind: 'productObj.description',
    },
    {
      name: 'productItem',
      type: 'string',
      bind: 'productObj.item',
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
    { name: 'party', type: 'string', bind: 'supplierObj.party' },
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
      name: 'drawingLevel',
      type: 'string',
      label: '图纸层级',
    },
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
      lovCode: 'HWFP.PROCESS_DOCUMENT',
      ignore: 'always',
      // lovPara: {
      //   tenantId: getCurrentOrganizationId(),
      // },
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
    { name: 'auditWorkflowId', type: 'string', bind: 'examineObj.auditWorkflowId' },
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

    create: ({ data }) => {
      const { relatedDrawing } = data[0];
      const submitData = {
        ...data[0],
        relatedDrawing: relatedDrawing.join(';'),
      };
      return {
        url,
        method: 'POST',
        data: submitData,
      };
    },

    update: ({ data }) => {
      const { relatedDrawing } = data[0];
      const submitData = {
        ...data[0],
        relatedDrawing: relatedDrawing.join(';'),
      };
      return {
        url,
        method: 'PUT',
        data: submitData,
      };
    },
  },
});

const CreateLineDS = () => ({
  autoQuery: false,
  primaryKey: 'drawingId',
  fields: [
    {
      name: 'drawingVersionId',
      type: 'string',
    },
    {
      name: 'drawingVersion',
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
      lookupCode: 'LMDS.DRAWING_VERSION_STATUS',
      required: true,
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

const DrawingFileDS = () => ({
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

export { DrawingEditDS, CreateLineDS, DrawingFileDS };
