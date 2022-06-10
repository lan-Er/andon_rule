/**
 * @Description: po预检-DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 14:28:08
 * @LastEditors: leying.yan
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lmesPoPrecheck } = codeConfig.code;

const commonCode = 'lmes.common.model';
const preCheckCode = 'lmes.poPrecheck.model';

const LoginDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      name: 'workerObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
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
      name: 'inspectionDocNum',
      type: 'string',
    },
  ],
});

const QueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCheckCode}.party`).d('供应商'),
      lovCode: lmesPoPrecheck.party,
      ignore: 'always',
      required: true,
    },
    {
      name: 'partyId',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyNumber',
      bind: 'partyObj.partyNumber',
    },
    {
      name: 'partyName',
      bind: 'partyObj.partyName',
    },
    {
      name: 'poObj',
      type: 'object',
      label: intl.get(`${commonCode}.po`).d('PO'),
      lovCode: lmesPoPrecheck.po,
      ignore: 'always',
      required: true,
      cascadeMap: { partyId: 'partyId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          partyId: record.get('partyId'),
        }),
      },
    },
    {
      name: 'sourceDocId',
      bind: 'poObj.poId',
    },
    {
      name: 'sourceDocNum',
      bind: 'poObj.poNum',
    },
    {
      name: 'sourceDocTypeId',
      bind: 'poObj.poTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      bind: 'poObj.poTypeCode',
    },
    {
      name: 'lineNumObj',
      type: 'object',
      lovCode: lmesPoPrecheck.poLine,
      ignore: 'always',
      required: true,
      cascadeMap: { poHeaderId: 'sourceDocId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          poHeaderId: record.get('sourceDocId'),
        }),
      },
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'lineNumObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'lineNumObj.uom',
    },
    {
      name: 'demandQty',
      type: 'number',
      bind: 'lineNumObj.demandQty',
    },
    {
      name: 'demandDate',
      // type: 'date',
      bind: 'lineNumObj.demandDate',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'lineNumObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'lineNumObj.itemCode',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'lineNumObj.itemDescription',
    },
    {
      name: 'sourceDocLineId',
      bind: 'lineNumObj.poLineId',
    },
    {
      name: 'sourceDocLineNum',
      bind: 'lineNumObj.poLineNumber',
    },
    {
      name: 'batchQty',
      type: 'number',
      max: 'demandQty',
      min: 0,
      label: intl.get(`${preCheckCode}.batchQty`).d('检验数量'),
    },
    {
      name: 'inspectionGroupObj',
      type: 'object',
      label: intl.get(`${preCheckCode}.inspectionGroup`).d('检验组'),
      lovCode: lmesPoPrecheck.inspectionTemplate,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          inspectionTemplateType: 'SQC.NORMAL',
        }),
      },
    },
    {
      name: 'inspectionGroupId',
      bind: 'inspectionGroupObj.inspectionGroupId',
    },
    {
      name: 'inspectionGroupName',
      bind: 'inspectionGroupObj.inspectionGroupName',
    },
    {
      name: 'templateId',
      type: 'string',
      bind: 'inspectionGroupObj.templateId',
    },
    {
      name: 'itemControlType',
      type: 'string',
      transformRequest: (val) => val || '',
    },
    {
      name: 'taskId',
      type: 'string',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
});

export { LoginDS, QueryDS };
