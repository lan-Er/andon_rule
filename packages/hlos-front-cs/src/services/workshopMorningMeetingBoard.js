/*
 * @module-:晨会看板请求
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-13 14:06:41
 * @LastEditTime: 2020-12-25 10:13:50
 * @copyright: Copyright (c) 2018,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LCSV } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 查询晨会看板数据
export async function queryDashboard(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/dashboard/meeting-dashboard`, {
    method: 'GET',
    query: params,
  });
}
// 更新状态
export async function upDateStatus(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/action-plans/update-status`, {
    method: 'PUT',
    query: params,
  });
}
