/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-06-09 14:33:36
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-06-12 12:52:15
 */
/**
 * @Description: 发货单平台 service
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LSOP, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 创建发货单
export async function createShipOrder(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/ship-order-headers/create-ship-order`, {
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

// 关联
export async function relationShipOrderAPI(payload) {
  const { lists } = payload;
  return request(
    `${HLOS_LWMSS}/v1/${organizationId}/ship-order-headers/create-ship-order-relation`,
    {
      method: 'POST',
      body: lists,
    }
  );
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
    // `${HLOS_LWMS}/v1/${organizationId}/ship-order-lines/del-ship-order-line?shipOrderId=${shipOrderId}`,
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
 * 获取母订单号
 */
export async function getMasterOrderNo(params) {
  return request(`${HLOS_LSOP}/v1/${getCurrentOrganizationId()}/so-lines`, {
    method: 'GET',
    query: params,
  });
}
