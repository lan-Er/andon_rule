import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

export async function createSalesMo(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/mos/create-so-mo`, {
    method: 'POST',
    body: params,
  });
}

export async function createSalesMoSplit(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/mos/create-so-mo-split`, {
    method: 'POST',
    body: params,
  });
}

export async function getSplitTaskLogs(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/split-task-logs/${params}`, {
    method: 'GET',
  });
}

export async function splitTaskLogs(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/split-task-logs`, {
    method: 'PUT',
    body: params,
  });
}
