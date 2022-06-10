/*
 * @Description: 生产线管理信息--ProdLineDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-11 19:59:45
 * @LastEditors: mingbo.zhang@hand-china.com
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const intlPrefix = 'lmds.prodLine';
const commonCode = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/production-lines`;
const { common, lmdsProdLine } = codeConfig.code;
const {
  lovPara: { prodLine },
} = statusConfig.statusValue.lmds;

export default () => ({
  pageSize: 10,
  queryFields: [
    {
      name: 'prodLineCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLine`).d('生产线'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get('lmds.common.model.org').d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLine`).d('生产线'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      order: 'asc',
      unique: true,
    },
    {
      name: 'prodLineName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线名称'),
      required: true,
    },
    {
      name: 'prodLineAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineAlias`).d('生产线简称'),
      required: false,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineDesc`).d('生产线描述'),
      validator: descValidator,
      required: false,
    },
    {
      name: 'prodLineType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineType`).d('生产线类型'),
      required: true,
      lookupCode: lmdsProdLine.prodLineType,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.prodLineCategory`).d('生产线类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: prodLine },
      required: false,
      ignore: 'always',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'prodLineCategoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'prodLineCategoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.prodLineParty`).d('实体'),
      lovCode: common.party,
      ignore: 'always',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
      ignore: 'always',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'workerQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.prodLineWorkerQty`).d('工人数量'),
      min: 0,
      step: 1,
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.prodLineCalendar`).d('工作日历'),
      lovCode: lmdsProdLine.prodLineCalendar,
      dynamicProps: {
        lovPara: ({ record }) => ({
          resourceId: record.get('prodLineId'),
        }),
      },
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendarObj.calendarId',
    },
    {
      name: 'calendarCode',
      type: 'string',
      bind: 'calendarObj.calendarCode',
    },
    {
      name: 'calendarName',
      type: 'string',
      bind: 'calendarObj.calendarName',
      ignore: 'always',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.prodLineChiefPosition`).d('主管岗位'),
      lovCode: common.position,
      lovPara: { supervisorFlag: 1 },
      ignore: 'always',
      required: false,
    },
    {
      name: 'positionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
      ignore: 'always',
    },
    {
      name: 'chiefPosition',
      type: 'string',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLinePicture`).d('图片'),
    },
    {
      name: 'issueWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.issueWm`).d('默认发料仓库'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'issueWarehouseId',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseId',
    },
    {
      name: 'issueWarehouseCode',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseCode',
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      bind: 'issueWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'issueWmAreaObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.issueWmArea`).d('默认发料仓储区域'),
      cascadeMap: { warehouseId: 'issueWarehouseId' },
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'issueWmAreaId',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaId',
    },
    {
      name: 'issueWmAreaCode',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaCode',
    },
    {
      name: 'issueWmArea',
      type: 'string',
      bind: 'issueWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'completeWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.completeWm`).d('默认完工仓库'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'completeWarehouseId',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseId',
    },
    {
      name: 'completeWarehouseCode',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseCode',
    },
    {
      name: 'completeWarehouse',
      type: 'string',
      bind: 'completeWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'completeWmAreaObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.completeWmArea`).d('默认完工仓储区域'),
      cascadeMap: { warehouseId: 'completeWarehouseId' },
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'completeWmAreaId',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaId',
    },
    {
      name: 'completeWmAreaCode',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaCode',
    },
    {
      name: 'completeWmArea',
      type: 'string',
      bind: 'completeWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'inventoryWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.invWm`).d('默认入库仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.invWmArea`).d('默认入库仓储区域'),
      cascadeMap: { warehouseId: 'inventoryWarehouseId' },
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'inventoryWmAreaId',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaId',
    },
    {
      name: 'inventoryWmAreaCode',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaCode',
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'locationNameObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
      lovCode: common.location,
      lovPara: { tenantId: organizationId },
      ignore: 'always',
      required: false,
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationNameObj.locationName',
      ignore: 'always',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationNameObj.locationCode',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationNameObj.locationId',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.model.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'prodLine', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => ({
      url,
      method: 'GET',
    }),
    create: () => ({
      url,
      method: 'POST',
    }),
    update: () => ({
      url,
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ name, record }) => {
      const keyMaps = {
        issueWarehouseObj: 'issueWmAreaObj',
        completeWarehouseObj: 'completeWmAreaObj',
        inventoryWarehouseObj: 'inventoryWmAreaObj',
      };
      const needClearKey = keyMaps[name];
      if (needClearKey) {
        record.set(needClearKey, null);
      }
    },
  },
});
