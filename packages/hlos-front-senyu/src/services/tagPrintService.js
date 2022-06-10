import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 对大数组对象处理
// wms/v1/52/tags/save-tag-print-data
export async function pressData(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/save-tag-print-data`, {
    method: 'POST',
    body: params,
  });
}
// lwms/v1/0/tags/print-tag
export async function printTag(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/print-tag`, {
    method: 'POST',
    body: params,
  });
}
export async function insertTag(params) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/sen-yu/item-print/insert/tag`, {
    method: 'POST',
    body: params,
  });
}
