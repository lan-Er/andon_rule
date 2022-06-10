import moment from 'moment';
import { NOW_DATE_START, NOW_DATE_END } from 'hlos-front/lib/utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';

import codeConfig from '@/common/codeConfig';

const { common, PqcIqcFqcConfig } = codeConfig.code;

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs/qc-qualification-rate-statistics-report-table`;

// 顶部查询DS
export const QueryDS = () => ({
  fields: [
    {
      name: 'reportType',
      type: 'string',
      defaultValue: 'PQC',
    },
    {
      name: 'summaryDataType',
      type: 'string',
      multiple: true,
      defaultValue: ['ITEM', 'OPERATION'],
      lookupCode: PqcIqcFqcConfig.PQCStatisticaldimension,
      required: true,
    },
    {
      // 组织
      name: 'organizationObj',
      type: 'object',
      lovCode: common.singleMeOu,
      required: true,
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
      // 物料
      name: 'itemObj',
      type: 'object',
      lovCode: PqcIqcFqcConfig.itemMe,
      multiple: true,
    },
    {
      // 工序
      name: 'operationObj',
      type: 'object',
      lovCode: PqcIqcFqcConfig.operation,
      multiple: true,
    },
    {
      // 物料类别
      name: 'categoryObj',
      type: 'object',
      lovCode: PqcIqcFqcConfig.category,
      lovPara: { categorySet: 'ITEM_ME' },
    },
    {
      // 检验类型
      name: 'templateType',
      type: 'string',
      lookupCode: PqcIqcFqcConfig.templateType,
    },
    {
      // 合格率从
      name: 'rateFrom',
      type: 'number',
      max: 'rateTo',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
    {
      // 合格率至
      name: 'rateTo',
      type: 'number',
      min: 'rateFrom',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
    {
      // 一次合格率从
      name: 'firstRateFrom',
      type: 'number',
      max: 'firstRateTo',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
    {
      // 一次合格率至
      name: 'firstRateTo',
      type: 'number',
      min: 'firstRateFrom',
      validator: (value) => {
        if (value < 0) return '输入值必须为非负数';
      },
    },
  ],
});

// 底部表格DS
export const TableDS = () => ({
  selection: false,
  transport: {
    read: ({ data }) => {
      const { summaryDataType, itemId, operationId } = data;
      return {
        url: generateUrlWithGetParam(url, {
          summaryDataType,
        }),
        data: {
          ...data,
          summaryDataType: undefined,
          itemId: undefined,
          operationId: undefined,
          itemIds: itemId && itemId.join(),
          operationIds: operationId && operationId.join(),
          inspectionDocType: 'PQC',
        },
        method: 'GET',
      };
    },
  },
  fields: [
    {
      label: '物料',
      name: 'itemCode',
      type: 'string',
    },
    {
      label: '物料描述',
      name: 'itemName',
      type: 'string',
    },
    {
      label: '工序',
      name: 'operationName',
      type: 'string',
    },
    {
      label: '物料类型',
      name: 'itemTypeMeaning',
      type: 'string',
    },
    {
      label: '物料类别',
      name: 'categoryName',
      type: 'string',
    },
    {
      label: '单位',
      name: 'uomName',
      type: 'string',
    },
    {
      label: '检验数量',
      name: 'batchQty',
      type: 'string',
    },
    {
      label: '合格数量',
      name: 'qcOkQty',
      type: 'string',
    },
    {
      label: '不合格数量',
      name: 'qcNgQty',
      type: 'string',
    },
    {
      label: '让步接受',
      name: 'concessionQty',
      type: 'string',
    },
    {
      label: '返修数量',
      name: 'reworkQty',
      type: 'string',
    },
    {
      label: '报废数量',
      name: 'scrappedQty',
      type: 'string',
    },
    {
      label: '合格率',
      name: 'rate',
      type: 'number',
    },
    {
      label: '一次合格率',
      name: 'firstRate',
      type: 'number',
    },
    {
      label: '时间',
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
          return `起始结束日期跨度不可超过365天`;
        }
        return true;
      },
      required: true,
    },
  ],
});
