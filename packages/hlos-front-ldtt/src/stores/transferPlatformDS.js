/**
 * @Description: 任务组DS
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:48:07
 */

import intl from 'utils/intl';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'ldtf.transfer.platform.model';
const commonCode = 'ldtf.common.model';
const { ldttTransferService } = codeConfig.code;
const url = `${HLOS_LDTF}/v1/transfer-platforms`;

const TransferPlatformDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'serviceCode',
        type: 'string',
        lookupCode: ldttTransferService.serviceCode,
        label: intl.get(`${preCode}.tenant`).d('服务名称'),
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
        label: intl.get(`${commonCode}.remark`).d('服务名称'),
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

const PlatformCreateFormDS = () => {
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
        name: 'enabledFlag',
        label: '是否启用',
        labelWidth: 150,
        required: true,
      },
    ],
  };
};

export { TransferPlatformDS, PlatformCreateFormDS };
