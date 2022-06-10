/**
 * @Description: 非生产任务--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-16 20:28:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesTask } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const commonCode = 'lmes.common.model';
const preCode = 'lmes.nonProductionTask.model';

const ListDS = () => ({
  pageSize: 100,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
      noCache: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'taskObj',
      type: 'object',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      lovCode: common.npTask,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          taskClass: 'NP_TASK',
        }),
      },
    },
    {
      name: 'taskId',
      bind: 'taskObj.taskId',
    },
    {
      name: 'taskNum',
      bind: 'taskObj.taskNumber',
    },
    {
      name: 'taskTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.taskType`).d('任务类型'),
      lovCode: common.documentType,
      noCache: true,
      lovPara: {
        documentClass: 'NP_TASK',
      },
      ignore: 'always',
    },
    {
      name: 'taskTypeId',
      bind: 'taskTypeObj.documentTypeId',
    },
    {
      name: 'taskTypeName',
      bind: 'taskTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: lmesTask.taskStatus,
      multiple: true,
      defaultValue: ['NEW', 'RELEASED', 'RUNNING', 'PAUSE'],
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'planStartTimeLeft',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartDateLeft`).d('计划开始>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('planStartTimeRight')) {
            return 'startDateEnd';
          }
        },
      },
    },
    {
      name: 'planStartTimeRight',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartDateRight`).d('计划开始<='),
      min: 'planStartTimeLeft',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'planEndTimeLeft',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndDateLeft`).d('计划结束>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('planEndTimeRight')) {
            return 'planEndTimeRight';
          }
        },
      },
    },
    {
      name: 'planEndTimeRight',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndDateRight`).d('计划结束<='),
      min: 'planEndTimeLeft',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'organization',
      label: intl.get(`${commonCode}.org`).d('组织'),
      transformResponse: (val, object) =>
        `${object.organizationCode || ''} ${object.organizationName || ''}`,
    },
    {
      name: 'taskNum',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
    },
    {
      name: 'taskTypeName',
      label: intl.get(`${preCode}.taskType`).d('任务类型'),
    },
    {
      name: 'taskStatusMeaning',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
    },
    {
      name: 'description',
      label: intl.get(`${commonCode}.desc`).d('描述'),
    },
    {
      name: 'workerGroupName',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
    },
    {
      name: 'workerName',
      label: intl.get(`${commonCode}.worker`).d('操作工'),
    },
    {
      name: 'standardWorkTime',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
    },
    {
      name: 'processedTime',
      label: intl.get(`${preCode}.processedTime`).d('实际工时'),
    },
    {
      name: 'actualStartTime',
      label: intl.get(`${preCode}.startTime`).d('开始时间'),
    },
    {
      name: 'actualEndTime',
      label: intl.get(`${preCode}.endTime`).d('结束时间'),
    },
    {
      name: 'planStartTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
    },
    {
      name: 'planEndTime',
      label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
    },
    {
      name: 'calendarDay',
      label: intl.get(`${preCode}.calendarDay`).d('指定日期'),
    },
    {
      name: 'calendarShiftCodeMeaning',
      label: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
    },
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
    },
    {
      name: 'workcellName',
      label: intl.get(`${preCode}.workcell`).d('工位'),
    },
    {
      name: 'locationName',
      label: intl.get(`${preCode}.location`).d('地点'),
    },
    {
      name: 'outsideLocation',
      label: intl.get(`${commonCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'supervisorName',
      label: intl.get(`${preCode}.supervisor`).d('管理员工'),
    },
    {
      name: 'pictureIds',
      label: intl.get(`${commonCode}.picture`).d('图片'),
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'executeRuleName',
      label: intl.get(`${commonCode}.executeRule`).d('执行规则'),
    },
    {
      name: 'dispatchRuleName',
      label: intl.get(`${commonCode}.dispatchRule`).d('派工规则'),
    },
    {
      name: 'docProcessRuleId',
    },
    {
      name: 'docProcessRule',
      label: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
    },
    {
      name: 'referenceDocument',
      label: intl.get(`${commonCode}.referenceDocument`).d('参考文件'),
    },
    {
      name: 'instruction',
      label: intl.get(`${commonCode}.instruction`).d('操作说明'),
    },
    {
      name: 'printedFlag',
      label: intl.get(`${commonCode}.printedFlag`).d('打印标识'),
    },
    {
      name: 'printedDate',
      label: intl.get(`${commonCode}.printedDate`).d('打印时间'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { taskStatus: taskStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/tasks/np-task-query`, {
          taskStatusList,
        }),
        data: {
          ...data,
          taskStatus: undefined,
          taskClass: 'NP_TASK',
        },
        params: {
          page: data.page || 0,
          size: data.size || 100,
        },
        method: 'GET',
      };
    },
  },
});

const DetailDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'taskTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.taskType`).d('任务类型'),
      lovCode: common.documentType,
      lovPara: {
        documentClass: 'NP_TASK',
      },
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'taskTypeId',
      bind: 'taskTypeObj.documentTypeId',
    },
    {
      name: 'taskTypeCode',
      bind: 'taskTypeObj.documentTypeCode',
    },
    {
      name: 'taskTypeName',
      bind: 'taskTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      disabled: true,
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: lmesTask.taskStatus,
      defaultValue: 'NEW',
      disabled: true,
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroup',
      bind: 'workerGroupObj.workerGroupCode',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.desc`).d('描述'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${preCode}.location`).d('地点'),
      lovCode: common.location,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'locationId',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      bind: 'locationObj.locationName',
      ignore: 'always',
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
      name: 'supervisorObj',
      type: 'object',
      label: intl.get(`${preCode}.supervisor`).d('管理员工'),
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
    },
    {
      name: 'supervisorId',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'supervisor',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorName',
      bind: 'supervisorObj.workerName',
      ignore: 'always',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${commonCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      min: 0,
    },
    {
      name: 'planStartTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('planEndTime')) {
            return 'planEndTime';
          }
        },
      },
    },
    {
      name: 'planEndTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
      min: 'planStartTime',
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      ignore: 'always',
      lovPara: {
        ruleType: 'EXECUTE',
        ruleClass: 'TASK',
      },
      noCache: true,
    },
    {
      name: 'executeRuleId',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRule',
      bind: 'executeRuleObj.ruleJson',
    },
    {
      name: 'executeRuleName',
      bind: 'executeRuleObj.ruleName',
      ignore: 'always',
    },
    {
      name: 'processedTime',
      type: 'number',
      label: intl.get(`${preCode}.processedTime`).d('实际工时'),
      min: 0,
    },
    {
      name: 'actualStartTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('actualEndTime')) {
            return 'planEndTiactualEndTimeme';
          }
        },
      },
    },
    {
      name: 'actualEndTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      min: 'actualStartTime',
    },
    {
      name: 'dispatchRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      ignore: 'always',
      lovPara: {
        ruleType: 'DISPATCH',
        ruleClass: 'TASK',
      },
      noCache: true,
    },
    {
      name: 'dispatchRuleId',
      bind: 'dispatchRuleObj.ruleId',
    },
    {
      name: 'dispatchRule',
      bind: 'dispatchRuleObj.ruleJson',
    },
    {
      name: 'dispatchRuleName',
      bind: 'dispatchRuleObj.ruleName',
      ignore: 'always',
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${commonCode}.instruction`).d('操作说明'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.referenceDocument`).d('参考文件上传'),
    },
    {
      name: 'docProcessRuleId',
      bind: 'taskTypeObj.docProcessRuleId',
    },
    {
      name: 'docProcessRule',
      type: 'string',
      label: intl.get(`${commonCode}.docProcessRule`).d('单据处理规则'),
      bind: 'taskTypeObj.docProcessRule',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('workerGroupObj', null);
        record.set('workerObj', null);
        record.set('prodLineObj', null);
        record.set('equipmentObj', null);
        record.set('workcellObj', null);
        record.set('supervisorObj', null);
      }
    },
  },
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/np-task-query`,
      method: 'GET',
    }),
    submit: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/batch-create-np-task`,
      method: 'POST',
    }),
  },
});

const BatchCreateDS = () => ({
  queryFields: [
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
      noCache: true,
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
  ],
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${preCode}.workerCode`).d('工号'),
      lovCode: common.worker,
      textField: 'workerCode',
      ignore: 'always',
      unique: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          workerGroupId: record.get('workerGroupId'),
        }),
      },
      noCache: true,
      required: true,
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      label: intl.get(`${preCode}.name`).d('名称'),
      ignore: 'always',
    },
    {
      name: 'workerGroupId',
      bind: 'workerObj.workerGroupId',
    },
    {
      name: 'workerGroupCode',
      bind: 'workerObj.workerGroupCode',
    },
    {
      name: 'workerGroupName',
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      bind: 'workerObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'phoneNumber',
      label: intl.get(`${preCode}.phoneNumber`).d('联系方式'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMDS}/v1/${organizationId}/workers`,
      method: 'GET',
    }),
  },
});

export { ListDS, DetailDS, BatchCreateDS };
