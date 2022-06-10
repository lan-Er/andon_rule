/**
 * @Description: po预检 接口api
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-05 13:54:08
 * @LastEditors: leying.yan
 */

import request from 'utils/request';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const mdsUrl = `${HLOS_LMDS}/v1/${organzationId}`;
const mesUrl = `${HLOS_LMES}/v1/${organzationId}`;

/**
 * 获取检验模板
 */
export async function getInspectTemplate(params) {
  return request(`${mdsUrl}/inspection-templates/get-inspection-template`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 创建检验单
 */
export async function createInspectionDoc(params) {
  return request(`${mesUrl}/inspection-docs`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 判定检验单
 */
export async function judgeInspectionDoc(params) {
  return request(`${mesUrl}/inspection-docs`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 获取物料控制类型
 */
export async function getItemControlType(params) {
  return request(`${mdsUrl}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 获取异常信息
 */
export async function getExceptionAssigns(params) {
  return request(`${mdsUrl}/exception-assigns`, {
    method: 'GET',
    query: params,
  });
}
