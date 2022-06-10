/**
 * @Description: 需求发布
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-10 14:41:40
 */

import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 发布
export async function releasePo(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-headers/releasePo`, {
    method: 'PUT',
    body: params,
  });
}

// 审核（确认、取消、退回）
export async function verifyPo(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-headers/verifyPo`, {
    method: 'PUT',
    body: params,
  });
}
