/**
 * @Description: 发货单平台 service
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 创建发货单
export async function createShipOrder(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/create-ship-order`, {
    method: 'POST',
    body: payload,
  });
}

// 提交发货单
export async function submitShipOrderApi(payload) {
  const { lists } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/release-ship-order`, {
    method: 'POST',
    body: lists,
  });
}

// 删除发货单
export async function deleteShipOrderApi(payload) {
  const { lists } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/del-ship-order`, {
    method: 'POST',
    body: lists,
  });
}

// 执行发货单
export async function executeShipOrderApi(payload) {
  const { lists } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/execute-by-ship-order`, {
    method: 'POST',
    body: lists,
  });
}

// 改变头状态
export async function changeHeadStatusApi(payload) {
  const { type, lists } = payload;
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/${type}-ship-order`, {
    method: 'POST',
    body: lists,
  });
}

// 删除发货单行
export async function deleteShipOrderLineApi(payload) {
  const { shipOrderId, lists } = payload;
  return request(
    `${HLOS_LWMS}/v1/${organizationId}/ship-order-lines/del-ship-order-line?shipOrderId=${shipOrderId}`,
    {
      method: 'POST',
      body: lists,
    }
  );
}

// 改变行状态
export async function changeLineStatusApi(payload) {
  const { type, shipOrderId, lists } = payload;
  return request(
    `${HLOS_LWMS}/v1/${organizationId}/ship-order-lines/${type}-ship-order-line?shipOrderId=${shipOrderId}`,
    {
      method: 'POST',
      body: lists,
    }
  );
}

/**
 * 物料规则API mds服务 /v1/{tenantId}/item-wms/get-item-wm-Rule;
 */
export async function getItemWmRule(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms/get-item-wm-rule`, {
    method: 'POST',
    body: params,
  });
}
