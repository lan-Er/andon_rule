/**
 * @Description: 事件管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-18 15:23:37
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmdsEventType } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.eventType.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/event-types`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'eventTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.eventType`).d('事件类型'),
    },
    {
      name: 'eventTypeName',
      type: 'string',
      label: intl.get(`${preCode}.eventTypeName`).d('事件类型名称'),
    },
  ],
  fields: [
    {
      name: 'eventClass',
      type: 'string',
      label: intl.get(`${preCode}.eventTypeClass`).d('事件大类'),
      lookupCode: lmdsEventType.eventClass,
      required: true,
    },
    {
      name: 'eventTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.eventType`).d('事件类型'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'eventTypeName',
      type: 'intl',
      label: intl.get(`${preCode}.eventTypeName`).d('事件类型名称'),
      required: true,
    },
    {
      name: 'eventTypeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.eventTypeAlias`).d('事件类型简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.eventTypeDesc`).d('事件类型描述'),
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
      name: 'organization',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'eventCategory',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
    },
    {
      name: 'relatedEventTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedEventType`).d('关联事件类型'),
      lovCode: common.eventType,
      ignore: 'always',
    },
    {
      name: 'relatedEventTypeId',
      type: 'string',
      bind: 'relatedEventTypeObj.eventTypeId',
    },
    {
      name: 'relatedEventType',
      type: 'string',
      bind: 'relatedEventTypeObj.eventTypeName',
    },
    {
      name: 'relatedTransactionTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedTransactionType`).d('关联事务类型'),
      lovCode: common.transactionType,
      ignore: 'always',
    },
    {
      name: 'relatedTransactionTypeId',
      type: 'string',
      bind: 'relatedTransactionTypeObj.transactionTypeId',
    },
    {
      name: 'relatedTransactionType',
      type: 'string',
      bind: 'relatedTransactionTypeObj.transactionTypeName',
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
