/*
 * @module: 发货单平台
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-20 10:26:02
 * @LastEditTime: 2021-06-10 16:25:44
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LMDS, HLOS_LRPT, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

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
  return request(`${myModule.lwmss}/v1/${organizationId}/grwl-ship-orders/execute`, {
    method: 'POST',
    body: lists,
  });
}

// 取消执行发货单
export async function cancelexecuteShipOrderApi(payload) {
  return request(`${myModule.lwmss}/v1/${organizationId}/grwl-ship-orders/execute-cancel`, {
    method: 'POST',
    body: payload,
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

export async function getItemPrintList(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/grwl-ship-orders/item-qr-code-print`, {
    method: 'GET',
    query: params,
  });
}
// 打印二开
export async function getPrintList(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/grwl-ship-orders/print`, {
    method: 'GET',
    query: params,
  });
}

// 打印状态回传
export async function updatePrintFlag(params) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/grwl-ship-orders/update-print-flag`, {
    method: 'PUT',
    body: params,
  });
}
