/*
 * @module: 查询条件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-22 17:13:46
 * @LastEditTime: 2021-06-10 15:42:27
 * @copyright: Copyright (c) 2020,Hand
 */
import lovCodeList, { myModule } from '@/common/index';

import { getCurrentOrganizationId } from 'utils/utils';

export default () => {
  return {
    pageSize: 20,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: '发运组织',
        ignore: 'always',
        lovCode: lovCodeList.organization,
      },
      {
        name: 'shipOrganizationId',
        bind: 'organizationObj.organizationId',
        type: 'stirng',
      },
      {
        name: 'soObj',
        type: 'object',
        label: '销售单号',
        lovCode: lovCodeList.so,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationObj')) {
              return { organizationId: record.get('organizationObj') };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'soHeaderId',
        type: 'string',
        bind: 'soObj.soHeaderId',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: '客户',
        ignore: 'always',
        lovCode: lovCodeList.customer,
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('organizationObj')) {
              return { organizationId: record.get('organizationObj') };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'soLineStatusList',
        type: 'string',
        label: '订单行状态',
        lookupCode: lovCodeList.lineStatus,
        multiple: ',',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: '物料',
        lovCode: lovCodeList.item,
        ignore: 'always',
        multiple: ',',
      },
      {
        name: 'itemIdString',
        type: 'string',
        bind: 'itemObj.itemId',
        transformRequest: (value) => (value ? value.join(',') : null),
      },
      { name: 'customerItemDesc', type: 'string', label: '客户物料' },
      { name: 'customerPo', type: 'string', label: '客户PO' },
      { name: 'salesmanName', type: 'string', label: '销售员' },
      { name: 'demandDateFrom', type: 'date', label: '需求日期>=' },
      { name: 'demandDateTo', type: 'date', label: '需求日期<=' },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: '订单类型',
        lovCode: lovCodeList.documentType,
        ignore: 'always',
      },
      {
        name: 'soTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
      },
      { name: 'uncompletedFlag', type: 'boolean', label: '未来计划完成', defaultValue: true },
      {
        name: 'customerReceiveType',
        type: 'string',
        label: '是否免检',
        lookupCode: lovCodeList.soLineFlag,
      },
      { name: 'customerInventoryWm', type: 'string', label: '客户入库仓库' },
    ],
    fields: [
      { name: 'shipOrganizationName', type: 'sring', label: '发运组织' },
      { name: 'soNum', type: 'string', label: '销售订单' },
      { name: 'itemDisplay', type: 'string', label: '物料' },
      { name: 'uomName', type: 'string', label: '单位' },
      { name: 'demandQty', type: 'string', label: '需求数量' },
      {
        name: 'planQty',
        type: 'number',
        label: '本次发货数量',
        min: 0,
        step: '0.0001',
        required: true,
        dynamicProps: {
          max: ({ record }) => {
            const demandQty = record.get('demandQty');
            const plannedQty = record.get('plannedQty');
            const receivedQty = record.get('receivedQty');
            return 0 + demandQty - plannedQty + receivedQty;
          },
        },
      },
      { name: 'expectedArrivalDate', type: 'date', label: '预计到达日期', required: true },
      { name: 'plannedQty', type: 'string', label: '已发货数量' },
      { name: 'receivedQty', type: 'number', label: '已退货数量' },
      { name: 'onHandQty', type: 'string', label: '现有量' },
      { name: 'customerReceiveType', type: 'string', label: '是否免检' },
      { name: 'customerInventoryWm', type: 'string', label: '客户入库仓库' },
      { name: 'customerName', type: 'string', label: '客户' },
      { name: 'demandDate', type: 'string', label: '需求日期' },
      { name: 'promiseDate', type: 'string', label: '承诺日期' },
      {
        name: 'issueWarehouse',
        type: 'object',
        label: '发出仓库',
        lovCode: lovCodeList.wareHouse,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('shipOrganizationId')) {
              return { organizationId: record.get('shipOrganizationId') };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      { name: 'shipWarehouseId', type: 'string', bind: 'issueWarehouse.warehouseId' },
      { name: 'shipWarehouseCode', type: 'string', bind: 'issueWarehouse.warehouseCode' },
      { name: 'customerItemDisplay', type: 'string', label: '客户物料' },
      { name: 'customerPoDisplay', type: 'string', label: '客户PO' },
      { name: 'sopOuName', type: 'string', label: '销售中心' },
      { name: 'salesmanName', type: 'string', label: '销售员' },
      { name: 'itemCategoryName', type: 'string', label: '物料销售类别' },
      { name: 'secondUomName', type: 'string', label: '辅助单位数量' },
      { name: 'packingRuleName', type: 'string', label: '装箱规则' },
      { name: 'packingFormatMeaning', type: 'string', label: '包装方式' },
      { name: 'packingMaterial', type: 'string', label: '包装材料' },
      { name: 'minPackingQty', type: 'string', label: '最小包装数' },
      { name: 'packingQty', type: 'string', label: '单位包装数' },
      { name: 'containerQty', type: 'string', label: '箱数' },
      { name: 'palletContainerQty', type: 'string', label: '托盘数' },
      { name: 'packageNum', type: 'string', label: '包装编号' },
      { name: 'tagTemplate', type: 'string', label: '标签模板' },
      { name: 'lotNumber', type: 'string', label: '指定批次' },
      { name: 'tagCode', type: 'string', label: '指定标签' },
      { name: 'soTypeName', type: 'string', label: '订单类型' },
      { name: 'soStatusMeaning', type: 'string', label: '订单状态' },
      { name: 'soLineType', type: 'string', label: '行类型' },
      { name: 'soLineStatusMeaning', type: 'string', label: '行状态' },
      { name: 'remark', type: 'string', label: '订单备注' },
      { name: 'lineRemark', type: 'string', label: '订单行备注' },
    ],
    transport: {
      read: () => {
        return {
          url: `${myModule.lwmss}/v1/${getCurrentOrganizationId()}/grwl-so-create-ship-orders`,
          method: 'GET',
        };
      },
      submit: () => {
        return {
          url: `${
            myModule.lwmss
          }/v1/${getCurrentOrganizationId()}/grwl-so-create-ship-orders/batch-submit`,
          method: 'POST',
        };
      },
    },
  };
};
