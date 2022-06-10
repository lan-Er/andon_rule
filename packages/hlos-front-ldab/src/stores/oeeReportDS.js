/*
 * @Description:设备稼动率报表
 * @Author: yu.na@hand-china.com
 * @Date: 2021-03-22 15:44:22
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, ldabOeeReport } = codeConfig.code;
const preCode = 'ldab.oeeReport.model';

export const ListDS = () => ({
  selection: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('组织'),
      lovCode: common.singleMeOu,
      ignore: 'always',
      required: true,
      noCache: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'calendarMonth',
      type: 'month',
      label: intl.get(`${preCode}.org`).d('选择月份'),
      required: true,
      defaultValue: new Date(),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      noCache: true,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      noCache: true,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'calendarShiftCode',
      type: 'string',
      label: intl.get(`${preCode}.shift`).d('班次'),
      lookupCode: ldabOeeReport.shift,
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('组织'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${preCode}.equipment`).d('设备'),
    },
    {
      name: 'calendarShiftCodeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.shift`).d('班次'),
    },
    {
      name: 'workTime',
      type: 'number',
      label: intl.get(`${preCode}.workTime`).d('机床加工时间'),
    },
    {
      name: 'targetOee',
      type: 'string',
      label: intl.get(`${preCode}.targetOee`).d('标准稼动率'),
    },
  ],
});

export const LineDS = () => ({
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('组织'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${preCode}.equipment`).d('设备'),
    },
    {
      name: 'productName',
      type: 'string',
      label: intl.get(`${preCode}.product`).d('加工零件'),
    },
    {
      name: 'taskQty',
      type: 'number',
      label: intl.get(`${preCode}.taskQty`).d('加工数量'),
    },
    {
      name: 'standardTime',
      type: 'number',
      label: intl.get(`${preCode}.standardTime`).d('标准工时'),
    },
    {
      name: 'actualStartTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.actualStartTime`).d('开始时间'),
    },
    {
      name: 'actuaLEndTime',
      type: 'dateTime',
      label: intl.get(`${preCode}.actuaLEndTime`).d('结束时间'),
    },
    {
      name: 'completeStatus',
      type: 'string',
      label: intl.get(`${preCode}.completeStatus`).d('完成状态'),
    },
    {
      name: 'processedTime',
      type: 'number',
      label: intl.get(`${preCode}.processedTime`).d('加工时间'),
    },
    {
      name: 'singleRate',
      type: 'string',
      label: intl.get(`${preCode}.singleRate`).d('单品效率'),
    },
    {
      name: 'workerName',
      type: 'string',
      label: intl.get(`${preCode}.worker`).d('员工'),
    },
  ],
});
