import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LCSV } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 查询头数据
 */
export async function queryHeadApi(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/jcdq-out-in/pc-obtain-header`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询行数据
 */
export async function queryLineApi(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/jcdq-out-in/pc-obtain-line`, {
    method: 'GET',
    query: params,
  });
}
