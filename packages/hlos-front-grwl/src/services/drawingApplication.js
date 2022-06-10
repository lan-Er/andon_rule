/*
 * @module: 图纸申请
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-07 14:40:03
 * @LastEditTime: 2021-05-07 16:21:29
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// 拉货计划拒绝
export async function applicationServices(payload) {
  return request(`${myModule.lmdss}/v1/${organizationId}/grwl-item-drawings/apply`, {
    method: 'POST',
    body: payload,
  });
}
// 查询
export async function handleQeuryServices(payload) {
  return request(`${myModule.lmdss}/v1/${getCurrentOrganizationId()}/grwl-item-drawings/items`, {
    method: 'GET',
    query: payload,
  });
}
