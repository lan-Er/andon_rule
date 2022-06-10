import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
/**
 * 查询领料单头
 */
export async function queryHeadApi(params) {
  return request(
    `${HLOS_LWMS}/v1/${organizationId}/request-headers/issue`,
    // generateUrlWithGetParam(`${HLOS_LWMS}/v1/${organizationId}/request-headers/issue`, {
    //   requestStatusList: params.requestStatus,
    // }),
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 查询领料单行
 */
export async function queryLineApi(params) {
  return request(
    `${HLOS_LWMS}/v1/${organizationId}/request-lines`,
    // generateUrlWithGetParam(`${HLOS_LWMS}/v1/${organizationId}/request-headers/issue`, {
    //   requestStatusList: params.requestStatus,
    // }),
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 提交领料单
 * @param {*} queryParams 参数
 */
export async function releaseApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/release`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 取消领料单
 * @param {*} queryParams 参数
 */
export async function cancelApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/cancel`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 关闭领料单
 * @param {*} queryParams 参数
 */
export async function closeApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/close`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 删除领料单
 * @param {*} queryParams 参数
 */
export async function deleteApi(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/delete`, {
    method: 'DELETE',
    body: queryParams,
  });
}
/**
 * 执行领料单
 * @param {*} queryParams 参数
 */
// /v1/{tenantId}/request-headers/execute-by-request
export async function executeApi(queryParams) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/execute-by-request`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 判断物料控制类型
 */
export async function checkControlType(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/item-wms/get-item-control-type-batch`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 获取可用量
 */
export async function getAvailableQty(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-available-qty`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 获取现有量
 */
export async function getOnhandQty(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-onhand-qty`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取现有量和可用量
 */
export async function getOnhandAndAvailableQty(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-onhand-available-qty`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 根据Mo获取Mo组件行
 */
export async function requestMoComponent(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-mo-components`, {
    method: 'GET',
    query: params,
  });
}

// 委外行查询
export async function getLineInfo(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-lines/get-line-info`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 根据Mo获取Mo组件行
 */
export async function queryMoComponent(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/mo-components`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 多工单领料查询
 */
export async function mulMoQuerySer(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/mo-components/multi-mo-pick`, {
    method: 'POST',
    body: params[0],
  });
}

/**
 * 生产非限额领料单保存
 */
export async function PrdNotLimitSave(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/issue`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 多工单领料保存
 */
export async function mulMoSaveSer(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/issue-batch`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 成本中心领料单
 */
export async function costCenterAdd(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/issue`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 多工单领料提交
 */
export async function mulMoSubmitSer(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/multiple-issue-batch`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 多工单领料提交
 */
export async function getRequestTypeSer(params) {
  return request(
    `${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.DOCUMENT_TYPE&page=0&size=10&documentClass=WM_REQUEST`,
    {
      method: 'GET',
      body: params,
    }
  );
}
/**
 * 物料规则API mds服务 /v1/{tenantId}/item-wms/get-item-wm-Rule;
 */

export async function getItemWmRule(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/item-wms/get-item-wm-rule`, {
    method: 'POST',
    body: params,
  });
}
