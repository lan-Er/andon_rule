/*
 * @module: 创建销售发货单
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-22 10:51:26
 * @LastEditTime: 2021-04-22 10:53:21
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 创建发货单
export async function createShipOrder(payload) {
  return request(`${myModule.lwmss}/v1/${organizationId}/grwl-so-create-ship-orders/batch-submit`, {
    method: 'POST',
    body: payload,
  });
}
