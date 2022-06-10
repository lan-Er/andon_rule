/**
 * @Description: Mo工序管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 09:45:02
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesMoWorkspace } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.moOperation.model';
const commonCode = 'lmes.common.model';

const ResourceLineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'resource',
        label: intl.get(`${commonCode}.resource`).d('资源'),
      },
      {
        name: 'preferredFlag',
        label: intl.get(`${preCode}.preferredFlag`).d('优选标识'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-operation-resources`,
          method: 'GET',
        };
      },
    },
  };
};
const StepLineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'operationStepNum',
        label: intl.get(`${commonCode}.lineNum`).d('行号'),
      },
      {
        name: 'operationStepCode',
        label: intl.get(`${preCode}.operationStepCode`).d('步骤'),
      },
      {
        name: 'operationStepName',
        label: intl.get(`${preCode}.operationStepName`).d('步骤名称'),
      },
      {
        name: 'operationStepAlias',
        label: intl.get(`${preCode}.operationStepAlias`).d('步骤简称'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.description`).d('描述'),
      },
      {
        name: 'operationStepTypeMeaning',
        label: intl.get(`${preCode}.operationStepType`).d('步骤类型'),
      },
      {
        name: 'keyStepFlag',
        label: intl.get(`${preCode}.keyStepFlag`).d('关键步骤'),
      },
      {
        name: 'processRule',
        label: intl.get(`${preCode}.processRule`).d('处理规则'),
      },
      {
        name: 'collector',
        label: intl.get(`${preCode}.collector`).d('数据收集'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabled`).d('是否有效'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-operation-steps`,
          method: 'GET',
        };
      },
    },
  };
};

const ComponentLineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'lineNum',
        label: intl.get(`${commonCode}.lineNum`).d('行号'),
      },
      {
        name: 'moComponentLineNum',
        label: intl.get(`${preCode}.moComponentLineNum`).d('MO组件行'),
      },
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'componentItemCode',
        label: intl.get(`${preCode}.componentItemCode`).d('组件物料'),
      },
      {
        name: 'componentItemDescription',
        label: intl.get(`${preCode}.componentDesc`).d('组件描述'),
      },
      {
        name: 'componentQty',
        label: intl.get(`${preCode}.componentQty`).d('组件数量'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabled`).d('是否有效'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-operation-components`,
          method: 'GET',
        };
      },
    },
  };
};

const resourceLineDS = new DataSet(ResourceLineDS());
const stepLineDS = new DataSet(StepLineDS());
const componentLineDS = new DataSet(ComponentLineDS());

const MoOperationListDS = () => {
  return {
    primaryKey: 'moOperationId',
    selection: false,
    paging: false,
    pageSize: 100,
    children: {
      resourceLineDS,
      stepLineDS,
      componentLineDS,
    },
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        // required: true,
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
        ignore: 'always',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumObj.moId',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNum',
      },
      {
        name: 'item',
        type: 'string',
        label: intl.get(`${commonCode}.item`).d('物料'),
        ignore: 'always',
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        ignore: 'always',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        ignore: 'always',
      },
      {
        name: 'makeQty',
        type: 'number',
        label: intl.get(`${preCode}.makeQty`).d('制造数量'),
        ignore: 'always',
      },
      {
        name: 'moStatus',
        type: 'string',
        lookupCode: lmesMoWorkspace.moStatus,
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        ignore: 'always',
      },
      {
        name: 'planStartDate',
        type: 'string',
        label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
        ignore: 'always',
      },
      {
        name: 'planEndDate',
        type: 'string',
        label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
        ignore: 'always',
      },
      {
        name: 'routingVersion',
        type: 'string',
        label: intl.get(`${preCode}.routingVersion`).d('工艺版本'),
        ignore: 'always',
      },
      {
        name: 'moTypeName',
        type: 'string',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'sequenceNum',
        label: intl.get(`${preCode}.sequenceNum`).d('序号'),
      },
      {
        name: 'operationCode',
        label: intl.get(`${preCode}.operation`).d('标准工序'),
      },
      {
        name: 'operationName',
        label: intl.get(`${preCode}.operationName`).d('工序名称'),
      },
      {
        name: 'operationAlias',
        label: intl.get(`${preCode}.operationAlias`).d('工序简称'),
      },
      {
        name: 'description',
        label: intl.get(`${preCode}.operationDesc`).d('工序描述'),
      },
      {
        name: 'operationTypeMeaning',
        label: intl.get(`${preCode}.operationType`).d('工序类型'),
      },
      {
        name: 'keyOperationFlag',
        label: intl.get(`${preCode}.keyOperation`).d('关键工序'),
      },
      {
        name: 'preSequenceNum',
        label: intl.get(`${preCode}.preOperation`).d('前工序'),
      },
      {
        name: 'operationGroup',
        label: intl.get(`${preCode}.operationGroup`).d('工序组'),
      },
      {
        name: 'reworkOperation',
        label: intl.get(`${preCode}.reworkOperation`).d('返工工序'),
      },
      {
        name: 'processTime',
        label: intl.get(`${preCode}.processTime`).d('加工时间'),
      },
      {
        name: 'standardWorkTime',
        label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      },
      {
        name: 'referenceDocument',
        label: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
      },
      {
        name: 'processProgram',
        label: intl.get(`${preCode}.processProgram`).d('加工程序'),
      },
      {
        name: 'collector',
        label: intl.get(`${preCode}.collector`).d('数据收集'),
      },
      {
        name: 'instruction',
        label: intl.get(`${preCode}.instruction`).d('工序说明'),
      },
      {
        name: 'downstreamOperation',
        label: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
      },
      {
        name: 'executeRule',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      },
      {
        name: 'inspectionRule',
        label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      },
      {
        name: 'dispatchRule',
        label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      },
      {
        name: 'packingRule',
        label: intl.get(`${preCode}.packingRule`).d('打包规则'),
      },
      {
        name: 'reworkRule',
        label: intl.get(`${preCode}.reworkRule`).d('返工规则'),
      },
      {
        name: 'releasedTaskFlag',
        label: intl.get(`${preCode}.releasedTaskFlag`).d('已发放任务'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        label: intl.get(`${preCode}.enabled`).d('是否有效'),
      },
      {
        name: 'externalId',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部编号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-operations`,
          method: 'GET',
        };
      },
    },
  };
};

export {
  MoOperationListDS,
};
