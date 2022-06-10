/**
 * @Description: 线下拆板 接口api
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 13:54:08
 * @LastEditors: leying.yan
 */

import request from 'utils/request';
import { HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const mdsUrl = `${HLOS_LMDS}/v1/${organzationId}`;
const wmsUrl = `${HLOS_LWMS}/v1/${organzationId}`;

/**
 * 获取标签信息及标签实物 api：getTagThing
 */
export async function getTagThing(params) {
  return request(`${wmsUrl}/tag-things`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取拆分物料
 * GET /v1/{organizationId}/bom-components
 */
export async function queryBomComponents(params) {
  return request(`${mdsUrl}/bom-components`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取拆板bom
 * POST /v1/{tenantId}/item-boms/batch-get-item-bom
 */
export async function getItemBom(params) {
  return request(`${mdsUrl}/item-boms/batch-get-item-bom`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 物料标签拆解
 * POST /v1/{tenantId}/warehouse-business/wm-tag-disassemble
 */
export async function wmTagDisassemble(params) {
  return request(`${wmsUrl}/warehouse-business/wm-tag-disassemble`, {
    method: 'POST',
    body: params,
  });
}
