/*
 * @Descripttion: pos 界面API
 * @Author: weihua.yao
 * @Date: 2020-01-15 15:22:37
 * @LastEditTime: 2021-04-21 14:54:34
 */

import request from 'utils/request';
import { HLOS_LSCM, HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

export async function approvePoAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/approve`, {
    method: 'PUT',
    body: params,
  });
}

export async function deletePoAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/delete`, {
    method: 'DELETE',
    body: params,
  });
}

export async function releasePoAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/release`, {
    method: 'PUT',
    body: params,
  });
}

export async function cancelPoAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/cancel`, {
    method: 'PUT',
    body: params,
  });
}

export async function closePoAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/close`, {
    method: 'PUT',
    body: params,
  });
}

export async function getNumAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/po-num`, {
    method: 'GET',
    query: params,
  });
}

export async function deletePoLineAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-lines/delete`, {
    method: 'DELETE',
    body: params,
  });
}

export async function cancelPoLineAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-lines/cancel`, {
    method: 'PUT',
    body: params,
  });
}

export async function closePoLineAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-lines/close`, {
    method: 'PUT',
    body: params,
  });
}

export async function queryPoLineAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-lines`, {
    method: 'GET',
    query: params,
  });
}

export async function getItemSupplierAPI(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/item-asls/get-item-supplier-attributes`,
    {
      method: 'GET',
      query: params,
    }
  );
}
export async function getDocumentTypeApi(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/document-types/getDocumentType`, {
    method: 'GET',
    query: params,
  });
}

export async function createSqcDocAPI(params) {
  return request(`${HLOS_LSCM}/v1/${getCurrentOrganizationId()}/po-headers/create-sqc-doc`, {
    method: 'POST',
    body: params,
  });
}
