import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

export async function delLine(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/smd-wip-lines/batch-delete`, {
    method: 'DELETE',
    body: params,
  });
}
