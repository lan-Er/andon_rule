/**
 * @Description: 事务查询管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 11:47:41
 * @LastEditors: yu.na
 */

import intl from 'utils/intl';
import { DATETIME_MAX, DATETIME_MIN } from 'utils/constants';
import moment from 'moment';
import { isEmpty } from 'lodash';
import codeConfig from '@/common/codeConfig';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';

const { common, lmdsTransaction } = codeConfig.code;
const preCode = 'lmds.transaction.model';
const commonCode = 'lmds.common.model';

export default () => ({
  selection: false,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      name: 'minTransactionTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.minTransactionTime`).d('事务时间>='),
      defaultValue: moment(NOW_DATE).format(DATETIME_MIN),
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('maxTransactionTime'))) {
          return {
            max: 'maxTransactionTime',
          };
        }
      },
    },
    {
      name: 'maxTransactionTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.maxTransactionTime`).d('事务时间<'),
      defaultValue: moment(NOW_DATE).format(DATETIME_MAX),
      min: 'minTransactionTime',
      required: true,
    },
    {
      name: 'transactionTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.transactionType`).d('事务类型'),
      lovCode: common.transactionType,
      ignore: 'always',
    },
    {
      name: 'transactionTypeId',
      type: 'string',
      bind: 'transactionTypeObj.transactionTypeId',
    },
    {
      name: 'transactionTypeName',
      type: 'string',
      bind: 'transactionTypeObj.transactionTypeName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
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
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
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
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      label: intl.get(`${preCode}.document`).d('单据'),
      lovCode: lmdsTransaction.document,
      ignore: 'always',
    },
    {
      name: 'documentId',
      type: 'string',
      bind: 'documentObj.documentId',
    },
    {
      name: 'documentName',
      type: 'string',
      bind: 'documentObj.documentName',
      ignore: 'always',
    },
    {
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.itemFeatureCode`).d('物料特性值'),
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      bind: 'toWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('toWarehouseId'),
        }),
      },
    },
    {
      name: 'toWmAreaId',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaId',
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      bind: 'toWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'sourceDocObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据'),
      lovCode: lmdsTransaction.document,
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocObj.documentId',
    },
    {
      name: 'sourceDocName',
      type: 'string',
      bind: 'sourceDocObj.documentName',
      ignore: 'always',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签条码'),
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCode}.party`).d('商业伙伴'),
      lovCode: common.party,
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${preCode}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.worker`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
    },
    {
      name: 'workerGroupId',
      type: 'string',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroupName',
      type: 'string',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});
