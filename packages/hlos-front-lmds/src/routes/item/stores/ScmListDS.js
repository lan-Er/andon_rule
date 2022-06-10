/**
 * @Description: 物料采购页面管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 13:54:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, positiveNumberValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsItem, common } = codeConfig.code;
const {
  lovPara: { itemScm },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-scms`;

export default () => ({
  selection: false,
  queryFields: [
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
      label: intl.get(`${preCode}.scmCategory`).d('采购类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_SCM' },
      ignore: 'always',
    },
    {
      name: 'scmCategoryId',
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
      defaultValue: '1',
    },
  ],
  fields: [
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
      name: 'scmOuId',
      type: 'string',
    },
    {
      name: 'scmOuCode',
      type: 'string',
    },
    {
      name: 'scmOuName',
      type: 'string',
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
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
      name: 'itemScmType',
      type: 'string',
      label: intl.get(`${preCode}.itemScmType`).d('物料采购类型'),
      lookupCode: lmdsItem.itemScmType,
    },
    {
      name: 'scmCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.scmCategory`).d('物料采购类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemScm },
      ignore: 'always',
    },
    {
      name: 'scmCategoryId',
      type: 'string',
      bind: 'scmCategoryObj.categoryId',
    },
    {
      name: 'scmCategoryCode',
      type: 'string',
      bind: 'scmCategoryObj.categoryCode',
    },
    {
      name: 'scmCategoryName',
      type: 'string',
      bind: 'scmCategoryObj.categoryName',
    },
    {
      name: 'buyerObj',
      type: 'object',
      label: intl.get(`${preCode}.buyer`).d('采购员'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'buyerId',
      type: 'string',
      bind: 'buyerObj.workerId',
    },
    {
      name: 'buyer',
      type: 'string',
      bind: 'buyerObj.workerCode',
    },
    {
      name: 'buyerName',
      type: 'string',
      bind: 'buyerObj.workerName',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${commonCode}.uom`).d('单位'),
      lovCode: common.uom,
      ignore: 'always',
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
      name: 'scmPlanRule',
      type: 'string',
      label: intl.get(`${preCode}.scmPlanRule`).d('供应链计划规则'),
      lookupCode: lmdsItem.scmPlanRule,
    },
    {
      name: 'eoq',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.eoq`).d('经济订货批量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'minStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maxStockQty',
      type: 'number',
      label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
      // 最大库存量不可小于最小库存量
      validator: (value, name, record) => {
        if (value <= record.get('minStockQty')) {
          return intl.get(`lmds.item.validation.biggerStock`).d('最大库存量必须大于最小库存量');
        }
      },
    },
    {
      name: 'safetyStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyStockQty`).d('安全库存量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'roundQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.roundQty`).d('圆整包装数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'minOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStartOrderQty`).d('最小起订量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maxOrderQty',
      type: 'number',
      label: intl.get(`${preCode}.maxStartOrderQty`).d('最大起订量'),
      // 最大起订量不可小于最小起订量
      validator: (value, name, record) => {
        if (value <= record.get('minOrderQty')) {
          return intl.get(`lmds.item.validation.biggerOrder`).d('最大起订量必须大于最小起订量');
        }
      },
    },
    {
      name: 'fixedOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.fixedOrderQty`).d('固定订货量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'fixedLotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.fixedLotFlag`).d('固定批次'),
    },
    {
      name: 'vmiFlag',
      type: 'boolean',
      label: 'VMI',
    },
    {
      name: 'marketPrice',
      type: 'number',
      label: intl.get(`${preCode}.marketPrice`).d('市场价格'),
      validator: positiveNumberValidator,
    },
    {
      name: 'purchasePrice',
      type: 'number',
      label: intl.get(`${preCode}.purchasePrice`).d('采购价格'),
      validator: positiveNumberValidator,
    },
    {
      name: 'taxable',
      type: 'boolean',
      label: intl.get(`${preCode}.taxable`).d('含税'),
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currencyObj.currencyName',
    },
    {
      name: 'priceTolerance',
      type: 'number',
      label: intl.get(`${preCode}.priceTolerance`).d('价格允差'),
      validator: positiveNumberValidator,
    },
    {
      name: 'receiveToleranceType',
      type: 'string',
      label: intl.get(`${preCode}.receiveToleranceType`).d('收货允差类型'),
      lookupCode: lmdsItem.receiveToleranceType,
    },
    {
      name: 'receiveTolerance',
      type: 'number',
      label: intl.get(`${preCode}.receiveTolerance`).d('收货允差'),
      validator: positiveNumberValidator,
    },
    {
      name: 'invoiceTolerance',
      type: 'number',
      label: intl.get(`${preCode}.invoiceTolerance`).d('开票允差'),
      validator: positiveNumberValidator,
    },
    {
      name: 'aslFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.aslFlag`).d('合格供应商'),
    },
    {
      name: 'rfqFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.rfqFlag`).d('报价'),
    },
    {
      name: 'bondedFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.bondedFlag`).d('保税物料'),
    },
    {
      name: 'maxDayOrder',
      type: 'number',
      label: intl.get(`${preCode}.maxDayOrder`).d('最大日供量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'leadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.leadTime`).d('采购提前期'),
    },
    {
      name: 'receiveRule',
      type: 'string',
      label: intl.get(`${preCode}.receiveRule`).d('接收入库规则'),
      lookupCode: lmdsItem.receiveRule,
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWarehouse`).d('默认接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'receiveWarehouseName',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseName',
    },
    {
      name: 'receiveWarehouseId',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('默认接收货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'receiveWarehouseId' },
    },
    {
      name: 'receiveWmAreaId',
      type: 'string',
      bind: 'receiveWmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      type: 'string',
      bind: 'receiveWmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      type: 'string',
      bind: 'receiveWmAreaObj.wmAreaName',
    },
    {
      name: 'inventoryWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouseName',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseName',
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'inventoryWarehouseObj.warehouseId',
    },
    {
      name: 'inventoryWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.inventoryWmArea`).d('默认入库货位'),
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
      name: 'inventoryWmAreaName',
      type: 'string',
      bind: 'inventoryWmAreaObj.wmAreaName',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.defaultSupplier`).d('默认供应商'),
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${preCode}.defaultSupplierItem`).d('默认供应商物料'),
      validator: codeValidator,
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.defaultSupplierItemDesc`).d('默认供应商物料描述'),
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
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'receiveWarehouseObj') {
        record.set('receiveWmAreaObj', null);
      }
      if (name === 'inventoryWarehouseObj') {
        record.set('inventoryWmAreaObj', null);
      }
      if (name === 'supplierObj') {
        record.set('supplierItemObj', null);
      }
    },
  },
});
