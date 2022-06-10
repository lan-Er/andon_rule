import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存
export async function saveDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys`, {
    method: 'POST',
    body: params,
  });
}

// 更新
export async function updateDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys`, {
    method: 'PUT',
    body: params,
  });
}

// 保存并提交
export async function releaseDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys/submit-delivery-apply`, {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function verifyDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys/verify-delivery-apply`, {
    method: 'POST',
    body: params,
  });
}

// 基于发货申请单创建发货单
export async function createByDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/create-by-delivery-apply`, {
    method: 'POST',
    body: params,
  });
}

// 取消
export async function cancelDeliveryApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-applys/cancel-delivery-apply`, {
    method: 'POST',
    body: params,
  });
}

// 拆行
export async function copyLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-apply-lines/copy-line`, {
    method: 'POST',
    body: params,
  });
}

// 删除发货申请单行
export async function deleteLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-apply-lines`, {
    method: 'DELETE',
    body: params,
  });
}

// 生成缸号
export async function createDyelotNumber(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/senyu/delivery-order-line/create-dyelot-number`,
    {
      method: 'POST',
      body: params,
    }
  );
}

export async function getPrintrules(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/print-rules`, {
    method: 'GET',
    query: params,
  });
}
