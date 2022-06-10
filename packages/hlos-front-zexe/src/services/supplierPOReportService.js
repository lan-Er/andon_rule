/**
 * @Description: 供应商报表API
 * @Author: yu.yang@hand-china.com
 * @Date: 2020-04-27 11:00:00
 * @LastEditors: yu.yang
 */

import request from 'utils/request';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';
import { generateUrlWithGetParam, getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/`;

export async function searchInputration(params) {
  const { moStatus } = params;
  return request(
    generateUrlWithGetParam(`${url}report/mo-inputration-supplier`, {
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
