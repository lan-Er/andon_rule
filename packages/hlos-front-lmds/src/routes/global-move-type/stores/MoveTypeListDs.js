import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import { getTlsRecord, convertFieldName, descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsmoveType, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.moveType.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/wm-move-types`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'moveTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.moveType`).d('移动类型'),
    },
    {
      name: 'moveTypeName',
      type: 'string',
      label: intl.get(`${preCode}.moveTypeName`).d('移动类型名称'),
    },
  ],
  fields: [
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      required: true,
      lovCode: common.organization,
      ignore: 'always',
      validator: (value, name, record) => {
        if (record.get('toOrganizationId') === record.get('organizationId')) {
          return '与目标组织重复，请重新选择';
        }
        if (value !== null) {
          if (value.organizationId === record.data.toOrganizationId) {
            return '与目标组织重复，请重新选择';
          }
        }
      },
    },
    { name: 'organizationId', type: 'string', bind: 'organization.organizationId' },
    { name: 'organizationName', type: 'string', bind: 'organization.organizationName' },
    {
      name: 'wmType',
      type: 'string',
      label: intl.get(`${preCode}.wmType`).d('业务类型'),
      required: true,
      lookupCode: lmdsmoveType.wmType,
    },
    {
      name: 'wmMoveClass',
      type: 'string',
      label: intl.get(`${preCode}.wmMoveClass`).d('移动大类'),
      required: true,
      lookupCode: lmdsmoveType.wmMoveClass,
    },
    {
      name: 'moveTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.moveType`).d('移动类型'),
      required: true,
    },
    {
      name: 'moveTypeName',
      type: 'intl',
      label: intl.get(`${preCode}.moveTypeName`).d('移动类型名称'),
      required: true,
    },
    {
      name: 'moveTypeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.moveTypeAlias`).d('移动类型简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.moveTypeDesc`).d('移动类型描述'),
      validator: descValidator,
    },
    {
      name: 'wmMoveCategory',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
    },
    {
      name: 'eventType',
      type: 'object',
      label: intl.get(`${preCode}.eventType`).d('事件类型'),
      required: true,
      lovCode: lmdsmoveType.eventType,
      ignore: 'always',
    },
    { name: 'eventTypeId', type: 'string', bind: 'eventType.eventTypeId' },
    { name: 'eventTypeName', type: 'string', bind: 'eventType.eventTypeName' },
    {
      name: 'transactionType',
      type: 'object',
      label: intl.get(`${preCode}.txnType`).d('事务类型'),
      required: false,
      lovCode: lmdsmoveType.transactionType,
      ignore: 'always',
    },
    { name: 'transactionTypeId', type: 'string', bind: 'transactionType.transactionTypeId' },
    { name: 'transactionTypeName', type: 'string', bind: 'transactionType.transactionTypeName' },
    {
      name: 'costCenter',
      type: 'string',
      label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      required: false,
    },
    {
      name: 'department',
      type: 'object',
      label: intl.get(`${preCode}.department`).d('部门'),
      required: false,
      lovCode: common.department,
      ignore: 'always',
    },
    { name: 'departmentId', type: 'string', bind: 'department.departmentId' },
    { name: 'departmentName', type: 'string', bind: 'department.departmentName' },
    {
      name: 'warehouse',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      required: false,
      lovCode: lmdsmoveType.warehouse,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    { name: 'warehouseId', type: 'string', bind: 'warehouse.warehouseId' },
    { name: 'warehouseName', type: 'string', bind: 'warehouse.warehouseName' },
    {
      name: 'wmArea',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      required: false,
      lovCode: lmdsmoveType.wmArea,
      cascadeMap: { warehouseId: 'warehouseId' },
      ignore: 'always',
    },
    { name: 'wmAreaId', type: 'string', bind: 'wmArea.wmAreaId' },
    { name: 'wmAreaName', type: 'string', bind: 'wmArea.wmAreaName' },
    {
      name: 'workcell',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      required: false,
      lovCode: lmdsmoveType.workcell,
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    { name: 'workcellId', type: 'string', bind: 'workcell.workcellId' },
    { name: 'workcellName', type: 'string', bind: 'workcell.workcellName' },
    {
      name: 'location',
      type: 'object',
      label: intl.get(`${preCode}.location`).d('地点'),
      required: false,
      lovCode: common.location,
      ignore: 'always',
    },
    { name: 'locationId', type: 'string', bind: 'location.locationId' },
    { name: 'locationName', type: 'string', bind: 'location.locationName' },
    {
      name: 'toWarehouse',
      type: 'object',
      label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
      required: false,
      lovCode: lmdsmoveType.warehouse,
      ignore: 'always',
    },
    { name: 'toWarehouseId', type: 'string', bind: 'toWarehouse.warehouseId' },
    { name: 'toWarehouseName', type: 'string', bind: 'toWarehouse.warehouseName' },
    {
      name: 'toWmArea',
      type: 'object',
      label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
      required: false,
      lovCode: lmdsmoveType.wmArea,
      cascadeMap: { toWarehouseId: 'toWarehouseId' },
      ignore: 'always',
    },
    { name: 'toWmAreaId', type: 'string', bind: 'toWmArea.wmAreaId' },
    { name: 'toWmAreaName', type: 'string', bind: 'toWmArea.wmAreaName' },
    {
      name: 'toWorkcell',
      type: 'object',
      label: intl.get(`${preCode}.toWorkcell`).d('目标工位'),
      required: false,
      lovCode: lmdsmoveType.workcell,
      ignore: 'always',
    },
    { name: 'toWorkcellId', type: 'string', bind: 'toWorkcell.workcellId' },
    { name: 'toWorkcellName', type: 'string', bind: 'toWorkcell.workcellName' },
    {
      name: 'toLocation',
      type: 'object',
      label: intl.get(`${preCode}.toLocation`).d('目标地点'),
      required: false,
      lovCode: common.location,
      ignore: 'always',
    },
    { name: 'toLocationId', type: 'string', bind: 'toLocation.locationId' },
    { name: 'toLocationName', type: 'string', bind: 'toLocation.locationName' },
    {
      name: 'toOrganization',
      type: 'object',
      label: intl.get(`${preCode}.toOrg`).d('目标组织'),
      required: false,
      lovCode: common.organization,
      ignore: 'always',
      validator: (value, name, record) => {
        if (record.get('toOrganizationId') === record.get('organizationId')) {
          return '与组织重复，请重新选择';
        }
        if (value != null) {
          if (value.organizationId === record.data.organizationId) {
            return '与组织重复，请重新选择';
          }
        }
      },
    },
    { name: 'toOrganizationId', type: 'string', bind: 'toOrganization.organizationId' },
    { name: 'toOrganizationName', type: 'string', bind: 'toOrganization.organizationName' },
    {
      name: 'viaWarehouse',
      type: 'object',
      label: intl.get(`${preCode}.viaWarehouse`).d('中转仓库'),
      required: false,
      lovCode: lmdsmoveType.warehouse,
      ignore: 'always',
    },
    { name: 'viaWarehouseId', type: 'string', bind: 'viaWarehouse.warehouseId' },
    { name: 'viaWarehouseName', type: 'string', bind: 'viaWarehouse.warehouseName' },
    {
      name: 'viaWmArea',
      type: 'object',
      label: intl.get(`${preCode}.viaWmArea`).d('中转货位'),
      required: false,
      lovCode: lmdsmoveType.wmArea,
      cascadeMap: { viaWarehouseId: 'viaWarehouseId' },
      ignore: 'always',
    },
    { name: 'viaWmAreaId', type: 'string', bind: 'viaWmArea.wmAreaId' },
    { name: 'viaWmAreaName', type: 'string', bind: 'viaWmArea.wmAreaName' },
    {
      name: 'viaWorkcell',
      type: 'object',
      label: intl.get(`${preCode}.viaWorkcell`).d('中转工位'),
      required: false,
      lovCode: lmdsmoveType.workcell,
      ignore: 'always',
    },
    { name: 'viaWorkcellId', type: 'string', bind: 'viaWorkcell.workcellId' },
    { name: 'viaWorkcellName', type: 'string', bind: 'viaWorkcell.workcellName' },
    {
      name: 'viaLocation',
      type: 'object',
      label: intl.get(`${preCode}.viaLocation`).d('中转地点'),
      required: false,
      lovCode: common.location,
      ignore: 'always',
    },
    { name: 'viaLocationId', type: 'string', bind: 'viaLocation.locationId' },
    { name: 'viaLocationName', type: 'string', bind: 'viaLocation.locationName' },
    {
      name: 'transInOrgFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.transInOrgFlag`).d('组织内转移'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'transBetweenOrgsFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.transBetweenOrgsFlag`).d('组织间转移'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'inventoryAdjustFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.inventoryAdjustFlag`).d('库存调整'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'scrapFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.scrapFlag`).d('报废'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'internalUseFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.internalUseFlag`).d('内部领用'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'itemSwitchFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.itemSwitchFlag`).d('物料转换'),
      required: true,
      defaultValue: false,
    },
    {
      name: 'externalCode',
      type: 'string',
      label: intl.get(`${preCode}.externalCode`).d('外部单据编码'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部单据ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'organization') {
        record.set('warehouse', null);
        record.set('workcell', null);
      }
      if (name === 'warehouse') {
        record.set('wmArea', null);
      }
      if (name === 'toWarehouse') {
        record.set('toWmArea', null);
      }
      if (name === 'viaWarehouse') {
        record.set('viaWmArea', null);
      }
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'moveType', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
