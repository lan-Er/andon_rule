/**
 * @Description: 任务组DS
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:48:07
 */

import intl from 'utils/intl';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'ldtf.transfer.service.model';
const commonCode = 'ldtf.common.model';
const { ldttTransferService } = codeConfig.code;
const url = `${HLOS_LDTF}/v1/transfer-services`;

const TransferServiceDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'serviceCode',
        type: 'string',
        lookupCode: ldttTransferService.serviceCode,
        label: intl.get(`${preCode}.tenant`).d('服务名称'),
        // defaultValue: null,
      },
    ],
    fields: [
      {
        name: 'serviceCode',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('服务编码'),
      },
      {
        name: 'serviceName',
        type: 'string',
        label: intl.get(`${commonCode}.tenantName`).d('服务名称'),
      },
      {
        name: 'datasourceId',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('数据源ID'),
      },
      {
        name: 'datasourceCode',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('数据源编码'),
      },
      {
        name: 'description',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('数据源名称'),
      },
      {
        name: 'datasourceUrl',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('数据源URL'),
      },
      {
        name: 'tenantId',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('租户ID'),
      },
      {
        name: 'tenantName',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('租户名称'),
      },
      {
        name: 'whiteList',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('白名单'),
      },
      {
        name: 'blackList',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('黑名单'),
      },
      {
        name: 'filterMode',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('过滤模式code'),
      },
      {
        name: 'filterModeMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('过滤模式'),
      },
      {
        name: 'enabledFlag',
        type: 'number',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否启用'),
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

const ServiceCreateFormDS = () => {
  return {
    fields: [
      {
        name: 'serviceCode',
        type: 'string',
        lookupCode: ldttTransferService.serviceCode,
        label: intl.get(`${preCode}.tenant`).d('服务名称'),
        required: true,
        // defaultValue: null,
      },
      {
        name: 'datasourceObj',
        type: 'object',
        label: intl.get(`${commonCode}.tenant`).d('数据源'),
        lovCode: ldttTransferService.datasource,
        ignore: 'always',
        labelWidth: 150,
        required: true,
      },
      {
        name: 'datasourceId',
        type: 'string',
        bind: 'datasourceObj.datasourceId',
        ignore: 'always',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'datasourceObj.description',
        ignore: 'always',
      },
      {
        name: 'whiteList',
        label: '白名单',
        labelWidth: 150,
      },
      {
        name: 'blackList',
        label: '黑名单',
        labelWidth: 150,
      },
      {
        name: 'filterMode',
        type: 'string',
        lookupCode: ldttTransferService.filterMode,
        label: intl.get(`${commonCode}.filterMode`).d('过滤模式'),
        required: true,
        defaultValue: 1,
      },
      {
        name: 'enabledFlag',
        label: '是否启用',
        labelWidth: 150,
        required: true,
        defaultValue: 1,
      },
    ],
  };
};

export { TransferServiceDS, ServiceCreateFormDS };
