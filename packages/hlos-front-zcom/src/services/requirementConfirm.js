/**
 * @Description: 需求发布
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-10 14:41:40
 */

import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 确认
export async function confirmPoHeader(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-headers/confirmPoHeader`, {
    method: 'PUT',
    body: params,
  });
}

// 确认行
export async function confirmPoLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-lines/confirmPoLine`, {
    method: 'PUT',
    body: params,
  });
}

// 销售订单生成
export async function createSo(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/po-headers/createSo`, {
    method: 'PUT',
    body: params,
  });
}
