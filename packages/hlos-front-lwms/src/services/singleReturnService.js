import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 多工单领料提交
 */
export async function getRequestType(params) {
  return request(
    `${HLOS_LMDS}/v1/lovs/sql/data?lovCode=LMDS.DOCUMENT_TYPE&page=0&size=10&documentClass=WM_RETURNED`,
    {
      method: 'GET',
      body: params,
    }
  );
}

/**
 * 查询领料单行
 */
export async function getIssueRequestLine(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines`, {
    method: 'GET',
    query: params,
  });
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

/**
 * 获取待申领数量
 */
export async function getAppliedQty(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-lines/get-applied-qty`, {
    method: 'GET',
    query: params,
  });
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

/**
 * 生产退料领料单保存
 */
export async function prodIssueReturnSave(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/return`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 提交
 */
export async function submitTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/release`, {
    method: 'PUT',
    body: payload,
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
