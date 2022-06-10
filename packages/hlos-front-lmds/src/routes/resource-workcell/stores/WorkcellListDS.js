/**
 * @Description: 工作单元管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-11 14:27:41
 * @LastEditors: yu.na
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

const { common, lmdsWorkcell } = codeConfig.code;
const {
  lovPara: { workcell },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.workcell.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/workcells`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'workcellCode',
      type: 'string',
      label: intl.get(`${preCode}.wkc`).d('工作单元'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${preCode}.wkcName`).d('工作单元名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'workcellCode',
      type: 'string',
      label: intl.get(`${preCode}.wkc`).d('工作单元'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'workcellName',
      type: 'intl',
      label: intl.get(`${preCode}.wkcName`).d('工作单元名称'),
      required: true,
    },
    {
      name: 'workcellAlias',
      type: 'intl',
      label: intl.get(`${preCode}.wkcAlias`).d('工作单元简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.wkcDesc`).d('工作单元描述'),
      validator: descValidator,
    },
    {
      name: 'workcellType',
      type: 'string',
      label: intl.get(`${preCode}.wkcType`).d('工作单元类型'),
      lookupCode: lmdsWorkcell.workcellType,
      required: true,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.wkcCategory`).d('工作单元类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: workcell },
      ignore: 'always',
    },
    {
      name: 'workcellCategoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'workcellCategoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'activityType',
      type: 'string',
      // lookupCode: lmdsWorkcell.activityType,
      label: intl.get(`${preCode}.activityType`).d('作业类型'),
    },
    {
      name: 'prodLinObj',
      type: 'object',
      label: intl.get(`${preCode}.wkcProdLine`).d('工作单元所属产线'),
      lovCode: common.prodLine,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLinObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLinObj.prodLineCode',
    },
    {
      name: 'proLineName',
      type: 'string',
      bind: 'prodLinObj.resourceName',
    },
    {
      name: 'workerQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.wkcWorkerQty`).d('工人数量'),
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${preCode}.wkcCalendar`).d('工作日历'),
      lovCode: common.calendar,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          resourceId: record.get('workcellId'),
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
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.wkcChiefPosition`).d('主管岗位'),
      lovCode: common.position,
      lovPara: { supervisorFlag: 1 },
      ignore: 'always',
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'chiefPosition',
      type: 'string',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'positionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.wkcPicture`).d('图片'),
    },
    {
      name: 'issueWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
    },
    {
      name: 'issueWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'issueWarehouseId' },
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
    },
    {
      name: 'completeWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
    },
    {
      name: 'completeWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'completeWarehouseId' },
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
    },
    {
      name: 'inventoryWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
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
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'inventoryWarehouseId' },
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
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
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
      if (name === 'issueWarehouseObj') {
        record.set('issueWmAreaObj', null);
      }
      if (name === 'completeWarehouseObj') {
        record.set('completeWmAreaObj', null);
      }
      if (name === 'inventoryWarehouseObj') {
        record.set('inventoryWmAreaObj', null);
      }
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'workcell', 'resource');
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
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
