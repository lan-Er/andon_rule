/*
 * @Description:
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-22 15:45:44
 */

import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/transfer/execute`;

const headerSearchDSConfig = () => ({
  autoCreate: true,
  pageSize: 12,
  fields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      required: true,
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      required: true,
      lovCode: 'LMDS.ORGANIZATION',
      ignore: 'always',
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'organizationObj.wmOuId',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
      required: true,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: 'LMDS.WM_AREA',
      cascadeMap: { warehouseId: 'warehouseId' },
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'partyObj',
      type: 'object',
      lovCode: 'LMDS.SUPPLIER',
      required: true,
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
      name: 'placeObj',
      type: 'object',
      lovCode: 'LMDS.SUPPLIER_SITE',
      cascadeMap: { supplierId: 'partyId' },
      ignore: 'always',
    },
    {
      name: 'supplierSiteId',
      type: 'string',
      bind: 'placeObj.supplierSiteId',
    },
    {
      name: 'supplierSiteNumber',
      type: 'string',
      bind: 'placeObj.supplierSiteNumber',
    },
    {
      name: 'partyDocumentNumber',
    },
    {
      name: 'remark',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});

const lineList = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagCode',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: 'LMDS.ITEM_WM',
      required: true,
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
    },
    {
      name: 'itemName',
      type: 'string',
      bind: 'itemObj.itemName',
      ignore: 'always',
    },
    {
      name: 'receivedQty',
      type: 'number',
      required: true,
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'itemObj.uom',
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'itemControlType',
      type: 'string',
      defaultValue: 'QUANTITY',
    },
    {
      name: 'pictures',
      type: 'string',
    },
    {
      name: 'lineRemark',
      type: 'string',
    },
    {
      name: 'madeDate',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
        max: ({ record }) => {
          if (record.get('expireDate')) {
            return 'expireDate';
          }
          return 'today';
        },
      },
    },
    {
      name: 'today',
      type: 'date',
      defaultValue: moment().format(DEFAULT_DATETIME_FORMAT),
      ignore: 'always',
    },
    {
      name: 'expireDate',
      type: 'date',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
        min: ({ record }) => {
          if (record.get('madeDate')) {
            return 'madeDate';
          }
          return 'today';
        },
      },
    },
    {
      name: 'partyLotNumber',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'material',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'materialSupplier',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'materialLotNumber',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'manufacturer',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => record.get('itemControlType') === 'QUANTITY',
      },
    },
    {
      name: 'checkedFlag',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  // transport: {
  //   read: () => {
  //     return {
  //       url,
  //       method: 'GET',
  //     };
  //   },
  // },
  methods: {},
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

export { headerSearchDSConfig, lineList, modalDS };
