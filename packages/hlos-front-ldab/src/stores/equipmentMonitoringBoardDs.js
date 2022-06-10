/*
 * @module: 设备监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-20 17:43:42
 * @LastEditTime: 2021-02-04 14:58:44
 * @copyright: Copyright (c) 2020,Hand
 */
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const intlPrefix = 'ldab.equipment';

export default function projectDS() {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.organzation`).d('组织'),
        lovCode: common.singleMeOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.meOuName',
      },
      {
        name: 'meAreaObjs',
        type: 'object',
        label: intl.get(`${intlPrefix}.meArea`).d('车间'),
        lovCode: common.meArea,
        ignore: 'always',
      },
      {
        name: 'meAreaId',
        type: 'string',
        bind: 'meAreaObjs.meAreaId',
      },
      {
        name: 'meAreaName',
        type: 'string',
        bind: 'meAreaObjs.meAreaName',
      },
      {
        name: 'equipmentStatus',
        type: 'string',
        label: intl.get(`${intlPrefix}.equipmentStatus`).d('状态'),
        multiple: true,
      },
      {
        name: 'minutes',
        type: 'string',
        defaultValue: 180,
        required: true,
        step: 0.1,
        max: 2000,
        min: 1,
        label: intl.get(`${intlPrefix}.time`).d('时间'),
      },
    ],
  };
}
