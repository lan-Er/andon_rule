import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存报价单
export async function quotationOrderSave(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders`, {
    method: 'POST',
    body: params,
  });
}

// 提交报价单
export async function quotationOrderSubmit(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders/submit-quotation-order`, {
    method: 'POST',
    body: params,
  });
}

// 撤回报价单
export async function quotationOrderRecall(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders/recall-quotation-order`, {
    method: 'POST',
    body: params,
  });
}

// 删除报价单
export async function quotationOrderDelete(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders`, {
    method: 'DELETE',
    body: params,
  });
}


