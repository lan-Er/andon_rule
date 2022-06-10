import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 创建对账单
export async function createVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/batch-create-verification-order`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 修改对账单
export async function updateVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`, {
    method: 'PUT',
    body: params,
  });
}

// 删除对账单
export async function deleteVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 取消对账单
export async function cancelVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/cancel-verification-order`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 提交对账单
export async function submitVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/submit-verification-order`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 重置调整金额
export async function resetAmount(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/reset-amount`, {
    method: 'POST',
    body: params,
  });
}
