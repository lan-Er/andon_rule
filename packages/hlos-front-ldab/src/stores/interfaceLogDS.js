/*
 * @Description: 接口配置--InterfaceCofig
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-06-26 11:20:40
 */
import intl from 'utils/intl';
import { HLOS_LDAB } from 'hlos-front/lib/utils/config';

const intlPrefix = 'ldab.interfaceLog';
const interfaceLogUrl = `${HLOS_LDAB}/v1/interface/interface-log`;

export function interfaceLogDS() {
  return {
    autoQuery: true,
    primaryKey: 'interfaceLogId',
    transport: {
      read: () => ({
        url: `${interfaceLogUrl}`,
        method: 'GET',
      }),
      destroy: ({ data }) => {
        return {
          url: `${interfaceLogUrl}`,
          data: data[0],
          method: 'DELETE',
        };
      },
    },
    queryFields: [
      {
        name: 'interfaceCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.interfaceCode`).d('接口编码'),
      },
      {
        name: 'interfaceUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.interfaceUrl`).d('请求接口地址'),
      },
    ],
    fields: [
      {
        name: 'interfaceCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceCode`).d('接口编码'),
      },
      {
        name: 'interfaceUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceUrl`).d('请求接口地址'),
      },
      {
        name: 'interfaceMessage',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceMessage`).d('异常消息'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.creationDate`).d('创建时间'),
      },
    ],
  };
}

export function clearLogsDS() {
  return {
    autoQuery: false,
    transport: {
      read: () => ({
        url: `/hpfm/v1/lovs/value/batch?clearTypeList=HITF.INTERFACE_LOG.CLEAR_TYPE`,
        method: 'GET',
      }),
    },
    fields: [
      {
        name: 'clearType',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.clearType`).d('类型'),
        required: true,
      },
    ],
  };
}
