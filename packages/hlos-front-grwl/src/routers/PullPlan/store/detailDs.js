/*
 * @module: 详情页
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-28 11:01:47
 * @LastEditTime: 2021-06-18 10:30:12
 * @copyright: Copyright (c) 2020,Hand
 */
import lovCodeList, { myModule } from '@/common/index';

import { getCurrentOrganizationId } from 'utils/utils';

export default (orgId) => {
  return {
    pageSize: 1000,
    queryFields: [
      {
        name: 'planIdList',
        type: 'object',
        label: '查询',
      },
    ],
    fields: [
      {
        name: 'planBatchNum',
        label: '批次号',
        type: 'string',
      },
      {
        name: 'planNum',
        type: 'string',
        label: '拉动计划号',
      },
      {
        name: 'itemCode',
        type: 'string',
        label: '物料编码',
      },
      {
        name: 'featureDesc',
        label: '特性值描述',
        type: 'string',
      },
      {
        name: 'itemDescription',
        label: '物料描述',
        type: 'string',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: '需求数量',
      },
      {
        name: 'pullQty',
        type: 'number',
        label: '申请数量',
      },
      {
        name: 'soLineDemandQty',
        type: 'number',
        label: '订单行需求数量',
      },
      {
        name: 'soLineGeneratedQty',
        type: 'number',
        label: '订单行已生成数量',
      },
      {
        name: 'soLineReturnedQty',
        type: 'number',
        label: '订单行退货数量',
      },
      {
        name: 'customerPoNum',
        type: 'string',
        label: '采购订单号',
      },
      {
        name: 'customerPoLineNum',
        type: 'string',
        label: '采购订单行号',
      },
      {
        name: 'satisfyQty',
        type: 'number',
        label: '满足数量',
      },
      {
        name: 'expectArrivalDate',
        type: 'date',
        label: '预计到达时间',
      },
      {
        name: 'fromWarehouseObj',
        type: 'object',
        label: '发出仓库',
        lovCode: lovCodeList.wareHouse,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: () => {
            if (orgId.getOrigin) {
              return { organizationId: orgId.getOrigin };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      { name: 'fromWarehouseId', type: 'string', bind: 'fromWarehouseObj.warehouseId' },
      { name: 'fromWarehouseCode', type: 'string', bind: 'fromWarehouseObj.warehouseCode' },
      { name: 'fromWarehouseName', type: 'string', bind: 'fromWarehouseObj.warehouseName' },
      { name: 'rejectReason', type: 'string', label: '拒绝理由' },
    ],
    transport: {
      read: ({ data }) => {
        return {
          data: data.planIdList,
          url: `${myModule.lwmss}/v1/${getCurrentOrganizationId()}/grwl-pull-ship-plans/check`,
          method: 'POST',
        };
      },
    },
  };
};
