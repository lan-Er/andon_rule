/**
 * @Description: 异常组管理信息--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 12:25:19
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.exceptionGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/exception-group-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'exceptionObj',
      type: 'object',
      label: intl.get(`${preCode}.exception`).d('异常'),
      lovCode: common.exception,
      textField: 'exceptionCode',
      ignore: 'always',
      required: true,
    },
    {
      name: 'exceptionId',
      type: 'string',
      bind: 'exceptionObj.exceptionId',
    },
    {
      name: 'exceptionCode',
      type: 'string',
      bind: 'exceptionObj.exceptionCode',
    },
    {
      name: 'exceptionName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionName`).d('异常名称'),
      bind: 'exceptionObj.exceptionName',
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderBy`).d('排序'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submit: ({ dataSet, data }) => {
      data.map(item => {
        const dataItem = item;
        dataItem.exceptionGroupId = dataSet.queryParameter.exceptionGroupId;
        return dataItem;
      });
    },
    submitSuccess: ({dataSet}) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});
