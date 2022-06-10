import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

/**
 * 通过领料单号查询领料执行列表数据
 * @param {*} queryParams 参数
 */
export async function requestByNum(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/issue-by-num`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询领料行列表数据
 * @param {*} queryParams 参数
 */
export async function requestLine(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-lines/receive`, {
    method: 'GET',
    query: queryParams,
  });
}
