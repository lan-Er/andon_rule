/**
 * @Description: 设备稼动率报表--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-10 09:52:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.equipmentUtilizationReport.model';

const ListDS = () => ({
  pageSize: 10,
  selection: 'multiple',
  queryFields: [
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: 'LMDS.EQUIPMENT',
      required: true,
      ignore: 'always',
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
      name: 'efficiencyFrom',
      type: 'number',
      label: intl.get(`${preCode}.efficiencyFrom`).d('单品效率从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('efficiencyTo')) {
            return 'efficiencyTo';
          }
        },
      },
    },
    {
      name: 'efficiencyTo',
      type: 'number',
      label: intl.get(`${preCode}.efficiencyTo`).d('单品效率至'),
      required: true,
      min: 'efficiencyFrom',
    },
    {
      name: 'workDateStart',
      type: 'date',
      label: intl.get(`${preCode}.workDateStart`).d('加工日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('workDateEnd')) {
            return 'workDateEnd';
          }
        },
      },
    },
    {
      name: 'workDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.workDateEnd`).d('加工日期至'),
      required: true,
      min: 'workDateStart',
    },
  ],
  fields: [
    {
      name: 'equipmentCode',
      label: intl.get(`${preCode}.equipmentCode`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${preCode}.equipmentName`).d('设备名称'),
    },
    {
      name: 'calendarShift',
      label: intl.get(`${preCode}.calendarShift`).d('班次'),
    },
    {
      name: 'taskNum',
      label: intl.get(`${preCode}.taskNum`).d('任务编码'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'itemCode',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'description',
      label: intl.get(`${preCode}.itemDesc`).d('物料名称'),
    },
    {
      name: 'taskQty',
      label: intl.get(`${preCode}.taskQty`).d('数量'),
    },
    {
      name: 'standardWorkTime',
      label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
    },
    {
      name: 'startTime',
      label: intl.get(`${preCode}.startTime`).d('开始加工时间'),
    },
    {
      name: 'endTime',
      label: intl.get(`${preCode}.endTime`).d('结束加工时间'),
    },
    {
      name: 'workTime',
      label: intl.get(`${preCode}.workTime`).d('设备工时'),
    },
    {
      name: 'equipmentRate',
      label: intl.get(`${preCode}.equipmentRate`).d('设备稼动率'),
    },
    {
      name: 'standardRate',
      label: intl.get(`${preCode}.standardRate`).d('标准稼动率'),
    },
    {
      name: 'efficiency',
      label: intl.get(`${preCode}.efficiency`).d('单品效率'),
    },
    {
      name: 'worker',
      label: intl.get(`${preCode}.worker`).d('加工担当'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/tasks/hg-dynamic-rate`,
      method: 'GET',
    }),
    submit: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/work-times/batch-update-remark`,
      method: 'POST',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

export { ListDS };
