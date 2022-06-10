import { getCurrentOrganizationId, getCurrentUserId } from 'utils/utils';
import request from 'utils/request';
import {
  HLOS_LMDS,
  HLOS_LMESS,
  HLOS_LMES,
  HLOS_LWMS,
  HLOS_LMDSS,
} from 'hlos-front/lib/utils/config';

/**
 * 查询当前用户默认信息
 * @param {*} queryParams defaultFlag=Y&queryCodeFlag=Y&userId=127
 * @returns
 */
export async function getUserSettings() {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/user-settings`, {
    method: 'GET',
    query: {
      defaultFlag: 'Y',
      queryCodeFlag: 'Y',
      userId: getCurrentUserId(),
    },
  });
}

/**
 * 员工编号
 * @param {*} queryParams workerCode=BK001
 * @returns
 */
export async function searchWorkerCode(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/worker-code`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 工单编码
 * @param {*} queryParams moNum=MO202012010001
 * @returns
 */
export async function getMoNum(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/mo-num`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 工位
 * @param {*} queryParams workcellCode=GZDY01
 * @returns
 */
export async function searchWorkcellCode(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/workcell-code`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 工序
 * @param {*} queryParams operationCode=1-1
 * @returns
 */
export async function searchOperationCode(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/operation-code`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 工序级任务
 * @param {*} queryParams moNum=MO202105060001 moQueryFlag=Y operationId=175243237070712832 organizationId=121571959929114624 taskTypeCode=OPERATION_TASK
 * @returns
 */
export async function taskItems(queryParams) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/task-items`, {
    method: 'GET',
    query: queryParams,
  });
}

// taskId=168301113167757312
/**
 * 查询是否显示 投料码
 * @param {*} queryParams
 * @returns
 */
export async function validDisplayFeeding(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/valid-display-feeding`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 获取工艺文件
 * @param {*} queryParams
 * @returns
 */
export async function getLatestEsop(queryParams) {
  return request(
    `${HLOS_LMDSS}/v1/${getCurrentOrganizationId()}/jcdq-esop-versions/getLatestEsop`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 注册
 * @param {*} queryParams
 * @returns
 */
export async function registerWip(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/register-wip`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 出站
 * @param {*} queryParams
 * @returns
 */
export async function moveOutWip(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/move-out-wip`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 标签展开
 * @param {*} queryParams
 * @returns
 */
export async function expandTag(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/expand-tag`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 新的投料码接口
 * @param {*} queryParams
 * @returns
 */
export async function issueTask(queryParams) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/tasks/issue-task`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 新的标签展开
 * @param {*} queryParams
 * @returns
 */
export async function expandTagNew(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/expand-tag`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 待报检标签信息
 * @param {*} params  moId
 * @param {*} params  operationId
 * @param {*} params  executeType
 * @returns []
 */
export async function getExecuteLot(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lots/get-execute-lot`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 任务报检
 */
export async function createTaskQcDoc(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/create-task-qc-doc`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询
 * @param {*} params
 * @returns
 */
export async function taskQty(params) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/task-qty`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 查询
 * @param {*} params
 * @returns
 */
export async function barcodeQty(params) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-single-piece-flows/barcode-qty`,
    {
      method: 'GET',
      query: params,
    }
  );
}
