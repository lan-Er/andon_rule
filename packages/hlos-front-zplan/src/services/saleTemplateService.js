import request from 'utils/request';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const HLOS_ZPLAN = '/hzmc-plan-32184';
// 保存销售预测模板
export async function saleTemplates(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates`, {
    method: 'PUT',
    body: params,
  });
}

// 提交销售预测任务
export async function submitTask(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates/submit-template`, {
    method: 'POST',
    body: params,
  });
}

// 创建销售预测模板
export async function createSaleTemplates(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates`, {
    method: 'POST',
    body: params,
  });
}

// 取消销售预测模板
export async function cancelTemplates(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates/cancel-template`, {
    method: 'POST',
    body: params,
  });
}

// 删除销售预测任务
export async function deletePredictionTask(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates`, {
    method: 'DELETE',
    body: params,
  });
}
