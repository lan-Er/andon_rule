/**
 * @Description: 物料关键属性接口
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-16 10:46:19
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

// 创建
export async function itemKeyAttrCreate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/attributes`, {
    method: 'POST',
    body: params,
  });
}

// 修改
export async function itemKeyAttrUpdate(params) {
  return request(`${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/attributes`, {
    method: 'PUT',
    body: params,
  });
}
