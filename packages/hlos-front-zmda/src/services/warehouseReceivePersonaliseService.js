import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 新增
export async function create(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZMDA}/v1/${organizationId}/warehouse-contacts`, {
    method: 'POST',
    body: params,
  });
}
