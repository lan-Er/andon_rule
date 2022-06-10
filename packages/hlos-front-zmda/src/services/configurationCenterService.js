import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';

// 发货规则新建
export async function deliveryConfigCreate(params) {
  return request(`${HLOS_ZCOM}/v1/${getCurrentOrganizationId()}/delivery-rules`, {
    method: 'POST',
    body: params,
  });
}

// 发货规则编辑
export async function deliveryConfigUpdate(params) {
  return request(`${HLOS_ZCOM}/v1/${getCurrentOrganizationId()}/delivery-rules`, {
    method: 'PUT',
    body: params,
  });
}
