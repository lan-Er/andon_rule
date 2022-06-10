/**
 * @Description: 核企报表API
 * @Author: yu.yang@hand-china.com
 * @Date: 2020-04-26 16:24:08
 * @LastEditors: yu.yang
 */

import request from 'utils/request';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';
import { generateUrlWithGetParam, getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/`;

// 查询
export async function executeLines(params) {
  const { moStatus } = params;
  return request(
    generateUrlWithGetParam(`${url}report/mo-inputration-purchaser`, {
      moStatusList: moStatus,
    }),
    {
      method: 'GET',
      query: {
        ...params,
        moStatus: undefined,
      },
    }
  );
}
