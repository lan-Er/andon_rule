import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { codeValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common, lwmsShipReturnPlatform } = codeConfig.code;
const preCode = 'lwms.shipReturnReceive.model';
const commonCode = 'lwms.common.model';

const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.worker`).d('员工'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'receiveWorkerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'receiveWorker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'receiveWorkerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('接收组织'),
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
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
    },
    {
      name: 'receiveWarehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('receiveWarehouseId'),
        }),
      },
    },
    {
      name: 'receiveWmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${preCode}.customer`).d('客户'),
      lovCode: common.customer,
      textField: 'customerName',
      ignore: 'always',
      required: true,
    },
    {
      name: 'customerId',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerNumber',
      bind: 'customerObj.customerNumber',
    },
    {
      name: 'customerName',
      bind: 'customerObj.customerName',
    },
    {
      name: 'customerSiteObj',
      type: 'object',
      label: intl.get(`${preCode}.customerSite`).d('客户地点'),
      lovCode: common.customerSite,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          customerId: record.get('customerId'),
        }),
      },
    },
    {
      name: 'customerSiteId',
      bind: 'customerSiteObj.customerSiteId',
    },
    {
      name: 'customerSiteNumber',
      bind: 'customerSiteObj.customerSiteNumber',
    },
    {
      name: 'customerSiteName',
      bind: 'customerSiteObj.customerSiteName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'returnReasonObj',
      type: 'object',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
      lovCode: lwmsShipReturnPlatform.returnReason,
      lovPara: { exceptionClass: 'SALES_RETURN' },
      ignore: 'always',
    },
    {
      name: 'returnReasonId',
      bind: 'returnReasonObj.exceptionId',
    },
    {
      name: 'returnReason',
      bind: 'returnReasonObj.exceptionCode',
    },
    {
      name: 'returnReasonName',
      bind: 'returnReasonObj.exceptionName',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'customerObj') {
        record.set('customerSiteObj', null);
      }
    },
  },
});

const QueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'customerId',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
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
    {
      name: 'description',
      bind: 'itemObj.description',
    },
    {
      name: 'uomId',
      bind: 'itemObj.uomId',
    },
    {
      name: 'uom',
      bind: 'itemObj.uom',
    },
    {
      name: 'uomName',
      bind: 'itemObj.uomName',
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      lovCode: common.soLine,
      textField: 'so',
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          customerId: record.get('customerId'),
          itemId: record.get('itemId'),
          return: true,
        }),
      },
    },
    {
      name: 'soId',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soNum',
      bind: 'soObj.soNumber',
    },
    {
      name: 'soLineNum',
      bind: 'soObj.soLineNumber',
    },
    {
      name: 'soLineId',
      bind: 'soObj.soLineId',
    },
    {
      name: 'shippedQty',
      bind: 'soObj.shippedQty',
    },
    {
      name: 'returnedQty',
      bind: 'soObj.returnedQty',
    },
    {
      name: 'receivedQty',
      type: 'number',
      label: intl.get(`${preCode}.qty`).d('数量'),
      min: 1,
      step: 1,
      dynamicProps: {
        max: ({ record }) => {
          return record.get('shippedQty') - record.get('returnedQty');
        },
      },
    },
  ],
});

const TagDS = () => ({
  queryFields: [
    {
      name: 'maxLimit',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签号'),
      validator: codeValidator,
      required: true,
    },
    {
      name: 'receivedQty',
      type: 'number',
      label: intl.get(`${preCode}.qty`).d('数量'),
      min: 1,
      step: 1,
      max: 'maxLimit',
      required: true,
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lot`).d('批次'),
      validator: codeValidator,
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('制造日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'expireDate',
      type: 'date',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        min: ({ record }) => {
          if (record.get('madeDate')) {
            return 'madeDate';
          }
        },
      },
    },
  ],
  fields: [
    {
      name: 'tagCode',
      label: intl.get(`${preCode}.tag`).d('标签'),
    },
    {
      name: 'receivedQty',
      label: intl.get(`${preCode}.qty`).d('数量'),
    },
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lot`).d('批次'),
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('制造日期'),
    },
    {
      name: 'expireDate',
      type: 'date',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
    },
  ],
});

const LotDS = () => ({
  queryFields: [
    {
      name: 'maxLimit',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lot`).d('批次'),
      validator: codeValidator,
      required: true,
    },
    {
      name: 'receivedQty',
      type: 'number',
      label: intl.get(`${preCode}.qty`).d('数量'),
      min: 1,
      step: 1,
      max: 'maxLimit',
      required: true,
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('制造日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'expireDate',
      type: 'date',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        min: ({ record }) => {
          if (record.get('madeDate')) {
            return 'madeDate';
          }
        },
      },
    },
  ],
  fields: [
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lot`).d('批次'),
    },
    {
      name: 'receivedQty',
      label: intl.get(`${preCode}.qty`).d('数量'),
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('制造日期'),
    },
    {
      name: 'expireDate',
      type: 'date',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
    },
  ],
});

const ReasonDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'returnReasonObj',
      type: 'object',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
      lovCode: lwmsShipReturnPlatform.returnReason,
      lovPara: { exceptionClass: 'SALES_RETURN' },
    },
    {
      name: 'returnReasonId',
      bind: 'returnReasonObj.exceptionId',
    },
    {
      name: 'returnReason',
      bind: 'returnReasonObj.exceptionCode',
    },
    {
      name: 'returnReasonName',
      bind: 'returnReasonObj.exceptionName',
    },
  ],
});

export { TagDS, LotDS, HeaderDS, QueryDS, ReasonDS };
