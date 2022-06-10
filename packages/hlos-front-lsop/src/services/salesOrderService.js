/**
 * @Description: 销售订单 api
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-25 19:18:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LSOP, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const commonUrl = `${HLOS_LSOP}/v1/${getCurrentOrganizationId()}/so-headers`;
const commonLineUrl = `${HLOS_LSOP}/v1/${getCurrentOrganizationId()}/so-lines`;

/**
 * 获取销售订单号
 */
export async function requestNum(params) {
  return request(`${commonUrl}/number`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 取消销售订单
 */
export async function cancelSo(params) {
  return request(`${commonUrl}/cancel`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 关闭销售订单
 */
export async function closeSo(params) {
  return request(`${commonUrl}/close`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 提交销售订单
 */
export async function releaseSo(params) {
  return request(`${commonUrl}/release`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 取消销售订单行
 */
export async function cancelSoLine(params) {
  return request(`${commonLineUrl}/cancel`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 关闭销售订单行
 */
export async function closeSoLine(params) {
  return request(`${commonLineUrl}/close`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 删除销售订单行
 */
export async function deleteSoLine(params) {
  return request(`${commonLineUrl}/delete`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 获取物料供应商属性
 */
export async function getItemCustomerAttributes(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/customer-items/get-item-customer-attributes`,
    {
      method: 'GET',
      query: params,
    }
  );
}

// 删除
export async function deliverySoHeafers(params) {
  return request(`${HLOS_LSOP}/v1/${getCurrentOrganizationId()}/so-headers/delete`, {
    method: 'DELETE',
    body: params,
  });
}
