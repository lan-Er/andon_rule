import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function getRequestLines(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines`, {
    method: 'GET',
    query: params,
  });
}

export async function getDocReservation(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/reservations/get-docReservation-for-web`, {
    method: 'GET',
    query: params,
  });
}

export async function confirmProductionWm(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/confirm-production-vm`, {
    method: 'POST',
    body: params,
  });
}

export async function executeProductionWm(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/execute-production-wm`, {
    method: 'POST',
    body: params,
  });
}
