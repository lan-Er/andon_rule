/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-10-16 19:44:22
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-01 10:52:53
 */
import request from 'utils/request';
import {
  getCurrentUser,
  parseParameters, // 将传过来的对象 准换为后台接受的格式
} from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

const { loginName } = getCurrentUser();

/**
 * 获取排产资源
 */
export async function getResourcePlanListApi(params = {}) {
  const query = parseParameters(params);
  return request(`${HLOS_LISP}/v1/datas/resource-plan`, {
    method: 'GET',
    query: {
      ...query,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'SCHEDULED_RESOURCE',
      user: loginName,
      attribute39: '',
      attribute8: 1,
    },
  });
}

/**
 * 获取task列表 - 1.1.4 获取排产工单列表
 */
export async function getTaskListApi(params = {}) {
  const query = parseParameters(params);
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'GET',
    query: {
      ...query,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'MAKE_ORDER',
      user: loginName,
      attribute39: '',
      attribute7: '新建',
      attribute43: 0,
    },
  });
}

/**
 * task 拖动
 */
export async function dragBackApi(params) {
  return request(`${HLOS_LISP}/v1/datas/update-pre-schedule-sequence`, {
    method: 'PUT',
    body: {
      ...params,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'MAKE_ORDER',
      user: loginName,
    },
  });
}

/**
 * 下达
 */
export async function assignTaskApi(params) {
  console.log(params);
  return request(`${HLOS_LISP}/v1/datas/update-scheduled-execute`, {
    method: 'PUT',
    body: params,
  });
}
