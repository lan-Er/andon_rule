/**
 * @Description: 设备工时统计报表--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-10 09:52:33
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.equipmentUtilizationReport.model';

const ListDS = () => ({
  pageSize: 10,
  selection: false,
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
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('加工日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endDate')) {
            return 'endDate';
          }
        },
      },
      transformRequest: (val) => (val ? moment(val).format(`${DEFAULT_DATE_FORMAT} 08:00:00`) : ''),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('加工日期至'),
      required: true,
      min: 'startDate',
      transformRequest: (val) =>
        val ? moment(val).add(1, 'days').format(`${DEFAULT_DATE_FORMAT} 07:59:59`) : '',
    },
  ],
  fields: [
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.prodLineName`).d('课室名称'),
    },
    {
      name: 'equipmentCode',
      label: intl.get(`${preCode}.equipmentCode`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${preCode}.equipmentName`).d('设备名称'),
    },
    {
      name: 'workDate',
      type: 'date',
      label: intl.get(`${preCode}.date`).d('日期'),
    },
    {
      name: 'eveningWorkTime',
      label: intl.get(`${preCode}.eveningWorkTime`).d('晚班工时'),
    },
    {
      name: 'morningWorkTime',
      label: intl.get(`${preCode}.morningWorkTime`).d('早班工时'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LMES}/v1/${organizationId}/work-times/hg/equipment-work-time`,
      method: 'GET',
    }),
  },
});

export { ListDS };
