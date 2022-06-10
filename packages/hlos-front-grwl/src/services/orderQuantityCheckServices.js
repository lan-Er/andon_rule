/*
 * @module: 订单数据检查
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-17 10:20:28
 * @LastEditTime: 2021-05-17 17:25:25
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { myModule } from '@/common/index';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// 检查接口
export async function examinationServices(payload) {
  return request(`${myModule.lsops}/v1/${organizationId}/grwl-so-lines/check`, {
    method: 'POST',
    body: payload,
  });
}
// 打印
export async function itemPrint(payload) {
  console.log(payload);
  return request(`${myModule.lsops}/v1/${organizationId}/grwl-so-lines/item-qr-code-print`, {
    method: 'POST',
    body: payload,
  });
}
