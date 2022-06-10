import moment from 'moment';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { NOW_DATE_START, NOW_DATE_END } from 'hlos-front/lib/utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const intlPrefix = 'ldab.IqcStatisticalReport.model';
const { common, PqcIqcFqcConfig } = codeConfig.code;

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs/qc-qualification-rate-statistics-report-table`;

// 顶部查询DS
export const QueryDS = () => ({
  fields: [
    {
      name: 'reportType',
      type: 'string',
      defaultValue: 'IQC',
    },
    {
      name: 'summaryDataType',
      type: 'string',
      multiple: true,
      border: 'none',
      defaultValue: ['ITEM', 'SUPPLIER'],
      lookupCode: PqcIqcFqcConfig.IQCStatisticaldimension,
      required: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: common.singleMeOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: PqcIqcFqcConfig.purchaseItem,
      multiple: true,
    },
    {
      name: 'customerObj',
      type: 'object',
      lovCode: PqcIqcFqcConfig.supplier,
      multiple: true,
    },
    {
      name: 'rateFrom',
      type: 'number',
      max: 'rateTo',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
    {
      name: 'rateTo',
      type: 'number',
      min: 'rateFrom',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
  ],
});

// 下方表格DS
export const TableDS = () => ({
  selection: false,
  transport: {
    read: ({ data }) => {
      const { summaryDataType, itemId, partyId } = data;
      return {
        url: generateUrlWithGetParam(url, {
          summaryDataType,
        }),
        data: {
          ...data,
          summaryDataType: undefined,
          itemId: undefined,
          partyId: undefined,
          itemIds: itemId && itemId.join(),
          partyIds: partyId && partyId.join(),
          inspectionDocType: 'IQC',
        },
        method: 'GET',
      };
    },
  },
  fields: [
    {
      label: intl.get(`${intlPrefix}.item`).d('物料'),
      name: 'itemCode',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.description`).d('物料描述'),
      name: 'itemName',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.partyName`).d('供应商'),
      name: 'partyName',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
      name: 'uomName',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.batchQty`).d('检验数量'),
      name: 'batchQty',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.qcOkQty`).d('合格数量'),
      name: 'qcOkQty',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.qcNgQty`).d('不合格数量'),
      name: 'qcNgQty',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.concessionQty`).d('让步接受'),
      name: 'concessionQty',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.returnedQty`).d('退回数量'),
      name: 'returnedQty',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.rate`).d('合格率'),
      name: 'rate',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.time`).d('时间'),
      name: 'dayWeekMonth',
      type: 'string',
    },
  ],
});

// 时间范围DS
export const TimeDS = () => ({
  fields: [
    {
      name: 'time',
      type: 'date',
      range: ['start', 'end'],
      defaultValue: { start: NOW_DATE_START, end: NOW_DATE_END },
      validator: (value) => {
        if (value && value.end > moment(value.start).add(365, 'days')) {
          return intl
            .get(`${intlPrefix}.view.message.timeLimit`)
            .d('起始结束日期跨度不可超过365天');
        }
        return true;
      },
      required: true,
    },
  ],
});
