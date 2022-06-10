/**
 * @Description: 发货单平台 service
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 获取物料控制类型
export async function queryItemControlTypeBatch(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取单据类型
 */
export async function queryDocumentType(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/document-types`, {
    method: 'GET',
    query: params,
  });
}
