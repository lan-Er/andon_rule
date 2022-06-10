/**
 * @Description: 月度不良统计分析报表--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-20 09:44:00
 * @LastEditors: yu.na
 */
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.monthlyBadStatisticsAnalysis.model';

const ListDS = () => ({
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: 'LMDS.PRODLINE',
      label: intl.get(`${preCode}.prodLine`).d('课室'),
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: 'LMDS.SUPPLIER',
      ignore: 'always',
    },
    {
      name: 'partyId',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'partyName',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'dateType',
      type: 'string',
      label: intl.get(`${preCode}.dateType`).d('日期维度'),
      lookupCode: 'HG.DATE_TYPE',
      defaultValue: 'month',
      required: true,
    },
    {
      name: 'judgedDateStart',
      type: 'date',
      label: intl.get(`${preCode}.dateFrom`).d('日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('judgedDateEnd')) {
            return 'judgedDateEnd';
          }
        },
      },
    },
    {
      name: 'judgedDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.dateTo`).d('日期至'),
      required: true,
      min: 'judgedDateStart',
    },
  ],
  fields: [
    {
      name: 'judgedDateStart',
      type: 'date',
      label: intl.get(`${preCode}.dateFrom`).d('日期从'),
    },
    {
      name: 'judgedDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.dateTo`).d('日期至'),
    },
    {
      name: 'exceptionName',
      label: intl.get(`${preCode}.exceptionName`).d('不良原因'),
    },
    {
      name: 'exceptionQty',
      label: intl.get(`${preCode}.exceptionQty`).d('不良数量'),
    },
    {
      name: 'totalQty',
      label: intl.get(`${preCode}.totalQty`).d('累计数量'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('累计百分比'),
    },
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.resourceName`).d('课室名称'),
    },
    {
      name: 'partyName',
      label: intl.get(`${preCode}.partyName`).d('供应商名称'),
    },
  ],
  transport: {
    read: ({ data }) => {
      let _data = {};
      _data = {
        ...data,
        judgedDateEnd: moment(data.judgedDateEnd)
          .endOf(data.dateType)
          .format(DEFAULT_DATETIME_FORMAT),
      };
      _data.dateType = data.dateType.toUpperCase();
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg/monthly-defect-analysis`,
        data: _data,
        method: 'GET',
      };
    },
  },
});

export { ListDS };
