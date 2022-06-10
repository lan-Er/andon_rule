/**
 * @Description: 在库检报检--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-17 09:55:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 批量报检
export async function createWqcDoc(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/create-wqc-doc`, {
    method: 'POST',
    body: params,
  });
}
