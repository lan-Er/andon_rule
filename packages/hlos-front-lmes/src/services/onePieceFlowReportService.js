/**
 * @Description: 单件流报工 api
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 14:08:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LMES, HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organizationId}/wips`;

/**
 * 获取
 */
export async function getWip(params) {
  return request(`${commonUrl}/get-wip`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取
 */
export async function getTaskItemForWip(params) {
  return request(`${commonUrl}/get-task-item-for-wip`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 注册
 */
export async function registerWip(params) {
  return request(`${commonUrl}/register-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 进站
 */
export async function moveInWip(params) {
  return request(`${commonUrl}/move-in-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 出站
 */
export async function moveOutWip(params) {
  return request(`${commonUrl}/move-out-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 上线
 */
export async function loadWip(params) {
  return request(`${commonUrl}/load-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 装箱
 */
export async function packWip(params) {
  return request(`${commonUrl}/pack-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 检验
 */
export async function inspectWip(params) {
  return request(`${commonUrl}/inspect-wip`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 强制下线
 */
export async function unloadWip(params) {
  return request(`${commonUrl}/un-load-wip`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 绑定序列号
 */
export async function bindWipProdTag(params) {
  return request(`${commonUrl}/bind-wip-product-tag`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询标签信息-装箱
 */
export async function getTagForPack(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags/get-tag-for-pack`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询过站信息
 */
export async function getDetail(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/execute-lines/query`, {
    method: 'GET',
    query: params,
  });
}

// 获取现有量
export async function getQuantity(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`, {
    method: 'GET',
    query: params,
  });
}

// 获取检验模板
export async function getInspectionTemplate(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/inspection-templates/get-inspection-template`, {
    method: 'POST',
    body: params,
  });
}

// 获取检验模板行
export async function getTemplateLine(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}//inspection-template-lines`, {
    method: 'GET',
    query: params,
  });
}

// 获取异常
export async function getExceptionAssign(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/common/get-exception-assign`, {
    method: 'POST',
    body: params,
  });
}

// 获取箱码
export async function getPackingTagCode(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/get-packing-tag-code`, {
    method: 'GET',
    query: params,
  });
}

// 解绑 标签信息
export async function getUnbindTagInfo(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/wips/query-wip-main`, {
    method: 'POST',
    body: params,
  });
}

// 解绑页面右侧列表
export async function inventoryFilter(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/wips/inventory-filter`, {
    method: 'POST',
    body: params,
  });
}

// 获取标签（可能返回多个标签）
export async function queryTagThing(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/expand-tag`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 待报检标签信息
 * @param {*} params  moId
 * @param {*} params  operationId
 * @param {*} params  executeType
 * @returns []
 */
export async function getExecuteLot(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/execute-lots/get-execute-lot`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 任务报检
 */
export async function createTaskQcDoc(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/create-task-qc-doc`, {
    method: 'POST',
    body: params,
  });
}
