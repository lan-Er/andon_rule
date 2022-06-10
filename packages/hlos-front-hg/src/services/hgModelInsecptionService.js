/*
 * @Description: 恒光试模检 api
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-21 17:41:34
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 检验组查询
export async function queryHgInspectionGroup(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspection-group`, {
    method: 'GET',
    query: params,
  });
}

// 试模检判定
export async function handleHgJudgeInspectionDoc(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/judge-inspection-doc`, {
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
