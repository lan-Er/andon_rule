/*
 * @Description: 送货单平台 - service
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-16 16:46:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-25 18:29:36
 * @Copyright: Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 新增/更新单据
export async function createAndUpdateApi(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets`, {
    method: 'POST',
    body: payload,
  });
}

// 改变行状态
export async function changeLineStatueApi(payload) {
  const { type, ticketLineIds } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-ticket-lines/${type}`, {
    method: 'PUT',
    body: ticketLineIds,
  });
}

// 改变头状态
export async function changeHeadStatueApi(payload) {
  const { type, ticketIds, receiveParamsList } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/${type}`, {
    method: type === 'receive-by-ticket' ? 'POST' : 'PUT',
    body: type === 'receive-by-ticket' ? receiveParamsList : ticketIds,
  });
}

// 删除
export async function deliveryTickets(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets`, {
    method: 'DELETE',
    body: params,
  });
}
