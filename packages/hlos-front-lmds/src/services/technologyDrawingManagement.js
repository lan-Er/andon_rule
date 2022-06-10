/*
 * @module: ESOP平台
 * @Author: 董森<sen.dong@hand-china.com>
 * @Date: 2021-07-08 15:09:09
 * @LastEditTime: 2021-07-029 17:00:22
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LMDS}/v1/${organizationId}/drawing-versions/submitApproval`;

// 提交审批
export async function submitApproval(params) {
  return request(`${url}`, {
    method: 'POST',
    body: params,
  });
}
