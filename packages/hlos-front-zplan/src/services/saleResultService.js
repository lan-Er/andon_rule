import request from 'utils/request';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存/提交销售结果模板
export async function saleResults(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-results`, {
    method: 'PUT',
    body: params,
  });
}

// 创建销售结果模板
export async function createSaleResults(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-results`, {
    method: 'POST',
    body: params,
  });
}

// 取消销售预测结果
export async function cancelResults(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-results/cancel-template`, {
    method: 'POST',
    body: params,
  });
}
