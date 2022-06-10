/*
 * @module: 客户采购明细Ds
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-06-23 09:53:38
 * @LastEditTime: 2021-06-25 20:16:58
 * @copyright: Copyright (c) 2020,Hand
 */
import codeList, { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

export default () => {
  return {
    pageSize: 20,
    queryFields: [
      { name: 'customerName', type: 'string', label: '客户' },
      { name: 'poNum', type: 'string', label: '采购订单号' },
      {
        name: 'poLineNum',
        type: 'string',
        label: '采购订单行号',
        dynamicProps: ({ record }) => {
          if (record.get('poNum')) {
            return { disabled: false };
          } else {
            return { disabled: true };
          }
        },
      },
      {
        name: 'creationDateStart',
        type: 'dateTime',
        label: '制单日期从',
        max: 'creationDateEnd',
      },
      {
        name: 'creationDateEnd',
        type: 'dateTime',
        label: '制单日期至',
        min: 'creationDateStart',
      },
      {
        name: 'demandDateStart',
        type: 'dateTime',
        label: '需求日期从',
        min: 'demandDateEnd',
      },
      {
        name: 'demandDateEnd',
        type: 'dateTime',
        label: '需求日期至',
        max: 'demandDateStart',
      },
      {
        name: 'buyer',
        type: 'string',
        label: '采购员',
      },
      {
        name: 'soLineStatusList',
        type: 'string',
        lookupCode: codeList.lineStatus,
        multiple: ',',
        label: '状态',
      },
      {
        name: 'itemObject',
        type: 'object',
        label: '物料',
        ignore: 'always',
        lovCode: codeList.item,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObject.itemId',
      },
      {
        name: 'itemName',
        type: 'string',
        bind: 'itemObject.itemName',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObject.itemCode',
      },
      {
        name: 'inventoryQty',
        type: 'string',
        label: '净入库数>=',
      },
      {
        name: 'notGeneratedReturnedQty',
        type: 'string',
        label: '待生成退货>=',
      },
    ],
    fields: [
      { name: 'soLineStatusMeaning', label: '状态', type: 'string' },
      { name: 'poNum', label: '订单号', type: 'string' },
      { name: 'customerNumber', label: '客户编码', type: 'string' },
      { name: 'customerName', label: '客户名称', type: 'string' },
      { name: 'poLineNum', label: '行号', type: 'string' },
      { name: 'itemCode', label: '物料编码', type: 'string' },
      { name: 'itemDescription', label: '物料描述', type: 'string' },
      { name: 'demandQty', label: '需求数量', type: 'string' },
      { name: 'inventoryQty', label: '净入库数', type: 'string' },
      { name: 'notInventoryQty', label: '未入库数', type: 'string' },
      { name: 'notReceiveQty', label: '未接收数量', type: 'string' },
      { name: 'returnedQty', label: '退货数量', type: 'string' },
      { name: 'notGeneratedReturnedQty', label: '待生成退货数量', type: 'string' },
      {
        name: 'returnWarehouseObj',
        label: '退货仓库',
        type: 'object',
        lovCode: codeList.wareHouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: () => {
            const organizationId = sessionStorage.getItem('organizationObjGrwl');
            if (organizationId) {
              return { organizationId };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'returnWarehouseId',
        type: 'string',
        bind: 'returnWarehouseObj.warehouseId',
      },
      {
        name: 'returnWarehouseCode',
        type: 'string',
        bind: 'returnWarehouseObj.warehouseCode',
      },
      {
        name: 'returnWarehouseName',
        type: 'string',
        bind: 'returnWarehouseObj.warehouseName',
      },
      { name: 'generatedReturnedQty', label: '已生成退货数', type: 'string' },
      { name: 'shippedQty', label: '已发货数量', type: 'string' },
      { name: 'unitPrice', label: '单价', type: 'string' },
      { name: 'lineAmount', label: '行总价', type: 'string' },
      { name: 'uom', label: '单位', type: 'string' },
      { name: 'demandDate', label: '需求日期', type: 'dateTime' },
      { name: 'promiseDate', label: '承诺日期', type: 'dateTime' },
      { name: 'designCode', label: '规格', type: 'string' },
      { name: 'specification', label: '型号', type: 'string' },
      { name: 'remark', label: '采购订单备注', type: 'string' },
      { name: 'buyer', label: '采购员', type: 'string' },
      { name: 'publishDate', label: '发布日期', type: 'dateTime' },
      { name: 'confirmDate', label: '确认日期', type: 'dateTime' },
      { name: 'creationDate', label: '制单日期', type: 'dateTime' },
      { name: 'externalNum', label: '来源系统', type: 'string' },
    ],
    transport: {
      read: () => {
        return {
          url: `${
            myModule.lsops
          }/v1/${getCurrentOrganizationId()}/grwl-so-lines/customer-po-detail`,
          method: 'GET',
        };
      },
    },
  };
};
