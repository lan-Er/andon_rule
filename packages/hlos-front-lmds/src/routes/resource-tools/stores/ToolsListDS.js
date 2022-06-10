/*
 * @Author: zhang yang
 * @Description: 工装 DS
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 20:08:19
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/toolss`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.tool.model';

const { common, lmdsTools } = codeConfig.code;

export default () => ({
  autoQuery: true,
  selection: false,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'tool', 'resource');
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
      method: 'get',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'post',
    }),
    submit: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
        },
        method: 'put',
      };
    },
  },
  fields: [
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organization.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'toolCode',
      type: 'string',
      label: intl.get(`${preCode}.tool`).d('工装'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'toolName',
      type: 'intl',
      label: intl.get(`${preCode}.toolName`).d('工装名称'),
      required: true,
    },
    {
      name: 'toolAlias',
      type: 'intl',
      label: intl.get(`${preCode}.toolAlias`).d('工装简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.toolDesc`).d('工装描述'),
      validator: descValidator,
    },
    {
      name: 'toolType',
      type: 'string',
      label: intl.get(`${preCode}.relationType`).d('工装类型'),
      required: true,
      lookupCode: lmdsTools.toolType,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.picture`).d('图片'),
    },
    {
      name: 'category',
      type: 'object',
      label: intl.get(`${preCode}.toolCategory`).d('工装类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'TOOL' },
      ignore: 'always',
    },
    {
      name: 'toolCategoryId',
      type: 'string',
      bind: 'category.categoryId',
    },
    {
      name: 'toolCategoryCode',
      type: 'string',
      bind: 'category.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'category.categoryName',
    },
    {
      name: 'toolGroup',
      type: 'string',
      label: intl.get(`${preCode}.toolGroup`).d('工装组'),
    },
    {
      name: 'ownerType',
      type: 'string',
      label: '所有者类型',
      lookupCode: common.ownerType,
      required: true,
    },
    {
      name: 'owner',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.party,
      cascadeMap: {
        ownerType: 'ownerType',
      },
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.partyId',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.partyName',
    },
    {
      name: 'ownerNumber',
      type: 'string',
      bind: 'owner.partyNumber',
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
      name: 'chiefPositionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'toolStatus',
      type: 'string',
      label: intl.get(`${preCode}.toolStatus`).d('工装状态'),
      lookupCode: lmdsTools.toolStatus,
    },
    {
      name: 'exclusiveFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.exclusiveFlag`).d('专用标识'),
      defaultValue: false,
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
      name: 'BOM',
      type: 'object',
      label: intl.get(`${preCode}.BOM`).d('工装BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: 'TOOL' },
      ignore: 'always',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'BOM.resourceBomId',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'BOM.resourceBomCode',
    },
    {
      name: 'bomName',
      type: 'string',
      bind: 'BOM.resourceBomName',
    },
    {
      name: 'valueCurrency',
      type: 'object',
      label: intl.get(`${preCode}.valueCurrency`).d('估值货币'),
      lovCode: common.currency,
      ignore: 'always',
    },
    {
      name: 'currencyCode',
      type: 'string',
      bind: 'valueCurrency.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'valueCurrency.currencyId',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'valueCurrency.currencyCode',
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
      name: 'prodLine',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: lmdsTools.prodLine,
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLine.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLine.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLine.resourceName',
    },
    {
      name: 'equipment',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: lmdsTools.equipment,
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipment.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipment.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipment.equipmentName',
    },
    {
      name: 'workcell',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      lovCode: lmdsTools.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcell.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcell.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcell.workcellName',
    },
    {
      name: 'warehouse',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      lovCode: lmdsTools.warehouse,
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'wmArea',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: lmdsTools.wmArea,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('warehouseId'))) {
          return {
            lovPara: { warehouseId: record.get('warehouseId') },
          };
        }
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmArea.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmArea.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmArea.wmAreaName',
    },
    {
      name: 'wmUnit',
      type: 'object',
      label: intl.get(`${preCode}.wmUnit`).d('货格'),
      lovCode: lmdsTools.wmUnit,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('wmAreaId'))) {
          return {
            lovPara: { wmAreaId: record.get('wmAreaId') },
          };
        }
      },
    },
    {
      name: 'wmUnitId',
      type: 'string',
      bind: 'wmUnit.wmUnitId',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnit.wmUnitCode',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnit.wmUnitCode',
    },
    {
      name: 'location',
      type: 'object',
      label: intl.get(`${preCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'location.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'location.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'location.locationName',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'cycleCount',
      type: 'number',
      label: intl.get(`${preCode}.cycleCount`).d('循环使用次数'),
      min: 0,
      step: 1,
    },
    {
      name: 'usedCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.toolUsedCount`).d('已使用次数'),
    },
    {
      name: 'nextPlanCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.nextPlanCount`).d('下回计划次数'),
    },
    {
      name: 'nextUsedCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.nextUsedCount`).d('下回使用次数'),
    },
    {
      name: 'maintenancedTimes',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.maintenancedTimes`).d('检修次数'),
    },
    {
      name: 'lastTpmDate',
      type: 'date',
      label: intl.get(`${preCode}.lastTpmDate`).d('上次检修日期'),
    },
    {
      name: 'lastTpmMan',
      type: 'string',
      label: intl.get(`${preCode}.lastTpmMan`).d('上次检修人'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'toolCode', type: 'string', label: intl.get(`${preCode}.tool`).d('工装') },
    {
      name: 'toolName',
      type: 'string',
      label: intl.get(`${preCode}.toolName`).d('工装名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ name, record }) => {
      if (name === 'warehouse') {
        record.set('wmArea', null);
      }
      if (name === 'wmArea') {
        record.set('wmUnit', null);
      }
    },
  },
});
