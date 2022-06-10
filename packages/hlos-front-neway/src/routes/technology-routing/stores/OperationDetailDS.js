/**
 * @Description: 工艺路线工序详情--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ComponentListDS from './ComponentListDS';
import ResourceListDS from './ResourceListDS';
import StepListDS from './StepListDS';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDSS}/v1/${organizationId}/neway-routing-operations`;

export default () => ({
  selection: false,
  primaryKey: 'routingOperationId',
  children: {
    componentList: new DataSet({ ...ComponentListDS() }),
    resourceList: new DataSet({ ...ResourceListDS() }),
    stepList: new DataSet({ ...StepListDS() }),
  },
  fields: [
    {
      name: 'sequenceNum',
      type: 'string',
      label: intl.get(`${preCode}.sequenceNum`).d('序号'),
      required: true,
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('标准工序'),
      lovCode: common.operation,
      textField: 'operationCode',
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationCode',
      type: 'string',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationName',
      type: 'intl',
      label: intl.get(`${preCode}.operationName`).d('工序名称'),
      required: true,
      bind: 'operationObj.operationName',
    },
    {
      name: 'operationAlias',
      type: 'intl',
      label: intl.get(`${preCode}.operationAlias`).d('工序简称'),
      bind: 'operationObj.operationAlias',
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.operationDesc`).d('工序描述'),
      bind: 'operationObj.description',
    },
    {
      name: 'routingOperationType',
      type: 'string',
      label: intl.get(`${preCode}.operationType`).d('工序类型'),
      lookupCode: common.operationType,
      required: true,
    },
    {
      name: 'keyOperationFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyOperationFlag`).d('关键工序'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'preSequenceNum',
      type: 'string',
      label: intl.get(`${preCode}.preSequenceNum`).d('前工序'),
    },
    {
      name: 'operationGroup',
      type: 'string',
      label: intl.get(`${preCode}.operationGroup`).d('工序组'),
    },
    {
      name: 'reworkOperation',
      type: 'string',
      label: intl.get(`${preCode}.reworkOperation`).d('返工工序'),
    },
    {
      name: 'processTime',
      type: 'number',
      label: intl.get(`${preCode}.processTime`).d('加工时间'),
      validator: positiveNumberValidator,
      bind: 'operationObj.processTime',
    },
    {
      name: 'standardWorkTime',
      type: 'number',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      validator: positiveNumberValidator,
      bind: 'operationObj.standardWorkTime',
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.standardWorkTime`).d('参考文件'),
      bind: 'operationObj.referenceDocument',
    },
    {
      name: 'processProgram',
      type: 'string',
      label: intl.get(`${preCode}.processProgram`).d('加工程序'),
      bind: 'operationObj.processProgram',
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
      name: 'instruction',
      type: 'string',
      label: intl.get(`${preCode}.instruction`).d('工艺路线说明'),
      bind: 'operationObj.instruction',
    },
    {
      name: 'downstreamOperation',
      type: 'string',
      label: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为EXECUTE
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRuleName',
      type: 'string',
      bind: 'executeRuleObj.ruleName',
    },
    {
      name: 'inspectionRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为INSPECTION
      lovPara: {
        ruleType: 'INSPECTION',
      },
    },
    {
      name: 'inspectionRuleId',
      type: 'string',
      bind: 'inspectionRuleObj.ruleId',
    },
    {
      name: 'inspectionRuleName',
      type: 'string',
      bind: 'inspectionRuleObj.ruleName',
    },
    {
      name: 'dispatchRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为DISPATCH
      lovPara: {
        ruleType: 'DISPATCH',
      },
    },
    {
      name: 'dispatchRuleId',
      type: 'string',
      bind: 'dispatchRuleObj.ruleId',
    },
    {
      name: 'dispatchRuleName',
      type: 'string',
      bind: 'dispatchRuleObj.ruleName',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('打包规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为PACKING
      lovPara: {
        ruleType: 'PACKING',
      },
    },
    {
      name: 'packingRuleId',
      type: 'string',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRuleName',
      type: 'string',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'reworkRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reworkRule`).d('返工规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为REWORK
      lovPara: {
        ruleType: 'REWORK',
      },
    },
    {
      name: 'reworkRuleId',
      type: 'string',
      bind: 'reworkRuleObj.ruleId',
    },
    {
      name: 'reworkRuleName',
      type: 'string',
      bind: 'reworkRuleObj.ruleName',
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部序号'),
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
    read: ({ data }) => {
      return {
        url,
        data: {
          routingOperationId: data.routingOperationId,
        },
        method: 'get',
      };
    },
    submit: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'post',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      const operationObj = record.get('operationObj');
      if (name === 'operationObj' && !isEmpty(operationObj)) {
        const {
          collectorId,
          collectorName,
          executeRuleId,
          executeRuleName,
          inspectionRuleId,
          inspectionRuleName,
          dispatchRuleId,
          dispatchRuleName,
          packingRuleId,
          packingRuleName,
          reworkRuleId,
          reworkRuleName,
          operationType,
          keyOperationFlag,
        } = operationObj;
        record.set('collectorObj', {
          collectorId,
          collectorName,
        });
        record.set('executeRuleObj', {
          ruleId: executeRuleId,
          ruleName: executeRuleName,
        });
        record.set('inspectionRuleObj', {
          ruleId: inspectionRuleId,
          ruleName: inspectionRuleName,
        });
        record.set('dispatchRuleObj', {
          ruleId: dispatchRuleId,
          ruleName: dispatchRuleName,
        });
        record.set('packingRuleObj', {
          ruleId: packingRuleId,
          ruleName: packingRuleName,
        });
        record.set('reworkRuleObj', {
          ruleId: reworkRuleId,
          ruleName: reworkRuleName,
        });
        record.set('routingOperationType', operationType);
        record.set('keyOperationFlag', !!keyOperationFlag);
      }
    },
    submit: ({ dataSet, data }) => {
      const dataObj = data;
      dataObj[0].routingId = dataSet.queryParameter.routingId;
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
