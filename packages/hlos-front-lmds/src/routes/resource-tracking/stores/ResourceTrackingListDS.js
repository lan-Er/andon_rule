/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-04 12:04:34
 * @LastEditTime: 2021-03-30 14:59:55
 * @Description:资源跟踪DS
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { isEmpty } from 'lodash';
// import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
// import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const { common, lmdsResource, lmdsResourceTracking } = codeConfig.code;

const commonCode = 'lmds.common.model';
const intlPrefix = 'lmds.resource.tracking';
const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/resource-tracks/list`;

export default () => ({
  selection: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.organization`).d('组织'),
      lovCode: common.organization,
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
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源'),
      cascadeMap: { organizationId: 'organizationId' },
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'resourceClass',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceClass`).d('资源大类'),
      lookupCode: lmdsResourceTracking.resourceClass,
    },
    {
      name: 'resourceType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceType`).d('资源类型'),
      lookupCode: lmdsResource.resourceType,
    },
    {
      name: 'trackType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.trackType`).d('跟踪类型'),
      lookupCode: lmdsResourceTracking.trackType,
    },
    {
      name: 'connectResourceObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.connectResource`).d('关联资源'),
      cascadeMap: { organizationId: 'organizationId' },
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'relatedResourceId',
      type: 'string',
      bind: 'connectResourceObj.resourceId',
    },
    {
      name: 'relatedResourceCode',
      type: 'string',
      bind: 'connectResourceObj.resourceCode',
    },
    {
      name: 'relatedResourceName',
      type: 'string',
      bind: 'connectResourceObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'trackTimeStart',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.trackTimeStart`).d('跟踪时间>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('trackTimeEnd')) {
            return 'trackTimeEnd';
          }
        },
      },
    },
    {
      name: 'trackTimeEnd',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.trackTimeEnd`).d('跟踪时间<='),
      min: 'trackTimeStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${intlPrefix}.model.warehouse`).d('仓库'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      label: '生产线',
      name: 'prodLineObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.PRODLINE',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('organizationId')),
      },
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      label: '设备',
      name: 'equipmentObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.EQUIPMENT',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          prodLineId: record.get('prodLineId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('organizationId')),
      },
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'toWarehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${commonCode}.toWarehouse`).d('目标仓库'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.toWmArea`).d('目标货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'toWarehouseId' },
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
      label: '目标生产线',
      name: 'toProdLineObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.PRODLINE',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('organizationId')),
      },
    },
    {
      name: 'toProdLineId',
      bind: 'toProdLineObj.prodLineId',
    },
    {
      label: '目标设备',
      name: 'toEquipmentObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.EQUIPMENT',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
        disabled: ({ record }) => isEmpty(record.get('organizationId')),
      },
    },
    {
      name: 'toEquipmentId',
      bind: 'toEquipmentObj.equipmentId',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${intlPrefix}.model.worker`).d('操作工'),
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      type: 'string',
      bind: 'workerObj.workeCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: 'LMDS.ITEM',
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
      name: 'documentObj',
      type: 'object',
      label: '单据',
      lovCode: 'LMDS.DOCUMENT',
      ignore: 'always',
    },
    {
      name: 'documentId',
      type: 'string',
      bind: 'documentObj.documentId',
    },
    {
      name: 'resourceLot',
      type: 'string',
      label: '资源批次',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.organization`).d('组织'),
    },
    {
      name: 'resourceCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源'),
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
    },
    {
      name: 'trackType',
      type: 'string',
    },
    {
      name: 'trackTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.trackType`).d('跟踪类型'),
    },
    {
      name: 'trackTime',
      // type: 'date',
      label: intl.get(`${intlPrefix}.model.trackTime`).d('跟踪时间'),
    },
    {
      name: 'uomName',
      label: '单位',
    },
    {
      name: 'quantity',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.quantity`).d('数量'),
    },
    {
      name: 'resourceLot',
      label: '资源批次',
    },
    {
      name: 'keyValue',
      label: intl.get(`${intlPrefix}.keyValue`).d('关键值'),
    },
    {
      name: 'trackRecord',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.trackRecord`).d('详细记录'),
    },
    {
      name: 'resourceClassMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceClass`).d('资源大类'),
    },
    {
      name: 'resourceClass',
      type: 'string',
    },
    {
      name: 'resourceType',
      type: 'string',
    },
    {
      name: 'resourceTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceType`).d('资源类型'),
    },
    {
      name: 'relatedResourceName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.relatedResourceName`).d('关联资源'),
    },
    {
      name: 'relatedResourceId',
      type: 'string',
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.warehouse`).d('仓库'),
    },
    {
      name: 'wmAreaName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.wmArea`).d('货位'),
    },
    {
      name: 'wmUnitName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.wmUnit`).d('货格'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线'),
    },
    {
      name: 'equipmentId',
      type: 'string',
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipment`).d('设备'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workcell`).d('工位'),
    },
    {
      name: 'location',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地点'),
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.outsideLocation`).d('外部地点'),
    },
    {
      name: 'toWarehouseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toWarehouse`).d('目标仓库'),
    },
    {
      name: 'toWmAreaName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toWmArea`).d('目标货位'),
    },
    {
      name: 'toWmUnitName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toWmUnitName`).d('目标货格'),
    },
    {
      name: 'toProdLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toProdLine`).d('目标生产线'),
    },
    {
      name: 'toEquipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toEquipment`).d('目标设备'),
    },
    {
      name: 'toWorkcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toWorkcell`).d('目标工位'),
    },
    {
      name: 'toLocationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toLocation`).d('目标地点'),
    },
    {
      name: 'toOutsideLocation',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.toOutsideLocation`).d('目标外部地点'),
    },
    {
      name: 'usedCount',
      label: intl.get(`${intlPrefix}.model.usedCount`).d('使用计数'),
    },
    {
      name: 'worker',
      type: 'string',
    },
    {
      name: 'workerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.worker`).d('操作工'),
    },
    {
      name: 'workerGroupName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroup`).d('班组'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },

    {
      name: 'operationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.operation`).d('工序'),
    },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.documentType`).d('单据类型'),
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.documentNum`).d('单据号'),
    },
    {
      name: 'documentLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.documentLineNum`).d('单据行号'),
    },
    //
    {
      name: 'documentLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.documentLineNum`).d('单据行号'),
    },
    // add
    {
      name: 'eventType',
      type: 'string',
      label: intl.get(`${commonCode}.eventType`).d('事件类型'),
    },
    {
      name: 'eventId',
      type: 'string',
      label: intl.get(`${commonCode}.eventId`).d('事件ID'),
    },
    {
      name: 'eventBy',
      type: 'string',
      label: intl.get(`${commonCode}.eventBy`).d('事件提交人'),
    },

    // {
    //   name: 'resourceLot',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.model.resourceLot`).d('批次'),
    // },

    {
      name: 'pictures',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.pictures`).d('图片'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.remark`).d('备注'),
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
