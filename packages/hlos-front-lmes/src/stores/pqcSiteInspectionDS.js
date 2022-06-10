/*
 * PQC巡检检-DS
 * date: 2020-07-09
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import codeConfig from '@/common/codeConfig';

const { common, lmesPqcSiteInspection } = codeConfig.code;

export const pqcSiteFormDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'inspectionDocNum',
      type: 'string',
      label: '检验单号',
      readOnly: true,
    },
    {
      name: 'inspectionDocId',
      type: 'string',
    },
    {
      name: 'operationObj',
      type: 'object',
      noCache: true,
      lovCode: common.operation,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationCode',
      type: 'string',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operationObj.operationName',
    },
    {
      name: 'itemObj',
      type: 'object',
      noCache: true,
      lovCode: common.item,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      textField: 'description',
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
      name: 'description',
      type: 'string',
      bind: 'itemObj.description',
    },
    {
      name: 'documentType',
      type: 'string',
      lookupCode: lmesPqcSiteInspection.documentType,
      defaultValue: 'MO',
      required: true,
    },
    {
      name: 'taskObj',
      type: 'object',
      ignore: 'always',
      lovCode: lmesPqcSiteInspection.documentTask,
    },
    {
      name: 'documentObj',
      type: 'object',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('documentType') === 'TASK') {
            return {
              organizationId: record.get('organizationId'),
            };
          } else {
            return {
              documentClass: 'MO',
              organizationId: record.get('organizationId'),
            };
          }
        },
        lovCode: ({ record }) => {
          if (record.get('documentType') && record.get('documentType') === 'TASK') {
            return lmesPqcSiteInspection.documentTask;
          } else {
            return common.document;
          }
        },
      },
    },
    {
      name: 'documentId',
      type: 'string',
      bind: 'documentObj.documentId',
    },
    {
      name: 'documentNum',
      type: 'string',
      bind: 'documentObj.documentNum',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      bind: 'documentObj.documentTypeCode',
    },
    {
      name: 'documentTypeId',
      type: 'string',
      bind: 'documentObj.documentTypeId',
    },
    {
      name: 'taskId',
      type: 'string',
      bind: 'documentObj.taskId',
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'documentObj.taskNum',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'documentObj.documentTypeName',
    },
    {
      name: 'operation',
      type: 'string',
      bind: 'documentObj.operation',
    },
    {
      name: 'taskTypeId',
      type: 'string',
      bind: 'documentObj.taskTypeId',
    },
    {
      name: 'taskTypeCode',
      type: 'string',
      bind: 'documentObj.taskTypeCode',
    },
    {
      name: 'tagId',
      type: 'string',
    },
    {
      name: 'tagCode',
      type: 'string',
      required: true,
    },
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          showOrganization: 'Y',
        }),
      },
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      lovCode: common.prodLine,
      ignore: 'always',
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
      name: 'resourceName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      lovCode: common.workcell,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      noCache: true,
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'traceNum',
      type: 'string',
      label: '跟踪号',
    },
    {
      name: 'inspectionGroupObj',
      type: 'object',
      noCache: true,
      label: '检验项目组',
      lovCode: lmesPqcSiteInspection.inspectionGroup,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          inspectionTemplateType: 'PQC.ROUTING',
        }),
      },
      disabled: true,
      required: true,
      ignore: 'always',
    },
    {
      name: 'templateId',
      type: 'string',
      bind: 'inspectionGroupObj.templateId',
    },
    {
      name: 'inspectionGroupName',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionGroupName',
    },
    {
      name: 'inspectionGroupId',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionGroupId',
    },
    // 检验组类型
    {
      name: 'inspectionTemplateType',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionTemplateType',
    },
    {
      name: 'qcResult',
      lookupCode: lmesPqcSiteInspection.qcResult,
      type: 'string',
      label: '判定',
    },
    {
      name: 'sampleQty',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'sampleNumber',
      type: 'string',
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'documentType') {
        record.set('documentObj', null);
      }
    },
  },
});

export const pqcLoginDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'declarerObj',
      type: 'object',
      noCache: true,
      lovCode: common.worker,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          showOrganization: 'Y',
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'declarerId',
      type: 'string',
      bind: 'declarerObj.workerId',
    },
    {
      name: 'declarerCode',
      type: 'string',
      bind: 'declarerObj.workerCode',
    },
    {
      name: 'declarer',
      type: 'string',
      bind: 'declarerObj.workerName',
    },
    {
      name: 'fileUrl',
      type: 'string',
      bind: 'declarerObj.fileUrl',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'declarerObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'declarerObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'declarerObj.organizationName',
      disabled: true,
    },
  ],
});
