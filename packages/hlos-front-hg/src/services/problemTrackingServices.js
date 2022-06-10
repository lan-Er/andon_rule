/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-19 10:21:09
 * @LastEditTime: 2020-08-20 11:59:14
 * @Description:
 */
import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

export async function userSetting(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/user-settings`, {
    method: 'GET',
    query: params,
  });
}

// 关闭问题清单 /v1/{tenantId}/issues/closed

export async function issuesClosed(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/issues/closed `, {
    method: 'PUT',
    body: params,
  });
}
