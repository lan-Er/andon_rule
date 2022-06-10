/*
 * @Description: OQC检验 API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-23 10:53:52
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 检验单批量判定
export async function inspectionDocBatchJudge(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/batch-judge`, {
    method: 'PUT',
    body: params,
  });
}

// 根据检验组获取检验单列表
export async function getInspectionDocForGroup(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/get-inspection-doc-for-group`, {
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

// 已判定检验单异常查询
export async function queryInspectionDocExpPC(params) {
  return request(
    `${HLOS_LMES}/v1/${organizationId}/inspection-doc-exceptions/inspection-doc-exception-pc`,
    {
      method: 'GET',
      query: params,
    }
  );
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
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs`, {
    method: 'PUT',
    body: params,
  });
}

// 批量通过检验单组接口
export async function passInspectionDocGroup(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/pass-inspection-doc-group`, {
    method: 'POST',
    body: params,
  });
}
