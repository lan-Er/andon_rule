import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function executeLines(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/execute-lines`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 打印
 * @param {*} queryParams
 * @returns
 */
export async function executePrint(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-execute-line/execute-print`, {
    method: 'GET',
    query: queryParams,
  });
}
