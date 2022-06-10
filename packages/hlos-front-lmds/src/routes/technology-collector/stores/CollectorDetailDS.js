/*
 * @Author: zhang yang
 * @Description: 数据收集项 详情 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:04:10
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import ContextLineDS from './ContextLineDS';

const { lmdsCollector } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.collector.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/collectors`;

export default () => ({
  primaryKey: 'collectorId',
  selection: false,
  children: {
    collectorLineList: new DataSet({ ...ContextLineDS() }),
  },
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
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
});
