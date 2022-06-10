import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const preCode = 'lwms.deliveryReturn.model';
const commonCode = 'lwms.common.model';

const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'returnedWorkerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'returnedWorker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'returnedWorkerName',
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
    },
    {
      name: 'returnWarehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'returnWarehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'returnWarehouseName',
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
          warehouseId: record.get('returnWarehouseId'),
        }),
      },
    },
    {
      name: 'returnWmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'returnWmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'returnWmAreaName',
      bind: 'wmAreaObj.wmAreaName',
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
      name: 'partyId',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'partyNumber',
      bind: 'supplierObj.partyNumber',
    },
    {
      name: 'partyName',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'supplierSiteObj',
      type: 'object',
      label: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
      lovCode: common.supplierSite,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          supplierId: record.get('supplierId'),
        }),
      },
    },
    {
      name: 'partySiteId',
      bind: 'supplierSiteObj.supplierSiteId',
    },
    {
      name: 'partySiteNumber',
      bind: 'supplierSiteObj.supplierSiteNumber',
    },
    {
      name: 'partySiteName',
      bind: 'supplierSiteObj.supplierSiteName',
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
  fields: [
    {
      name: 'organizationId',
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
          // itemControl: record.get('activeKey') || 'QUANTITY',
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
      name: 'uomName',
      bind: 'itemObj.uomName',
    },
    {
      name: 'uom',
      bind: 'itemObj.uom',
    },
    {
      name: 'uomId',
      bind: 'itemObj.uomId',
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get(`${preCode}.qty`).d('数量'),
      required: true,
    },
  ],
});

const ModalDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'itemId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouseObj`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'returnWarehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'returnWarehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'returnWarehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaId`).d('货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'returnWarehouseId' },
      ignore: 'always',
    },
    {
      name: 'returnWmAreaName',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'returnWmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'returnWmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'returnReason',
      type: 'string',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${preCode}.poNum`).d('采购订单'),
    },
    {
      name: 'lotObj',
      type: 'object',
      lovCode: common.lot,
      multiple: true,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          warehouseId: record.get('returnWarehouseId'),
          wmAreaId: record.get('returnWmAreaId'),
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'lotId',
      bind: 'lotObj.lotId',
    },
    {
      name: 'lotNumber',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'tagObj',
      type: 'object',
      lovCode: common.tagthing,
      multiple: true,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          wmsOrganizationId: record.get('organizationId'),
          warehouseId: record.get('returnWarehouseId'),
          wmAreaId: record.get('returnWmAreaId'),
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'tagId',
      bind: 'tagObj.tagId',
    },
    {
      name: 'tagCode',
      bind: 'tagObj.tagCode',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

export { HeaderDS, QueryDS, ModalDS };
