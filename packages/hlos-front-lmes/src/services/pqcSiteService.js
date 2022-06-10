/*
 * PQC巡检
 * date: 2020-07-15
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import request from 'utils/request';
import { HLOS_LMES, HLOS_LMDS, HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 * 生成检验单号
 */
export async function getInspectionNum(params) {
  return request(
    `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs/inspection-doc-number`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * @name: 查询检验项
 * @param {type}
 * @return:
 */
// export async function getInspectionItem(params) {
//   return request(
//     `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/inspection-groups/query-inspection-item`,
//     {
//       method: 'GET',
//       query: params,
//     }
//   );
// }

/**
 * @name: 制造订单执行表列表
 * @param {type}
 * @return:
 */
export async function moExecutes(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/mo-executes`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @name: 获取标签
 * @param {type}
 * @return:
 */
export async function queryTags(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tags`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @name: 根据任务号获取相关信息
 * @param {type}
 * @return:
 */
export async function queryExecuteLines(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/query`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @name: 获取检验组模板
 * @param {type}
 * @return:
 */
export async function getInspectionTemplate(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/inspection-templates/get-inspection-template`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * @name: 创建
 * @param {type}
 * @return:
 */
export async function createInspect(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs`, {
    method: 'POST',
    body: params,
  });
}

/**
 * @name: 判定
 * @param {type}
 * @return:
 */
export async function Inspect(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs`, {
    method: 'PUT',
    body: params,
  });
}
