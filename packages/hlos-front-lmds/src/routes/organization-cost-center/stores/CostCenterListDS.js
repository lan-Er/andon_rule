/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-25 10:27:59
 * @LastEditTime: 2020-10-22 18:45:48
 * @Description:
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  getTlsRecord,
  convertFieldName,
  codeValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;
const preCode = 'lmds.costCenter.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/cost-centers`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'costCenterCode',
      type: 'string',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
    },
    {
      name: 'costCenterName',
      type: 'string',
      label: intl.get(`${preCode}.costCenterName`).d('成本中心名称'),
    },
  ],
  fields: [
    {
      name: 'costCenterCode',
      type: 'string',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      maxLength: CODE_MAX_LENGTH,
      validator: codeValidator,
      required: true,
    },
    {
      name: 'costCenterName',
      type: 'intl',
      label: intl.get(`${preCode}.costCenterName`).d('成本中心名称'),
      required: true,
    },
    {
      name: 'costCenterAlias',
      type: 'intl',
      label: intl.get(`${preCode}.costCenterAlias`).d('成本中心简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.description`).d('成本中心描述'),
      validator: descValidator,
    },
    {
      name: 'accountCode',
      type: 'string',
      label: intl.get(`${preCode}.accountCode`).d('会计科目'),
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organization`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${preCode}.department`).d('部门'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'departmentCode',
      type: 'string',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
      validator: (value) => {
        const reg = /^[1-9]+[0-9]*$/;
        if (value && !value.match(reg)) {
          return 'Invalid data';
        }
      },
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部编号'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      defaultValue: true,
      required: true,
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'costCenter', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
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
