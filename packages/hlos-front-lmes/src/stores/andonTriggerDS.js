/*
 * @Descripttion: 安灯触发DS
 * @Author: yu.na@hand-china.com
 * @Date: 2020-11-11 17:40:22
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonCode = 'lmes.common.model';
const { common } = codeConfig.code;

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/andons/triggered-pc`;

export const QueryDS = () => {
  return {
    autoCreate: true,
    queryFields: [
      {
        name: 'organizationId',
      },
      {
        name: 'resourceObj',
        type: 'object',
        noCache: true,
        label: intl.get(`${commonCode}.resource`).d('资源'),
        lovCode: common.resource,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            lovType: 'andon',
          }),
        },
        ignore: 'always',
      },
      {
        name: 'resourceId',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceClass',
        bind: 'resourceObj.resourceClass',
      },
      {
        name: 'resourceName',
        bind: 'resourceObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        ignore: 'always',
        // required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
        ignore: 'always',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'organizationId',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'moId',
        bind: 'moNumObj.moId',
      },
      {
        name: 'moNum',
        bind: 'moNumObj.moNum',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        noCache: true,
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        // ignore: 'always',
      },
      {
        name: 'equipmentId',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentName',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'resourceName',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'itemDescription',
      },
      {
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${commonCode}.uom`).d('单位'),
        lovCode: common.uom,
        ignore: 'always',
      },
      {
        name: 'uomId',
        bind: 'uomObj.uomId',
      },
      {
        name: 'uom',
        // bind: 'uomObj.uomCode',
      },
      {
        name: 'uomName',
        bind: 'uomObj.uomName',
        ignore: 'always',
      },
      {
        name: 'pressedTimes',
      },
      {
        name: 'exceptionGroupObj',
        type: 'object',
        noCache: true,
        label: intl.get(`${commonCode}.exceptionGroup`).d('异常组'),
        lovCode: common.exceptionGroup,
        ignore: 'always',
      },
      {
        name: 'exceptionGroupId',
        bind: 'exceptionGroupObj.exceptionGroupId',
      },
      {
        name: 'exceptionGroupCode',
        bind: 'exceptionGroupObj.exceptionGroupCode',
      },
      {
        name: 'exceptionGroupName',
        bind: 'exceptionGroupObj.exceptionGroupName',
        ignore: 'always',
      },
      {
        name: 'exceptionObj',
        type: 'object',
        noCache: true,
        label: intl.get(`${commonCode}.exception`).d('异常'),
        lovCode: common.exception,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            exceptionGroupId: record.get('exceptionGroupId'),
          }),
        },
      },
      {
        name: 'exceptionId',
        bind: 'exceptionObj.exceptionId',
      },
      {
        name: 'exceptionCode',
        bind: 'exceptionObj.exceptionCode',
      },
      {
        name: 'exceptionName',
        bind: 'exceptionObj.exceptionName',
        ignore: 'always',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注信息'),
      },
      {
        name: 'quantity',
        type: 'number',
        label: intl.get(`${commonCode}.quantity`).d('数量'),
        min: 0,
      },
    ],
    transport: {
      read: () => ({
        url,
        method: 'GET',
      }),
    },
  };
};
