/*
 * @Description: 采购接收DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-03 15:05:28
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';

const { common } = codeConfig.code;
const intlPrefix = 'lwms.purchaseReceipt.model';
const commonPrefix = 'lwms.common.model';

const headFormDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.worker`).d('操作工'),
      lovCode: common.worker,
      ignore: 'always',
      required: true,
    },
    {
      name: 'receiveWorkerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'receiveWorker',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'receiveWorkerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'receiveOrgObj',
      type: 'object',
      lovCode: common.organization,
      label: intl.get(`${intlPrefix}.receiveOrg`).d('接收组织'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'receiveOrgName',
      type: 'string',
      bind: 'receiveOrgObj.organizationName',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'receiveOrgObj.organizationCode',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'receiveOrgObj.organizationId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.warehouse`).d('仓库'),
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
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'warehouseId' },
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'pictures',
      type: 'object',
      label: intl.get(`${intlPrefix}.pictures`).d('图片'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'receiveOrgObj') {
        record.set('warehouseObj');
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj');
      }
    },
  },
});

const headerSearchDSConfig = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'poNum',
      type: 'string',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'supplierObj',
      type: 'object',
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplierObj.partyName',
      ignore: 'always',
    },
    {
      name: 'supplierSiteObj',
      type: 'object',
      lovCode: common.supplierSite,
      cascadeMap: { supplierId: 'supplierId' },
      ignore: 'always',
    },
    {
      name: 'supplierSiteId',
      type: 'string',
      bind: 'supplierSiteObj.supplierSiteId',
    },
    {
      name: 'supplierSiteName',
      type: 'string',
      bind: 'supplierSiteObj.supplierSiteName',
      ignore: 'always',
    },
  ],
  events: {
    update({ name, value, record }) {
      if (name === 'warehouseObj' && !value) {
        record.set('wmAreaObj', null);
      }
      if (name === 'supplierSiteObj' && !value) {
        record.set('wmAreaObj', null);
      }
    },
  },
});

const modalDSPublicConfig = {
  fields: [
    {
      name: 'receivedQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.number`).d('数量'),
      validator: positiveNumberValidator,
      required: true,
      min: 0,
    },
    {
      name: 'traceNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.traceNum`).d('追踪号'),
    },
    {
      name: 'partyLotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierLot`).d('供应商批次'),
    },
    {
      name: 'madeDate',
      type: 'dateTime',
      max: 'expireDate',
      label: intl.get(`${intlPrefix}.createDate`).d('制造日期'),
    },
    {
      name: 'expireDate',
      type: 'dateTime',
      min: 'madeDate',
      label: intl.get(`${intlPrefix}.invalidateDate`).d('失效日期'),
      // dynamicProps: {
      //   min({ record }) {
      //     const madeDate = record.get('madeDate');
      //     return madeDate || new Date();
      //   },
      //   validator({ record }) {
      //     const madeDate = record.get('madeDate');
      //     const expireDate = record.get('expireDate');
      //     if (expireDate?.isSame(madeDate) || expireDate?.isBefore(madeDate)) {
      //       return intl
      //         .get(`${intlPrefix}.view.message.expireDate.cannot.before.madeDate`)
      //         .d('失效日期不可小于制造日期');
      //     }
      //   },
      // },
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${intlPrefix}.manufacturer`).d('制造商'),
    },
    {
      name: 'material',
      type: 'string',
      label: intl.get(`${intlPrefix}.item`).d('材料'),
    },
    {
      name: 'materialSupplier',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemSupplier`).d('材料供应商'),
    },
    {
      name: 'materialLotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemLot`).d('材料批次'),
    },
  ],
};

const modalFormDSConfig = (type) => {
  if (type === 'TAG') {
    return {
      ...modalDSPublicConfig,
      autoCreate: true,
      fields: [
        ...modalDSPublicConfig.fields,
        {
          name: 'tagCode',
          type: 'string',
          label: intl.get(`${intlPrefix}.tagCode`).d('标签号'),
          required: true,
        },
        {
          name: 'lotNumber',
          type: 'string',
          label: intl.get(`${intlPrefix}.lot`).d('批次'),
        },
      ],
    };
  } else if (type === 'LOT') {
    return {
      ...modalDSPublicConfig,
      autoCreate: true,
      fields: [
        ...modalDSPublicConfig.fields,
        {
          name: 'lotNumber',
          type: 'string',
          label: intl.get(`${intlPrefix}.lot`).d('批次号'),
          required: true,
        },
      ],
    };
  }
};

const modalTableDSConfig = (type) => ({
  fields: [
    ...modalDSPublicConfig.fields,
    {
      name: 'numberAndSupplierLot', // '标签/批次号 + 供应商信息'
      type: 'string',
    },
    {
      name: 'info',
      label:
        type === 'TAG'
          ? intl.get(`${intlPrefix}.tagInfo`).d('标签信息')
          : intl.get(`${intlPrefix}.lotInfo`).d('批次信息'),
      type: 'string',
    },
    {
      name: 'count', // 计数
      type: 'number',
    },
  ],
});

export { headFormDSConfig, headerSearchDSConfig, modalFormDSConfig, modalTableDSConfig };
