/**
 * @Description: 加工完成率报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-06 15:38:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
// import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.completionRateReport.model';

const ListDS = () => ({
  pageSize: 10,
  selection: 'multiple',
  queryFields: [
    {
      name: 'organizationId',
      defaultValue: -1,
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLineCode`).d('课室编码'),
      lovCode: 'LMDS.PRODLINE',
      textField: 'prodLineCode',
      required: true,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'periodDay',
      type: 'number',
      label: intl.get(`${preCode}.periodDay`).d('间隔天数'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'demandDateStart',
      type: 'date',
      label: intl.get(`${preCode}.demandDateStart`).d('需求日期从'),
      required: true,
      validator: (value, name, record) => {
        if (
          record.get('demandDateEnd') &&
          value < moment(record.get('demandDateEnd')).add(-30, 'days')
        ) {
          return '需求日期间隔不能超过30天';
        }
        return true;
      },
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('demandDateEnd')) {
            return 'demandDateEnd';
          }
        },
      },
      defaultValue: moment(new Date()).add(-14, 'days'),
      // transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'demandDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.demandDateEnd`).d('需求日期至'),
      required: true,
      min: 'demandDateStart',
      validator: (value, name, record) => {
        if (
          record.get('demandDateStart') &&
          value > moment(record.get('demandDateStart')).add(30, 'days')
        ) {
          return '需求日期间隔不能超过30天';
        }
        return true;
      },
      defaultValue: moment(new Date()).add(7, 'days'),
      // transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'prodLineCode',
      label: intl.get(`${preCode}.prodLineCode`).d('课室编码'),
    },
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.resourceName`).d('课室名称'),
    },
    {
      name: 'qty',
      label: intl.get(`${preCode}.qty`).d('安排数量'),
    },
    {
      name: 'completedQty',
      label: intl.get(`${preCode}.completedQty`).d('完成数量'),
    },
    {
      name: 'incompletedQty',
      label: intl.get(`${preCode}.inCompletedQty`).d('未完成数量'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('完成率'),
    },
    {
      name: 'demandDateStart',
      type: 'date',
      label: intl.get(`${preCode}.demandDateStart`).d('需求日期从'),
    },
    {
      name: 'demandDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.demandDateEnd`).d('需求日期至'),
    },
  ],
  transport: {
    read: ({ data }) => {
      let queryUrl = `${HLOS_LMES}/v1/${organizationId}/tasks/hg-task-completion-rate-report`;
      let queryParams = data;
      if (Array.isArray(data.prodLineId)) {
        queryUrl = generateUrlWithGetParam(
          `${HLOS_LMES}/v1/${organizationId}/tasks/hg-task-completion-rate-report`,
          {
            prodLineIdArray: data.prodLineId,
          }
        );
        queryParams = {
          ...data,
          prodLineId: undefined,
          prodLineCode: undefined,
          prodLineName: undefined,
        };
      }
      return {
        url: queryUrl,
        data: queryParams,
        method: 'GET',
      };
    },
  },
});

export { ListDS };
