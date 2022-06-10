/*
 * @Description: 供应商交期回复 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-26 17:49:28
 * @LastEditors: 赵敏捷
 */

import moment from 'moment';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

import { queryList } from '@/services/api';

const url = `${HLOS_LISP}/v1/datas/solution-pack`;
const functionType = 'SUPPLIER_CHAIN_OVERALL';

function computeRecommendedDelivery(record) {
  const PLAN_REPORT_DATE = record.attribute45;
  const DEMAND_DATE = record.attribute11;
  let res;
  if (PLAN_REPORT_DATE) {
    res = moment(PLAN_REPORT_DATE).add(2, 'days');
  } else {
    res = moment().add(2, 'days');
  }
  if (res.isAfter(moment(DEMAND_DATE))) {
    return moment(DEMAND_DATE);
  } else {
    return res;
  }
}

function dsConfig() {
  return {
    pageSize: 10,
    autoQuery: true,
    fields: [
      {
        name: 'serialNumber',
        type: 'string',
        label: '序号',
      },
      {
        name: 'attribute28',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute25&33',
        type: 'string',
        label: '产品',
      },
      {
        name: 'attribute2',
        type: 'string',
        label: '客户',
      },
      {
        name: 'attribute5&6',
        type: 'string',
        label: '数量',
      },
      {
        name: 'attribute8&7',
        type: 'string',
        label: '金额',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: '需求日期',
      },
      {
        name: 'attribute12',
        type: 'date',
        label: '承诺日期',
      },
      {
        name: 'recommendedDelivery',
        type: 'date',
        label: '建议交期',
      },
      {
        name: 'attribute45',
        type: 'date',
        label: '计划完工日期',
      },
      {
        name: 'availableCount',
        type: 'string',
        label: '可用量',
      },
      {
        name: 'transportationTime',
        type: 'string',
        label: '运输时长',
      },
      {
        name: 'attribute24',
        type: 'string',
        label: '销售员',
      },
    ],
    transport: {
      read: ({ data, params }) => ({
        url,
        data,
        method: 'GET',
        params: {
          ...params,
          functionType,
          dataType: 'ORDER',
          attribute3: '',
          attribute9: '已确认',
          sortFlag: false,
          field: 'attribute12',
        },
        transformResponse: async (_data_) => {
          try {
            const jsonData = JSON.parse(_data_);
            if (jsonData && !jsonData.faied) {
              const res = await queryList({
                page: -1,
                functionType: 'SUPPLIER_CHAIN_OVERALL',
                dataType: 'ONHAND_INVENTORY',
                attribute1: '',
              });
              let onHandInventory = null;
              if (res.content?.length) {
                onHandInventory = res.content.map((i) => ({
                  item: i.attribute3,
                  inventoryQty: i.attribute4,
                  uom: i.attribute5,
                }));
              }
              return {
                ...jsonData,
                content: jsonData.content.map((item) => {
                  let availableCount = '';
                  const recommendDelivery = computeRecommendedDelivery(item);
                  const inventoryInfo = onHandInventory.find((i) => i.item === item.attribute4);
                  if (inventoryInfo) {
                    availableCount = inventoryInfo.inventoryQty + inventoryInfo.uom;
                  }
                  return {
                    ...item,
                    attribute12: recommendDelivery,
                    recommendedDelivery: recommendDelivery,
                    transportationTime: '2天',
                    availableCount,
                  };
                }),
              };
            }
          } catch (e) {
            // do nothing, use default error deal
          }
          return _data_;
        },
      }),
    },
  };
}

function filterDSConfig() {
  return {
    fields: [
      {
        name: 'attribute28',
        type: 'string',
        label: '销售订单号',
      },
      {
        name: 'attribute2Obj',
        type: 'object',
        label: '客户',
        lovCode: 'LMDS.DEMO_CUSTOMER',
        ignore: 'always',
      },
      {
        name: 'attribute2',
        type: 'string',
        bind: 'attribute2Obj.attribute1',
      },
      {
        name: 'attribute25Obj',
        type: 'object',
        label: '产品',
        lovCode: 'LMDS.DEMO_PRODUCT',
        ignore: 'always',
      },
      {
        name: 'attribute25',
        type: 'string',
        bind: 'attribute25Obj.attribute3',
      },
    ],
  };
}

export { dsConfig, filterDSConfig };
