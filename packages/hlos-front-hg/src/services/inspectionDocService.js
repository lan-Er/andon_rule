/*
 * @Description: 检验单平台 API
 * @Author: yu.na@hand-china.com
 * @LastEditTime: 2020-08-20 15:23:44
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

// 检验单行不良原因查询
export async function requestException(params) {
  return request(
    `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-doc-exceptions/inspection-doc-line-exception`,
    {
      method: 'GET',
      query: params,
    }
  );
}
