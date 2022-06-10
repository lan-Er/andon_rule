/**
 * @Description: 物料接口
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-13 15:21:20
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 创建
export async function itemCreate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/items`, {
    method: 'POST',
    body: params,
  });
}

// 修改
export async function itemUpdate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/items`, {
    method: 'PUT',
    body: params,
  });
}
