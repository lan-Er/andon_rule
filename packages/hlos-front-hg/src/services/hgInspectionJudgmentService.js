/*
 * @Description: 检验判定 API
 * @Author: zmt
 * @LastEditTime: 2020-10-19 15:42:38
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';

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
  return request(
    `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-judge-area-status?qcStatusList=${params.qcStatusList[0]}&qcStatusList=${params.qcStatusList[1]}&qcStatusList=${params.qcStatusList[2]}&ngProcessedFlag=${params.ngProcessedFlag}&inspectionTemplateType=${params.inspectionTemplateType}`,
    {
      method: 'GET',
      // query: params,
    }
  );
}

// 检验组查询
export async function queryHgInspectionGroup(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspection-group`, {
    method: 'GET',
    query: params,
  });
}

// 异常查询
export async function queryExceptionAssigns(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/exception-assigns`, {
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

// 创建检验单异常
export async function handleHgJudgeInspectionDoc(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-judge-inspection-doc`, {
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

// 开始检验
export async function startInspection(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/start-inspection`, {
    method: 'POST',
    body: params,
  });
}

// 处理检验不合格
export async function processInspectionNg(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/process-inspection-ng`, {
    method: 'POST',
    body: params,
  });
}
