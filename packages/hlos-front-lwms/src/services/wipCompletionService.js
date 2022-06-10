import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';

/**
 * 通过标签查询物料
 * @param {*} queryParams 参数
 */
export async function requestItemByTag(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/getTagThing`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 通过批次查询物料
 * @param {*} queryParams 参数
 */
export async function requestItemByLot(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/lot-number`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 通过itemCode查询物料
 * @param {*} queryParams 参数
 */
export async function requertItemByCode(queryParams) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/items/item-code-select`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 完工入库提交
 * @param {*} queryParams 参数
 */
export async function completeToInventory(queryParams) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/warehouse-business/complete-to-inventory`,
    {
      method: 'PUT',
      body: queryParams,
    }
  );
}
