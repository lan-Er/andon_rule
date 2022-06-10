/*
 * @Author: zhang yang
 * @Description: 检验项目 - list-dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 14:19:20
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
// import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
// import statusConfig from '@/common/statusConfig';

const { common, newayLov, newayValue } = codeConfig.code;
// const {
//   lovPara: { inspectionGroup },
// } = statusConfig.statusValue.lmds;
const organizationId = getCurrentOrganizationId();
const preCode = 'neway.dispatchOrder';
const commonCode = 'lmds.common.model';

const listTableDs = () => ({
  selection: 'multiple',
  autoQuery: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'moNumObj',
      type: 'object',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
      // lovCode: 'LMES.NP_MO',
      lovCode: newayLov.moNum,
      ignore: 'always',
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'moNumObj.moId',
    },
    {
      name: 'moTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.moType`).d('工单类型'),
      // lovCode: 'LMDS.DOCUMENT_TYPE',
      lovCode: newayLov.documentType,
      ignore: 'always',
      lovPara: { documentClass: 'NP_MO' },
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'moTypeObj.documentTypeId',
    },
  ],
  fields: [
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.moType`).d('工单类型'),
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('工单状态'),
      // lookupCode: 'LMES.MO_STATUS',
      lookupCode: newayValue.moStatus,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
    {
      name: 'costCenterName',
      type: 'string',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      validator: descValidator,
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.MO`).d('生产订单'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'attributeString3',
      type: 'string',
      label: intl.get(`${commonCode}.totalWorkingHours`).d('总工时'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mos`,
        data,
        method: 'GET',
      };
    },
  },
});

const lineTableDs = () => ({
  autoQuery: false,
  selection: false,
  pageSize: 10,
  fields: [
    {
      name: 'taskNum',
      type: 'string',
      label: intl.get(`${preCode}.taskNum`).d('任务编号'),
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: 'LMES.TASK_STATUS',
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${preCode}.workerNum`).d('分配人员'),
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.assignScale`).d('分配比列'),
      validator: descValidator,
    },
    {
      name: 'executableProcessedTime',
      type: 'string',
      label: intl.get(`${preCode}.executableProcessedTime`).d('可报工工时'),
    },
    {
      name: 'processedTime',
      type: 'string',
      label: intl.get(`${preCode}.processedTime`).d('已报工时'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-tasks`,
        method: 'GET',
      };
    },
  },
});

const orderOperationDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      // lovCode: 'LMES.NP_OPERATION',
      lovCode: newayLov.operation,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'operation',
      type: 'string',
      bind: 'operationObj.operation',
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${preCode}.standardWorkTime`).d('工序工时'),
      bind: 'operationObj.standardWorkTime',
    },
  ],
  transport: {
    read: ({ data = {} }) => {
      const { moId } = data;
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-tasks/operations`,
        method: 'GET',
        data: { documentId: moId },
      };
    },
  },
});

const operationAssignDs = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${preCode}.assignWorker`).d('分配人员'),
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.assignScale`).d('分配比例'),
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${preCode}.assignWorkTime`).d('分配工时'),
    },
    {
      name: 'processedTime',
      type: 'string',
      label: intl.get(`${preCode}.processedTime`).d('已报工时'),
    },
  ],
  transport: {
    read: ({ data = {} }) => {
      const { moId } = data;
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-tasks`,
        method: 'GET',
        data: { documentId: moId },
      };
    },
  },
});

const detailDs = () => ({
  autoQuery: false,
  selection: false,
  pageSize: 10,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.taskNum`).d('工厂'),
      // lovCode: 'LMDS.SINGLE.ME_OU',
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'ownerOrganizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'ownerOrganizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'moTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.moType`).d('工单类型'),
      // lovCode: 'LMDS.DOCUMENT_TYPE',
      lovCode: newayLov.documentType,
      ignore: 'always',
      required: true,
      lovPara: { documentClass: 'NP_MO' },
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'moTypeObj.documentTypeId',
    },
    {
      name: 'moTypeCode',
      type: 'string',
      bind: 'moTypeObj.documentTypeCode',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'moTypeObj.documentTypeName',
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('工单号'),
      disabled: true,
    },
    {
      name: 'moStatus',
      type: 'string',
      label: intl.get(`${preCode}.moStatus`).d('工单状态'),
      lookupCode: 'LMES.MO_STATUS',
    },
    {
      name: 'costCenterObj',
      type: 'object',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      validator: descValidator,
      // lovCode: 'LMDS.COST_CENTER_CODE',
      lovCode: newayLov.costCenter,
      ignore: 'always',
      required: true,
    },
    {
      name: 'attributeString1',
      type: 'string',
      bind: 'costCenterObj.costCenterId',
    },
    {
      name: 'attributeString2',
      type: 'string',
      bind: 'costCenterObj.costCenterCode',
    },
    {
      name: 'costCenterName',
      type: 'string',
      bind: 'costCenterObj.costCenterName',
    },
    {
      name: 'sourceDocNumObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源生产订单号'),
      // lovCode: 'LMES.MO',
      lovCode: newayLov.sourceDocNum,
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocNumObj.sourceDocId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocNumObj.sourceDocNum',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      required: true,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'attributeString6',
      type: 'string',
      label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      bind: 'itemObj.description',
      disabled: true,
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: intl.get(`${commonCode}.totalWorkingHours`).d('总工时(min)'),
      disabled: true,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: ({ data = {} }) => {
      const { moId = '', ...other } = data;
      if (moId) {
        return {
          url: `${HLOS_LMESS}/v1/${organizationId}/neway-mos/detail/${moId}`,
          method: 'GET',
          data: other,
        };
      }
    },
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-mos/save`,
        data: data[0],
        method: 'POST',
      };
    },
  },
});

const assignModalDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'jobNumberObj',
      type: 'object',
      label: intl.get(`${preCode}.jobNumber`).d('工号'),
      required: true,
      // lovCode: 'LMDS.WORKER',
      lovCode: common.worker,
      ignore: 'always',
      textField: 'workerCode',
    },
    {
      name: 'worker',
      type: 'string',
      bind: 'jobNumberObj.workerCode',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'jobNumberObj.workerId',
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${preCode}.name`).d('名称'),
      disabled: true,
      bind: 'jobNumberObj.workerName',
    },
    {
      name: 'attributeString1',
      type: 'number',
      label: intl.get(`${preCode}.scale`).d('比例(100%)'),
      required: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMESS}/v1/${organizationId}/neway-tasks`,
        method: 'GET',
      };
    },
  },
});

export { listTableDs, lineTableDs, detailDs, orderOperationDS, operationAssignDs, assignModalDS };
