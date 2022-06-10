import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存
export async function moSave(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/mo-components/save-mo-component`, {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function moSubmit(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/mo-components/release-mo-component`, {
    method: 'POST',
    body: params,
  });
}
