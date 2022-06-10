/*
 * @Author: 梁春艳 <chunyan.liang@hand-china.com>
 * @Date: 2019-12-03 10:20:18
 * @LastEditTime: 2020-10-26 12:00:08
 * @Description: 量具--GaugeListDS
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import {
  positiveNumberValidator,
  getTlsRecord,
  convertFieldName,
  codeValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const urlPrefix = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/gauges`;
const preCode = 'lmds.gauge.model';
const commonCode = 'lmds.common.model';
const { common, lmdsGauge } = codeConfig.code;
const {
  lovPara: { gauge },
} = statusConfig.statusValue.lmds;

export default () => ({
  pageSize: 10,
  autoQuery: true,
  selection: false,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'gauge', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: (config) => {
      const url = `${urlPrefix}`;
      return {
        ...config,
        url,
        method: 'get',
      };
    },
    update: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'PUT',
      };
    },
    create: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  queryFields: [
    { name: 'gaugeCode', type: 'String', label: intl.get(`${preCode}.gauge`).d('量具') },
    { name: 'gaugeName', type: 'String', label: intl.get(`${preCode}.gaugeName`).d('量具名称') },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      textField: 'organizationName',
      ignore: 'always',
    },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.meOuId' },
    { name: 'organizationCode', type: 'string', bind: 'organizationObj.meOuCode' },
    { name: 'organizationName', type: 'string', bind: 'organizationObj.organizationName' },
    {
      name: 'gaugeCode',
      type: 'string',
      label: intl.get(`${preCode}.gauge`).d('量具'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'gaugeName',
      type: 'intl',
      label: intl.get(`${preCode}.gaugeName`).d('量具名称'),
      required: true,
    },
    {
      name: 'gaugeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.gaugeAlias`).d('量具简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.description`).d('量具描述'),
      validator: descValidator,
    },
    {
      name: 'gaugeType',
      type: 'string',
      label: intl.get(`${preCode}.gaugeType`).d('量具类型'),
      lookupCode: lmdsGauge.gaugeType,
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.picture`).d('图片'),
    },
    {
      name: 'gaugeCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.gaugeCategory`).d('量具类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: gauge },
      ignore: 'always',
    },
    {
      name: 'gaugeCategoryId',
      type: 'string',
      bind: 'gaugeCategoryObj.categoryId',
    },
    {
      name: 'gaugeCategoryCode',
      type: 'string',
      bind: 'gaugeCategoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'gaugeCategoryObj.categoryName',
    },
    {
      name: 'gaugeGroup',
      type: 'string',
      label: intl.get(`${preCode}.gaugeGroup`).d('量具组'),
    },
    {
      name: 'ownerObj',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.department,
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
      name: 'unitName',
      type: 'string',
      bind: 'ownerObj.departmentName',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.chiefPosition`).d('主管岗位'),
      lovCode: common.position,
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
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${preCode}.assetNumber`).d('资产编号'),
    },
    {
      name: 'gaugeStatus',
      type: 'string',
      label: intl.get(`${preCode}.gaugeStatus`).d('量具状态'),
      lookupCode: lmdsGauge.gaugeStatus,
    },
    {
      name: 'purchaseDate',
      type: 'date',
      label: intl.get(`${preCode}.purchaseDate`).d('采购日期'),
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
      label: intl.get(`${preCode}.startUseDate`).d('开始使用日期'),
      min: 'purchaseDate',
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('expiredDate'))) {
            return 'expiredDate';
          }
        },
      },
    },
    {
      name: 'expiredDate',
      type: 'date',
      label: intl.get(`${preCode}.expiredDate`).d('失效日期'),
      min: 'startUseDate',
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
    {
      name: 'servicePhone',
      type: 'string',
      label: intl.get(`${preCode}.servicePhone`).d('维修电话'),
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${preCode}.bom`).d('量具BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: gauge },
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
      name: 'bom',
      type: 'string',
      bind: 'bomObj.resourceBomName',
    },
    {
      name: 'valueCurrencyObj',
      type: 'object',
      label: intl.get(`${preCode}.valueCurrency`).d('估值货币'),
      lovCode: common.currency,
      // textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'valueCurrency',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'valueCurrencyName',
      type: 'string',
      bind: 'valueCurrencyObj.currencyName',
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
      type: 'number',
      label: intl.get(`${preCode}.initialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'number',
      label: intl.get(`${preCode}.currentValue`).d('当前价值'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
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
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: common.equipment,
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
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
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
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
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
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
    },
    {
      name: 'wmUnitId',
      type: 'string',
      bind: 'wmUnitObj.wmUnitId',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnitObj.wmUnitCode',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnitObj.wmUnitCode',
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
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'calibrateOrganization',
      type: 'string',
      label: intl.get(`${preCode}.calibrateOrg`).d('校准机构'),
    },
    {
      name: 'gaugeLifetime',
      type: 'number',
      label: intl.get(`${preCode}.lifetime`).d('使用寿命(月)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'planCalibrateTimes',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${preCode}.planCalibrateTimes`).d('计划校准次数'),
    },
    {
      name: 'calibratedTimes',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${preCode}.calibratedTimes`).d('已校准次数'),
    },
    {
      name: 'calibrateInterval',
      type: 'number',
      label: intl.get(`${preCode}.calibrateInterval`).d('校准间隔(月)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'lastCalibratedDate',
      type: 'date',
      label: intl.get(`${preCode}.lastCalibratedDate`).d('上次校准日期'),
    },
    {
      name: 'nextCalibrateDate',
      type: 'date',
      label: intl.get(`${preCode}.nextCalibrateDate`).d('下次校准日期'),
    },
    {
      name: 'lastCalibratedMan',
      type: 'string',
      label: intl.get(`${preCode}.lastCalibratedMan`).d('上次校准人'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
      required: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
