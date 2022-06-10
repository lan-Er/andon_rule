/*
 * @module: 设备监控看板接口
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-21 09:57:16
 * @LastEditTime: 2021-02-04 18:53:41
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LRPT}/v1/${getCurrentOrganizationId()}/equipments/monitor-dashboard`;

const detailUrl = `${HLOS_LRPT}/v1/${getCurrentOrganizationId()}/resource-monitors/dashboard-detail`;

// 获取设备监控看板-设备列表
export async function queryEquipmentList(params) {
  return request(url, {
    method: 'GET',
    query: params,
  });
}
// 设备详情
export async function queryEquipmentDetails(params) {
  return request(detailUrl, {
    method: 'GET',
    query: params,
  });
}
