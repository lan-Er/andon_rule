import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

// 查询客户信息
export async function clientInfoSearch(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/customer/queryCustomerInfo`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改客户信息
export async function clientInfoOperate(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/customer/insertOrUpdate`, {
    method: 'POST',
    body: params,
  });
}
