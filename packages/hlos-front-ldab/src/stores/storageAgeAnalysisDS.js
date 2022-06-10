/*
 * @Description: 库龄分析报表--DS
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-10 11:05:22
 * @LastEditors: Please set LastEditors
 */

import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const preCode = 'ldab.productionTaskProgressReport.model';
const commonCode = 'ldab.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys/query-inventory-aging-report`;

const ListDS = () => {
  return {
    selection: false,
    transport: {
      read: () => ({
        url,
        method: 'GET',
      }),
    },
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
        lovCode: common.singleMeOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.meOuName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: 'LMDS.ITEM',
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            itemControlType: 'LOT',
          }),
        },
      },
      {
        name: 'itemId',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'warehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'itemType',
        type: 'string',
        label: intl.get(`${preCode}.itemType`).d('物料类型'),
        lookupCode: common.itemType,
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
        lovCode: 'LMDS.CATEGORIES',
        dynamicProps: {
          lovPara: () => ({
            categorySetCode: 'ITEM_WM',
          }),
        },
        ignore: 'always',
      },
      {
        name: 'categoryId',
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'categoryName',
        bind: 'categoryObj.categoryName',
      },
    ],
    fields: [
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'itemTypeMeaning',
        label: intl.get(`${commonCode}.itemType`).d('物料类型'),
      },
      {
        name: 'warehouseName',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'sumQty',
        label: intl.get(`${preCode}.quantity`).d('合计数量'),
      },
    ],
  };
};

const DetailDS = () => ({
  selection: false,
  transport: {
    read: () => ({
      url: `${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys/query-inventory-aging-report-detail`,
      method: 'GET',
    }),
  },
  fields: [
    {
      name: 'itemCode',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'descriptions',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'warehouseName',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    },
    {
      name: 'wmAreaName',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
    },
    {
      name: 'wmUnitCode',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'lotNumber',
      label: intl.get(`${commonCode}.lot`).d('批次号'),
    },
    {
      name: 'lotStatusMeaning',
      label: intl.get(`${preCode}.status`).d('状态'),
    },
    {
      name: 'uomName',
      label: intl.get(`${commonCode}.uom`).d('单位'),
    },
    {
      name: 'quantity',
      label: intl.get(`${preCode}.quantity`).d('数量'),
    },
    {
      name: 'inventoryAging',
      label: intl.get(`${preCode}.quantity`).d('库龄'),
    },
    {
      name: 'receivedDate',
      type: 'date',
      label: intl.get(`${preCode}.receivedDate`).d('接收日期'),
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('生产日期'),
    },
    {
      name: 'expireDate',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
    },
    {
      name: 'supplierName',
      type: 'date',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
    {
      name: 'supplierLotNumber',
      label: intl.get(`${preCode}.supplierLot`).d('供应商批次'),
    },
    {
      name: 'materialLotNumber',
      label: intl.get(`${preCode}.material`).d('材料'),
    },
    {
      name: 'materialSupplier',
      label: intl.get(`${preCode}.materialSupplier`).d('材料供应商'),
    },
    {
      name: 'manufacturer',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
  ],
});

export { ListDS, DetailDS };
