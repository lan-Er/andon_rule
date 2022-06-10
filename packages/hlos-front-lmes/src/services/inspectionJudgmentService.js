/*
 * @Description: 检验判定 API
 * @Author: zmt
 * @LastEditTime: 2021-07-05 09:45:53
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function queryInspectionAndJudgment(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspection-and-judgment`, {
    method: 'GET',
    query: params,
  });
}

export async function queryInspectionDoc(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspectionDoc`, {
    method: 'GET',
    query: params,
  });
}

export async function queryJudgeArea(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/judge-area`, {
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

// 检验行删除
export async function handleInspectionDocLinesDelete(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines`, {
    method: 'DELETE',
    body: params,
  });
}

// 检验行新增
export async function handleInspectionDocLinesAdd(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines`, {
    method: 'POST',
    body: params,
  });
}

// 获取检验单批次
export async function getInspectionDocLot(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lots/getInspectionDocLot`, {
    method: 'POST',
    body: params,
  });
}

// 检验行样品名称更改
export async function handleInspectionDocLinesModify(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines`, {
    method: 'PUT',
    body: params,
  });
}

// 单个检验单判定
export async function inspectionDocSubmit(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs`, {
    method: 'PUT',
    body: params,
  });
}

// 检验单批量判定
export async function inspectionDocBatchJudge(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/batch-judge`, {
    method: 'PUT',
    body: params,
  });
}

// 检验单批量判定(调整后)
export async function inspectionDocAutoBatchJudge(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/auto-batch-judge`, {
    method: 'PUT',
    body: params,
  });
}

// // 异常查询
// export async function queryExceptionAssigns(params) {
//   return request(`${HLOS_LMDS}/v1/${organizationId}/exception-assigns`, {
//     method: 'GET',
//     query: params,
//   });
// }

// 异常查询
export async function queryExceptionAssigns(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/common/get-exception-assign`, {
    method: 'POST',
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
