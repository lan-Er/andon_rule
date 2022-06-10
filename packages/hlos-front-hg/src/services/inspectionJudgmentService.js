/*
 * @Description: 检验判定 API
 * @Author: zmt
 * @LastEditTime: 2020-08-20 15:23:44
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 头查询
export async function queryInspectionAndJudgment(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-judge-area`, {
    method: 'GET',
    query: params,
  });
}

// NEW ONGOING 状态数量查询
export async function queryHgJudgeAreaStatus(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}//hg-judge-area-status`, {
    method: 'GET',
    query: params,
  });
}

// 检验组查询
export async function queryHgInspectionGroup(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-inspection-group`, {
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
