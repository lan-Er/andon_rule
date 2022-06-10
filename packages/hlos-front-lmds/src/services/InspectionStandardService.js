/*
 * @Description: 检验标准API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-26 15:37:14
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 根据检验标准查询检验标准列表
export async function queryInspectionStandardList(params) {
  return request(
    `${HLOS_LMDS}/v1/${organizationId}/sampling-standards/query-sampling-standard-list`,
    {
      method: 'GET',
      query: params,
    }
  );
}

// 新建检验标准信息
export async function createInspectionStandard(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/sampling-standards/create-sampling-standard`, {
    method: 'POST',
    body: params,
  });
}

// 更新检验标准信息
export async function updateInspectionStandard(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/sampling-standards/update-sampling-standard`, {
    method: 'PUT',
    body: params,
  });
}

// 删除检验标准信息
export async function removeInspectionStandard(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/sampling-standards/remove-sampling-standard`, {
    method: 'DELETE',
    body: params,
  });
}
