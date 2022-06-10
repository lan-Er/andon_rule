import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function executeLines(queryParams) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/query`, {
    method: 'GET',
    query: queryParams,
  });
}
