import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 创建发货单
export async function createOutDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/create-out-delivery-order`, {
    method: 'POST',
    body: params,
  });
}

// 取消发货单
export async function cancelDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/cancel-delivery-order`, {
    method: 'POST',
    body: params,
  });
}

// 删除发货单
export async function deleteDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 提交发货单
export async function submitDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/submit-delivery-order`, {
    method: 'POST',
    body: params,
  });
}

// 修改发货单
export async function updateDeliveryOrders(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'PUT',
    body: params,
  });
}

// 创建发货单
export async function createDeliveryOrders(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'POST',
    body: params,
  });
}
