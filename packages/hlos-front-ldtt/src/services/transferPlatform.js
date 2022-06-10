import request from 'utils/request';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';

// 新增租户分发
export async function addTransferPlatform(params) {
  return request(`${HLOS_LDTF}/v1/transfer-platforms`, {
    method: 'POST',
    body: params,
  });
}

// 编辑租户分发
export async function editTransferPlatform(params) {
  return request(`${HLOS_LDTF}/v1/transfer-platforms`, {
    method: 'PUT',
    body: params,
  });
}

// 刷新CanalTask监听线程
export async function refreshCanal() {
  return request(`${HLOS_LDTF}/v1/transfer-tasks/refreshCanalTask`, {
    method: 'GET',
  });
}

// 刷新RocketMqTask监听线程
export async function refreshMq() {
  return request(`${HLOS_LDTF}/v1/transfer-tasks/refreshRocketMqTasks`, {
    method: 'GET',
  });
}
