/**
 * @Description: 员工实绩 api
 * @Author: wei.tang <wei.tang03@hand-china.com>
 * @LastEditTime: 2021-03-04 14:02:49
 */

import request from 'utils/request';
import { HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 获取单价
export async function getLatestWorkPrice(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/work-prices/get-latest-work-price`, {
    method: 'GET',
    query: params,
  });
}

// 实绩确认
export async function saveExecuteLinePerformance(params) {
  return request(
    `${HLOS_LMES}/v1/${organizationId}/workerPerformance/save-execute-line-performance`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 计算工资
export async function countSalary(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/execute-lines/count-salary`, {
    method: 'POST',
    body: params,
  });
}
