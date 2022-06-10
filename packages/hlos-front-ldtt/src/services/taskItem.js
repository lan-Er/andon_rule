import request from 'utils/request';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

// 新增任务项
export async function addTaskItem(params) {
  return request(`${HLOS_LETL}/v1/etl-tasks`, {
    method: 'POST',
    body: params,
  });
}

// 更新任务项
export async function updateTaskItem(params) {
  return request(`${HLOS_LETL}/v1/etl-tasks`, {
    method: 'PUT',
    body: params,
  });
}

// 表结构同步
export async function createTable(params) {
  return request(`${HLOS_LETL}/v1/etl/createTable/${params.taskId}`, {
    method: 'GET',
  });
}

// 快速模式运行
export async function runTask(params) {
  return request(`${HLOS_LETL}/v1/etl/runTask/${params.taskId}`, {
    method: 'GET',
  });
}

// 安全模式运行
export async function runTaskSecurity(params) {
  return request(`${HLOS_LETL}/v1/etl/runTaskSecurity/${params.taskId}`, {
    method: 'GET',
  });
}
