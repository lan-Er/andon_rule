import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function queryAndonTriggerClassification(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/statistics/trigger-class`, {
    method: 'GET',
    query: params,
  });
}

export async function queryAndonStatistic(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/statistics/count`, {
    method: 'GET',
    query: params,
  });
}

export async function queryProcessOrResponseTimeTop(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/statistics/time-top`, {
    method: 'GET',
    query: params,
  });
}

export async function queryTriggerTimesRank(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/andon-journals/statistics/trigger-times-top`, {
    method: 'GET',
    query: params,
  });
}

export async function queryWorkCellTriggerTimesRank(params) {
  return request(
    `${HLOS_LMES}/v1/${organizationId}/andon-journals/statistics/workcell-trigger-times-top`,
    {
      method: 'GET',
      query: params,
    }
  );
}
