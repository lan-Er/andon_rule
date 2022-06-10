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

// 新增或者更新图文教程
export async function graphicOperate(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/imageTextCourse/insetOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

// 查询图文教程详情
export async function getGraphicDetail(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/imageTextCourse/getImageTextCourseById`,
    {
      method: 'POST',
      body: params,
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
