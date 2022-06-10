/*
 * @Author: zhang yang
 * @Description: 安灯异常 - D
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-29 13:27:24
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { getTlsRecord, convertFieldName } from 'hlos-front/lib/utils/utils';

const { lmdsAndonException, common } = codeConfig.code;

const preCode = 'lmds.lmdsAndonException.model';
const commonCode = 'lmds.common.model';
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/andon-exception-groups`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonClassName',
      type: 'string',
      label: intl.get(`${preCode}.andonClass`).d('安灯分类'),
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'andonClass',
      type: 'object',
      label: intl.get(`${preCode}.andonClass`).d('安灯分类'),
      lovCode: lmdsAndonException.andonClass,
      ignore: 'always',
      required: true,
    },
    {
      name: 'andonClassId',
      type: 'string',
      bind: 'andonClass.andonClassId',
    },
    {
      name: 'andonClassName',
      type: 'string',
      bind: 'andonClass.andonClassName',
    },
    {
      name: 'andon',
      type: 'object',
      label: intl.get(`${preCode}.andon`).d('安灯'),
      lovCode: lmdsAndonException.andon,
      cascadeMap: { organizationId: 'organizationId', andonClassId: 'andonClassId' },
      ignore: 'always',
    },
    {
      name: 'andonId',
      type: 'string',
      bind: 'andon.andonId',
    },
    {
      name: 'andonName',
      type: 'string',
      bind: 'andon.andonName',
    },
    {
      name: 'exceptionGroup',
      type: 'object',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常'),
      lovCode: lmdsAndonException.exceptionGroup,
      ignore: 'always',
      required: true,
    },
    {
      name: 'exceptionGroupId',
      type: 'string',
      bind: 'exceptionGroup.exceptionGroupId',
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      bind: 'exceptionGroup.exceptionGroupName',
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
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record}) => {
      if(name === 'organizationObj' || name === 'andonClass') {
        record.set('andon', null);
      }
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'andonException', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName},
        transformResponse: data => {
          return getTlsRecord(data, name);
        },
      };
    },
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
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
