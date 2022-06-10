/*
 * PQC报检-DS
 * date: 2020-07-09
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getInspectionGroup } from '../services/iqcInspectionService';
import notification from 'utils/notification';
import moment from 'moment';
import { DataSet } from 'choerodon-ui/pro';

const { common, lmesPqcInspection } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

export const pqcFormDS = () => ({
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
      name: 'inspectionTemplateType',
      type: 'string',
      lookupCode: lmesPqcInspection.inspect,
      label: '首检/完工检',
    },
    {
      name: 'sourceDocTypeObj',
      type: 'object',
      lovCode: common.documentType,
      lovPara: {
        documentClassflag: 'Y',
      },
      ignore: 'always',
      required: true,
      label: '来源单据类型',
    },
    {
      name: 'sourceDocTypeCode',
      type: 'string',
      bind: 'sourceDocTypeObj.documentTypeCode',
    },
    {
      name: 'sourceDocTypeId',
      type: 'string',
      bind: 'sourceDocTypeObj.documentTypeId',
    },
    {
      name: 'sourceObj',
      type: 'object',
      noCache: true,
      label: '来源单据号',
      lovCode: common.document,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (
            record.get('sourceDocTypeCode') &&
            record.get('sourceDocTypeCode').indexOf('TASK') !== -1
          ) {
            return {
              documentTypeCode: record.get('sourceDocTypeCode'),
              documentClass: 'TASK',
            };
          } else if (
            record.get('sourceDocTypeCode') &&
            record.get('sourceDocTypeCode').indexOf('MO') !== -1
          ) {
            return {
              documentTypeCode: record.get('sourceDocTypeCode'),
              documentClass: 'MO',
            };
          }
        },
        // disabled: ({ record }) => {
        //   if (record.get('__group-3__')) {
        //     return false;
        //   }
        //   return true;
        // },
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceObj.documentId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceObj.documentNum',
    },
    {
      name: 'resourceObj',
      type: 'object',
      noCache: true,
      label: '资源',
      lovCode: lmesPqcInspection.resource,
      cascadeMap: {
        organizationId: 'organizationId',
      },
      lovPara: {
        lovType: 'pqc',
      },
      ignore: 'always',
      // required: true,
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'sampleQty',
      type: 'number',
      label: '样品数量',
      defaultValue: 0,
      min: 0,
      validator: (value) => (value > 0 ? true : '样品数量必须大于0'),
      // required: true,
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
      bind: 'sourceObj.itemCode',
    },
    {
      name: 'description',
      type: 'string',
      readOnly: true,
      bind: 'sourceObj.item',
    },
    {
      name: 'itemId',
      type: 'string',
      readOnly: true,
      bind: 'sourceObj.itemId',
    },
    {
      name: 'qty',
      type: 'number',
      readOnly: true,
      dynamicProps: {
        bind: ({ record }) => {
          if (
            record.get('sourceDocTypeCode') &&
            record.get('sourceDocTypeCode').indexOf('TASK') !== -1
          ) {
            return 'sourceObj.taskQty';
          } else if (
            record.get('sourceDocTypeCode') &&
            record.get('sourceDocTypeCode').indexOf('MO') !== -1
          ) {
            return 'sourceObj.makeQty';
          }
        },
      },
    },
    {
      name: 'uomName',
      type: 'string',
      readOnly: true,
      bind: 'sourceObj.uomName',
    },
    {
      name: 'qtyuom',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'operationId',
      type: 'string',
      readOnly: true,
      bind: 'sourceObj.operationId',
    },
    {
      name: 'operation',
      type: 'string',
      readOnly: true,
      bind: 'sourceObj.operation',
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
      name: 'declaredDate',
      type: 'date',
      defaultValue: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
    },
    {
      name: 'sourceDocClass',
      type: 'string',
      bind: 'sourceDocTypeObj.documentClass',
    },
    {
      name: 'batchQty',
      type: 'string',
      defaultValue: '',
      bind: 'sampleQty',
    },
    {
      name: 'autoFeedbackResult',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'selectValue',
      type: 'string',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        selection: 'single',
        data: [
          { text: '首检', value: 'PQC.FIRST' },
          { text: '完工检', value: 'PQC.FINISH' },
        ],
      }),
    },
  ],
  transport: {
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs`,
        data: {
          ...data[0],
          inspectionDocNum: '',
          inspectionTemplateType: data[0].selectValue,
        },
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
    async update({ record, name, oldValue }) {
      if (name === 'sourceObj') {
        if (record.get('qty')) {
          record.set('qtyuom', record.get('qty') + record.get('uomName'));
        } else {
          record.set('qtyuom', null);
        }
        let obj;
        const data = record.toData();
        if (!data.sourceObj) {
          record.set('inspectionGroupId', '');
          record.set('inspectionGroupName', '');
        }
        if (!data.selectValue) {
          return notification.warning({
            message: '请先选择首检/完工检',
          });
        }
        if (data.sourceDocTypeCode && data.sourceDocTypeCode.indexOf('TASK') !== -1) {
          obj = {
            documentTypeCode: data.sourceDocTypeCode,
            operationId: data.sourceObj?.operationId,
            inspectionTemplateType: data.selectValue,
            itemId: data.itemId,
            organizationId: data.organizationId,
          };
        } else {
          obj = {
            inspectionTemplateType: data.selectValue,
            itemId: data.itemId,
            organizationId: data.organizationId,
          };
        }
        if (obj.itemId && obj.organizationId && obj.inspectionTemplateType) {
          const res = await getInspectionGroup(obj);
          if (res.failed) {
            notification.warning({
              message: res.message,
            });
          } else {
            record.set('inspectionGroupId', res.inspectionGroupId);
            record.set('inspectionGroupName', res.inspectionGroupName);
          }
        }
      }
      if (name === 'resourceObj' && oldValue?.resourceId) {
        record.set('sourceDocTypeCode', null);
        record.set('sourceObj', null);
        record.set('sampleQty', null);
      }
    },
  },
});
