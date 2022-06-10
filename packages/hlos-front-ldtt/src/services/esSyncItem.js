import request from 'utils/request';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

// es索引生成
export async function generatorEsTask(params) {
  return request(`${HLOS_LETL}/v1/es-tasks/generatorEsTask`, {
    method: 'GET',
    query: params,
  });
}

// es索引创建执行
export async function createIndex(params) {
  return request(`${HLOS_LETL}/v1/es-tasks/createIndex/${params.esTaskId}`, {
    method: 'GET',
  });
}

// es同步任务执行
export async function runTask(params) {
  return request(`${HLOS_LETL}/v1/es-tasks/runTask/${params.esTaskId}`, {
    method: 'GET',
  });
}

// es索引删除
export async function deleteIndex(params) {
  return request(`${HLOS_LETL}/v1/es-tasks/deleteIndex/${params.esTaskId}?deleteFlag=true`, {
    method: 'GET',
  });
}

// 新建
export async function esTasksCreate(params) {
  return request(`${HLOS_LETL}/v1/es-tasks`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function esTasksEdit(params) {
  return request(`${HLOS_LETL}/v1/es-tasks`, {
    method: 'PUT',
    body: params,
  });
}
