/*
 * @module: 工时统计报表
 * @Author: sai<sai.tan@zone-cloud.com>
 * @Date: 2021-01-22 10:08:44
 * @LastEditTime: 2021-03-15 18:59:35
 * @copyright: Copyright (c) 2021,zone
 */
import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

/**
 * 员工工时统计报表查询
 * @param {Object} params - 查询参数
 */
export async function queryWorkTimesReport(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/work-times/work-time-report`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 员工工时统计报表主页面分页查询
 * @param {Object} params - 查询参数
 */
export async function queryWorkTimeReportMain(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/work-times/work-time-report-line`, {
    method: 'POST',
    body: params,
  });
}
