import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function queryDocReservation(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/reservations/get-docReservation`, {
    method: 'GET',
    query: params,
  });
}

export async function queryDeliveryTicket(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/header-line`, {
    method: 'GET',
    query: params,
  });
}

export async function submitDeliveryTicket(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/delivery-inventory`, {
    method: 'POST',
    body: params,
  });
}
