/*
 * @Description: 任务处理API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-13 09:34:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LTCC } from 'hlos-front/lib/utils/config';

/**
 * 执行
 * @param {*} params 参数
 */
 export async function branchTaskExecute(params) {
  return request(`${HLOS_LTCC}/v1/${getCurrentOrganizationId()}/branch/task/to-execute`, {
    method: 'GET',
    query: params,
  });
}
