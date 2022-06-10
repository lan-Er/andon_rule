/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-15 15:37:46
 * @LastEditTime: 2021-01-29 10:31:15
 * @Description:
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function userSetting(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/user-settings`, {
    method: 'GET',
    query: params,
  });
}

/**
 *数量调整
 *GET /v1/{organizationId}/tags/quantity-picking-pc
 * @export
 * @param {*} params
 * @returns
 */
export async function getQuantityPicking(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/quantity-picking-pc`, {
    method: 'GET',
    query: params,
  });
}

/**
 *杂项接收 标签调整
 *GET /v1/{organizationId}/tags/sundry-accept
 * @export
 * @param {*} params
 * @returns
 */
export async function getSundryAccept(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/sundry-accept`, {
    method: 'GET',
    query: params,
  });
}
/**
 *杂项发出 标签调整
 *GET /v1/{organizationId}/tags/sundry-send-out
 * @export
 * @param {*} params
 * @returns
 */
export async function getsundrySendOut(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/sundry-send-out`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 杂项接收
 *post /v1/{tenantId}/warehouse-business/cost-center-in
 * @export
 * @param {*} params
 * @returns
 */

export async function costCenterIn(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/warehouse-business/cost-center-in`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 杂项发出
 *post /v1/{tenantId}/warehouse-business/cost-center-in
 * @export
 * @param {*} params
 * @returns
 */

export async function costCenterOut(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/warehouse-business/cost-center-out`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 判断物料控制类型
 */
export async function checkControlType(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}
