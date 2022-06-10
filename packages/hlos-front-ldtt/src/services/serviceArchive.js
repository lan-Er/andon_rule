/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-13 13:47:59
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-14 17:58:06
 */
import request from 'utils/request';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

// 新增服务归档
export async function addArchives(params) {
  return request(`${HLOS_LETL}/v1/archives`, {
    method: 'POST',
    body: params,
  });
}

// 新增服务归档详情
export async function addArchivesDetail(params) {
  return request(`${HLOS_LETL}/v1/archive-details`, {
    method: 'POST',
    body: params,
  });
}

// 更新服务归档详情
export async function updateArchivesDetail(params) {
  return request(`${HLOS_LETL}/v1/archive-details`, {
    method: 'PUT',
    body: params,
  });
}

// 数据备份
export async function dataBackupSer(params) {
  // console.log(`${HLOS_LETL}/v1/archive-details/backup/${params.archiveDetailId}`);
  return request(`${HLOS_LETL}/v1/archive-details/backup/${params.archiveDetailId}`, {
    method: 'GET',
  });
}

// 数据还原
export async function revertSer(params) {
  // console.log(`${HLOS_LETL}/v1/archive-details/revert/${params.archiveDetailId}`);
  return request(`${HLOS_LETL}/v1/archive-details/revert/${params.archiveDetailId}`, {
    method: 'GET',
  });
}

// 数据清空
export async function cleanupSer(params) {
  // console.log(`${HLOS_LETL}/v1/archive-details/cleanup/${params.archiveDetailId}`);
  return request(`${HLOS_LETL}/v1/archive-details/cleanup/${params.archiveDetailId}`, {
    method: 'GET',
  });
}

// 清空归档数据报文
export async function generatorArchiveDeleteSqlSer(params) {
  return request(
    `${HLOS_LETL}/v1/archive-details/generatorArchiveDeleteSql/${params.archiveDetailId}`,
    {
      method: 'GET',
    }
  );
}
