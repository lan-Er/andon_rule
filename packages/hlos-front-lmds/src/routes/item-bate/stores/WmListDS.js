/**
 * @Description: 物料仓储页面管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 15:33:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsItem, common } = codeConfig.code;
const {
  lovPara: { itemWm },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-wms`;

export default () => ({
  pageSize: 100,
  selection: false,
  queryFields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.wmCategory`).d('仓储类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_WM' },
      ignore: 'always',
    },
    {
      name: 'wmCategoryId',
      type: 'string',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: '是否有效',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        selection: 'single',
        data: [
          { text: '有效', value: '1' },
          { text: '无效', value: '0' },
        ],
      }),
    },
  ],
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      bind: 'organizationObj',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'wmOuId',
      type: 'string',
    },
    {
      name: 'wmOuCode',
      type: 'string',
    },
    {
      name: 'wmOuName',
      type: 'string',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      validator: descValidator,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
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
      name: 'itemWmType',
      type: 'string',
      label: intl.get(`${preCode}.itemWmType`).d('物料仓储类型'),
      lookupCode: lmdsItem.itemWmType,
    },
    {
      name: 'wmCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.wmCategory`).d('物料仓储类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemWm },
      ignore: 'always',
    },
    {
      name: 'wmCategoryId',
      type: 'string',
      bind: 'wmCategoryObj.categoryId',
    },
    {
      name: 'wmCategoryCode',
      type: 'string',
      bind: 'wmCategoryObj.categoryCode',
    },
    {
      name: 'wmCategoryName',
      type: 'string',
      bind: 'wmCategoryObj.categoryName',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${commonCode}.uom`).d('单位'),
      lovCode: common.uom,
      ignore: 'always',
      required: true,
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'wmWorkerObj',
      type: 'object',
      label: intl.get(`${preCode}.wmWorker`).d('仓库管理员工'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'wmWorkerId',
      type: 'string',
      bind: 'wmWorkerObj.workerId',
    },
    {
      name: 'wmWorker',
      type: 'string',
      bind: 'wmWorkerObj.workerCode',
    },
    {
      name: 'wmWorkerName',
      type: 'string',
      bind: 'wmWorkerObj.workerName',
    },
    {
      name: 'abcType',
      type: 'string',
      label: intl.get(`${preCode}.abcType`).d('ABC分类'),
      lookupCode: lmdsItem.abcType,
    },
    {
      name: 'sequenceLotControl',
      type: 'string',
      label: intl.get(`${preCode}.sequenceLotControl`).d('序列/批次控制'),
      lookupCode: lmdsItem.lotControl,
    },
    {
      name: 'tagFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.tagFlag`).d('条码管理'),
    },
    {
      name: 'reservationRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reservationRule`).d('预留规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为RESERVATION
      lovPara: {
        ruleType: 'RESERVATION',
      },
    },
    {
      name: 'reservationRuleId',
      type: 'string',
      bind: 'reservationRuleObj.ruleId',
    },
    {
      name: 'reservationRuleName',
      type: 'string',
      bind: 'reservationRuleObj.ruleName',
    },
    {
      name: 'fifoRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为FIFO
      lovPara: {
        ruleType: 'FIFO',
      },
    },
    {
      name: 'fifoRuleId',
      type: 'string',
      bind: 'fifoRuleObj.ruleId',
    },
    {
      name: 'fifoRuleName',
      type: 'string',
      bind: 'fifoRuleObj.ruleName',
    },
    {
      name: 'storageRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.storageRule`).d('上架规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为STORAGE
      lovPara: {
        ruleType: 'STORAGE',
      },
    },
    {
      name: 'storageRuleId',
      type: 'string',
      bind: 'storageRuleObj.ruleId',
    },
    {
      name: 'storageRuleName',
      type: 'string',
      bind: 'storageRuleObj.ruleName',
    },
    {
      name: 'pickRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.pickRule`).d('拣货规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为PICK
      lovPara: {
        ruleType: 'PICK',
      },
    },
    {
      name: 'pickRuleId',
      type: 'string',
      bind: 'pickRuleObj.ruleId',
    },
    {
      name: 'pickRuleName',
      type: 'string',
      bind: 'pickRuleObj.ruleName',
    },
    {
      name: 'replenishRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.replenishRule`).d('补货规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为REPLENISH
      lovPara: {
        ruleType: 'REPLENISH',
      },
    },
    {
      name: 'replenishRuleId',
      type: 'string',
      bind: 'replenishRuleObj.ruleId',
    },
    {
      name: 'replenishRuleName',
      type: 'string',
      bind: 'replenishRuleObj.ruleName',
    },
    {
      name: 'waveDeliveryRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.waveDeliveryRule`).d('波次规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为WAVE_DELIVERY
      lovPara: {
        ruleType: 'WAVE_DELIVERY',
      },
    },
    {
      name: 'waveDeliveryRuleId',
      type: 'string',
      bind: 'waveDeliveryRuleObj.ruleId',
    },
    {
      name: 'waveDeliveryRuleName',
      type: 'string',
      bind: 'waveDeliveryRuleObj.ruleName',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为PACKING
      lovPara: {
        ruleType: 'PACKING',
      },
    },
    {
      name: 'packingRuleId',
      type: 'string',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRuleName',
      type: 'string',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'wmInspectRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.wmInspectRule`).d('仓库质检规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为WM_INSPECT
      lovPara: {
        ruleType: 'WM_INSPECT',
      },
    },
    {
      name: 'wmInspectRuleId',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleId',
    },
    {
      name: 'wmInspectRuleName',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleName',
    },
    {
      name: 'cycleCountRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.cycleCountRule`).d('循环盘点规则'),
      lovCode: common.rule,
      ignore: 'always',
      // 限定规则类型为CYCLE_COUNT
      lovPara: {
        ruleType: 'CYCLE_COUNT',
      },
    },
    {
      name: 'cycleCountRuleId',
      type: 'string',
      bind: 'cycleCountRuleObj.ruleId',
    },
    {
      name: 'cycleCountRuleName',
      type: 'string',
      bind: 'cycleCountRuleObj.ruleName',
    },
    {
      name: 'economicQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.economicQty`).d('经济批量'),
    },
    {
      name: 'storageMinQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.storageMinQty`).d('存储下限'),
    },
    {
      name: 'storageMaxQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.storageMaxQty`).d('存储上限'),
      validator: (value, name, record) => {
        if (value <= record.get('storageMinQty')) {
          return intl.get(`lmds.item.validation.biggerStorage`).d('存储上限必须大于存储下限');
        }
      },
    },
    {
      name: 'packingFormat',
      type: 'string',
      label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      lookupCode: common.packingFormat,
    },
    {
      name: 'packingMaterial',
      type: 'string',
      label: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
    },
    {
      name: 'minPackingQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
    },
    {
      name: 'packingQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.packingQty`).d('包装数'),
      validator: (value, name, record) => {
        if (value <= record.get('minPackingQty')) {
          return intl.get(`lmds.item.validation.biggerpacking`).d('包装数必须大于最小包装数');
        }
      },
    },
    {
      name: 'containerQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.containerQty`).d('装箱数'),
    },
    {
      name: 'palletContainerQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.palletContainerQty`).d('托盘箱数'),
    },
    {
      name: 'storageWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.storageWarehouse`).d('上架仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'storageWarehouseName',
      type: 'string',
      bind: 'storageWarehouseObj.warehouseName',
    },
    {
      name: 'storageWarehouseId',
      type: 'string',
      bind: 'storageWarehouseObj.warehouseId',
    },
    {
      name: 'storageWarehouseCode',
      type: 'string',
      bind: 'storageWarehouseObj.warehouseCode',
    },
    {
      name: 'storageWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.storageWmArea`).d('上架货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'storageWarehouseId' },
    },
    {
      name: 'storageWmAreaId',
      type: 'string',
      bind: 'storageWmAreaObj.wmAreaId',
    },
    {
      name: 'storageWmAreaCode',
      type: 'string',
      bind: 'storageWmAreaObj.wmAreaCode',
    },
    {
      name: 'storageWmAreaName',
      type: 'string',
      bind: 'storageWmAreaObj.wmAreaName',
    },
    {
      name: 'storageWmUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.storageWmUnit`).d('上架货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      cascadeMap: { wmAreaId: 'storageWmAreaId' },
    },
    {
      name: 'storageWmUnitId',
      type: 'string',
      bind: 'storageWmUnitObj.wmUnitId',
    },
    {
      name: 'storageWmUnitCode',
      type: 'string',
      bind: 'storageWmUnitObj.wmUnitCode',
    },
    {
      name: 'pickWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.pickWarehouse`).d('拣货仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'pickWarehouseName',
      type: 'string',
      bind: 'pickWarehouseObj.warehouseName',
    },
    {
      name: 'pickWarehouseCode',
      type: 'string',
      bind: 'pickWarehouseObj.warehouseCode',
    },
    {
      name: 'pickWarehouseId',
      type: 'string',
      bind: 'pickWarehouseObj.warehouseId',
    },
    {
      name: 'pickWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.pickWmArea`).d('拣货货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'pickWarehouseId' },
    },
    {
      name: 'pickWmAreaId',
      type: 'string',
      bind: 'pickWmAreaObj.wmAreaId',
    },
    {
      name: 'pickWmAreaCode',
      type: 'string',
      bind: 'pickWmAreaObj.wmAreaCode',
    },
    {
      name: 'pickWmAreaName',
      type: 'string',
      bind: 'pickWmAreaObj.wmAreaName',
    },
    {
      name: 'pickWmUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.pickWmUnit`).d('拣货货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      cascadeMap: { wmAreaId: 'pickWmAreaId' },
    },
    {
      name: 'pickWmUnitId',
      type: 'string',
      bind: 'pickWmUnitObj.wmUnitId',
    },
    {
      name: 'pickWmUnitCode',
      type: 'string',
      bind: 'pickWmUnitObj.wmUnitCode',
    },
    {
      name: 'expireControlFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.expireControlFlag`).d('有效期控制'),
    },
    {
      name: 'expireControlType',
      type: 'string',
      label: intl.get(`${preCode}.expireControlType`).d('有效期控制类型'),
      lookupCode: lmdsItem.expireControlType,
    },
    {
      name: 'expireDays',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.expireDays`).d('有效期'),
    },
    {
      name: 'expireAlertDays',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.expireAlertDays`).d('预警期'),
    },
    {
      name: 'expireLeadDays',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.expireLeadDays`).d('出库提前期'),
      // 天
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
        transformResponse(data) {
          const newData = JSON.parse(data);
          if (newData && newData.content && newData.content.length) {
            return {
              ...newData,
              content: newData.content.reverse(),
            };
          } else {
            return {
              ...newData,
            };
          }
        },
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'storageWarehouseObj') {
        record.set('storageWmAreaObj', null);
        record.set('storageWmUnitObj', null);
      }
      if (name === 'storageWmAreaObj') {
        record.set('storageWmUnitObj', null);
      }
      if (name === 'pickWarehouseObj') {
        record.set('pickWmAreaObj', null);
        record.set('pickWmUnitObj', null);
      }
      if (name === 'pickWmAreaObj') {
        record.set('pickWmUnitObj', null);
      }
    },
  },
});
