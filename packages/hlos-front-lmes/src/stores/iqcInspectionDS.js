/*
 * @module: IQC检验
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-09 14:20:24
 * @LastEditTime: 2021-06-22 10:57:49
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';

const commonCode = 'lmes.iqcInspection.model';
const {
  common,
  lmesMoComponent,
  lmesIqcInspection,
  lmesInspectionDoc,
  lmesPoPrecheck,
  lmesInspectionJudge,
} = codeConfig.code;
const organizationId = getCurrentOrganizationId();

export const queryIqcMainDS = () => {
  return {
    pageSize: 10,
    autoCreate: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        label: intl.get(`${commonCode}.organization`).d('收货组织'),
        ignore: 'always',
        required: true,
      },
      {
        name: 'checkedLine',
        type: 'string',
        defaultValue: 'Y',
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'ticketObject',
        type: 'object',
        lovCode: lmesIqcInspection.source,
        ignore: 'always',
        label: intl.get(`${commonCode}.ticket`).d('送货单号'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId') };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'samplingType',
        label: intl.get(`${commonCode}.samplingType`).d('检验类型'),
        lookupCode: lmesInspectionDoc.samplingType,
        type: 'string',
      },
      {
        name: 'ticketId',
        type: 'string',
        bind: 'ticketObject.ticketId',
      },
      {
        name: 'ticketNum',
        type: 'string',
        bind: 'ticketObject.ticketNum',
      },
      {
        name: 'ticketLineStatus',
        type: 'string',
        lookupCode: lmesInspectionDoc.ticketStatus,
        label: intl.get(`${commonCode}.ticketLineStatus`).d('送货单行状态'),
        multiple: true,
        // defaultValue: ['RECEIVED', 'RECEIVING'],
      },
      {
        name: 'partyObject',
        type: 'object',
        lovCode: lmesMoComponent.supplier,
        ignore: 'always',
        label: intl.get(`${commonCode}.party`).d('供应商'),
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'partyObject.partyName',
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObject.partyId',
      },
      {
        name: 'itemObj',
        type: 'object',
        lovCode: common.item,
        ignore: 'always',
        label: intl.get(`${commonCode}.item`).d('物料'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId') };
            } else {
              return {
                organizationId: 'undefined',
              };
            }
          },
        },
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
        ignore: 'always',
      },
      {
        name: 'documentObject',
        type: 'object',
        lovCode: lmesPoPrecheck.po,
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId'), documentClass: 'PO' };
            } else {
              return {
                organizationId: 'undefined',
                documentClass: 'PO',
              };
            }
          },
        },
        ignore: 'always',
        label: intl.get(`${commonCode}.document`).d('采购订单号'),
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'documentObject.poId',
      },
      {
        name: 'inspectionDocObj',
        type: 'object',
        lovCode: lmesInspectionDoc.inspectionDocNum,
        ignore: 'always',
        label: intl.get(`${commonCode}.inspection`).d('检验单号'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return {
                organizationId: record.get('organizationId'),
                INSPECTION_TEMPLATE_TYPE: 'IQC.NORMAL',
              };
            } else {
              return {
                organizationId: 'undefined',
                INSPECTION_TEMPLATE_TYPE: 'IQC.NORMAL',
              };
            }
          },
        },
      },
      {
        name: 'inspectionDocNum',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocNum',
        ignore: 'always',
      },
      {
        name: 'inspectionDocId',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocId',
      },
      {
        name: 'qcResult',
        type: 'string',
        label: intl.get(`${commonCode}.qcResult`).d('判定结果'),
        lookupCode: lmesInspectionDoc.qcResult,
      },
      {
        name: 'receiveWorkerObj',
        type: 'object',
        lovCode: common.worker,
        ignore: 'always',
        label: intl.get(`${commonCode}.receiveWorker`).d('接收员工'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId') };
            } else {
              return {
                organizationId: 'undefined',
              };
            }
          },
        },
      },
      {
        name: 'receiveWorkerName',
        type: 'string',
        bind: 'receiveWorkerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'receiveWorkerId',
        type: 'string',
        bind: 'receiveWorkerObj.workerId',
      },
      {
        name: 'qcFlag',
        label: intl.get(`${commonCode}.inspectionFlag`).d('是否报检'),
        lookupCode: lmesInspectionJudge.qcFlag,
        type: 'string',
      },
      {
        name: 'declarerObj',
        type: 'object',
        lovCode: common.worker,
        ignore: 'always',
        label: intl.get(`${commonCode}.declarer`).d('报检员工'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId') };
            } else {
              return {
                organizationId: 'undefined',
              };
            }
          },
        },
      },
      {
        name: 'declarerName',
        type: 'string',
        bind: 'declarerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'declarerId',
        type: 'string',
        bind: 'declarerObj.workerId',
      },
      {
        name: 'inspectorObj',
        type: 'object',
        lovCode: common.worker,
        ignore: 'always',
        label: intl.get(`${commonCode}.inspector`).d('判定员工'),
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationId')) {
              return { organizationId: record.get('organizationId') };
            } else {
              return {
                organizationId: 'undefined',
              };
            }
          },
        },
      },
      {
        name: 'inspectorName',
        type: 'string',
        bind: 'inspectorObj.workerName',
        ignore: 'always',
      },
      {
        name: 'inspectorId',
        type: 'string',
        bind: 'inspectorObj.workerId',
      },
      {
        name: 'receiveDateLeft',
        label: intl.get(`${commonCode}.receiveDateLeft`).d('接收时间>='),
        type: 'dateTime',
        max: 'receiveDateRight',
      },
      {
        name: 'receiveDateRight',
        label: intl.get(`${commonCode}.receiveDateRight`).d('接收时间<='),
        type: 'dateTime',
        min: 'receiveDateLeft',
      },
      {
        name: 'creationDateLeft',
        label: intl.get(`${commonCode}.creationDateLeft`).d('报检时间>='),
        type: 'dateTime',
        mix: 'creationDateRight',
      },
      {
        name: 'creationDateRight',
        label: intl.get(`${commonCode}.creationDateRight`).d('报检时间<='),
        type: 'dateTime',
        min: 'creationDateLeft',
      },
      {
        name: 'judgeDateLeft',
        label: intl.get(`${commonCode}.judgeDateLeft`).d('判定时间>='),
        type: 'dateTime',
        max: 'judgeDateRight',
      },
      {
        name: 'judgeDateRight',
        label: intl.get(`${commonCode}.judgeDateRight`).d('判定时间<='),
        type: 'dateTime',
        min: 'judgeDateLeft',
      },
    ],
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        label: intl.get(`${commonCode}.organization`).d('收货组织'),
        ignore: 'always',
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationCode',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'joinTicketNum',
        label: intl.get(`${commonCode}.joinTicket`).d('送货单'),
        type: 'string',
      },
      {
        name: 'ticketObject',
        type: 'object',
        lovCode: lmesIqcInspection.source,
        ignore: 'always',
      },
      {
        name: 'ticketId',
        type: 'string',
        bind: 'ticketObject.ticketId',
      },
      {
        name: 'ticketNum',
        type: 'string',
        bind: 'ticketObject.ticketNum',
      },
      {
        name: 'itemObj',
        type: 'object',
        lovCode: common.item,
        ignore: 'always',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemDescription',
        type: 'string',
        bind: 'itemObj.itemDescription',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'ticketLineStatus',
        type: 'string',
        lookupCode: lmesInspectionDoc.ticketStatus,
        label: intl.get(`${commonCode}.ticketLineStatus`).d('送货单行状态'),
      },
      {
        name: 'receivedQty',
        label: intl.get(`${commonCode}.receivedQty`).d('接收数量'),
        type: 'number',
      },
      {
        name: 'waitQty',
        type: 'number',
        label: intl.get(`${commonCode}.waitQty`).d('待检数量'),
      },
      {
        name: 'batchQty',
        type: 'number',
        label: intl.get(`${commonCode}.batchQty`).d('报检数量'),
        min: 0,
        max: 'waitQty',
      },
      {
        name: 'samplingType',
        label: intl.get(`${commonCode}.samplingType`).d('抽样类型'),
        lookupCode: lmesInspectionDoc.samplingType,
        type: 'string',
        dynamicProps: {
          required: ({ record }) => {
            const { isSelected } = record;
            if (isSelected) {
              return true;
            } else {
              return false;
            }
          },
        },
        transformResponse: (value) => {
          if (!value) {
            return 'SAMPLE';
          }
          return value;
        },
      },
      {
        name: 'sampleQty',
        label: intl.get(`${commonCode}.sampleQty`).d('样品数量'),
        type: 'number',
        dynamicProps: {
          required: ({ record }) => {
            const { isSelected } = record;
            if (isSelected) {
              return true;
            } else {
              return false;
            }
          },
        },
        min: 0,
        step: 1,
      },
      {
        name: 'inspectionTemplateTypeMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.inspectionTemplateTypeMeaning`).d('检验模板类型'),
      },
      {
        name: 'joinInspectionTemplate',
        type: 'string',
        label: intl.get(`${commonCode}.joinInspectionTemplate`).d('检验模板'),
      },
      {
        name: 'priority',
        type: 'string',
        label: intl.get(`${commonCode}.priority`).d('紧急度'),
        // lookupCode: lmesIqcInspection.priority,
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'qcDocNum',
        type: 'stirng',
        label: intl.get(`${commonCode}.qcDocNum`).d('检验单号'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${commonCode}.qcOkQty`).d('合格数量'),
        type: 'number',
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${commonCode}.qcNgQty`).d('不合格数量'),
        type: 'number',
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonCode}.supplierName`).d('供应商'),
      },
      {
        name: 'joinPoNum',
        type: 'string',
        label: intl.get(`${commonCode}.joinPoNum`).d('采购订单号'),
      },
      // {
      //   name: 'receiveWorkerObj',
      //   type: 'object',
      //   lovCode: common.worker,
      //   ignore: 'always',
      //   label: intl.get(`${commonCode}.receiveWorker`).d('接收员工'),
      //   textField: 'receiveWorkerName',
      // },
      {
        name: 'receiveWorkerName',
        type: 'string',
        label: intl.get(`${commonCode}.receiveWorker`).d('接收员工'),
        // bind: 'receiveWorkerObj.workerName',
      },
      // {
      //   name: 'receiveWorkerId',
      //   type: 'string',
      //   bind: 'receiveWorkerObj.workerId',
      // },
      {
        name: 'actualArrivalTime',
        label: intl.get(`${commonCode}.actualArrivalTime`).d('接收时间'),
        type: 'dateTime',
      },
      {
        name: 'lotNumber',
        label: intl.get(`${commonCode}.lotNumber`).d('批次'),
        type: 'string',
      },
      {
        name: 'ticketTypeName',
        label: intl.get(`${commonCode}.ticketTypeName`).d('送货单类型'),
        type: 'string',
      },
      {
        name: 'itemControlType',
        label: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
        lookupCode: common.itemControlType,
        type: 'string',
      },
      {
        name: 'receiveWarehouseName',
        label: intl.get(`${commonCode}.receiveWarehouseName`).d('接收仓库'),
        type: 'string',
      },
      {
        name: 'receiveWarehouseCode',
        label: intl.get(`${commonCode}.receiveWarehouseCode`).d('接收仓库code'),
        type: 'string',
      },
      {
        name: 'receiveWmAreaName',
        label: intl.get(`${commonCode}.receiveWmAreaName`).d('接收货位'),
        type: 'string',
      },
      {
        name: 'qcResult',
        type: 'string',
        label: intl.get(`${commonCode}.qcResult`).d('判定结果'),
        lookupCode: lmesInspectionDoc.qcResult,
      },
      {
        name: 'declarerObj',
        type: 'object',
        lovCode: common.worker,
        ignore: 'always',
        label: intl.get(`${commonCode}.declarerObj`).d('报检员工'),
      },
      {
        name: 'declarerName',
        type: 'string',
        bind: 'declarerObj.workerName',
      },
      {
        name: 'declarerId',
        type: 'string',
        bind: 'declarerObj.workerId',
      },
      {
        name: 'inspector',
        type: 'string',
        label: intl.get(`${commonCode}.inspector`).d('判定员工'),
      },
      {
        name: 'judgedDate',
        label: intl.get(`${commonCode}.judgedDate`).d('判定时间'),
        type: 'dateTime',
      },
      {
        name: 'lineRemark',
        label: intl.get(`${commonCode}.lineRemark`).d('送货单备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { ticketLineStatus } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_LMES}/v1/${organizationId}/inspection-docs/iqc-main-query`,
            {
              ticketLineStatus,
            }
          ),
          method: 'GET',
          data: {
            ...data,
            ticketLineStatus: undefined,
            queryFlag: 'main',
          },
        };
      },
      submit: ({ data }) => {
        const url = 'inspection-docs/create-inspection-doc-iqc';
        const newData = data.map((item) =>
          Object.assign(item, {
            iqcSourceType: 'DELIVERY_TICKET',
            sourceDocTypeId: item.ticketTypeId,
            sourceDocTypeCode: item.ticketTypeCode,
            sourceDocId: item.ticketId,
            sourceDocNum: item.ticketNum,
            sourceDocLineId: item.ticketLineId,
            sourceDocLineNum: item.ticketLineNum,
            relatedDocNum: item.poNum,
            relatedDocId: item.poId,
            relatedDocLineId: item.poLineId,
            relatedDocLineNum: item.poLineNum,
          })
        );
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/${url}`,
          method: 'POST',
          data: newData,
        };
      },
    },
    events: {
      update: ({ name, record, value }) => {
        if (name === 'samplingType') {
          if (value.toUpperCase() === 'ALL') {
            const setValue = record.get('waitQty') || 0;
            record.set('sampleQty', setValue);
            record.getField('sampleQty').set('disabled', true);
          } else if (value.toUpperCase() === 'SAMPLE') {
            const setValue = record.get('receivedQty') || 0;
            record.set('sampleQty', 1);
            record.getField('sampleQty').set('disabled', false);
            record.getField('sampleQty').set('max', setValue);
          } else if (value.toUpperCase() === 'NONE') {
            record.set('batchQty', record.get('waitQty') || 0);
            record.set('sampleQty', 0);
            record.getField('sampleQty').set('disabled', true);
          }
        } else if (name === 'ticketLineStatus') {
          if (value === 'RECEIVED' || value === 'RECEIVING') {
            record.getField('sampleQty').set('disabled', false);
          } else {
            record.getField('sampleQty').set('disabled', true);
          }
        }
      },
      select: ({ record }) => {
        const setbatchQty = record.get('waitQty');
        if (setbatchQty || setbatchQty === 0) {
          record.set('batchQty', setbatchQty);
        }
        if (record.get('samplingType') === 'SAMPLE') {
          record.set('sampleQty', 1);
        }
        if (record.get('samplingType').toUpperCase() === 'NONE') {
          record.set('sampleQty', 0);
          record.getField('sampleQty').set('disabled', true);
        }
      },
      unSelect: ({ record }) => {
        record.set('batchQty', undefined);
        record.set('sampleQty', undefined);
      },
      selectAll: ({ dataSet }) => {
        const { records } = dataSet;
        records.forEach((item) => {
          const setbatchQty = item.get('waitQty');
          if (setbatchQty || setbatchQty === 0) {
            item.set('batchQty', setbatchQty);
          }
          if (item.get('samplingType') === 'SAMPLE') {
            item.set('sampleQty', 1);
          }
        });
      },
      unSelectAll: ({ dataSet }) => {
        const { records } = dataSet;
        records.forEach((item) => {
          item.set('batchQty', undefined);
          item.set('sampleQty', undefined);
        });
      },
    },
  };
};

export const queryInspectionDS = () => {
  return {
    pageSize: 10,
    autoCreate: false,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        label: intl.get(`${commonCode}.organization`).d('收货组织'),
        ignore: 'always',
      },
      {
        name: 'organizationCode',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'joinTicketNum',
        label: intl.get(`${commonCode}.joinTicket`).d('送货单'),
        type: 'string',
      },
      {
        name: 'itemObj',
        type: 'object',
        lovCode: common.item,
        ignore: 'always',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        bind: 'itemObj.itemDescription',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'qcResult',
        type: 'string',
        label: intl.get(`${commonCode}.qcResult`).d('判定结果'),
        lookupCode: lmesInspectionDoc.qcResult,
      },
      {
        name: 'samplingType',
        label: intl.get(`${commonCode}.samplingType`).d('抽样类型'),
        lookupCode: lmesInspectionDoc.samplingType,
        type: 'string',
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${commonCode}.qcOkQty`).d('合格数量'),
        type: 'number',
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${commonCode}.qcNgQty`).d('不合格数量'),
        type: 'number',
      },
      {
        name: 'inspector',
        type: 'string',
        label: intl.get(`${commonCode}.inspector`).d('判定员工'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${commonCode}.inspector`).d('报检时间'),
        transformResponse: (value) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        name: 'judgedDate',
        label: intl.get(`${commonCode}.judgedDate`).d('判定时间'),
        type: 'dateTime',
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('检验备注'),
        type: 'string',
      },
      {
        name: 'inspectionDocNum',
        label: intl.get(`${commonCode}.inspection`).d('检验单号'),
        type: 'string',
      },
      {
        name: 'declarerName',
        label: intl.get(`${commonCode}.declarer`).d('报检员工'),
        type: 'string',
      },
    ],
    transport: {
      read: ({ data }) => {
        const { ticketLineStatus } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_LMES}/v1/${organizationId}/inspection-docs/iqc-main-query`,
            {
              ticketLineStatus,
            }
          ),
          method: 'GET',
          data: {
            ...data,
            ticketLineStatus: undefined,
            queryFlag: 'test',
          },
        };
      },
    },
  };
};
