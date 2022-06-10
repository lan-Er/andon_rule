/**
 * @Description: 采购接收入库/到货入库 - modalDs
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-09-21 14:21:41
 * @LastEditors: yu.na
 */

// import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
// import { getCurrentOrganizationId } from 'utils/utils';
// import moment from 'moment';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'lwms.common.model';
const preCode = 'lwms.purchaseReceiveInventory.model';
// const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/delivery-ticket-lines`;

const HeaderDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'inventoryWorkerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'inventoryWorker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('入库组织'),
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
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      ignore: 'always',
      required: true,
      cascadeMap: { organizationId: 'organizationId' },
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     organizationId: record.get('organizationId'),
      //   }),
      // },
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
      lovCode: common.wmArea,
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     warehouseId: record.get('warehouseId'),
      //   }),
      // },
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
      label: intl.get(`${preCode}.remark`).d('备注'),
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
  paging: false,
  page: -1,
  fields: [
    {
      name: 'inventory',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${commonCode}.poNum`).d('采购订单号'),
    },
    {
      name: 'ticketNumLike',
      type: 'string',
      label: intl.get(`${commonCode}.ticketNum`).d('送货单号'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      ignore: 'always',
      lovCode: common.item,
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
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${commonCode}.supplier`).d('供应商'),
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'partyId',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'partyName',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'supplierSiteObj',
      type: 'object',
      label: intl.get(`${commonCode}.supplierSite`).d('供应商地点'),
      lovCode: common.supplierSite,
      cascadeMap: { supplierId: 'partyId' },
      ignore: 'always',
    },
    {
      name: 'partySiteId',
      bind: 'supplierSiteObj.supplierSiteId',
    },
    {
      name: 'partySiteName',
      bind: 'supplierSiteObj.supplierSiteName',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'supplierObj') {
        record.set('supplierSiteObj', null);
      }
    },
  },
});

const modalDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'lineRemark',
      type: 'string',
    },
  ],
});

const TagDS = () => ({
  fields: [],
});

export { HeaderDS, QueryDS, modalDS, TagDS };
