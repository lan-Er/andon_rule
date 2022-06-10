import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

/**
 * 通过标签查询物料
 * @param {*} queryParams 参数
 */
export async function requestItemByTag(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-by-tag`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 通过批次查询物料
 * @param {*} queryParams 参数
 */
export async function requestItemByLot(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/item-by-lot`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 通过itemCode查询物料
 * @param {*} queryParams 参数
 */
export async function requestItemByCode(queryParams) {
  // return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/items/itemCode`, {
  //   method: 'GET',
  //   query: queryParams,
  // });
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-available-onhand`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 直接退料
 * @param {*} queryParams 参数
 */
export async function submitWmReturn(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/submit-wm-return`, {
    method: 'POST',
    body: queryParams,
  });
}
