import request from 'utils/request';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';

// 新增租户分发
export async function addTransferDetail(params) {
  return request(`${HLOS_LDTF}/v1/transfer-details`, {
    method: 'POST',
    body: params,
  });
}

// 编辑租户分发
export async function editTransferDetail(params) {
  return request(`${HLOS_LDTF}/v1/transfer-details`, {
    method: 'PUT',
    body: params,
  });
}
