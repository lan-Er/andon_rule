import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/report`;

// 总览查询
export async function queryOverview(params) {
  return request(`${url}/production-overview`, {
    method: 'GET',
    query: params,
  });
}

// 产线查询
export async function queryProdLine(params) {
  return request(`${url}/production-prod-line`, {
    method: 'GET',
    query: params,
  });
}

// 物料查询
export async function queryItem(params) {
  return request(`${url}/production-item`, {
    method: 'GET',
    query: params,
  });
}
