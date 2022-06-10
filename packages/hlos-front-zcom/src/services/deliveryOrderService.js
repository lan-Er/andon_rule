import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 修改发货单
export async function updateDeliveryOrders(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'PUT',
    body: params,
  });
}

// 删除发货单
export async function deleteDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 取消发货单
export async function cancelDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/cancel-delivery-order`, {
    method: 'POST',
    body: params,
  });
}

// 提交发货单
export async function submitDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/submit-delivery-order`, {
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
