/**
 * @Description: TPM任务管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:54:36
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesTask } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.tpmTask.model';
const commonCode = 'lmes.common.model';

const TpmTaskQueryDS = () => {
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
        name: 'taskObj',
        type: 'object',
        label: intl.get(`${preCode}.taskNum`).d('任务号'),
        lovCode: 'LMES.TPM_TASK',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            taskClass: 'TPM_TASK',
          }),
        },
        ignore: 'always',
      },
      {
        name: 'taskId',
        type: 'string',
        bind: 'taskObj.taskId',
      },
      {
        name: 'taskNum',
        type: 'string',
        bind: 'taskObj.taskNumber',
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get(`${commonCode}.resource`).d('资源'),
        lovCode: common.resource,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
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
        name: 'taskStatus',
        type: 'string',
        label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
        lookupCode: lmesTask.taskStatus,
        multiple: true,
        defaultValue: ['NEW', 'RELEASED', 'DISPATCHED', 'QUEUING', 'RUNNING', 'PAUSE', 'PENDING'],
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
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
        name: 'produceLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
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
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${preCode}.workcell`).d('工位'),
        lovCode: common.workcell,
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
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'taskTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.taskType`).d('任务类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'TPM_TASK' },
        ignore: 'always',
      },
      {
        name: 'taskTypeId',
        type: 'string',
        bind: 'taskTypeObj.documentTypeId',
      },
      {
        name: 'taskTypeName',
        type: 'string',
        bind: 'taskTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${preCode}.worker`).d('操作工'),
        lovCode: common.worker,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${preCode}.workGroup`).d('班组'),
        lovCode: common.workerGroup,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workerGroupId',
        type: 'string',
        bind: 'workerGroupObj.workerGroupId',
      },
      {
        name: 'workerGroupName',
        type: 'string',
        bind: 'workerGroupObj.workerGroupName',
        ignore: 'always',
      },
      {
        name: 'taskGroup',
        type: 'string',
        label: intl.get(`${preCode}.taskGroup`).d('任务组'),
      },
      {
        name: 'inspectedResult',
        type: 'string',
        label: intl.get(`${preCode}.tpmResult`).d('TPM结果'),
        lookupCode: lmesTask.tpmResult,
      },
      {
        name: 'calendarDay',
        type: 'date',
        label: intl.get(`${preCode}.calendarDay`).d('指定日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'calendarShiftCode',
        type: 'string',
        label: intl.get(`${preCode}.calendarShift`).d('指定班次'),
        lookupCode: lmesTask.shift,
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocTypeId: record.get('documentTypeId'),
          }),
        },
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'startDateStart',
        type: 'date',
        label: intl.get(`${preCode}.planStartDateLeft`).d('计划开始>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('startDateEnd')) {
              return 'startDateEnd';
            }
          },
        },
      },
      {
        name: 'startDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.planStartDateRight`).d('计划开始<='),
        min: 'startDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'endDateStart',
        type: 'time',
        label: intl.get(`${preCode}.planEndDateLeft`).d('计划结束>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('endDateEnd')) {
              return 'endDateEnd';
            }
          },
        },
      },
      {
        name: 'endDateEnd',
        type: 'time',
        label: intl.get(`${preCode}.planEndDateRight`).d('计划结束<='),
        min: 'endDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'organizationObj') {
          record.set('taskObj', null);
          record.set('resourceObj', null);
          record.set('prodLineObj', null);
          record.set('equipmentObj', null);
          record.set('workcellObj', null);
          record.set('workerObj', null);
          record.set('workerGroupObj', null);
        }
      },
    },
  };
};

const TpmLineListDS = () => {
  return {
    selection: false,
    autoQuery: false,
    pageSize: 10,
    fields: [
      {
        name: 'inspectionItemName',
        label: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
      },
      {
        name: 'inspectionItemAlias',
        label: intl.get(`${preCode}.inspectionItemAlias`).d('检验项目简称'),
      },
      {
        name: 'inspectionItemDescription',
        label: intl.get(`${preCode}.inspectionItemDesc`).d('检验项目描述'),
      },
      {
        name: 'inspectionResultMeaning',
        label: intl.get(`${preCode}.inspectionResult`).d('判定结果'),
      },
      {
        name: 'resultTypeMeaning',
        label: intl.get(`${preCode}.resultType`).d('结果类型'),
      },
      {
        name: 'inspectionValue',
        label: intl.get(`${preCode}.inspectionValue`).d('检验值'),
      },
      {
        name: 'defaultUcl',
        label: intl.get(`${preCode}.defaultUcl`).d('默认上限'),
      },
      {
        name: 'defaultUclAccept',
        label: intl.get(`${preCode}.acceptUcl`).d('包含默认上限值'),
      },
      {
        name: 'defaultLcl',
        label: intl.get(`${preCode}.defaultLcl`).d('默认下限'),
      },
      {
        name: 'defaultLclAccept',
        label: intl.get(`${preCode}.acceptLcl`).d('包含默认下限值'),
      },
      {
        name: 'inspectionResource',
        label: intl.get(`${preCode}.inspectionResource`).d('检测工具'),
      },
      {
        name: 'necessaryFlag',
        label: intl.get(`${preCode}.necessaryFlag`).d('是否必输'),
      },
      {
        name: 'orderByCode',
        label: intl.get(`${preCode}.orderBy`).d('显示顺序'),
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.inspectionRemark`).d('检验备注'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/task-inspections`,
          method: 'GET',
        };
      },
    },
  };
};

const TpmTaskListDS = () => {
  return {
    selection: 'multiple',
    pageSize: 10,
    primaryKey: 'taskId',
    // children: {
    //   taskInspectionList: new DataSet(TpmLineListDS()),
    // },
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
        transformResponse: (val, object) =>
          val ||
          `${object.organizationCode}\n${object.organizationName}`.replace(/undefined/g, ' '),
      },
      {
        name: 'taskNum',
        label: intl.get(`${preCode}.taskNum`).d('任务号'),
      },
      {
        name: 'taskStatusMeaning',
        label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      },
      {
        name: 'resourceName',
        label: intl.get(`${commonCode}.resource`).d('资源'),
      },
      {
        name: 'produceLineName',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
      },
      {
        name: 'equipmentName',
        label: intl.get(`${preCode}.equipment`).d('设备'),
      },
      {
        name: 'workcellName',
        label: intl.get(`${preCode}.workcell`).d('工位'),
      },
      {
        name: 'workerGroupName',
        label: intl.get(`${preCode}.workGroup`).d('班组'),
      },
      {
        name: 'declare',
        label: intl.get(`${preCode}.declare`).d('提报人'),
      },
      {
        name: 'supervisor',
        label: intl.get(`${preCode}.supervisor`).d('管理员'),
      },
      {
        name: 'workerName',
        label: intl.get(`${preCode}.worker`).d('操作工'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.description`).d('描述'),
      },
      {
        name: 'taskTypeName',
        label: intl.get(`${preCode}.taskType`).d('任务类型'),
      },
      {
        name: 'resourceClassMeaning',
        label: intl.get(`${preCode}.resourceClass`).d('资源分类'),
      },
      {
        name: 'inspectedResultMeaning',
        label: intl.get(`${preCode}.tpmResult`).d('TPM结果'),
      },
      {
        name: 'inspectionGroupName',
        label: intl.get(`${preCode}.inspectionGroup`).d('检验组'),
      },
      {
        name: 'exceptionName',
        label: intl.get(`${preCode}.exception`).d('异常'),
      },
      {
        name: 'taskGroup',
        label: intl.get(`${preCode}.taskGroup`).d('任务组'),
      },
      {
        name: 'locationName',
        label: intl.get(`${preCode}.location`).d('地点'),
      },
      {
        name: 'outsideLocation',
        label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
      },
      {
        name: 'calendarDay',
        label: intl.get(`${preCode}.calendarDay`).d('指定日期'),
      },
      {
        name: 'calendarShiftCodeMeaning',
        label: intl.get(`${preCode}.calendarShift`).d('指定班次'),
      },
      {
        name: 'planStartTime',
        label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
      },
      {
        name: 'planEndTime',
        label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
      },
      {
        name: 'actualStartTime',
        label: intl.get(`${preCode}.actualStartDate`).d('实际开始时间'),
      },
      {
        name: 'actualEndTime',
        label: intl.get(`${preCode}.actualEndDate`).d('实际结束时间'),
      },
      {
        name: 'planProcessTime',
        label: intl.get(`${preCode}.planProcessTime`).d('计划处理时间'),
      },
      {
        name: 'processedTime',
        label: intl.get(`${preCode}.processedTime`).d('实际处理时间'),
      },
      {
        name: 'referenceDocument',
        label: intl.get(`${preCode}.referenceDoc`).d('参考文件'),
      },
      {
        name: 'instruction',
        label: intl.get(`${preCode}.instruction`).d('操作说明'),
      },
      {
        name: 'pictureIds',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
      {
        name: 'priority',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
      {
        name: 'printedFlag',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'documentTypeName',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { taskStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/tasks/query-tpm`, {
            statusList,
          }),
          data: {
            ...data,
            taskStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

export { TpmTaskListDS, TpmTaskQueryDS, TpmLineListDS };
