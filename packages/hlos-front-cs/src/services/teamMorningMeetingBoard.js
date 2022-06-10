/*
 * @module-:班组看板接口
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-25 16:03:57
 * @LastEditTime: 2020-11-25 16:07:45
 * @copyright: Copyright (c) 2018,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LCSV } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 获取班组看板数据
export async function getTeamDashboardImg(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/dashboard/workgroup-meeting-dashboard`, {
    method: 'GET',
    query: params,
  });
}
