/*
 * @Description: 检验判定--DS
 * @Author: zmt
 * @LastEditTime: 2021-05-12 16:13:45
 */

import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
const { common, lmesInspectionJudge } = codeConfig.code;
const queryInspectionUrl = `${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspection-and-judgment`;

export const inspectionQueryDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: common.organization,
      label: '组织',
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
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'inspectionObj',
      type: 'object',
      noCache: true,
      lovCode: lmesInspectionJudge.inspectionDocNum,
      label: '检验单号',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'inspectionDocId',
      type: 'string',
      bind: 'inspectionObj.inspectionDocId',
    },
    {
      name: 'inspectionDocNum',
      type: 'string',
      bind: 'inspectionObj.inspectionDocNum',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      noCache: true,
      lovCode: common.document,
      label: '来源单据号',
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     organizationId: record.get('organizationId'),
      //   }),
      // },
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'documentObj.documentId',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'documentObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'linkDocumentObj',
      type: 'object',
      noCache: true,
      lovCode: common.document,
      label: '关联单据号',
      ignore: 'always',
    },
    {
      name: 'relatedDocId',
      type: 'string',
      bind: 'linkDocumentObj.documentId',
    },
    {
      name: 'operationObj',
      type: 'object',
      noCache: true,
      lovCode: common.operation,
      label: '工序',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'itemObj',
      type: 'object',
      noCache: true,
      lovCode: common.item,
      label: '物料',
      dynamicProps: {
        lovPara: ({ record }) => ({
          meOuId: record.get('organizationId'),
        }),
      },
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
      ignore: 'always',
    },
    {
      name: 'partyObj',
      type: 'object',
      lovCode: common.party,
      label: '供应商',
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
      ignore: 'always',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: '报检人',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'declarerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'declarerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'declarerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: common.prodLine,
      label: '生产线',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'workcellObj',
      type: 'object',
      lovCode: common.workcell,
      label: '工位',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      lovCode: common.equipment,
      label: '设备',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: '仓库',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: '货位',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
      cascadeMap: { warehouseId: 'warehouseId' },
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'createDateMin',
      type: 'dateTime',
      max: 'createDateMax',
      format: 'YYYY-MM-DD HH:mm:ss',
      label: '报检时间>=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'createDateMax',
      type: 'dateTime',
      min: 'createDateMin',
      format: 'YYYY-MM-DD HH:mm:ss',
      label: '报检时间<=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
  ],
  transport: {
    read: ({ params, data }) => {
      let url = queryInspectionUrl;
      if (data.pqcType === 'IQC') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['IQC.NORMAL', 'IQC.NORMAL.ALL'],
        });
      } else if (data.pqcType === 'FIRST') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['PQC.FIRST', 'PQC.FIRST.ALL'],
        });
      } else if (data.pqcType === 'FINISH') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['PQC.FINISH', 'PQC.FINISH.ALL'],
        });
      } else if (data.pqcType === 'FQC') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['FQC.NORMAL', 'FQC.NORMAL.ALL'],
        });
      } else if (data.pqcType === 'ROUTING') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['PQC.ROUTING', 'PQC.ROUTING.ALL'],
        });
      } else if (data.pqcType === 'SQC') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['SQC.NORMAL', 'SQC.NORMAL.ALL'],
        });
      } else if (data.pqcType === 'RQC') {
        url = generateUrlWithGetParam(queryInspectionUrl, {
          inspectionTemplateTypeList: ['RQC.NORMAL', 'RQC.NORMAL.ALL'],
        });
      }
      return {
        url,
        method: 'get',
        params,
      };
    },
  },
});

export const headerJudgeDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'batchQty',
      type: 'number',
    },
    {
      name: 'unQuantity',
      type: 'number',
      required: true,
    },
    {
      name: 'headerRemark',
      type: 'string',
      required: true,
    },
  ],
});

export const sampleDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'sampleNumber',
      type: 'string',
    },
  ],
});
