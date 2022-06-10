/**
 * @Description: 模具-DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-04 14:47:15
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

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

const preCode = 'lmds.mould';
const commonCode = 'lmds.common';
const { common, lmdsMould } = codeConfig.code;
const {
  lovPara: { die },
} = statusConfig.statusValue.lmds;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/dies`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  primaryKey: 'dieId',
  queryFields: [
    {
      name: 'dieCode',
      type: 'string',
      unique: true,
      label: intl.get(`${preCode}.view.title.mould`).d('模具'),
    },
    {
      name: 'dieName',
      type: 'string',
      label: intl.get(`${preCode}.model.dieName`).d('模具名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'dieCode',
      type: 'string',
      label: intl.get(`${preCode}.view.title.mould`).d('模具'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'dieName',
      type: 'intl',
      label: intl.get(`${preCode}.model.dieName`).d('模具名称'),
      required: true,
    },
    {
      name: 'dieAlias',
      type: 'intl',
      label: intl.get(`${preCode}.model.dieAlias`).d('模具简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.model.description`).d('模具描述'),
      validator: descValidator,
    },
    {
      name: 'dieType',
      type: 'string',
      label: intl.get(`${preCode}.model.dieType`).d('模具类型'),
      required: true,
      lookupCode: lmdsMould.dieType,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.model.fileUrl`).d('图片'),
    },
    {
      name: 'dieCategoryObj',
      label: intl.get(`${preCode}.model.dieCategoryId`).d('模具类别'),
      type: 'object',
      lovCode: common.categories,
      lovPara: { categorySetCode: die },
      ignore: 'always',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'dieCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'dieCategoryCode',
      type: 'string',
      bind: 'dieCategoryObj.categoryCode',
    },
    {
      name: 'dieCategoryId',
      type: 'string',
      bind: 'dieCategoryObj.categoryId',
    },
    {
      name: 'dieGroup',
      type: 'string',
      label: intl.get(`${preCode}.model.dieGroup`).d('模具组'),
    },
    {
      name: 'ownerObj',
      type: 'object',
      label: intl.get(`${preCode}.model.ownerId`).d('所有者'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'unitName',
      type: 'string',
      bind: 'ownerObj.departmentName',
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'ownerObj.departmentId',
    },
    {
      name: 'ownerNumber',
      type: 'string',
      bind: 'ownerObj.departmentCode',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.model.chiefPositionId`).d('主管岗位'),
      lovCode: common.position,
      ignore: 'always',
    },
    {
      name: 'chiefPositionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
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
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${preCode}.model.assetNumber`).d('资产编号'),
    },
    {
      name: 'dieStatus',
      type: 'string',
      label: intl.get(`${preCode}.model.dieStatus`).d('模具状态'),
      lookupCode: lmdsMould.dieStatus,
    },
    {
      name: 'purchaseDate',
      type: 'date',
      label: intl.get(`${preCode}.model.purchaseDate`).d('采购日期'),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('startUseDate'))) {
            return 'startUseDate';
          }
        },
      },
    },
    {
      name: 'startUseDate',
      type: 'date',
      label: intl.get(`${preCode}.model.startUseDate`).d('开始使用日期'),
      min: 'purchaseDate',
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('lastRepairedDate'))) {
            return 'lastRepairedDate';
          }
        },
      },
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${preCode}.model.supplier`).d('供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.model.manufacturer`).d('制造商'),
    },
    {
      name: 'servicePhone',
      type: 'string',
      label: intl.get(`${preCode}.model.servicePhone`).d('维修电话'),
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${preCode}.model.bomId`).d('模具BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: die },
      ignore: 'always',
    },
    {
      name: 'bom',
      type: 'string',
      bind: 'bomObj.resourceBomName',
      ignore: 'always',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bomObj.resourceBomId',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'bomObj.resourceBomCode',
    },
    {
      name: 'valueCurrencyObj',
      type: 'object',
      label: intl.get(`${preCode}.model.valueCurrency`).d('估值货币'),
      lovCode: common.currency,
      ignore: 'always',
    },
    {
      name: 'valueCurrency',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'valueCurrencyObj.currencyId',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'initialValue',
      type: 'string',
      label: intl.get(`${preCode}.model.initialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'string',
      label: intl.get(`${preCode}.model.currentValue`).d('当前价值'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.model.prodLineId`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.model.equipmentId`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'workCellObj',
      type: 'object',
      label: intl.get(`${preCode}.model.workcellId`).d('工位'),
      lovCode: lmdsMould.workCell,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workCellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workCellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workCellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.model.warehouseId`).d('仓库'),
      lovCode: lmdsMould.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmAreaId`).d('货位'),
      lovCode: lmdsMould.wmArea,
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.model.wmUnitId`).d('货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          wmAreaId: record.get('wmAreaId'),
        }),
      },
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnitObj.wmUnitCode',
    },
    {
      name: 'wmUnitId',
      type: 'string',
      bind: 'wmUnitObj.wmUnitId',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${preCode}.model.locationId`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
      ignore: 'always',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${preCode}.model.outsideLocation`).d('外部地点'),
    },
    {
      name: 'dieLifetimeCount',
      type: 'number',
      label: intl.get(`${preCode}.model.dieLifetimeCount`).d('寿命次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'dieUsedCount',
      type: 'number',
      label: intl.get(`${preCode}.model.dieUsedCount`).d('已使用次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'planRepairTimes',
      type: 'number',
      label: intl.get(`${preCode}.model.planRepairTimes`).d('计划维修次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'repairedTimes',
      type: 'number',
      label: intl.get(`${preCode}.model.repairedTimes`).d('已维修次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'nextPlanCount',
      type: 'number',
      label: intl.get(`${preCode}.model.nextPlanCount`).d('下回计划次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'nextUsedCount',
      type: 'number',
      label: intl.get(`${preCode}.model.nextUsedCount`).d('下回使用次数'),
      min: 1,
      step: 1,
    },
    {
      name: 'lastRepairedDate',
      type: 'date',
      label: intl.get(`${preCode}.model.lastRepairedDate`).d('上次维修日期'),
      min: 'startUseDate',
    },
    {
      name: 'lastRepairedMan',
      type: 'string',
      label: intl.get(`${preCode}.model.lastRepairedMan`).d('上次维修人'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.model.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('lmds.common.model.enabledFlag').d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'die', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ record, name }) => {
      if (!record.get('startUseDate')) {
        record.fields.get('purchaseDate').set('max', '2100-1-1');
      }
      if (!record.get('lastRepairedDate')) {
        record.fields.get('purchaseDate').set('max', '2100-1-1');
        record.fields.get('startUseDate').set('max', '2100-1-1');
      }
      if (name === 'warehouseObj') {
        if (isEmpty(record.get('warehouseObj'))) {
          record.set('wmAreaObj', null);
        }
      }
      if (name === 'wmAreaObj') {
        if (isEmpty(record.get('wmAreaObj'))) {
          record.set('wmUnitObj', null);
        }
      }
    },
  },
});
