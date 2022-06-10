/*
 * @Description: 领料任务-api
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-10-30 14:05:22
 * @LastEditors: 那宇
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 领料看板数量
export async function queryBoardAmount(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/board/amount`, {
    method: 'GET',
    query: params,
  });
}

// 领料看板已发概况
export async function queryBoardExecuted(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/board/executed-overview`, {
    method: 'GET',
    query: params,
  });
}

// 领料看板非生产领料单概况
export async function queryBoardNoProduct(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/board/no-product-overview`, {
    method: 'GET',
    query: params,
  });
}

// 领料看板待发概况
export async function queryBoardPicked(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/board/picked-overview`, {
    method: 'GET',
    query: params,
  });
}

// 领料看板待检概况
export async function queryBoardReleased(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/board/released-overview`, {
    method: 'GET',
    query: params,
  });
}
