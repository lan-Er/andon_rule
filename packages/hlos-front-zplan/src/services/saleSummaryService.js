import request from 'utils/request';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存/提交销售预测汇总
export async function saleSummarys(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summarys/update-plan-sale-summary-list`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 创建销售预测汇总
export async function createSaleSummarys(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summarys`, {
    method: 'POST',
    body: params,
  });
}

// 创建销售预测汇总行
export async function createSaleSummaryLines(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-lines`, {
    method: 'POST',
    body: params,
  });
}

// 创建销售预测汇总结果
export async function createSaleSummaryResults(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-lines/create-result-and-day`,
    {
      method: 'POST',
      body: params,
    }
  );
}
