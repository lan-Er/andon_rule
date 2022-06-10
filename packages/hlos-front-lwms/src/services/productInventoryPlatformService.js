/**
 * @Description: 生产入库单平台 api
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-06 14:08:08
 * @LastEditors: leying.yan
 */

import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getCurrentTenant } from 'utils/utils';
// eslint-disable-next-line prefer-destructuring
const tenantId = getCurrentTenant().tenantId;
/**
 * 提交
 * @param {*} queryParams 参数
 */
export async function releaseApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/release`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 取消
 * @param {*} queryParams 参数
 */
export async function cancelApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/cancel`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 关闭
 * @param {*} queryParams 参数
 */
export async function closeApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/close`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 删除
 * @param {*} queryParams 参数
 */
export async function deleteApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/delete`, {
    method: 'DELETE',
    body: queryParams,
  });
}

/**
 * 确认接收
 * @param {*} params 参数
 */
export async function confirmReceive(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/confirm-production-vm`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 驳回原因
 * @param {*} params 参数
 */
export async function rejectReasonsApi(params) {
  return request(`${HLOS_LWMS}/v1/${tenantId}/request-headers/reject-production`, {
    method: 'POST',
    body: params,
  });
}
