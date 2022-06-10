import request from 'utils/request';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';

// 新增租户分发
export async function addTransferTenant(params) {
  return request(`${HLOS_LDTF}/v1/transfer-tenants`, {
    method: 'POST',
    body: params,
  });
}

// 编辑租户分发
export async function editTransferTenant(params) {
  return request(`${HLOS_LDTF}/v1/transfer-tenants`, {
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
