/**
 * @Description: 任务项DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-03 17:26:43
 */

import intl from 'utils/intl';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'letl.task.model';
const commonCode = 'letl.common.model';
const { ldttTaskItem } = codeConfig.code;
const url = `${HLOS_LETL}/v1/etl-tasks`;

const TaskItemDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'taskName',
        type: 'string',
        label: intl.get(`${preCode}.taskName`).d('任务名称'),
      },
    ],
    fields: [
      {
        name: 'taskName',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('任务名称'),
      },
      {
        name: 'sourceDescription',
        type: 'string',
        label: intl.get(`${commonCode}.sourceDescription`).d('源数据库'),
      },
      {
        name: 'sourceTable',
        type: 'string',
        label: intl.get(`${commonCode}.sourceTable`).d('源数据库表名'),
      },
      {
        name: 'sourceDatasourceUrl',
        type: 'string',
        label: intl.get(`${commonCode}.sourceTable`).d('源数据库地址'),
      },
      {
        name: 'sourceCondition',
        type: 'string',
        label: intl.get(`${commonCode}.sourceCondition`).d('源表etl条件'),
      },
      {
        name: 'targetDescription',
        type: 'string',
        label: intl.get(`${commonCode}.targetDescription`).d('目标数据库'),
      },
      {
        name: 'targetTable',
        type: 'string',
        label: intl.get(`${commonCode}.targetTable`).d('目标数据库表名'),
      },
      {
        name: 'targetDatasourceUrl',
        type: 'string',
        label: intl.get(`${commonCode}.targetTable`).d('目标数据库地址'),
      },
      {
        name: 'targetPreSql',
        type: 'string',
        label: intl.get(`${commonCode}.targetPreSql`).d('etl前执行sql'),
      },
      {
        name: 'targetColumn',
        type: 'string',
        label: intl.get(`${commonCode}.targetColumn`).d('同步目标表字段'),
      },
      {
        name: 'tenantName',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('租户'),
      },
      {
        name: 'groupName',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('任务组'),
      },
      {
        name: 'taskProgress',
        type: 'string',
        label: intl.get(`${commonCode}.taskProgress`).d('进度'),
      },
      {
        name: 'taskStatusMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.taskStatus`).d('状态'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url,
          method: 'GET',
        };
      },
    },
  };
};

const TaskItemCreateFormDS = () => {
  return {
    fields: [
      {
        name: '_token',
        label: 'token',
        required: false,
      },
      {
        name: 'objectVersionNumber',
        label: '版本号',
        required: false,
      },
      {
        name: 'taskId',
        label: '任务Id',
        labelWidth: 150,
      },
      {
        name: 'taskName',
        label: '任务名称',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'groupId',
        label: '任务组',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'groupName',
        label: '任务组',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'sourceDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDatasource`).d('源数据库'),
        lovCode: ldttTaskItem.sourceDatasource,
        ignore: 'always',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'sourceDatasourceId',
        type: 'string',
        bind: 'sourceDatasourceObj.datasourceId',
      },
      {
        name: 'sourceDatasourceCode',
        type: 'string',
        bind: 'sourceDatasourceObj.datasourceCode',
        ignore: 'always',
      },
      {
        name: 'sourceDescription',
        type: 'string',
        bind: 'sourceDatasourceObj.description',
        ignore: 'always',
      },
      {
        name: 'sourceTable',
        label: '源数据库表名',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'targetDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.targetDatasource`).d('目标数据库'),
        lovCode: ldttTaskItem.targetDatasource,
        ignore: 'always',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'targetDatasourceId',
        type: 'string',
        bind: 'targetDatasourceObj.datasourceId',
      },
      {
        name: 'targetDatasourceCode',
        type: 'string',
        bind: 'targetDatasourceObj.datasourceCode',
        ignore: 'always',
      },
      {
        name: 'targetDescription',
        type: 'string',
        bind: 'targetDatasourceObj.description',
        ignore: 'always',
      },
      {
        name: 'targetTable',
        label: '目标数据库表名',
        labelWidth: 150,
      },
      {
        name: 'sourceCondition',
        label: '源表etl条件',
        labelWidth: 150,
      },
      {
        name: 'targetPreSql',
        label: 'etl前执行sql',
        labelWidth: 150,
      },
      {
        name: 'targetColumn',
        label: '同步目标表字段',
        labelWidth: 150,
      },
      {
        name: 'remark',
        label: '备注',
        labelWidth: 150,
      },
    ],
  };
};

export { TaskItemDS, TaskItemCreateFormDS };
