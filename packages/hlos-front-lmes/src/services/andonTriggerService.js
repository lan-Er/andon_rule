import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 查询对应工位产线下的安灯class
export async function queryAndonTriggerClass(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/andon-classs/workcell-prod-line`, {
    method: 'GET',
    query: params,
  });
}

// 安灯触发列表
export async function queryAndonTrigger(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/andons/triggered-pc`, {
    method: 'GET',
    query: params,
  });
}

// 安灯触发
export async function andonTrigger(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/trigger`, {
    method: 'POST',
    body: params,
  });
}
