/*
 * @Descripttion: 配置中心
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:29:19
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-23 10:02:31
 */

import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存核企侧订单明细规则配置
export async function orderConfigDetails(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/order-config-details`, {
    method: 'POST',
    body: params,
  });
}
