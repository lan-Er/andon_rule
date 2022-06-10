/*
 * @module: 多工厂物料
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-07-19 13:46:21
 * @LastEditTime: 2021-07-19 13:48:11
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 多工厂物料主要查询
export async function itemBageMain(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/items`, {
    method: 'GET',
    query: params,
  });
}
