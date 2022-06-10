import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 安灯关闭
export async function closeApi(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/close`, {
    method: 'PUT',
    body: params,
  });
}
// 安灯响应
export async function responseApi(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/response`, {
    method: 'PUT',
    body: params,
  });
}
// 创建维修任务(单个)
export async function createRepairTask(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/create-repair-task`, {
    method: 'POST',
    body: params,
  });
}