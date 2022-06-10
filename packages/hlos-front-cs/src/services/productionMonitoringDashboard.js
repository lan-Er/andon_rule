/*
 * @module-: 生产监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-06 15:53:48
 * @LastEditTime: 2020-11-16 15:33:31
 * @copyright: Copyright (c) 2018,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS, HLOS_LCSV } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 质量监控查询
export async function queryQualityControl(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/quality-controller`, {
    method: 'GET',
    query: params,
  });
}

// 产量统计部分
export async function queryOutputStatistics(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/performances/output-statistics`, {
    method: 'GET',
    query: params,
  });
}

// 当月生产完成总量部分
export async function queryTotalProductionCompleted(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/performances/total-production-completed`, {
    method: 'GET',
    query: params,
  });
}

// 生产概况部分
export async function queryMosOverView(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/mos/overview`, {
    method: 'GET',
    query: params,
  });
}

// 安灯异常监控
export async function queryAndonsMonitoring(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/andons/monitoring`, {
    method: 'GET',
    query: params,
  });
}

// 安灯监控-已触发数据
export async function queryAndonJournalsTriggered(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/triggered`, {
    method: 'GET',
    query: params,
  });
}

export async function queryProductionMonitoring(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/production-monitoring/schedule-overview`, {
    method: 'GET',
    query: params,
  });
}
