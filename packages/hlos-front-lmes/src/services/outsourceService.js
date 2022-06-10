/**
 * @Description: 工序外协 api
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-21 14:08:08
 * @LastEditors: leying.yan
 */

import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organzationId}/`;

/**
 * 取消
 */
export async function cancelOutsource(params) {
  return request(`${commonUrl}/outsource-headers/cancel-out-source`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 关闭
 */
export async function closeOutsource(params) {
  return request(`${commonUrl}/outsource-headers/close-out-source`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除
 */
export async function deleteOutsource(params) {
  return request(`${commonUrl}/outsource-headers/delete-out-source`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 提交
 */
export async function submitOutsource(params) {
  return request(`${commonUrl}/outsource-headers/release-out-source`, {
    method: 'POST',
    body: params,
  });
}
