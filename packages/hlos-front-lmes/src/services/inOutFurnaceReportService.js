/*
 * @Description: 进出炉报工 - service
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-20 17:37:48
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES, HLOS_LMDS, HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 准备
export async function packWipPrepare(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/furnace/pack-wip-prepare`, {
    method: 'POST',
    body: params,
  });
}

// 清洗
export async function packWipClean(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/furnace/pack-wip-clean`, {
    method: 'POST',
    body: params,
  });
}

// 检验
export async function packWipInspection(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/furnace/pack-wip-inspection`, {
    method: 'POST',
    body: params,
  });
}

// 在制品下线
export async function unloadWip(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/wips/un-load-wip`, {
    method: 'POST',
    body: params,
  });
}

// 获取自动填充数据
export async function getIdentifyBarcode(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/identify-rules/identify-barcode`, {
    method: 'POST',
    body: params,
  });
}

// 获取标签数据
export async function getTagThing(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/getTagThing`, {
    method: 'GET',
    query: params,
  });
}

// 获取标签数据
export async function checkContainerNum(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things`, {
    method: 'GET',
    query: params,
  });
}

// 获取炉批次
export async function getFurnaceBatch(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/furnace/get-furnace-batch`, {
    method: 'GET',
    query: params,
  });
}

// 氮化
export async function nitrideRelease(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/furnace/nitride-release`, {
    method: 'POST',
    body: params,
  });
}
