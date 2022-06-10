import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 派工
export async function dispatching(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-mos/release`, {
    method: 'POST',
    body: data,
  });
}

// 取消派工
export async function cancel(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-mos/cancel`, {
    method: 'POST',
    body: data,
  });
}

// 查询值集LMES.NOOP_MO_TYPE
export async function queryValueSet() {
  return request(`/hpfm/v1/${organizationId}/lovs/data?lovCode=LMES.NOOP_MO_TYPE`, {
    method: 'GET',
  });
}

// 保存行数据
export async function saveLine(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-mos/save`, {
    method: 'POST',
    body: data,
  });
}
