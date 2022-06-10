import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 确认/拒绝
export async function poVerify(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/pos/verify-po`, {
    method: 'POST',
    body: params,
  });
}

// 头保存
export async function headSave(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/pos`, {
    method: 'POST',
    body: params,
  });
}

// 行保存
export async function lineSave(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-lines/batch-update-po-line`, {
    method: 'PUT',
    body: params,
  });
}

// 批量维护
export async function updateAllLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-lines/update-all-po-line`, {
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
