/**
 * @Description: 公司接口
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-08 16:34:38
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 查询
export async function groupSearch(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/groups`, {
    method: 'GET',
    query: params,
  });
}


// 新建
export async function companyCreate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/companys`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function companyUpdate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/companys`, {
    method: 'PUT',
    body: params,
  });
}
