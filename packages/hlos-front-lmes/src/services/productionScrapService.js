import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organzationId}/tasks`;

/**
 * 根据MO查询工序
 * @param {*} queryParams 参数
 */
 export async function queryMoOperation(queryParams) {
  return request(`${HLOS_LMES}/v1/${organzationId}/mo-operations`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * * 获取任务物料
 */
 export async function queryTaskItem(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/task-items`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取Mo
 */
 export async function queryMo(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/mos`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 运行
 */
 export async function runTask(params) {
  return request(`${commonUrl}/run-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 暂停
 */
export async function pauseTask(params) {
  return request(`${commonUrl}/pause-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 任务报工提交
 */
 export async function submitTaskOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/run-submit-task`, {
    method: 'POST',
    body: params,
  });
}
