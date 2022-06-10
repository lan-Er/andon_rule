/*
 * @Author: zhang yang
 * @Description: 容器 DS
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
const url = `${HLOS_LMDS}/v1/${organizationId}/containers`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.container.model';

const { common, lmdsContainer } = codeConfig.code;

export default () => ({
  autoQuery: true,
  selection: false,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'container', 'resource');
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
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'containerCode',
      type: 'string',
      label: intl.get(`${preCode}.container`).d('容器'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'containerName',
      type: 'intl',
      label: intl.get(`${preCode}.containerName`).d('容器名称'),
      required: true,
    },
    {
      name: 'containerAlias',
      type: 'intl',
      label: intl.get(`${preCode}.containerAlias`).d('容器简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.containerDesc`).d('容器描述'),
      validator: descValidator,
    },
    {
      name: 'containerTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.relationType`).d('容器类型'),
      required: true,
      lovCode: lmdsContainer.containerType,
      ignore: 'always',
    },
    {
      name: 'containerType',
      type: 'string',
      bind: 'containerTypeObj.containerType',
    },
    {
      name: 'containerTypeId',
      type: 'string',
      bind: 'containerTypeObj.containerTypeId',
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.picture`).d('图片'),
    },
    {
      name: 'category',
      type: 'object',
      label: intl.get(`${preCode}.containerCategory`).d('容器类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'CONTAINER' },
      ignore: 'always',
    },
    {
      name: 'containerCategoryId',
      type: 'string',
      bind: 'category.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'category.categoryName',
    },
    {
      name: 'containerGroup',
      type: 'string',
      label: intl.get(`${preCode}.containerGroup`).d('容器组'),
    },
    {
      name: 'owner',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.user,
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.id',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.realName',
    },
    {
      name: 'chiefPosition',
      type: 'object',
      label: intl.get(`${preCode}.chiefPosition`).d('主管岗位'),
      lovCode: common.position,
      ignore: 'always',
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPosition.positionId',
    },
    {
      name: 'chiefPositionName',
      type: 'string',
      bind: 'chiefPosition.positionName',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('实物标签'),
    },
    {
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${preCode}.assetNumber`).d('资产编号'),
    },
    {
      name: 'containerStatus',
      type: 'string',
      label: intl.get(`${preCode}.containerStatus`).d('容器状态'),
      lookupCode: lmdsContainer.containerStatus,
    },
    {
      name: 'exclusiveFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.exclusiveFlag`).d('专用标识'),
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
      label: intl.get(`${preCode}.BOM`).d('容器BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: 'CONTAINER' },
      ignore: 'always',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'BOM.resourceBomId',
    },
    {
      name: 'resourceBomDescription',
      type: 'string',
      bind: 'BOM.resourceBomName',
    },
    {
      name: 'valueCurrencyObj',
      type: 'object',
      label: intl.get(`${preCode}.valueCurrency`).d('估值货币'),
      lovCode: common.currency,
      ignore: 'always',
    },
    {
      name: 'valueCurrency',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'valueCurrencyObj.currencyId',
    },
    {
      name: 'initialValue',
      type: 'string',
      label: intl.get(`${preCode}.initialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'string',
      label: intl.get(`${preCode}.currentValue`).d('当前价值'),
    },
    {
      name: 'prodLine',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: lmdsContainer.prodLine,
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLine.prodLineId',
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
      lovCode: lmdsContainer.equipment,
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipment.equipmentId',
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
      lovCode: lmdsContainer.workcell,
      ignore: 'always',
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcell.workcellId',
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
      lovCode: lmdsContainer.warehouse,
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouse.warehouseId',
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
      lovCode: lmdsContainer.wmArea,
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmArea.wmAreaId',
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
      lovCode: lmdsContainer.wmUnit,
      ignore: 'always',
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
      label: intl.get(`${preCode}.containerUsedCount`).d('已使用次数'),
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
      dynamicProps: {
        min: ({ record }) => {
          if (!isEmpty(record.get('startUseDate'))) {
            return 'startUseDate';
          }
        },
      },
    },
    {
      name: 'lastTpmMan',
      type: 'string',
      label: intl.get(`${preCode}.lastTpmMan`).d('上次检修人'),
    },
    {
      name: 'length',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.Length`).d('长度(米)'),
    },
    {
      name: 'width',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.width`).d('宽度(米)'),
    },
    {
      name: 'height',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.height`).d('高度(米)'),
    },
    {
      name: 'containerWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.containerWeight`).d('容器重量(Kg)'),
    },
    {
      name: 'maxVolume',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.maxVolume`).d('最大体积(立方米)'),
    },
    {
      name: 'maxWeight',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.maxWeight`).d('最大重量(Kg)'),
    },
    {
      name: 'maxItemQty',
      type: 'number',
      min: 0,
      defaultValue: 9999,
      label: intl.get(`${preCode}.maxItemQty`).d('最大物料数量'),
    },
    {
      name: 'multiItemEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.multiItemEnable`).d('允许物料混放'),
      defaultValue: true,
    },
    {
      name: 'multiLotEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.multiLotEnable`).d('允许批次混放'),
      defaultValue: true,
    },
    {
      name: 'loadMethod',
      type: 'string',
      label: intl.get(`${preCode}.loadMethod`).d('装载方式'),
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
    { name: 'containerCode', type: 'string', label: intl.get(`${preCode}.container`).d('容器') },
    {
      name: 'containerName',
      type: 'string',
      label: intl.get(`${preCode}.containerName`).d('容器名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ name, record }) => {
      const containerTypeObj = record.get('containerTypeObj');
      if (name === 'containerTypeObj' && !isEmpty(containerTypeObj)) {
        const {
          exclusiveFlag,
          length,
          width,
          height,
          containerWeight,
          maxVolume,
          maxWeight,
          maxItemQty,
          multiItemEnable,
          multiLotEnable,
          loadMethod,
        } = containerTypeObj;
        record.set('exclusiveFlag', !!exclusiveFlag);
        record.set('length', length);
        record.set('width', width);
        record.set('height', height);
        record.set('containerWeight', containerWeight);
        record.set('maxVolume', maxVolume);
        record.set('maxWeight', maxWeight);
        record.set('maxItemQty', maxItemQty);
        record.set('multiItemEnable', !!multiItemEnable);
        record.set('multiLotEnable', !!multiLotEnable);
        record.set('loadMethod', loadMethod);
      }
    },
  },
});
