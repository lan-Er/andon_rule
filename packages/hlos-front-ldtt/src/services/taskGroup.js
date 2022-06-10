import request from 'utils/request';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

// 新增任务组
export async function addTaskGroup(params) {
  return request(`${HLOS_LETL}/v1/etl-groups`, {
    method: 'POST',
    body: params,
  });
}

// 表结构全组同步
export async function runAllTaskCreateTable(params) {
  return request(`${HLOS_LETL}/v1/etl/runAllTaskCreateTable/${params.groupId}`, {
    method: 'GET',
  });
}

// 数据全组同步
export async function runAllTaskRecord(params) {
  return request(`${HLOS_LETL}/v1/etl/runAllTaskRecord/${params.groupId}`, {
    method: 'GET',
  });
}

// 数据全组同步--安全模式
export async function runAllTaskRecordSecurity(params) {
  return request(`${HLOS_LETL}/v1/etl/runAllTaskRecordSecurity/${params.groupId}`, {
    method: 'GET',
  });
}
