/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 15:58:36
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-30 13:57:24
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 报价单审核
export async function verifyQuotationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders/verify-quotation-order`, {
    method: 'POST',
    body: params,
  });
}
