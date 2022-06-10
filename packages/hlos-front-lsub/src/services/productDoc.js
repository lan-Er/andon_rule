import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';

// 查询
export async function productSearch(params) {
  return request(`${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/queryProductDoc`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function productOperate(params) {
  return request(`${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/insertOrUpdateProductDoc`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function productDelete(params) {
  return request(`${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/deleteProductDoc`, {
    method: 'POST',
    body: params,
  });
}
