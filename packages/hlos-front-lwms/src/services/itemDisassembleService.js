/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-09 13:42:38
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function getTagThings(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/getTagThing`, {
    method: 'GET',
    query: params,
  });
}
// getMoComponent
// /v1/{organizationId}/bom-components/bomId  mds服务
// getBomComponent
// https://zoneda.onestep-cloud.com/lmes/v1/0/mo-components?moId=168293065032372225&organizationId=81792646158888960  GET请求
export async function getMoComponent(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/mo-components`, {
    method: 'GET',
    query: params,
  });
}
export async function getBomComponent(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/bom-components/bomId`, {
    method: 'GET',
    query: params,
  });
}
// 获取物料类型
export async function queryItemControlTypeBatch(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}

// 明细列表添加一行
export async function getReceiveTagCode(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/get-receive-tag-number`, {
    method: 'POST',
    body: params,
  });
}

// 拆解还原
export async function wmItemDisassemble(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/warehouse-business/wm-item-disassemble`, {
    method: 'POST',
    body: params,
  });
}
