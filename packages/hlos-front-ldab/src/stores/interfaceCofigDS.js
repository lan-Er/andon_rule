/*
 * @Description: 接口配置--InterfaceCofig
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-06-06 11:20:40
 */
import intl from 'utils/intl';
import { HLOS_LDAB } from 'hlos-front/lib/utils/config';
import { codeValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { DataSet } from 'choerodon-ui/pro';
import codeConfig from '@/common/codeConfig';

const { interfaceConfig } = codeConfig.code;

const intlPrefix = 'ldab.interfaceCofig';
const interfaceUrl = `${HLOS_LDAB}/v1/interface`;

export function projectDS() {
  return {
    autoQuery: false,
    primaryKey: 'projectId',
    transport: {
      read: () => ({
        url: `${interfaceUrl}/project`,
        method: 'GET',
      }),
      create: ({ data }) => {
        return {
          url: `${interfaceUrl}/project`,
          data: data[0],
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: `${interfaceUrl}/project`,
          data: data[0],
          method: 'PUT',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${interfaceUrl}/project`,
          data: data[0],
          method: 'DELETE',
        };
      },
    },
    queryFields: [
      {
        name: 'projectCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.projectCode`).d('项目编码'),
      },
      {
        name: 'projectName',
        type: 'boolstringean',
        label: intl.get(`${intlPrefix}.projectName`).d('项目名称'),
      },
    ],
    fields: [
      {
        name: 'projectCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.projectCode`).d('项目编码'),
        validator: codeValidator,
        maxLength: CODE_MAX_LENGTH,
        required: true,
      },
      {
        name: 'projectName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.projectName`).d('项目名称'),
        required: true,
      },
      {
        name: 'domainUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.domainUrl`).d('服务地址'),
        required: true,
      },
      {
        name: 'userName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.userName`).d('帐号'),
        required: true,
      },
      {
        name: 'password',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.password`).d('密钥'),
        required: true,
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.enabledFlag`).d('项目名称'),
        defaultValue: true,
      },
    ],
  };
}

export function interfaceCofigDS() {
  return {
    autoQuery: false,
    pageSize: 1000,
    primaryKey: 'interfaceId',
    transport: {
      read: () => ({
        url: `${interfaceUrl}/interface-config`,
        method: 'GET',
      }),
      submit: ({ data }) => {
        return {
          url: `${interfaceUrl}/interface-config`,
          data: data[0],
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${interfaceUrl}/interface-config`,
          data: data[0],
          method: 'DELETE',
        };
      },
    },
    fields: [
      {
        name: 'interfaceCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceCode`).d('接口编码'),
        validator: codeValidator,
        maxLength: CODE_MAX_LENGTH,
        required: true,
      },
      {
        name: 'interfaceName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceName`).d('接口名称'),
        required: true,
      },
      {
        name: 'requestUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.requestUrl`).d('接口同步地址'),
        required: true,
      },
    ],
  };
}

export function projectInterfaceDS() {
  return {
    autoQuery: false,
    autoQueryAfterSubmit: false,
    primaryKey: 'projectInterfaceId',
    transport: {
      read: ({ data }) => {
        return {
          url: `${interfaceUrl}/${data.interfaceId}/project-interface`,
          method: 'GET',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${interfaceUrl}/${data.interfaceId}/project-interface`,
          data,
          method: 'DELETE',
        };
      },
    },
    queryFields: [
      {
        name: 'projectCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.projectCode`).d('项目编码'),
      },
      {
        name: 'projectName',
        type: 'string',
        label: intl.get(`${intlPrefix}.projectName`).d('项目名称'),
      },
    ],
    fields: [
      {
        name: 'projectObj',
        type: 'object',
        ignore: 'always',
        lovCode: interfaceConfig.project,
        label: intl.get(`${intlPrefix}.model.projectCode`).d('项目编码'),
        required: true,
      },
      {
        name: 'projectId',
        type: 'string',
        bind: 'projectObj.projectId',
      },
      {
        name: 'projectCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.projectCode`).d('项目编码'),
        bind: 'projectObj.projectCode',
      },
      {
        name: 'projectName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.projectName`).d('项目名称'),
        bind: 'projectObj.projectName',
      },
      {
        name: 'domainUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.domainUrl`).d('服务地址'),
        bind: 'projectObj.domainUrl',
      },
      {
        name: 'interfaceUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.interfaceUrl`).d('第三方接口地址'),
        required: true,
      },
    ],
  };
}

export function createprojectInterface() {
  return {
    ...interfaceCofigDS(),
    autoQueryAfterSubmit: false,
    children: {
      projectInterface: new DataSet(projectInterfaceDS()),
    },
  };
}
