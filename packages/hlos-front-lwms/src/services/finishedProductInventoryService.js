import request from 'utils/request';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LWMS, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function directTransfer(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/production-transfer`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 获取默认工厂
 */
export async function queryDefaultMeOu(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/me-ous/lovs/data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询物料批次列表数据
 * @param {*} queryParams 参数
 */
export async function requestItemLot(queryParams) {
  const { ...params } = queryParams;
  const lotStatusList = [...queryParams.lotStatus];
  return request(
    generateUrlWithGetParam(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys`, {
      lotStatusList,
    }),
    {
      method: 'GET',
      query: {
        ...params,
        lotStatus: undefined,
      },
    }
  );
}

/**
 * 查询物料标签列表数据
 * @param {*} queryParams 参数
 */
export async function requestItemTag(queryParams) {
  const { ...params } = queryParams;
  const qcStatusList = [...queryParams.qcStatus];
  return request(
    generateUrlWithGetParam(
      `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-tag-thing`,
      {
        qcStatusList,
      }
    ),
    {
      method: 'GET',
      query: {
        ...params,
        qcStatus: undefined,
      },
    }
  );
}
