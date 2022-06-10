import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存或提交对账单
export async function saveVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/saveVerificationOrder`, {
    method: 'POST',
    body: params,
  });
}

// 批量提交对账单
export async function batchReleaseVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/batchReleaseVerificationOrder`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 批量删除对账单
export async function deleteVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 核企侧订单明细规则配置明细
export async function getSettingDetail(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/order-config-details/getDetail`, {
    method: 'GET',
    query: params,
  });
}
