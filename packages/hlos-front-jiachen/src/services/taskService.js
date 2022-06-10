/**
 * @Description: TPM任务 api
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 14:08:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LMES, HLOS_LMDS, HLOS_LWMS, HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organzationId}/tasks`;

/**
 * 非生产任务批量新增
 */
export async function npTaskSubmit(params) {
  return request(`${commonUrl}/batch-create-np-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 下达
 */
export async function releaseTask(params) {
  return request(`${commonUrl}/release-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 运行
 */
export async function runTask(params) {
  return request(`${commonUrl}/run-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 暂停
 */
export async function pauseTask(params) {
  return request(`${commonUrl}/pause-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 复原
 */
export async function unholdTask(params) {
  return request(`${commonUrl}/un-hold-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 暂挂
 */
export async function holdTask(params) {
  return request(`${commonUrl}/hold-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 取消
 */
export async function cancelTask(params) {
  return request(`${commonUrl}/cancel-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 关闭
 */
export async function closeTask(params) {
  return request(`${commonUrl}/close-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取默认工厂
 */
export async function queryDefaultMeOu(params) {
  return request(`${HLOS_LMDS}/v1/${organzationId}/me-ous/lovs/data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取Mo工序
 */
export async function queryMoOperation(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/mo-operations`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取报表
 */
export async function queryReportData(reportCode) {
  return request(`/hrpt/v1/${organzationId}/reports?reportCode=${reportCode}`, {
    method: 'GET',
  });
}

/**
 * 获取Mo
 */
export async function queryMo(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/mos`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 任务报工提交
 */
export async function submitTaskOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/run-submit-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 副产品报功
 */
export async function submitTaskByProduct(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/by-product`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 订单报工提交
 */
export async function submitMoOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/submit-mo-output`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 判断物料控制类型
 */
export async function checkControlType(params) {
  return request(`${HLOS_LMDS}/v1/${organzationId}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 创建检验单
 */
export async function handleInspectionDocs(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/inspection-docs`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取任务信息
 */
export async function queryTask(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/get-task`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 投料页面查询
 */
export async function queryFeeding(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/query-feeding`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 投料页面(批次/标签)查询
 */
export async function queryFeedingMixture(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/query-feeding-mixture`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 投料页面 - 投料物料
 */
export async function queryIssueItem(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/task-items/issue-item`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取操作工对应班组
 */
export async function queryWorkerGroup(params) {
  return request(`${HLOS_LMDS}/v1/${organzationId}/workers/worker-group`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 投料页面 - 获取物料关联批次
 */
export async function itemLotNumber(params) {
  return request(`${HLOS_LWMS}/v1/${organzationId}/lots/item-lot-number`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 投料页面 - 获取物料关联标签
 */
export async function itemTagThing(params) {
  return request(`${HLOS_LWMS}/v1/${organzationId}/tag-things/item-tag-thing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * Task发料
 */
export async function issueTasks(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/issue-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * task调整
 */
export async function adjustTask(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/adjust-task-rank`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取生产批次号
 */
export async function getMakeLotNumber(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/getMakeLotNumber`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询任务物料
 */
export async function queryReturnTaskItem(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/task-items/queryReturnTaskItem`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询任务物料详情-退料详情页面 /v1/{organizationId}/task-items/queryReturnTaskItemDetail
 */
export async function queryReturnTaskItemDetail(params) {
  return request(
    `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/task-items/queryReturnTaskItemDetail`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 查询任务物料详情-退料详情页面 /v1/{organizationId}/task-items/query-return-task-item-detail-v2
 */
export async function queryReturnTaskItemDetailV2(params) {
  return request(
    `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/task-items/query-return-task-item-detail-v2`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 任务退料
 */
export async function returnTaskInput(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/tasks/returnTaskInput`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 任务退料(批量)
 */
export async function returnTaskInputBatch(params) {
  return request(`${HLOS_LMES}/v1/${getCurrentOrganizationId()}/tasks/return-task-input-batch`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 任务报工退回
 */
export async function returnTask(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/return-task-out-put`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * * 修改工时
 */
export async function updateTaskProcessedTime(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/update-task-processed-time`, {
    method: 'PUT',
    body: params,
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
 * * 获取任务物料
 */
export async function queryTaskItem(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/task-items`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 获取实物标签
 */
export async function queryTagThing(params) {
  return request(`${HLOS_LWMS}/v1/${organzationId}/tag-things/getTagThing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 获取实物标签
 */
export async function queryItemTagThing(params) {
  return request(`${HLOS_LWMS}/v1/${organzationId}/tag-things/item-tag-thing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 获取最新图纸
 */
export async function getLastestDrawing(params) {
  return request(`${HLOS_LMDS}/v1/${organzationId}/drawing-versions/getLatestDrawing`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 获取最新ESOP
 */
export async function getLastestEsop(params) {
  return request(`${HLOS_LMDS}/v1/${organzationId}/esop-versions/getLatestEsop`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 获取处理数量
 */
export async function getReworkProcessedQty(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/get-rework-processed-qty`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 快速创建返修任务
 */
export async function createReworkTaskEasy(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/create-rework-task-easy`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 创建返修任务
 */
export async function createReworkTask(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/tasks/create-rework-task`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 创建返修任务
 */
export async function getMoOperation(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/mo-operations`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 获取任务物料值集
 */
export async function queryItemData(params) {
  return request(`${HLOS_LMES}/v1/lovs/sql/data`, {
    method: 'GET',
    query: params,
  });
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
