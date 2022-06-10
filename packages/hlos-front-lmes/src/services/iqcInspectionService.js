/*
 * iqc报检
 * date: 2020-07-15
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/inspection-templates/get-inspection-template`;

/**
 * 获取检验项目组
 */
export async function getInspectionGroup(params) {
  return request(url, {
    method: 'POST',
    body: params,
  });
}

/**
 * 判断物料控制类型
 */
export async function checkControlType(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}
