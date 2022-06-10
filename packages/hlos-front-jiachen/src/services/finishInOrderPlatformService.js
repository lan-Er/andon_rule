import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 关闭按钮
 * @param {*} queryParams
 * @returns
 */
export async function closeButton(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-complete/close-button`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 提交按钮
 * @param {*} queryParams
 * @returns
 */
export async function submitButton(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-complete/submit-button`, {
    method: 'POST',
    body: queryParams,
  });
}
