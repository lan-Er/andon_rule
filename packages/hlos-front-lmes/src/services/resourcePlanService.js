/*
 * @Descripttion: 资源计划Service
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */

import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

import {
  getCurrentOrganizationId,
  getCurrentUserId,
  //   parseParameters, // 将传过来的对象 准换为后台接受的格式
} from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const userId = getCurrentUserId();

/**
 * 批量排成资源设置
 * @async
 * @function queryUserScheduleConfigs -函数名称
 * @returns {object} fetch Promise
 */
export async function queryUserConfigs(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/user-schedule-configs/user-config`, {
    method: 'GET',
    query: {
      userId,
      ...params,
    },
  });
}

/**
 * 资源计划列表
 * @async
 * @function queryTasksSwimLane -函数名称
 * @param {string} params.resourceClass - 资源类别
 * @param {long} params.resourceId - 资源ID
 * @param {long} params.organizationId - 资源组织ID
 * @returns {object} fetch tasks
 */
export async function queryTasksSwimLane(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/schedule/swim-lane`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 资源计划任务编排
 * @async
 * @function updatePreScheduleTask -函数名称
 * @param {long} params.organizationId - 资源组织ID
 * @param {long} params.priority - 序列
 * @param {string} params.sourceResourceClass - 资源类别
 * @param {long} params.sourceResourceCode - 资源CODE
 * @param {long} params.sourceResourceId - 资源ID
 * @param {string} params.targetResourceClass - 目标资源类别
 * @param {long} params.targetResourceCode - 目标资源CODE
 * @param {long} params.targetResourceId - 目标资源ID
 * @returns {object} fetch tasks
 */
export async function updatePreScheduleTask(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/update-pre-schedule`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * Tasks Order
 * @async
 * @function updateScheduleTaskOrder -函数名称
 * @param {long} params.priority - 序列
 * @returns {object} fetch tasks order
 */
export async function updateScheduleTaskOrder(taskList) {
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/update-schedule-order`, {
    method: 'PUT',
    body: taskList,
  });
}
