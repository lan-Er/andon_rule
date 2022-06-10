/**
 * @Description: 单件流报工--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-16 20:28:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmesTaskReport, lmesOnePieceFlowReport } = codeConfig.code;

const commonCode = 'lmes.common.model';
const preCode = 'lmes.onePieceFlowReport.model';

const LoginDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'organizationCode',
    },
    {
      name: 'organizationName',
    },
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      required: true,
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'fileUrl',
      bind: 'workerObj.fileUrl',
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'prodLineId',
      bind: 'workcellObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      bind: 'workcellObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      bind: 'workcellObj.prodLineName',
    },
    {
      name: 'calendarDay',
      type: 'date',
      label: intl.get(`${commonCode}.time`).d('时间'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      required: true,
      defaultValue: moment(),
    },
    {
      name: 'calendarShiftCode',
      type: 'string',
      label: intl.get(`${commonCode}.shift`).d('班次'),
      lookupCode: common.shift,
      required: true,
      defaultValue: 'MORNING SHIFT',
    },
    {
      name: 'calendarShiftCodeMeaning',
      bind: 'calendarShiftCode.meaning',
    },
    {
      name: 'reworkFlag',
      type: 'boolean',
    },
  ],
});

const QueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'moObj',
      type: 'object',
      label: intl.get(`${commonCode}.moNum`).d('MO号'),
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
      bind: 'moObj.moId',
    },
    {
      name: 'moNum',
      bind: 'moObj.moNum',
    },
    {
      name: 'moOperationObj',
      type: 'object',
      label: intl.get(`${commonCode}.operation`).d('工序'),
      lovCode: common.moOperation,
      ignore: 'always',
      required: true,
      cascadeMap: { moId: 'moId' },
    },
    {
      name: 'moOperationId',
      bind: 'moOperationObj.operationId',
    },
    {
      name: 'moOperationCode',
      bind: 'moOperationObj.operationCode',
    },
    {
      name: 'moOperationName',
      bind: 'moOperationObj.operationName',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${commonCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
      required: true,
    },
    {
      name: 'operationId',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationCode',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationName',
      bind: 'operationObj.operationName',
    },
    {
      name: 'snCode',
      type: 'string',
      label: intl.get(`${preCode}.snCode`).d('SN编码'),
      required: true,
    },
    {
      name: 'productCode',
      type: 'string',
      label: intl.get(`${preCode}.productCode`).d('产品码'),
      required: true,
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'outerTagCode',
      type: 'string',
      label: intl.get(`${preCode}.outerTagCode`).d('箱码'),
      required: true,
    },
    {
      name: 'unloadCode',
      type: 'string',
      label: intl.get(`${preCode}.snNumber`).d('SN号'),
      required: true,
    },
    {
      name: 'itemControlType',
    },
    {
      name: 'taskId',
    },
    {
      name: 'input',
      type: 'string',
      required: true,
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: lmesTaskReport.taskItem,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemLineType: 'INPUT',
          taskId: record.get('taskId'),
          itemControlType: record.get('itemControlType'),
          supplyType: 'PUSH',
        }),
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'moObj') {
        record.set('moOperationObj', null);
      }
    },
  },
});

const TemplateDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagTemplateObj',
      type: 'object',
      label: intl.get(`${preCode}.template`).d('模板'),
      lovCode: lmesOnePieceFlowReport.tagTemplate,
    },
    {
      name: 'reportCode',
      type: 'string',
      bind: 'tagTemplateObj.reportCode',
    },
  ],
});

const UnbindDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'moId',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签号'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lotNumber`).d('批次号'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.moComponent,
      ignore: 'always',
      noCache: true,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          moId: record.get('moId'),
        }),
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.componentItemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.componentItemCode',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouseObj`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaId`).d('货位'),
      lovCode: common.wmArea,
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
  ],
});

const InspectQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'moObj',
      type: 'object',
      label: intl.get(`${commonCode}.moNum`).d('MO号'),
      lovCode: common.document,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          documentClass: 'MO',
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'moId',
      bind: 'moObj.documentId',
    },
    {
      name: 'moNum',
      bind: 'moObj.documentNum',
    },
    {
      name: 'moOperationObj',
      type: 'object',
      label: intl.get(`${commonCode}.operation`).d('工序'),
      lovCode: common.moOperation,
      ignore: 'always',
      required: true,
      cascadeMap: { moId: 'moId' },
    },
    {
      name: 'moOperationId',
      bind: 'moOperationObj.operationId',
    },
    {
      name: 'moOperationCode',
      bind: 'moOperationObj.operationCode',
    },
    {
      name: 'moOperationName',
      bind: 'moOperationObj.operationName',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签号'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lotNumber`).d('批次号'),
    },
  ],
});

export { LoginDS, QueryDS, TemplateDS, UnbindDS, InspectQueryDS };
