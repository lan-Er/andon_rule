import request from 'utils/request';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const HLOS_ZPLAN = '/zplan-32184';

// 获取日期列
export async function createDateGap(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates/create-date-gap`, {
    method: 'GET',
    query: params,
  });
}

// 创建销售预测版本
export async function createVersion(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions`, {
    method: 'POST',
    body: params,
  });
}

// 更新销售预测版本
export async function updateVersion(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions`, {
    method: 'PUT',
    body: params,
  });
}

// 删除销售预测版本
export async function deleteVersion(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions`, {
    method: 'DELETE',
    body: params,
  });
}

// 操作销售预测版本（取消、提交、退回和确认）
export async function operateVersion(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions/update-plan-sale-version-list`,
    {
      method: 'PUT',
      body: params,
    }
  );
}

// 清空销售预测版本行
export async function clearVersionLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-version-details/empty`, {
    method: 'DELETE',
    query: params,
  });
}

// 复制销售预测版本
export async function copyVersion(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions/copy-plan-sale-version`, {
    method: 'POST',
    body: params,
  });
}

// 更新智能预测版本的数据来源
export async function saveSource(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-version-days`, {
    method: 'PUT',
    body: params,
  });
}
