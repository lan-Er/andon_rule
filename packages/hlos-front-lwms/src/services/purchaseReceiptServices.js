import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LSCM } from 'hlos-front/lib/utils/config';

const tenantId = getCurrentOrganizationId();

export async function getReceiveLotNumber(queryParams) {
  return request(`${HLOS_LWMS}/v1/${tenantId}/lots/get-receive-lot-number`, {
    method: 'POST',
    body: queryParams,
  });
}

export async function getReceiveTagCode(queryParams) {
  return request(`${HLOS_LWMS}/v1/${tenantId}/tags/get-receive-tag-number`, {
    method: 'POST',
    body: queryParams,
  });
}

export async function queryLineList(queryParams) {
  return request(`${HLOS_LSCM}/v1/${tenantId}/po-headers/get-header-and-line`, {
    method: 'GET',
    query: queryParams,
  });
}

export async function submitLines(queryParams) {
  return request(`${HLOS_LWMS}/v1/${tenantId}/delivery-tickets/po-receive-batch`, {
    method: 'POST',
    body: queryParams,
  });
}
