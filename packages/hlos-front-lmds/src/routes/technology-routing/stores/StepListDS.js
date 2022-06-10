/**
 * @Description: 工艺路线工序详情--步骤tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { descValidator } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-steps`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'operationStepNum',
      type: 'string',
      label: intl.get(`${preCode}.operationStepNum`).d('步骤行号'),
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'operationStepCode',
      type: 'string',
      label: intl.get(`${preCode}.operationStep`).d('步骤'),
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
      label: intl.get(`${commonCode}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'operationStepType',
      type: 'string',
      label: intl.get(`${preCode}.operationStepType`).d('步骤类型'),
      lookupCode: common.operationStepType,
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
      name: 'collectorObj',
      type: 'object',
      label: intl.get(`${preCode}.collector`).d('数据收集'),
      lovCode: common.collector,
      ignore: 'always',
    },
    {
      name: 'collectorId',
      type: 'string',
      bind: 'collectorObj.collectorId',
    },
    {
      name: 'collectorName',
      type: 'string',
      bind: 'collectorObj.collectorName',
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
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
