/*
 * @module-:发货任务看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-06 13:46:59
 * @LastEditTime: 2020-11-09 14:31:58
 * @copyright: Copyright (c) 2018,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 获取发货任务看板数据-头部数量
export async function queryTaskBoard(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/ship-order-headers/ship-order-count-report`, {
    method: 'GET',
    query: params,
  });
}
// 获取中间左侧数据
export async function queryPending(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/ship-order-headers/ship-order-release-report`, {
    method: 'GET',
    query: params,
  });
}

// 获取底部左侧数据
export async function queryReadyToGo(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/ship-order-headers/ship-order-picked-report`, {
    method: 'GET',
    query: params,
  });
}

// 获取底部右侧数据
export async function querySent(params) {
  return request(
    `${HLOS_LRPT}/v1/${organizationId}/ship-order-headers/ship-order-executed-report`,
    {
      method: 'GET',
      query: params,
    }
  );
}

// 获取中间饼图右侧数据
export async function queryPieList(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/ship-order-headers/ship-order-rate-report`, {
    method: 'GET',
    query: params,
  });
}
