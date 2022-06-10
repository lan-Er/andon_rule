import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 删除采购订单
export async function poDelete(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/pos`, {
    method: 'DELETE',
    body: params,
  });
}

// 提交采购订单
export async function poSubmit(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/pos/submit-po`, {
    method: 'POST',
    body: params,
  });
}

// 取消采购订单
export async function poCancel(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/pos/cancel-po`, {
    method: 'POST',
    body: params,
  });
}

// 取消采购订单行
export async function poLineCancel(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-lines/cancel-po-line`, {
    method: 'POST',
    body: params,
  });
}

export async function getPrintrules(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/print-rules`, {
    method: 'GET',
    query: params,
  });
}
