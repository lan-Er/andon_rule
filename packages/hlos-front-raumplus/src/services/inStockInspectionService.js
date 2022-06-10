/*
 * @Description: 在库检验API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-06-09 15:47:46
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 检验单查询
export async function queryInspectionDoc(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspectionDoc`, {
    method: 'GET',
    query: params,
  });
}

// 检验行查询
export async function queryInspectionDocLines(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines`, {
    method: 'GET',
    query: params,
  });
}

// 获取检验单批次
export async function getInspectionDocLot(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lots/getInspectionDocLot`, {
    method: 'POST',
    body: params,
  });
}

// 异常查询
export async function queryExceptionAssigns(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/common/get-exception-assign`, {
    method: 'POST',
    body: params,
  });
}

// 单个检验单判定
export async function inspectionDocSubmit(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/batch-judge`, {
    method: 'PUT',
    body: params,
  });
}

// 详情页检验单判定
export async function inspectionSingleDocSubmit(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs`, {
    method: 'PUT',
    body: params,
  });
}

// 更新样本数量
export async function updateSampleQty(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/update-sampleQty`, {
    method: 'POST',
    body: params,
  });
}
