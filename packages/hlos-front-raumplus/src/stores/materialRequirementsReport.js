/*
 * @module: 物料需求报表
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-09 21:02:22
 * @LastEditTime: 2021-02-23 10:25:02
 * @copyright: Copyright (c) 2020,Hand
 */
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const { common } = codeConfig.code;
const intlPrefix = 'ldab.equipment';
const organizationId = getCurrentOrganizationId();

export default function magerialRequirementsDs() {
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
      // {
      //   name: 'wareHouseObj',
      //   type: 'object',
      //   ignore: 'always',
      //   lovCode: common.wareHouse,
      //   label: intl.get(`${intlPrefix}.wareHouseObj`).d('仓库'),
      //   multiple: true,
      // },
      // {
      //   name: 'warehouseName',
      //   type: 'string',
      //   bind: 'wareHouseObj.warehouseName',
      //   ignore: 'always',
      // },
      // {
      //   name: 'warehouseIds',
      //   type: 'string',
      //   bind: 'wareHouseObj.warehouseId',
      // },
      // {
      //   name: 'warehouseCode',
      //   type: 'string',
      //   bind: 'wareHouseObj.warehouseCode',
      //   ignore: 'always',
      // },
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
        label: '物料描述',
      },
      {
        name: 'demandQty',
        type: 'string',
        label: '需求数量',
      },
      {
        name: 'onhandQuantity',
        type: 'string',
        label: '在库数量',
      },
      {
        name: 'lackQty',
        type: 'string',
        label: '领料未审核数量',
      },
      {
        name: 'storedQty',
        type: 'string',
        label: '扣减后在库数量',
      },
      {
        name: 'warehousingQty',
        type: 'string',
        label: '预计入库数量',
      },
    ],
    transport: {
      read: ({ data }) => {
        const url = `${HLOS_LRPT}/v1/${organizationId}/requests/item-demand`;
        return {
          data,
          url,
          method: 'POST',
        };
      },
    },
  };
}
