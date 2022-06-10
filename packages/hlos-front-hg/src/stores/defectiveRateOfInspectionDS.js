/**
 * @Description: 检验不良率分析报表--tableDS
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
const preCode = 'hg.defectiveRateOfInspection.model';

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
      // 课室和供应商必须有一个查询条件不为空，
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
      name: 'summaryType',
      type: 'string',
      label: intl.get(`${preCode}.dateType`).d('日期维度'),
      lookupCode: 'HG.DATE_TYPE',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.dateFrom`).d('日期从'),
      required: true,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endDate')) {
            return 'endDate';
          }
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.dateTo`).d('日期至'),
      required: true,
      min: 'startDate',
    },
  ],
  fields: [
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.resourceName`).d('课室名称'),
    },
    {
      name: 'partyName',
      label: intl.get(`${preCode}.partyName`).d('供应商名称'),
    },
    {
      name: 'batchQty',
      label: intl.get(`${preCode}.batchQty`).d('检验总数量'),
    },
    {
      name: 'qcNgQty',
      label: intl.get(`${preCode}.qcNgQty`).d('检验不合格数量'),
    },
    {
      name: 'rate',
      label: intl.get(`${preCode}.rate`).d('不合格率'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.dateFrom`).d('日期从'),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.dateTo`).d('日期至'),
    },
  ],
  transport: {
    read: ({ data }) => {
      let _data = {};
      if (data.summaryType !== 'day') {
        _data = {
          ...data,
          endDate: moment(data.endDate).endOf(data.summaryType).format(DEFAULT_DATETIME_FORMAT),
        };
      } else {
        _data = data;
      }
      _data.summaryType = data.summaryType.toUpperCase();
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg/inspection-defect-rate`,
        data: _data,
        method: 'GET',
      };
    },
  },
});

export { ListDS };
