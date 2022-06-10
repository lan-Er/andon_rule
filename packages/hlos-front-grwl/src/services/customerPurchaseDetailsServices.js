/*
 * @module: 客户采购明细
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-06-25 14:11:15
 * @LastEditTime: 2021-06-25 19:29:39
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// 保存
export async function handleSaveServices(payload) {
  return request(`${myModule.lsops}/v1/${organizationId}/grwl-so-lines/update-shipped-qty`, {
    method: 'PUT',
    body: payload,
  });
}

// 生成退货单
export async function handleGenerateServices(payload) {
  return request(
    `${myModule.lwmss}/v1/${organizationId}/grwl-ship-returns/generate-so-ship-return`,
    {
      method: 'POST',
      body: payload,
    }
  );
}
