/*
 * @Description: 设备履历API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-19 17:11:35
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 设备履历头查询
export async function queryEquipmentLines(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/resource-tracks/list`, {
    method: 'GET',
    query: params,
  });
}

// 设备履历头提交
export async function resourceTracks(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/resource-tracks`, {
    method: 'POST',
    body: params,
  });
}
