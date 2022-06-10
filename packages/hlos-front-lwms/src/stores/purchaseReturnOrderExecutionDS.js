/*
 * @Description: 采购退货单执行DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-04 17:00:27
 */

// import { getCurrentOrganizationId } from 'utils/utils';
import { isEmpty } from 'lodash';
// import { HLOS_LWMS, HLOS_LSCM } from 'hlos-front/lib/utils/config';

// const organizationId = getCurrentOrganizationId();

const PageQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: '操作员',
      lovCode: 'LMDS.WORKER',
      required: true,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'fileUrl',
      type: 'string',
      bind: 'workerObj.fileUrl',
      ignore: 'always',
    },
    {
      name: 'deliveryReturnNum',
      label: '采购退货单',
      type: 'string',
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
      name: 'queryValue',
      type: 'string',
      dynamicProps: {
        disabled: ({ record }) => isEmpty(record.get('warehouseId')),
      },
    },
    {
      name: 'tagObj',
      type: 'object',
      lovCode: 'LWMS.TAG',
      dynamicProps: {
        disabled: ({ record }) => isEmpty(record.get('warehouseId')),
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'tagId',
      type: 'string',
      bind: 'tagObj.tagId',
    },
    {
      name: 'tagCode',
      type: 'string',
      bind: 'tagObj.tagCode',
    },
    {
      name: 'lotObj',
      type: 'object',
      lovCode: 'LWMS.LOT',
    },
    {
      name: 'lotId',
      type: 'string',
      bind: 'lotObj.lotId',
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WAREHOUSE',
      required: true,
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
      lovCode: 'LMDS.WM_AREA',
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
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
  ],
});

export { PageQueryDS, ModalDS };
