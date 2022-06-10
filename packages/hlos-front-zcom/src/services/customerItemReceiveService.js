/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-25 17:38:00
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-18 14:25:33
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 接收对账
export async function certStorageLines(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/cert-storage-lines`, {
    method: 'POST',
    body: params,
  });
}

// 接收对账
export async function triggerApi() {
  const organizationId = getCurrentOrganizationId();
  return request(`/letl/v1/${organizationId}/jimi/IF117`, {
    method: 'GET',
  });
}
