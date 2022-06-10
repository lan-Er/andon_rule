import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 生成按钮提交
 * @param {*} queryParams
 * @returns
 */
export async function generateButton(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-complete/generate-button`, {
    method: 'POST',
    body: queryParams,
  });
}
