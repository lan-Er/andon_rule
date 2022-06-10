/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-05-08 13:52:47
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-05-08 14:23:44
 */
import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
// import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function executeLines(queryParams) {
  // return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/execute-lines`, {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/raumplus-execute-line`, {
    method: 'GET',
    query: queryParams,
  });
}
