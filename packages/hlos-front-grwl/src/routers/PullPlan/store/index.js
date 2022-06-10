/*
 * @module: 主页表格Ds
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 14:54:45
 * @LastEditTime: 2021-06-17 15:13:41
 * @copyright: Copyright (c) 2020,Hand
 */
import lovCodeList, { myModule } from '@/common/index';

import { getCurrentOrganizationId } from 'utils/utils';

export default (store) => {
  return {
    pageSize: 10,
    queryFields: [
      {
        name: 'planNum',
        type: 'string',
        label: '拉动计划号',
      },
      {
        name: 'planStatusList',
        lookupCode: lovCodeList.pullDeliveryStatus,
        label: '拉动计划状态',
        type: 'string',
        multiple: ',',
      },
      {
        name: 'itemObj',
        lovCode: lovCodeList.item,
        label: '物料',
        type: 'object',
        ignore: 'always',
        dynamicProps: {
          lovPara: () => {
            if (store.organizationObj) {
              const { organizationId } = store.organizationObj;
              return { organizationId };
            } else {
              return { organizationId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemName',
        type: 'string',
        bind: 'itemObj.itemName',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'issueName',
        label: '客户下达人',
        type: 'string',
      },
      {
        name: 'issueDateStart',
        label: '客户下达日期从',
        type: 'date',
        max: 'issueDateEnd',
      },
      {
        name: 'issueDateEnd',
        label: '客户下达日期至',
        type: 'date',
        min: 'issueDateStart',
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
        name: 'featureCode',
        label: '特性值',
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
        name: 'generatedQty',
        type: 'number',
        label: '已生成数量',
      },
      {
        name: 'pullQty',
        type: 'number',
        label: '申请数',
      },
      {
        name: 'onhandQty',
        type: 'number',
        label: '现有量',
      },
      {
        name: 'demandDate',
        type: 'date',
        label: '拉动送货日期',
      },
      {
        name: 'planStatusMeaning',
        type: 'string',
        label: '拉动单状态',
      },
      {
        name: 'issueName',
        type: 'string',
        label: '客户下达人',
      },
      {
        name: 'issueDate',
        type: 'date',
        label: '客户下达日期',
      },
      {
        name: 'rejectName',
        type: 'string',
        label: '拒绝人',
      },
      {
        name: 'rejectDate',
        type: 'string',
        label: '拒绝时间',
      },
      {
        name: 'rejectReason',
        type: 'string',
        label: '拒绝理由',
      },
      {
        name: 'remark',
        type: 'string',
        label: '备注',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${myModule.lwmss}/v1/${getCurrentOrganizationId()}/grwl-pull-ship-plans`,
          method: 'GET',
        };
      },
    },
  };
};
