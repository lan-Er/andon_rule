/*
 * @Descripttion: 物料 界面API
 * @Author: yu.na
 * @Date: 2020-08-05 10:33:37
 */

import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 * 确认升级
 */
export async function versionUp(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/items/version-up `, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取物料明细
 */
export async function requestItem(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/items`, {
    method: 'GET',
    query: params,
  });
}
