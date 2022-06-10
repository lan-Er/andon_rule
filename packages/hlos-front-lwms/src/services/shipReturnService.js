/**
 * @Description: 销售退货单 service
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LSOP } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LWMS}/v1/${organizationId}/ship-returns`;
const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/ship-return-lines`;

// 关闭销售退货单
export async function closeShipReturn(params) {
  return request(`${url}/close`, {
    method: 'POST',
    body: params,
  });
}

// 取消销售退货单
export async function cancelShipReturn(params) {
  return request(`${url}/cancel`, {
    method: 'POST',
    body: params,
  });
}

// 提交销售退货单
export async function releaseShipReturn(params) {
  return request(`${url}/release`, {
    method: 'POST',
    body: params,
  });
}

// 提交销售退货单
export async function submitShipReturn(params) {
  return request(`${url}/mutation`, {
    method: 'POST',
    body: params,
  });
}

// 查询销售订单
export async function querySalesOrder(params) {
  return request(`${HLOS_LSOP}/v1/${organizationId}/so-lines/ship-return`, {
    method: 'GET',
    query: params,
  });
}

// 关闭销售退货单行
export async function closeShipReturnLine(params) {
  return request(`${lineUrl}/close`, {
    method: 'POST',
    body: params,
  });
}

// 取消销售退货单行
export async function cancelShipReturnLine(params) {
  return request(`${lineUrl}/cancel`, {
    method: 'POST',
    body: params,
  });
}

// 销售退货接收
export async function shipReturnReceiveApi(params) {
  return request(`${url}/customer-receive`, {
    method: 'POST',
    body: params,
  });
}

// 销售退货单执行
export async function shipReturnExecuteApi(params) {
  return request(`${url}/receive`, {
    method: 'POST',
    body: params,
  });
}

// 获取批次
export async function getLot(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/lots`, {
    method: 'GET',
    query: params,
  });
}

// 获取标签
export async function getTag(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/by-item-tag`, {
    method: 'GET',
    query: params,
  });
}
