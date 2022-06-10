import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

// 查询分组
export async function groupSearch(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/category/queryCategory?categoryType=${
      params.categoryType
    }`,
    {
      method: 'POST',
      body: {},
    }
  );
}

// 发布或撤回图文教程
export async function releaseOrCancel(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/imageTextCourse/releaseOrCancel?releaseFlag=${
      params.releaseFlag
    }`,
    {
      method: 'POST',
      body: params.ids,
    }
  );
}

// 置顶或取消置顶图文教程
export async function topOrCancel(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/imageTextCourse/topOrCancel?topFlag=${
      params.topFlag
    }`,
    {
      method: 'POST',
      body: params.ids,
    }
  );
}

// 删除图文教程
export async function deleteImageTextCourse(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/imageTextCourse/deleteImageTextCourse`,
    {
      method: 'POST',
      body: params,
    }
  );
}
