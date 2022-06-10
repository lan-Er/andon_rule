/**
 * @Description: ES同步项DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-04 10:46:37
 */

import intl from 'utils/intl';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'letl.esSyncItem.model';
const commonCode = 'letl.common.model';
const { ldttEsSyncItem } = codeConfig.code;
const url = `${HLOS_LETL}/v1/es-tasks`;

const EsSyncItemListDS = () => {
  return {
    autoQuery: true,
    selection: false,
    fields: [
      {
        name: 'esTaskName',
        type: 'string',
        label: intl.get(`${preCode}.esTaskName`).d('任务名称'),
      },
      {
        name: 'sourceDatasourceId',
        type: 'string',
        label: intl.get(`${preCode}.sourceDatasourceId`).d('源数据库ID'),
      },
      {
        name: 'sourceTable',
        type: 'string',
        label: intl.get(`${preCode}.sourceTable`).d('源数据库表名或视图名'),
      },
      {
        name: 'sourceCondition',
        type: 'string',
        label: intl.get(`${preCode}.sourceCondition`).d('源表etl条件'),
      },
      {
        name: 'esIndexName',
        type: 'string',
        label: intl.get(`${preCode}.esIndexName`).d('es索引名称'),
      },
      {
        name: 'esIndexContent',
        type: 'string',
        label: intl.get(`${preCode}.esIndexContent`).d('es索引内容'),
      },
      {
        name: 'esPk',
        type: 'string',
        label: intl.get(`${preCode}.esPk`).d('es主键'),
      },
      {
        name: 'tenantId',
        type: 'string',
        label: intl.get(`${commonCode}.tenantId`).d('租户ID'),
      },
      {
        name: 'taskProgress',
        type: 'string',
        label: intl.get(`${preCode}.taskProgress`).d('任务完成进度'),
      },
      {
        name: 'taskStatus',
        type: 'string',
        label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      },
      {
        name: 'countPerTask',
        type: 'string',
        label: intl.get(`${preCode}.countPerTask`).d('每个批次处理数量'),
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

const EsSyncItemCreateDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'sourceDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDatasource`).d('源数据库'),
        lovCode: ldttEsSyncItem.sourceDatasource,
        ignore: 'always',
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
        type: 'string',
        label: intl.get(`${preCode}.sourceTable`).d('源数据库表名或视图名'),
        required: true,
      },
    ],
  };
};

const EsSyncItemCreateFormDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'esTaskName',
        type: 'string',
        label: intl.get(`${preCode}.esTaskName`).d('任务名称'),
        required: true,
      },
      {
        name: 'sourceDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDatasource`).d('源数据库'),
        lovCode: ldttEsSyncItem.sourceDatasource,
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
        type: 'string',
        label: intl.get(`${preCode}.sourceTable`).d('源数据库表名或视图名'),
        required: true,
      },
      {
        name: 'sourceCondition',
        type: 'string',
        label: intl.get(`${preCode}.sourceCondition`).d('源表etl条件'),
      },
      {
        name: 'esIndexName',
        type: 'string',
        label: intl.get(`${preCode}.esIndexName`).d('es索引名称'),
        required: true,
      },
      {
        name: 'esIndexContent',
        type: 'string',
        label: intl.get(`${preCode}.esIndexContent`).d('es索引内容'),
        required: true,
      },
      {
        name: 'esPk',
        type: 'string',
        label: intl.get(`${preCode}.esPk`).d('es主键'),
        required: true,
      },
      {
        name: 'countPerTask',
        type: 'string',
        label: intl.get(`${preCode}.countPerTask`).d('每个批次处理数量'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
  };
};

export { EsSyncItemListDS, EsSyncItemCreateDS, EsSyncItemCreateFormDS };
