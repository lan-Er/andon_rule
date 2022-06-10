/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: TJ
 */

import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getCurrentUserId } from 'utils/utils';

const userId = getCurrentUserId();

/**
 * 查询当前用户默认信息
 */
export async function userSetting(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/user-settings`, {
    method: 'GET',
    query: {
      ...params,
      userId,
    },
  });
}
