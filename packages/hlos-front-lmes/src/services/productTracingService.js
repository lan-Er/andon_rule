import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 查询头
 * @param {*} queryParams 参数
 */
export async function productTraceHeaders(queryParams) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/product-trace-headers`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询行
 * @param {*} queryParams 参数
 */
export async function productTraceDetails(queryParams) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/product-trace-details`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询历史
 * @param {*} queryParams 参数
 */
export async function productTraceHistory(queryParams) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/product-trace-headers/header-all`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 追溯
 * @param {*} queryParams 参数
 */
export async function createProductTraceHeaders(queryParams) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/product-trace-headers`, {
    method: 'POST',
    body: queryParams,
  });
}
