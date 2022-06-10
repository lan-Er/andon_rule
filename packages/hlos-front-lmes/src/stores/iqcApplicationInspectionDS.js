/*
 * IQC报检-DS
 * date: 2020-07-09
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getInspectionGroup, checkControlType } from '../services/iqcInspectionService';
import notification from 'utils/notification';

const { common, lmesIqcInspection } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

export const iqcFormDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      noCache: true,
      label: '操作工',
      lovCode: common.worker,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          showOrganization: 'Y',
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'declarerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'declarer',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'fileUrl',
      type: 'string',
      bind: 'workerObj.fileUrl',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'workerObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'workerObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'workerObj.organizationName',
      disabled: true,
    },
    {
      name: 'sourceObj',
      type: 'object',
      noCache: true,
      label: '来源单据号',
      lovCode: lmesIqcInspection.source,
      cascadeMap: {
        organizationId: 'organizationId',
      },
      ignore: 'always',
      // required: true,
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceObj.ticketId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceObj.ticketNum',
    },
    {
      name: 'sourceDocTypeId',
      type: 'string',
      bind: 'sourceObj.ticketTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      bind: 'sourceObj.ticketTypeCode',
    },
    {
      name: 'sourceLineObj',
      type: 'object',
      noCache: true,
      label: '来源单据行号',
      lovCode: lmesIqcInspection.sourceLine,
      cascadeMap: {
        ticketId: 'sourceDocId',
      },
      ignore: 'always',
      // required: true,
    },
    {
      name: 'sourceDocLineId',
      type: 'string',
      bind: 'sourceLineObj.ticketLineId',
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      bind: 'sourceLineObj.ticketLineNum',
    },
    {
      name: 'sampleQty',
      type: 'number',
      label: '样品数量',
      // required: true,
      min: 0,
      validator: (value) => (value > 0 ? true : '样品数量必须大于0'),
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'itemCode',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.itemCode
            ? 'sourceObj.itemCode'
            : 'sourceLineObj.itemCode';
        },
      },
    },
    {
      name: 'itemId',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.itemId ? 'sourceObj.itemId' : 'sourceLineObj.itemId';
        },
      },
    },
    {
      name: 'receivedQty',
      type: 'number',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.receivedQty
            ? 'sourceObj.receivedQty'
            : 'sourceLineObj.receivedQty';
        },
      },
    },
    {
      name: 'uomName',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.uomName ? 'sourceObj.uomName' : 'sourceLineObj.uomName';
        },
      },
    },
    {
      name: 'description',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.description
            ? 'sourceObj.description'
            : 'sourceLineObj.description';
        },
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.lotNumber
            ? 'sourceObj.lotNumber'
            : 'sourceLineObj.lotNumber';
        },
      },
    },
    {
      name: 'partyName',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.partyName
            ? 'sourceObj.partyName'
            : 'sourceLineObj.partyName';
        },
      },
    },
    {
      name: 'partyId',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.partyId ? 'sourceObj.partyId' : 'sourceLineObj.partyId';
        },
      },
    },
    {
      name: 'partyNumber',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.partyNumber
            ? 'sourceObj.partyNumber'
            : 'sourceLineObj.partyNumber';
        },
      },
    },
    {
      name: 'shipTicket',
      type: 'string',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          return record.get('sourceObj')?.shipTicket
            ? 'sourceObj.shipTicket'
            : 'sourceLineObj.shipTicket';
        },
      },
    },
    {
      name: 'qtyuom',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'inspectionGroupId',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'inspectionGroupName',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'itemControlType',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'sourceDocClass',
      type: 'string',
      defaultValue: 'WM_DELIVERY',
    },
    {
      name: 'batchQty',
      type: 'string',
      defaultValue: '',
      bind: 'receivedQty',
    },
    {
      name: 'autoFeedbackResult',
      type: 'number',
      defaultValue: 0,
    },
  ],
  transport: {
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs/create-inspection-doc-iqc`,
        data: [
          {
            ...data[0],
            // inspectionDocNum: '',
            iqcDocNum: '',
            secondBatchQty: '',
            relatedDocTypeId: '',
            relatedDocTypeCode: '',
            relatedDocId: '',
            relatedDocNum: '',
            relatedDocLineId: '',
            relatedDocLineNum: '',
            inspectionTemplateType: 'IQC.NORMAL',
            iqcSourceType: 'DELIVERY_TICKET',
          },
        ],
        method: 'POST',
      };
    },
  },
  feedback: {
    submitSuccess(resp) {
      return notification.success({
        message: `检验单${resp.content[0].inspectionDocNum}已提交成功`,
      });
    },
  },
  events: {
    update: async ({ name, record }) => {
      if (name === 'sourceObj') {
        record.set('sourceLineObj', null);
      }
      if (name === 'workerObj') {
        record.set('sourceObj', null);
      }
      if ((name === 'sourceObj' || name === 'sourceLineObj') && record.get('receivedQty')) {
        record.set('qtyuom', record.get('receivedQty') + record.get('uomName'));
      }
      if (name === 'sourceObj' || name === 'sourceLineObj') {
        const obj = {
          inspectionTemplateType: 'IQC.NORMAL',
          itemId: record.toData().itemId,
          organizationId: record.toData().organizationId,
        };
        if (obj.itemId && obj.organizationId) {
          const res = await getInspectionGroup(obj);
          if (res) {
            if (res.failed) {
              notification.warning({
                message: res.message,
              });
            } else {
              record.set('inspectionGroupId', res.inspectionGroupId);
              record.set('inspectionGroupName', res.inspectionGroupName);
            }
          }
          // 获取物料控制类型
          const resp = await checkControlType([
            {
              organizationId: obj.organizationId,
              // warehouseId: _data[0].warehouseObj.warehouseId,
              itemId: obj.itemId,
              tenantId: getCurrentOrganizationId(),
              groupId: '2021', // 传入的值不做参考
            },
          ]);
          if (resp && resp.length) {
            record.set('itemControlType', resp[0].itemControlType);
          }
        }
      }
      if (name === 'sourceLineObj' && !record.get('sourceLineObj')) {
        record.set('qtyuom', '');
      }
    },
  },
});
