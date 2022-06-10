/**
 * @Description: 任务组DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-02 17:48:07
 */

import intl from 'utils/intl';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'letl.task.model';
const commonCode = 'letl.common.model';
const { ldttTaskGroup } = codeConfig.code;
const url = `${HLOS_LETL}/v1/etl-groups`;

const TaskGroupDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'groupName',
        type: 'string',
        label: intl.get(`${preCode}.groupName`).d('任务组名'),
      },
      {
        name: 'tenantObj',
        type: 'object',
        label: intl.get(`${preCode}.tenant`).d('租户'),
        lovCode: ldttTaskGroup.tenant,
        ignore: 'always',
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenantObj.tenantId',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenantObj.tenantNum',
        ignore: 'always',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenantObj.tenantName',
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'groupName',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('任务组名'),
      },
      {
        name: 'tenantName',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('租户名称'),
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

const TaskCreateFormDS = () => {
  return {
    fields: [
      {
        name: 'groupName',
        label: '任务组名',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'tenantObj',
        type: 'object',
        label: intl.get(`${preCode}.tenant`).d('租户'),
        lovCode: ldttTaskGroup.tenant,
        ignore: 'always',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenantObj.tenantId',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenantObj.tenantNum',
        ignore: 'always',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenantObj.tenantName',
        ignore: 'always',
      },
      {
        name: 'remark',
        label: '备注',
        labelWidth: 150,
      },
    ],
  };
};

export { TaskGroupDS, TaskCreateFormDS };
