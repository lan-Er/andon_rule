import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsShipReturnPlatform } = codeConfig.code;
const preCode = 'lwms.shipReturnReceive.model';
const commonCode = 'lwms.common.model';
const organizationId = getCurrentOrganizationId();

const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.worker`).d('员工'),
      ignore: 'always',
      noCache: true,
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
      noCache: true,
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
      noCache: true,
      required: true,
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      noCache: true,
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
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
    },
  },
});

const QueryDS = () => ({
  autoCreate: true,
  queryFields: [
    {
      name: 'shipReturnObj',
      type: 'object',
      label: intl.get(`${preCode}.shipReturn`).d('销售退货单'),
      lovCode: lwmsShipReturnPlatform.shipReturn,
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'shipReturnId',
      bind: 'shipReturnObj.shipReturnId',
    },
    {
      name: 'shipReturnNum',
      bind: 'shipReturnObj.shipReturnNum',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${preCode}.customer`).d('客户'),
      lovCode: common.customer,
      textField: 'customerName',
      ignore: 'always',
      noCache: true,
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
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      noCache: true,
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
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LWMS}/v1/${organizationId}/ship-return-lines/execute`,
      method: 'GET',
    }),
  },
});

export { HeaderDS, QueryDS };
