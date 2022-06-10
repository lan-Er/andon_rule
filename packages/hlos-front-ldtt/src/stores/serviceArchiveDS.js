/*
 * @Descripttion: 服务归档
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-13 10:41:56
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-13 16:51:55
 */

import intl from 'utils/intl';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'letl.task.model';
const commonCode = 'letl.common.model';
const { serviceArchive } = codeConfig.code;
const url = `${HLOS_LETL}/v1/archives`; // POST /v1/archives

const lineUrl = `${HLOS_LETL}/v1/archive-details`;

const ServiceArchiveDS = () => {
  return {
    autoQuery: true,
    selection: false,
    fields: [
      {
        name: 'archiveName',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('服务归档名'),
      },
      {
        name: 'sourceDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDatasource`).d('源数据库'),
        lovCode: serviceArchive.sourceDatasource,
        ignore: 'always',
        labelWidth: 150,
        required: true,
        textValue: 'description',
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
        name: 'sourceDatasourceUrl',
        type: 'string',
        label: '源数据库地址',
        bind: 'sourceDatasourceObj.datasourceUrl',
        ignore: 'always',
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
      update: ({ data }) => {
        return {
          url,
          data: data[0],
          method: 'PUT',
        };
      },
      // destroy: ({ data }) => {
      //   return {
      //     url,
      //     data,
      //     method: 'DELETE',
      //   };
      // },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

const ServiceCreateFormDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'archiveName',
        label: '服务归档名',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'sourceDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDatasource`).d('源数据库'),
        lovCode: serviceArchive.sourceDatasource,
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
        name: 'remark',
        label: '备注',
        labelWidth: 150,
      },
    ],
  };
};

const ServiceArchiveDetailDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'archiveName',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('服务归档名'),
      },
      {
        name: 'sourceDescription',
        type: 'string',
        label: intl.get(`${commonCode}.groupName`).d('源数据库'),
      },
      {
        name: 'sourceDatasourceUrl',
        type: 'string',
        label: intl.get(`${commonCode}.targetTable`).d('源数据库地址'),
      },
      {
        name: 'targetDescription',
        type: 'string',
        label: intl.get(`${commonCode}.targetDescription`).d('目标数据库'),
      },
      {
        name: 'targetDatasourceUrl',
        type: 'string',
        label: intl.get(`${commonCode}.targetTable`).d('目标数据库地址'),
      },
      {
        name: 'targetTenantName',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('归档租户'),
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
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: lineUrl,
          method: 'GET',
        };
      },
    },
  };
};

const ServiceDeatilCreateFormDS = () => {
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
        name: 'archiveId',
        label: '服务归档',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'archiveName',
        label: '服务归档名',
        labelWidth: 150,
      },
      {
        name: 'targetDatasourceObj',
        type: 'object',
        label: intl.get(`${preCode}.targetDatasource`).d('目标数据库'),
        lovCode: serviceArchive.targetDatasource,
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
        name: 'targetTenantObj',
        type: 'object',
        label: intl.get(`${preCode}.tenant`).d('归档租户'),
        lovCode: serviceArchive.tenant,
        ignore: 'always',
        required: true,
      },
      {
        name: 'targetTenantId',
        type: 'string',
        bind: 'targetTenantObj.tenantId',
      },
      {
        name: 'targetTenantNum',
        type: 'string',
        bind: 'targetTenantObj.tenantNum',
        ignore: 'always',
      },
      {
        name: 'targetTenantName',
        type: 'string',
        bind: 'targetTenantObj.tenantName',
        ignore: 'always',
      },
    ],
  };
};

export { ServiceArchiveDS, ServiceCreateFormDS, ServiceArchiveDetailDS, ServiceDeatilCreateFormDS };
