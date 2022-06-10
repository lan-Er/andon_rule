/**
 * @Description: 任务组DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-02 17:48:07
 */

import intl from 'utils/intl';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

const commonCode = 'letl.common.model';
const url = `${HLOS_LETL}/v1/etl-task-logs`;

const TaskLogsDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'taskName',
        type: 'string',
        label: intl.get(`${commonCode}.taskName`).d('任务名称'),
      },
      {
        name: 'taskStatusMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.taskStatusMeaning`).d('执行状态'),
      },
      {
        name: 'resultMessage',
        type: 'string',
        label: intl.get(`${commonCode}.resultMessage`).d('结果'),
      },
      {
        name: 'errorMessage',
        type: 'string',
        label: intl.get(`${commonCode}.errorMessage`).d('异常消息'),
      },
      {
        name: 'taskTime',
        type: 'string',
        label: intl.get(`${commonCode}.taskTime`).d('执行时长'),
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

export { TaskLogsDS };
