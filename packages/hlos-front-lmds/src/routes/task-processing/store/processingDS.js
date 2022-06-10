/*
 * @Description: 任务管理DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-15 15:13:46
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LTCC } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
// import moment from 'moment';
import intl from 'utils/intl';
// import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const { lmdsTaskProcessing } = codeConfig.code;
const preCode = 'lmds.taskProcessing';
const url = `${HLOS_LTCC}/v1/${getCurrentOrganizationId()}/branch-task-infos`;

const TaskProcessingDS = () => ({
  primaryKey: 'taskInfoId',
  queryFields: [
    {
      name: 'taskInfoType',
      type: 'string',
      lookupCode: lmdsTaskProcessing.taskType,
      label: intl.get(`${preCode}.taskInfoType`).d('任务名称'),
    },
    {
      name: 'taskInfoTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.taskInfoType`).d('任务编码'),
    },
    {
      name: 'taskStatus',
      type: 'string',
      lookupCode: lmdsTaskProcessing.taskStatus,
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
    },
    // {
    //   name: 'documentInfo',
    //   type: 'string',
    //   label: intl.get(`${preCode}.documentInfo`).d('单据信息'),
    // },
    {
      name: 'creationDateFrom',
      type: 'date',
      label: intl.get(`${preCode}.creationDateFrom`).d('执行时间从:'),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('creationDateTo')) {
            return 'creationDateTo';
          }
        },
      },
      // transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT} 08:00:00`) : ''),
    },
    {
      name: 'creationDateTo',
      type: 'date',
      label: intl.get(`${preCode}.creationDateTo`).d('加工日期至'),
      min: 'creationDateFrom',
      // transformRequest: (val) =>
      //   val ? moment(val).add(1, 'days').format(`${DEFAULT_DATE_FORMAT} 07:59:59`) : '',
    },
    {
      name: 'creatorObj',
      type: 'object',
      lovCode: lmdsTaskProcessing.userOrg,
      label: intl.get(`${preCode}.creator`).d('执行人'),
      ignore: 'always',
    },
    {
      name: 'createBy',
      type: 'string',
      bind: 'creatorObj.id',
    },
    {
      name: 'tenantId',
      type: 'string',
      label: intl.get(`${preCode}.tenantId`).d('执行租户'),
    },
    {
      name: 'taskParam',
      type: 'string',
      label: intl.get(`${preCode}.taskParam`).d('请求参数'),
    },
    {
      name: 'taskErrorTrack',
      type: 'string',
      label: intl.get(`${preCode}.taskErrorTrack`).d('异常参数'),
    },
  ],
  children: {
    lineList: new DataSet({ ...TaskProcessingLineDS() }),
  },
  fields: [
    {
      name: 'taskInfoTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.taskInfoTypeMeaning`).d('任务类型'),
    },
    {
      name: 'taskStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.taskStatusMeaning`).d('任务状态'),
    },
    {
      name: 'documentInfo',
      type: 'string',
      label: intl.get(`${preCode}.documentInfo`).d('单据信息'),
    },
    {
      name: 'creator',
      type: 'string',
      label: intl.get(`${preCode}.creator`).d('执行人'),
    },
    {
      name: 'tenantName',
      type: 'string',
      label: intl.get(`${preCode}.tenantName`).d('执行租户'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${preCode}.creationDate`).d('执行日期'),
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});

const TaskProcessingLineDS = () => ({
  fields: [
    {
      name: 'taskInfoTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.taskInfoTypeMeaning`).d('任务类型'),
    },
    {
      name: 'taskStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.taskStatusMeaning`).d('任务状态'),
    },
    {
      name: 'documentInfo',
      type: 'string',
      label: intl.get(`${preCode}.documentInfo`).d('单据信息'),
    },
    {
      name: 'creator',
      type: 'string',
      label: intl.get(`${preCode}.creator`).d('执行人'),
    },
    {
      name: 'tenantName',
      type: 'string',
      label: intl.get(`${preCode}.tenantName`).d('执行租户'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${preCode}.creationDate`).d('执行日期'),
    },
    {
      name: 'taskParam',
      type: 'string',
      label: intl.get(`${preCode}.taskParam`).d('请求参数'),
    },
    {
      name: 'taskErrorTrack',
      type: 'string',
      label: intl.get(`${preCode}.taskErrorTrack`).d('异常参数'),
    },
  ],
  transport: {
    read: ({ data }) => ({
      url,
      data: {
        parentTaskInfoId: data.taskInfoId,
        taskInfoId: undefined,
      },
      method: 'GET',
    }),
  },
});

export { TaskProcessingDS };
