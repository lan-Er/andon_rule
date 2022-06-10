import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 提交扣款单
export async function submitWithholdingOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/withholding-orders/submit-withholding-order`, {
    method: 'POST',
    body: params,
  });
}

// 删除扣款单
export async function deleteWithholdingOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/withholding-orders/delete-withholding-order`, {
    method: 'DELETE',
    body: params,
  });
}

// 取消扣款单
export async function cancelWithholdingOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/withholding-orders/cancel-withholding-order`, {
    method: 'POST',
    body: params,
  });
}

// 审核扣款单
export async function verifyWithholdingOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/withholding-orders/verify-withholding-order`, {
    method: 'POST',
    body: params,
  });
}
