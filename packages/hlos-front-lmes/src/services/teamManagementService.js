/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-23 14:43:35
 * @LastEditTime: 2020-10-22 11:21:06
 * @Description:
 */
import request from 'utils/request';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const commonUrl = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/tasks`;
const baseUrl = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}`;

export async function userSetting(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/user-settings`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 班组管理-绩效查看
 */
export async function workGroupPerformance(params) {
  return request(`${commonUrl}/work-group-performance`, {
    method: 'GET',
    query: params,
  });
}

/**
 * /v1/{tenantId}/tasks/work-group-user-detail
 * 绩效查看明细
 */
export async function workGroupUserDetail(params) {
  return request(`${commonUrl}/work-group-user-detail`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 开班
 */

export async function startWork(params) {
  return request(`${baseUrl}/work-times/start-work`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 结班
 */
export async function endWork(params) {
  return request(`${baseUrl}/work-times/end-work`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 结班
 */
export async function endWorkBatch(params) {
  return request(`${baseUrl}/work-times/end-work-batch`, {
    method: 'POST',
    body: params,
  });
}
/**
 *运行任务
 * @export
 * @param {*} params
 * @returns
 */

export async function runTask(params) {
  return request(`${commonUrl}/run-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 *暂挂任务
 * @export
 * @param {*} params
 * @returns
 */

export async function holdTask(params) {
  return request(`${commonUrl}/hold-task`, {
    method: 'POST',
    body: params,
  });
}
/**
 * POST /v1/{tenantId}/tasks/pause-task
 * 暂停任务
 */
export async function pauseTask(params) {
  return request(`${commonUrl}/pause-task`, {
    method: 'POST',
    body: params,
  });
}
/**
 * /v1/{tenantId}/performances/saveWorkerGroupPerformance
 * 班次小结
 */
export async function saveWorkerGroupPerformance(params) {
  return request(`${baseUrl}/performances/saveWorkerGroupPerformance`, {
    method: 'POST',
    body: params,
  });
}
/**
 * /v1/{tenantId}/workerPerformance/saveWorkerPerformance
 *提交员工实绩
 */
export async function saveWorkerPerformance(params) {
  return request(`${baseUrl}/workerPerformance/saveWorkerPerformance`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 绑定班组
 */

export async function bindWorkGroup(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/workers/bind-work-work-group`, {
    method: 'POST',
    body: params,
  });
}

// 获取工作状态  /v1/{tenantId}/work-times/work-status
export async function getWorkStatus(params) {
  return request(`${baseUrl}/work-times/work-status`, {
    method: 'POST',
    body: params,
  });
}

// 获取班组下的任务
export async function getWorkerGroupTask(params) {
  return request(`${commonUrl}/select-worker-group-task`, {
    method: 'GET',
    query: params,
  });
}
