/*
 * @module: 拉货计划
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-06 13:50:35
 * @LastEditTime: 2021-05-06 13:55:52
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// 拉货计划拒绝
export async function handleRejectServicec(payload) {
  return request(`${myModule.lwmss}/v1/${organizationId}/grwl-pull-ship-plans/reject`, {
    method: 'POST',
    body: payload,
  });
}
// 生成
export async function handleGenerateServicec(payload) {
  return request(
    `${myModule.lwmss}/v1/${organizationId}/grwl-pull-ship-plans/generate-ship-order`,
    {
      method: 'POST',
      body: payload,
    }
  );
}
