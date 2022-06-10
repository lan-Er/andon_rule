/**
 * @Description: 进出炉报工--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-04-26 10:28:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmesTaskReport } = codeConfig.code;

const commonCode = 'lmes.common.model';
const preCode = 'lmes.inOutFurnaceReport.model';

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
          PLBG: 1,
        }),
      },
      ignore: 'always',
      required: true,
      noCache: true,
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
      name: 'documentTypeCode',
      bind: 'moObj.documentTypeCode',
    },
    {
      name: 'moOperationObj',
      type: 'object',
      label: intl.get(`${commonCode}.operation`).d('工序'),
      lovCode: common.moOperation,
      ignore: 'always',
      required: true,
      noCache: true,
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
      noCache: true,
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
    // 准备页签输入框
    {
      name: 'snNumber',
      type: 'string',
      label: intl.get(`${preCode}.snCode`).d('SN号'),
    },
    {
      name: 'containerNumber',
      type: 'string',
      label: intl.get(`${preCode}.containerNumber`).d('容器号'),
    },
    {
      name: 'furnaceLot',
      type: 'string',
      label: intl.get(`${preCode}.furnaceLot`).d('炉批次'),
    },

    // 清洗、检验页签输入框
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签号'),
    },
    {
      name: 'defaultQty',
      type: 'number',
    },
    {
      name: 'qcType',
      type: 'string',
      lookupCode: lmesTaskReport.qcType,
      defaultValue: 'OK',
    },
    {
      name: 'ruleFlag',
      type: 'boolean',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: common.supplier,
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
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

export { LoginDS, QueryDS };
