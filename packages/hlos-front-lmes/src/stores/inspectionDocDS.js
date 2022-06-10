/**
 * @Description: 检验单平台--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:06:22
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesInspectionDoc } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lsop.inspectionDoc.model';
const commonCode = 'lsop.common.model';

const InspectionDocQueryDS = () => {
  return {
    selection: false,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'inspectionDocObj',
        type: 'object',
        label: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
        lovCode: lmesInspectionDoc.inspectionDocNum,
        cascadeMap: { organizationId: 'organizationId' },
        ignore: 'always',
      },
      {
        name: 'inspectionDocId',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocId',
      },
      {
        name: 'inspectionDocNum',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocNum',
      },
      {
        name: 'inspectionTemplateType',
        type: 'string',
        lookupCode: lmesInspectionDoc.inspectionTemplateType,
        label: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
        multiple: true,
      },
      {
        name: 'qcStatus',
        type: 'string',
        lookupCode: lmesInspectionDoc.qcStatus,
        label: intl.get(`${preCode}.qcStatus`).d('检验单状态'),
        multiple: true,
        defaultValue: ['NEW', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
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
        ignore: 'always',
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get(`${commonCode}.resource`).d('资源'),
        lovCode: common.resource,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceName',
        type: 'string',
        bind: 'resourceObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${commonCode}.party`).d('商业实体'),
        lovCode: common.party,
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
        name: 'relatedDocumentObj',
        type: 'object',
        label: intl.get(`${commonCode}.relatedDocument`).d('关联单据号'),
        lovCode: 'LMDS.DOCUMENT',
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'relatedDocId',
        type: 'string',
        bind: 'relatedDocumentObj.documentId',
      },
      {
        name: 'relatedDocTypeId',
        type: 'string',
        bind: 'relatedDocumentObj.documentTypeId',
        ignore: 'always',
      },
      {
        name: 'relatedDocNum',
        type: 'string',
        bind: 'relatedDocumentObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get(`${commonCode}.operation`).d('工序'),
        lovCode: 'LMDS.OPERATION',
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
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
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        lovCode: 'LMDS.PRODLINE',
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
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: 'LMDS.EQUIPMENT',
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
        ignore: 'always',
      },
      {
        name: 'qcResult',
        type: 'string',
        lookupCode: lmesInspectionDoc.qcResult,
        label: intl.get(`${preCode}.qcResult`).d('判定结果'),
      },
      {
        name: 'samplingType',
        type: 'string',
        lookupCode: lmesInspectionDoc.samplingType,
        label: intl.get(`${preCode}.samplingType`).d('抽样类型'),
      },
      {
        name: 'declarerObj',
        type: 'object',
        label: intl.get(`${preCode}.declarer`).d('报检员'),
        lovCode: common.worker,
        // lovPara: { workerType: 'DECLARER' },
        ignore: 'always',
      },
      {
        name: 'declarerId',
        type: 'string',
        bind: 'declarerObj.workerId',
      },
      {
        name: 'declarerName',
        type: 'string',
        bind: 'declarerObj.workerName',
      },
      {
        name: 'inspectorObj',
        type: 'object',
        label: intl.get(`${preCode}.inspector`).d('判定员'),
        lovCode: common.worker,
        lovPara: { workerType: 'INSPECTOR' },
        ignore: 'always',
      },
      {
        name: 'inspectorId',
        type: 'string',
        bind: 'inspectorObj.workerId',
      },
      {
        name: 'inspectorName',
        type: 'string',
        bind: 'inspectorObj.workerName',
      },
      {
        name: 'createDateMin',
        type: 'time',
        label: intl.get(`${preCode}.createDateMin`).d('报检时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('createDateMax')) {
              return 'createDateMax';
            }
          },
        },
      },
      {
        name: 'createDateMax',
        type: 'time',
        label: intl.get(`${preCode}.createDateMax`).d('报检时间<='),
        min: 'createDateMin',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
      {
        name: 'judgedDateMin',
        type: 'time',
        label: intl.get(`${preCode}.judgedDateMin`).d('判定时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('judgedDateMax')) {
              return 'judgedDateMax';
            }
          },
        },
      },
      {
        name: 'judgedDateMax',
        type: 'time',
        label: intl.get(`${preCode}.judgedDateMax`).d('判定时间<='),
        min: 'judgedDateMin',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
    ],
  };
};
const InspectionDocListDS = () => {
  return {
    selection: 'multiple',
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
        // transformResponse: (object) => {
        //   return `${object.organizationCode}` + ' ' + `${object.organizationName}`
        // }
      },
      {
        name: 'inspectionDocNum',
        label: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
      },
      {
        name: 'inspectionTemplateTypeMeaning',
        label: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
      },
      {
        name: 'qcStatusMeaning',
        label: intl.get(`${preCode}.qcStatus`).d('状态'),
      },
      {
        name: 'qcResultMeaning',
        label: intl.get(`${preCode}.qcResult`).d('判定结果'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.物料`).d('物料'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'operationName',
        label: intl.get(`${preCode}.operationName`).d('工序'),
      },
      {
        name: 'samplingTypeMeaning',
        label: intl.get(`${preCode}.samplingTypeMeaning`).d('抽样类型'),
      },
      {
        name: 'inspectionDocGroup',
        label: intl.get(`${preCode}.inspectionDocGroup`).d('检验单组'),
      },
      {
        name: 'inspectionGroupCode',
      },
      {
        name: 'inspectionGroupName',
        label: intl.get(`${preCode}.inspectionGroup`).d('检验项目组'),
        // transformResponse: (value, object) => {
        //   return `${object.inspectionGroupCode || ''}` + ' ' + `${value}`
        // }
      },
      {
        name: 'batchQty',
        label: intl.get(`${preCode}.batchQty`).d('报检数量'),
      },
      {
        name: 'secondBatchQty',
        label: intl.get(`${preCode}.secondBatchQty`).d('辅助单位数量'),
      },
      {
        name: 'sampleQty',
        label: intl.get(`${preCode}.sampleQty`).d('样品数量'),
      },
      {
        name: 'sourceDocClassMeaning',
        label: intl.get(`${preCode}.sourceDocClassMeaning`).d('来源单据大类'),
      },
      {
        name: 'sourceDocTypeName',
        label: intl.get(`${preCode}.sourceDocTypeName`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'relatedDocTypeName',
        label: intl.get(`${preCode}.relatedDocTypeName`).d('关联单据类型'),
      },
      {
        name: 'relatedDocNumAndLineNum',
        label: intl.get(`${preCode}.relatedDocNumAndLineNum`).d('关联单据号'),
      },
      {
        name: 'party',
        label: intl.get(`${commonCode}.party`).d('商业实体'),
      },
      {
        name: 'itemControlTypeMeaning',
        label: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${commonCode}.party`).d('标签号'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${commonCode}.party`).d('批次号'),
      },
      {
        name: 'resource',
        label: intl.get(`${commonCode}.resource`).d('资源'),
        // transformResponse: (object) => {
        //   return `${object.resourceCode}` + ' ' + `${object.resourceName}`
        // }
      },
      {
        name: 'resourceName',
      },
      {
        name: 'resourceCode',
      },
      {
        name: 'relatedResource',
        label: intl.get(`${commonCode}.relatedResource`).d('关联资源'),
        // transformResponse: (object) => {
        //   return `${object.relatedResourceCode}` + ' ' + `${object.resourceName}`
        // }
      },
      {
        name: 'relatedResourceCode',
      },
      {
        name: 'prodLineName',
        label: '生产线',
      },
      {
        name: 'workcellName',
        label: '工位',
      },
      {
        name: 'equipmentName',
        label: '设备',
      },
      {
        name: 'locationName',
        label: '位置',
      },
      {
        name: 'workerName',
        label: '员工',
      },
      {
        name: 'workGroupName',
        label: intl.get(`${commonCode}.party`).d('班组'),
      },
      {
        name: 'supervisorName',
        label: intl.get(`${commonCode}.supervisor`).d('管理员工'),
      },
      {
        name: 'calendarDay',
        label: intl.get(`${commonCode}.calendarDay`).d('工作日期'),
        transformResponse: (val) => {
          return `${val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''}`;
        },
      },
      {
        name: 'calendarShiftCodeMeaning',
        label: intl.get(`${commonCode}.calendarShiftCodeMeaning`).d('班次'),
      },
      {
        name: 'firstInspectionFlag',
        label: intl.get(`${commonCode}.firstInspectionFlag`).d('首次检验'),
      },
      {
        name: 'inspectionDegreeMeaning',
        label: intl.get(`${commonCode}.inspectionDegreeMeaning`).d('校验等级'),
      },
      {
        name: 'priority',
        label: intl.get(`${commonCode}.priority`).d('优先级'),
      },
      {
        name: 'pictures',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
      {
        name: 'processPictures',
        label: intl.get(`${preCode}.processPictures`).d('处理图片'),
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.remark`).d('备注'),
      },
      {
        name: 'docProcessRuleName',
        label: intl.get(`${preCode}.docProcessRuleName`).d('处理规则'),
      },
      {
        name: 'autoFeedbackResult',
        label: intl.get(`${preCode}.autoFeedbackResult`).d('是否反馈'),
      },
      {
        name: 'feedbackFlag',
        label: intl.get(`${preCode}.feedbackFlag`).d('反馈标识'),
      },
      {
        name: 'samplingStandardMeaning',
        label: intl.get(`${preCode}.samplingStandardMeaning`).d('抽样标准'),
      },
      {
        name: 'sampleJudgeModeMeaning',
        label: intl.get(`${preCode}.sampleJudgeModeMeaning`).d('样品判定模式'),
      },
      {
        name: 'autoJudgeFlag',
        label: intl.get(`${preCode}.autoJudgeFlag`).d('是否自动判定'),
      },
      {
        name: 'aqlAcceptQty',
        label: intl.get(`${preCode}.aqlAcceptQty`).d('AQL接受数量'),
      },
      {
        name: 'aqlRejectQty',
        label: intl.get(`${preCode}.aqlRejectQty`).d('AQL拒绝数量'),
      },
      {
        name: 'referenceDocument',
        label: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
      },
      {
        name: 'instruction',
        label: intl.get(`${preCode}.instruction`).d('操作说明'),
      },
      {
        name: 'drawingCode',
        label: intl.get(`${preCode}.drawingCode`).d('图纸'),
      },
      {
        name: 'traceNum',
        label: '跟踪号',
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'sampleQty',
        label: intl.get(`${preCode}.sampleQty`).d('抽样数量'),
      },
      {
        name: 'sampleOkQty',
        label: intl.get(`${preCode}.sampleOkQty`).d('抽样合格'),
      },
      {
        name: 'sampleNgQty',
        label: intl.get(`${preCode}.sampleNgQty`).d('抽样不合格'),
      },
      {
        name: 'declarerName',
        label: intl.get(`${preCode}.declarer`).d('报检员'),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}.createDate`).d('报检时间'),
      },
      {
        name: 'inspectorName',
        label: intl.get(`${preCode}.inspector`).d('判定员'),
      },
      {
        name: 'qcRemark',
        label: intl.get(`${preCode}.qcRemark`).d('判定备注'),
      },
      {
        name: 'reinspectorName',
        label: intl.get(`${preCode}.reinspector`).d('复检员'),
      },
      {
        name: 'reinspectionResultMeaning',
        label: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
      },
      {
        name: 'rejudgeDate',
        label: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
      },
      {
        name: 'ngProcessedFlag',
        label: intl.get(`${preCode}.ngProcessedFlag`).d('不合格品处理'),
      },
      {
        name: 'processDocNumAndLineNum',
        label: intl.get(`${preCode}.processDocNumAndLineNum`).d('处理单号'),
      },
      {
        name: 'processedDate',
        label: intl.get(`${preCode}.processedDate`).d('处理完成时间'),
      },
      {
        name: 'processorName',
        label: intl.get(`${preCode}.processorName`).d('处理人'),
      },
      {
        name: 'concessionQty',
        label: '让步接收数量',
      },
      {
        name: 'returnedQty',
        label: '退回数量',
      },
      {
        name: 'reworkQty',
        label: '返修数量',
      },
      {
        name: 'scrappedQty',
        label: '报废数量',
      },
      {
        name: 'processedOkQty',
        label: '处理合格',
      },
      {
        name: 'ngInventoryQty',
        label: '不合格入库',
      },
      {
        name: 'processResultMeaning',
        label: intl.get(`${preCode}.processResultMeaning`).d('处理结果'),
      },
      {
        name: 'processRemark',
        label: '处理备注',
      },
      {
        name: 'planStartTime',
        label: intl.get(`${preCode}.planStartTime`).d('计划开始'),
      },
      {
        name: 'planEndTime',
        label: intl.get(`${preCode}.planEndTime`).d('计划结束'),
      },
      {
        name: 'standardInspectTime',
        label: intl.get(`${preCode}.standardInspectTime`).d('标准时长'),
      },
      {
        name: 'startDate',
        label: intl.get(`${preCode}.startDate`).d('开始时间'),
      },
      {
        name: 'judgedDate',
        label: intl.get(`${preCode}.judgedDate`).d('判定时间'),
      },
      {
        name: 'inspectedTime',
        label: intl.get(`${preCode}.inspectedTime`).d('实际时长'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { qcStatus: qcStatusList, inspectionTemplateType: inspectionTemplateTypeList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspectionDoc`,
            {
              qcStatusList,
              inspectionTemplateTypeList,
            }
          ),
          data: {
            ...data,
            qcStatus: undefined,
            inspectionTemplateType: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

// 行 样本
const InspectionDocLineSampleDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      // 样本标签
      {
        name: 'sampleNumber',
        label: intl.get(`${preCode}.sampleNumber`).d('样本编码'),
      },
      {
        name: 'inspectionItem',
        label: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
      },
      {
        name: 'inspectionItemAlias',
        label: intl.get(`${preCode}.inspectionItemAlias`).d('检验项目简称'),
      },
      {
        name: 'inspectionItemDescription',
        label: intl.get(`${preCode}.inspectionItemDescription`).d('检验项目描述'),
      },
      {
        name: 'resultTypeMeaning',
        label: intl.get(`${preCode}.resultTypeMeaning`).d('结果类型'),
      },
      {
        name: 'inspectionResource',
        label: intl.get(`${preCode}.inspectionResource`).d('检验设备'),
      },
      {
        name: 'qcResultMeaning',
        label: intl.get(`${preCode}.qcResult`).d('判定结果'),
      },
      {
        name: 'qcValue',
        label: intl.get(`${preCode}.qcValue`).d('检验值'),
      },
      {
        name: 'ucl',
        label: intl.get(`${preCode}.ucl`).d('默认上限'),
      },
      {
        name: 'uclAccept',
        label: intl.get(`${preCode}.uclAccept`).d('包含默认上限值'),
      },
      {
        name: 'lcl',
        label: intl.get(`${preCode}.lcl`).d('默认下限'),
      },
      {
        name: 'lclAccept',
        label: intl.get(`${preCode}.lclAccept`).d('包含默认下限值'),
      },
      {
        name: 'referenceValue',
        label: intl.get(`${preCode}.referenceValue`).d('参考值'),
      },
      {
        name: 'valueUomName',
        label: intl.get(`${preCode}.valueUomName`).d('单位'),
      },
      {
        name: 'standardTypeMeaning',
        label: intl.get(`${preCode}.standardTypeMeaning`).d('标准类型'),
      },
      {
        name: 'standardValue',
        label: intl.get(`${preCode}.standardValue`).d('标准值'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'inspectorName',
        label: intl.get(`${preCode}.inspector`).d('判定员'),
      },
      {
        name: 'lastInspectedDate',
        label: intl.get(`${preCode}.lastInspectedDate`).d('最后检验时间'),
      },
      {
        name: 'reinspectionValue',
        label: intl.get(`${preCode}.reinspectionValue`).d('复检值'),
      },
      {
        name: 'reinspectionResultMeaning',
        label: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
      },
      {
        name: 'reinspectorName',
        label: intl.get(`${preCode}.reinspector`).d('复检员'),
      },
      {
        name: 'lastRejudgeDate',
        label: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
      },
      {
        name: 'necessaryFlag',
        label: intl.get(`${preCode}.necessaryFlag`).d('是否必输'),
      },
      {
        name: 'orderByCode',
        label: intl.get(`${preCode}.orderByCode`).d('排序编码'),
      },
      {
        name: 'inspectionSection',
        label: intl.get(`${preCode}.inspectionSection`).d('检验项目分段'),
      },
      {
        name: 'sectionOrderCode',
        label: intl.get(`${preCode}.sectionOrderCode`).d('分段排序'),
      },
      {
        name: 'relatedGroup',
        label: intl.get(`${preCode}.relatedGroup`).d('检验项关联组'),
      },
      {
        name: 'referenceDocument',
        label: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
      },
      {
        name: 'instruction',
        label: intl.get(`${preCode}.instruction`).d('操作说明'),
      },
      {
        name: 'drawingCode',
        label: intl.get(`${preCode}.drawingCode`).d('图纸编码'),
      },
      {
        name: 'pictures',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
      {
        name: 'lineRemark',
        label: intl.get(`${preCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines/inspectionDocLine`,
          method: 'GET',
        };
      },
    },
  };
};
// 行 明细页签
const InspectionDocLineDetailDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      // 明细标签
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
      {
        name: 'qcStatus',
      },
      {
        name: 'qcStatusMeaning',
        label: intl.get(`${preCode}.qcStatus`).d('状态'),
      },
      {
        name: 'qcResultMeaning',
        label: intl.get(`${preCode}.qcResult`).d('判定结果'),
      },
      {
        name: 'batchQty',
        label: intl.get(`${preCode}.batchQty`).d('报检数量'),
      },
      {
        name: 'secondBatchQty',
        label: intl.get(`${preCode}.secondBatchQty`).d('辅单位数量'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'qcSecondOkQty',
        label: intl.get(`${preCode}.qcSecondOkQty`).d('辅单位合格'),
      },
      {
        name: 'qcSecondNgQty',
        label: intl.get(`${preCode}.qcSecondNgQty`).d('辅单位不合格'),
      },
      {
        name: 'warehouseName',
        label: intl.get(`${preCode}.warehouse`).d('仓库'),
      },
      {
        name: 'wmAreaName',
        label: intl.get(`${preCode}.wmArea`).d('货位'),
      },
      {
        name: 'wmUnitCode',
        label: intl.get(`${preCode}.wmUnit`).d('货格'),
      },
      {
        name: 'startDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.startDate`).d('开始时间'),
      },
      {
        name: 'judgedDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.judgedDate`).d('判定时间'),
      },
      {
        name: 'qcNgReasonName',
        label: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
      },
      {
        name: 'reinspectionResultMeaning',
        label: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
      },
      {
        name: 'reinspectorName',
        label: intl.get(`${preCode}.reinspector`).d('复检员'),
      },
      {
        name: 'rejudgeDate',
        label: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
      },
      {
        name: 'processResultMeaning',
        label: intl.get(`${preCode}.processResultMeaning`).d('处理结果'),
      },
      {
        name: 'processorName',
        label: intl.get(`${preCode}.processorName`).d('处理人'),
      },
      {
        name: 'concessionQty',
        label: '让步接收数量',
      },
      {
        name: 'returnedQty',
        label: '退回数量',
      },
      {
        name: 'reworkQty',
        label: '返修数量',
      },
      {
        name: 'scrappedQty',
        label: '报废数量',
      },
      {
        name: 'processedOkQty',
        label: '处理合格',
      },
      {
        name: 'ngInventoryQty',
        label: '不合格入库',
      },
      {
        name: 'processRemark',
        label: '处理备注',
      },
      {
        name: 'processLotPictures',
        label: intl.get(`${preCode}.processPictures`).d('处理图片'),
      },
      {
        name: 'lotRemark',
        label: intl.get(`${preCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/inspection-doc-lots/inspection-doc-lot-pc`,
          method: 'GET',
        };
      },
    },
  };
};
// 行 异常页签
const InspectionDocLineExceptionDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      // 异常页签
      {
        name: 'exceptionCode',
      },
      {
        name: 'exceptionName',
        label: intl.get(`${preCode}.exceptionName`).d('异常'),
      },
      {
        name: 'exceptionGroupCode',
      },
      {
        name: 'exceptionGroupName',
        label: intl.get(`${preCode}.exceptionGroupName`).d('异常组'),
      },
      {
        name: 'exceptionQty',
        label: intl.get(`${preCode}.exceptionQty`).d('异常数量'),
      },
      {
        name: 'exceptionPictures',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'sampleNumber',
        label: intl.get(`${preCode}.sampleNumber`).d('样本编码'),
      },
      {
        name: 'inspectionItemName',
        label: intl.get(`${preCode}.inspectionItemName`).d('检验项目名称'),
      },
      {
        name: 'exceptionRemark',
        label: intl.get(`${preCode}.exceptionRemark`).d('判定备注'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/inspection-doc-exceptions/inspection-doc-exception-pc`,
          method: 'GET',
        };
      },
    },
  };
};

const queryDS = new DataSet(InspectionDocQueryDS());
const listDS = new DataSet(InspectionDocListDS());
const lineDS = new DataSet(InspectionDocLineSampleDS());
const detailDS = new DataSet(InspectionDocLineDetailDS());
const exceptionDS = new DataSet(InspectionDocLineExceptionDS());
export { queryDS, listDS, lineDS, detailDS, exceptionDS };
