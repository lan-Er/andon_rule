import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';

// 更新状态
export async function statusUpdate(params) {
  return request(`${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/userData/updateStatus`, {
    method: 'POST',
    body: params,
  });
}

// 更新备注
export async function remarkUpdate(params) {
  return request(`${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/userData/updateRemark`, {
    method: 'POST',
    body: params,
  });
}
