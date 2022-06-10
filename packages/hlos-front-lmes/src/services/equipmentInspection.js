/**
 * @Description: 设备点检 API
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-18 14:29:43
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

// 创建点检任务
export async function createEquInspection(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/create-tpm-task`, {
    method: 'POST',
    body: params,
  });
}

// 获取点检详情
export async function getEquInspectionDetail(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/query-record`, {
    method: 'GET',
    query: params,
  });
}

// 单个合格操作
export async function equInsQualified(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/submit-tpm-task`, {
    method: 'PUT',
    body: params,
  });
}

// 批量合格操作
export async function equInsQualifieds(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/submit-tpm-tasks`, {
    method: 'PUT',
    body: params,
  });
}
