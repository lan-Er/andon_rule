/**
 * @Description: 集团接口
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-08 14:43:16
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 新建
export async function groupCreate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/groups`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function groupUpdate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/groups`, {
    method: 'PUT',
    body: params,
  });
}
