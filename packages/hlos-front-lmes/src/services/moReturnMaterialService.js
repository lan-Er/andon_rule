import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function queryReturnMoItemDetail(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/execute-lots/query-return-mo-item-detail`, {
    method: 'GET',
    query: params,
  });
}

export async function moReturnSubmit(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/mo-components/return-mo-component`, {
    method: 'POST',
    body: params,
  });
}

// export async function queryReturnMoItemDetailMock(params) {
//   return request(`https://www.fastmock.site/mock/7742ac31b977694d16961441f30347fb/mo-return-material/api/detail`, {
//     method: 'GET',
//     query: params,
//   });
// }
