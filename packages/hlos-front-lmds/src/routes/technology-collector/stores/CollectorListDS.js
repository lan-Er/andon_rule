/*
 * @Author: zhang yang
 * @Description: 收集项 - List
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:33
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsCollector } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.collector.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/collectors`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'collectorCode',
      type: 'string',
      label: intl.get(`${preCode}.collectorCode`).d('收集项'),
    },
    {
      name: 'collectorName',
      type: 'string',
      label: intl.get(`${preCode}.collectorName`).d('收集项名称'),
    },
  ],
  fields: [
    {
      name: 'collectorType',
      type: 'string',
      label: intl.get(`${preCode}.collectorType`).d('收集项类型'),
      lookupCode: lmdsCollector.collectorType,
      required: true,
    },
    {
      name: 'collectorCode',
      type: 'string',
      label: intl.get(`${preCode}.collectorCode`).d('收集项'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'collectorName',
      type: 'intl',
      label: intl.get(`${preCode}.collectorName`).d('收集项名称'),
      required: true,
    },
    {
      name: 'collectorAlias',
      type: 'intl',
      label: intl.get(`${preCode}.collectorAlias`).d('收集项简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.collectorDesc`).d('收集项描述'),
      validator: descValidator,
    },
    {
      name: 'collectorRule',
      type: 'string',
      label: intl.get(`${preCode}.collectorRule`).d('收集方法'),
      lookupCode: lmdsCollector.collectorRule,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
    create: () => {
      return {
        url,
        method: 'post',
      };
    },
    update: () => {
      return {
        url,
        method: 'put',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
