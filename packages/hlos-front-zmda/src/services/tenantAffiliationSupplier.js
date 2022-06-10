import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { spellString } from '@/utils';

// 查询
export async function tenantRelsSearch(params) {
  const searchParams = spellString(params);
  return request(
    `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/tenant-rels/queryTreeList${searchParams}`,
    {
      method: 'GET',
    }
  );
}

// 保存
export async function tenantRelsSave(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/tenant-rels`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function tenantRelsDelete(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/tenant-rels`, {
    method: 'DELETE',
    body: params,
  });
}

// 保存-角色分配
export async function tenantRelRolesSave(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/tenant-rel-roles/save`, {
    method: 'POST',
    body: params,
  });
}
