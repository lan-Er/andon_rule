/**
 * @Description: 设备监控
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-21 17:16:55
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';

// 查询设备当前状态
export async function queryEquipmentStatus(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMDS}/v1/${organizationId}/equipments/current-status`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备点检进度
export async function queryEquipmentCheckRate(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/check-rate`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备综合效率--接口暂无，文档还没写好
// export async function queryEquipment(params) {
//   const organizationId = getCurrentOrganizationId();
//   return request(`${HLOS_LMES}/v1/${organizationId}/tasks/check-rate`, {
//     method: 'GET',
//     query: params,
//   });
// }

// 查询设备安灯
export async function queryEquipmentAndon(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMDS}/v1/${organizationId}/andons/equipment-andon`, {
    method: 'GET',
    query: params,
  });
}

// 查询各类设备状态
export async function queryEquipmentTypeStatus(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMDS}/v1/${organizationId}/equipments/equipment-type-status`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备地图
export async function queryEquipmentMap(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMDS}/v1/${organizationId}/equipments/equipment-map`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备地图--弹窗
export async function queryEquipmentMapModal(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_LMES}/v1/${organizationId}/tasks/equipment-task-map`, {
    method: 'GET',
    query: params,
  });
}
