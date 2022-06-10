/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-14 16:22:00
 * @LastEditTime: 2021-02-02 16:19:47
 * @Description:
 */
import codeConfig from '@/common/codeConfig';

const { common, lwmsInventoryPlatform, lwmsMiscellaneousAdjustment } = codeConfig.code;

const miscellaneousAdjustmentDS = () => ({
  selection: false,
  pageSize: 1000,
  autoCreate: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: common.organization,
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
      name: 'meOuId',
      type: 'string',
    },
    {
      name: 'meOuName',
      type: 'string',
    },
    {
      name: 'pickingType',
      type: 'string',
      defaultValue: 'QUANTITY',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      required: true,
      lovCode: common.warehouse,
      cascadeMap: { organizationId: 'organizationId' },
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
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaFlag',
      type: 'boolean',
      bind: 'warehouseObj.wmAreaFlag',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        disabled: ({ record }) => {
          if (!record.get('wmAreaFlag')) {
            return 'wmAreaFlag';
          }
        },
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
    {
      name: 'costCenterObj',
      type: 'object',
      lovCode: lwmsInventoryPlatform.adjustAccount,
      required: true,
    },
    {
      name: 'costCenterId',
      type: 'string',
      bind: 'costCenterObj.costCenterId',
    },
    {
      name: 'costCenterCode',
      type: 'string',
      bind: 'costCenterObj.costCenterCode',
    },
    {
      name: 'workerObj',
      type: 'object',
      required: true,
      lovCode: common.worker,
      dynamicProps: {
        lovPara: ({ record }) => ({
          showOrganization: 'Y',
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
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerUrl',
      type: 'string',
      bind: 'workerObj.fileUrl',
    },
    // {
    //   name: 'workerOrganizationName',
    //   type: 'string',
    //   bind: 'workerObj.organizationName',
    // },
    // {
    //   name: 'workerOrganizationCode',
    //   type: 'string',
    //   bind: 'workerObj.organizationCode',
    // },
    // {
    //   name: 'workerOrganizationId',
    //   type: 'string',
    //   bind: 'workerObj.organizationId',
    // },
    {
      name: 'remark',
      type: 'string',
    },
    {
      name: 'itemObj',
      type: 'object',
      required: true,
      lovCode: lwmsMiscellaneousAdjustment.itemWm,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemControl: record.get('pickingType'),
          meOuId: record.get('meOuId'),
          organizationId: record.get('organizationId'),
        }),
      },
      cascadeMap: { warehouseId: 'warehouseId' },
      textField: 'itemCode',
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
      name: 'itemDescription',
      type: 'string',
      bind: 'itemObj.description',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'itemObj.uom',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'itemObj.uomName',
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'lotObj',
      type: 'object',
      lovCode: lwmsMiscellaneousAdjustment.lot,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemCode: record.get('itemCode'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'lotId',
      type: 'string',
      bind: 'lotObj.lotId',
    },
    {
      name: 'tagObj',
      type: 'object',
      lovCode: lwmsMiscellaneousAdjustment.tag,
      dynamicProps: {
        lovPara: ({ record }) => ({
          itemCode: record.get('itemCode'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'tagCode',
      type: 'string',
      bind: 'tagObj.tagCode',
    },
    {
      name: 'tagId',
      type: 'string',
      bind: 'tagObj.tagId',
    },
    {
      name: 'existQuantity',
      type: 'number',
      defaultValue: 0,
      min: 0,
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

export { miscellaneousAdjustmentDS };
