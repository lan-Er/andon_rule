import request from 'utils/request';
import { HLOS_LDTF } from 'hlos-front/lib/utils/config';

// 新增租户分发
export async function addTransferService(params) {
  return request(`${HLOS_LDTF}/v1/transfer-services`, {
    method: 'POST',
    body: params,
  });
}

// 编辑租户分发
export async function editTransferService(params) {
  return request(`${HLOS_LDTF}/v1/transfer-services`, {
    method: 'PUT',
    body: params,
  });
}
