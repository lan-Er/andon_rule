/*
 * @Author: zhang yang
 * @Description: 工序 明细 steps DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';

const { lmdsOperation } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.operation.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-steps`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'operationStepNum',
      type: 'number',
      label: intl.get(`${preCode}.operationStepNum`).d('步骤行号'),
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'operationStepCode',
      type: 'string',
      label: intl.get(`${preCode}.operationStep`).d('步骤'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'operationStepName',
      type: 'intl',
      label: intl.get(`${preCode}.operationStepName`).d('步骤名称'),
      required: true,
    },
    {
      name: 'operationStepAlias',
      type: 'intl',
      label: intl.get(`${preCode}.operationStepAlias`).d('步骤简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.operationStepDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'operationStepType',
      type: 'string',
      label: intl.get(`${preCode}.operationStepType`).d('步骤类型'),
      lookupCode: lmdsOperation.operationStepType,
      required: true,
    },
    {
      name: 'keyStepFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyStepFlag`).d('关键步骤'),
      defaultValue: true,
    },
    {
      name: 'processRule',
      type: 'string',
      label: intl.get(`${preCode}.processRule`).d('处理规则'),
    },
    {
      name: 'collector',
      type: 'object',
      label: intl.get(`${preCode}.collector`).d('数据收集'),
      lovCode: lmdsOperation.collector,
      ignore: 'always',
    },
    {
      name: 'collectorId',
      type: 'string',
      bind: 'collector.collectorId',
    },
    {
      name: 'collectorName',
      type: 'string',
      bind: 'collector.collectorName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('endDate'))) {
            return 'endDate';
          }
        },
      },
      required: true,
      defaultValue: NOW_DATE,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
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
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
