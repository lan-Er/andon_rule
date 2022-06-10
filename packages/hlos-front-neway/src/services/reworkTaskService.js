import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 查询工序路线
export async function queryRouting(params) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-rework/routing/operation`, {
    method: 'GET',
    query: params,
  });
}
