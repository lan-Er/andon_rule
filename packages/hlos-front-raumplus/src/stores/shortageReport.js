/*
 * @module: 缺料报表
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-05 14:10:36
 * @LastEditTime: 2021-02-07 14:47:23
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const { common } = codeConfig.code;
const intlPrefix = 'ldab.equipment';
const organizationId = getCurrentOrganizationId();

export default function shortageDs(lacks) {
  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    queryFields: [
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'itemObj.description',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: '需求日期>=',
        required: true,
        max: 'demandDateEnd',
        transformRequest: (value) => (value ? moment(value).format('YYYY-MM-DD') : null),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: '需求日期<=',
        required: true,
        min: 'demandDateStart',
        transformRequest: (value) => (value ? moment(value).format('YYYY-MM-DD') : null),
      },
      {
        name: 'wareHouseObj',
        type: 'object',
        ignore: 'always',
        lovCode: common.wareHouse,
        label: intl.get(`${intlPrefix}.wareHouseObj`).d('仓库'),
        multiple: true,
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'wareHouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'warehouseIds',
        type: 'string',
        bind: 'wareHouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'wareHouseObj.warehouseCode',
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        required: true,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'itemObj.description',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'description',
        type: 'string',
        label: '描述',
      },
      {
        name: 'onhandQuantity',
        type: 'string',
        label: '现有量',
      },
      {
        name: 'demandQty',
        type: 'string',
        label: '需求数量',
      },
      {
        name: 'lackQty',
        type: 'string',
        label: '缺料数量',
      },
      {
        name: 'demandDate',
        type: 'date',
        label: '需求日期',
      },
      {
        name: 'dataDate',
        type: 'date',
        label: '数据日期',
      },
      {
        name: 'attribute',
        type: 'string',
        label: '是否自动料仓标识',
      },
    ],
    transport: {
      read: ({ data }) => {
        const url = `${HLOS_LRPT}/v1/${organizationId}/requests/${lacks}`;
        return {
          data,
          url,
          method: 'POST',
        };
      },
    },
  };
}
