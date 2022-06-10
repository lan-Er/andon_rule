/**
 * @Description: 事务类型管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 15:11:39
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmdsTransactionType } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.transactionType.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/transaction-types`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'transactionTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.transactionType`).d('事务类型'),
    },
    {
      name: 'transactionTypeName',
      type: 'string',
      label: intl.get(`${preCode}.transactionTypeName`).d('事务类型名称'),
    },
  ],
  fields: [
    {
      name: 'transactionClass',
      type: 'string',
      label: intl.get(`${preCode}.transactionClass`).d('事务大类'),
      lookupCode: lmdsTransactionType.transactionClass,
      required: true,
    },
    {
      name: 'transactionTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.transactionType`).d('事务类型'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'transactionTypeName',
      type: 'intl',
      label: intl.get(`${preCode}.transactionTypeName`).d('事务类型名称'),
      required: true,
    },
    {
      name: 'transactionTypeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.transactionTypeAlias`).d('事务类型简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.transactionTypeDesc`).d('事务类型描述'),
      validator: descValidator,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
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
      name: 'transactionCategory',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
    },
    {
      name: 'externalCode',
      type: 'string',
      label: intl.get(`${preCode}.externalCode`).d('外部事务编码'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部事务ID'),
      min: 1,
      step: 1,
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
  },
});
