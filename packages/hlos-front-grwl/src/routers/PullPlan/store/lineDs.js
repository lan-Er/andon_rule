/*
 * @module: 行数据
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 17:14:57
 * @LastEditTime: 2021-04-28 09:42:54
 * @copyright: Copyright (c) 2020,Hand
 */
import { myModule } from '@/common/index';

import { getCurrentOrganizationId } from 'utils/utils';

export default () => {
  return {
    pageSize: 10,
    selection: false,
    queryFields: [
      {
        name: 'pullShipPlanId',
        type: 'string',
        label: '查询id',
      },
    ],
    fields: [
      {
        name: 'poNum',
        label: '采购订单号',
        type: 'string',
      },
      {
        name: 'poLineNum',
        type: 'string',
        label: '采购订单行号',
      },
      {
        name: 'shipOrderNum',
        label: '发货单号',
        type: 'string',
      },
      {
        name: 'shipOrderLineNum',
        type: 'string',
        label: '发货单行号',
      },
      {
        name: 'customerDeliveryNum',
        type: 'string',
        label: '送货单号',
      },
      {
        name: 'customerDeliveryLineNum',
        type: 'string',
        label: '送货单行号',
      },
      {
        name: 'shipOrderLineStatus',
        type: 'string',
        label: '发货单行状态',
      },
      {
        name: 'applyQty',
        type: 'string',
        label: '申请数量',
      },
      {
        name: 'demandDate',
        type: 'date',
        label: '需求日期',
      },
      {
        name: 'issueWorker',
        type: 'date',
        label: '生成人',
      },
      {
        name: 'issueDate',
        type: 'date',
        label: '生成时间',
      },
      {
        name: 'executedWorker',
        type: 'date',
        label: '执行人',
      },
      {
        name: 'executedDate',
        type: 'date',
        label: '执行日期',
      },
      {
        name: 'executedQty',
        type: 'number',
        label: '执行数量',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${myModule.lwmss}/v1/${getCurrentOrganizationId()}/grwl-pull-ship-orders`,
          method: 'GET',
        };
      },
    },
  };
};
