import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 新建
export async function itemMappingCreate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/item-mappings`, {
    method: 'POST',
    body: params,
  });
}

// 批量映射
export async function itemMappings(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/item-mappings/batchUpdate`, {
    method: 'PUT',
    body: params,
  });
}

// 删除映射
export async function itemMappingsDelete(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/item-mappings`, {
    method: 'DELETE',
    body: params,
  });
}
