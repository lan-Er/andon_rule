//TPM任务 api

import request from 'utils/request';
import axios from 'axios';
import { HLOS_LMES, HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organzationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organzationId}/tasks`;

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
 * 任务报工提交
 */
export async function submitTaskOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/run-submit-task`, {
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
 * * 获取任务号
 */
export async function queryTaskNum(params) {
  return request(`${HLOS_LWMSS}/v1/${organzationId}/sen-yu/lwms-tags/query/taskNum`, {
    method: 'GET',
    query: params,
  });
}

/**
 * * 退单
 */
export async function retreatTaskOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/mo-inventory-return`, {
    method: 'POST',
    body: params,
  });
}

/**
 * * 任务报工退回
 */
export async function returnTaskOutput(params) {
  return request(`${HLOS_LMES}/v1/${organzationId}/execute-lines/return-task-out-put`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 串口请求
 */
export async function openPort() {
  //  const url = 'http://localhost:8733/serial/port/api/open-port';
  //  const url = 'http://127.0.0.1:8733/serial/port/api/open-port';
  //  const url = 'https://zoneda.onestep-cloud.com/oauth/token/code';
  const url = 'http://localhost:8000/serial/port/api/open-port';
  const config = {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.26.8',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
  };
  // const params = {
  //   PortName: 'COM3',
  //   StopBits: 1,
  //   Parity: 0,
  //   DataBits: 8,
  //   BaudRate: 9600,
  //   DataType: 0,
  // };
  const params = {
    PortName: 'COM3',
    StopBits: 1,
    Parity: 0,
    DataBits: 8,
    BaudRate: 9600,
    DataType: 0,
  };
  return axios.post(url, params, config);
}

/**
 * 串口请求
 */
export async function getPortWeight() {
  const config = {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      //  "User-Agent": 'PostmanRuntime/7.26.8',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
  };
  return axios.get('http://localhost:8733/serial/port/api/get-weight/COM3', config);
}
