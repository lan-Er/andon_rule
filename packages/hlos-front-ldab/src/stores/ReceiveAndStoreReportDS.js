import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { NOW_DATE_START, NOW_DATE_END } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'ldab.ReceiveAndStoreReport.model';
const { common, ReceiveAndStoreReportConfig } = codeConfig.code;

const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-journals/stock-report`;

// 顶部查询DS
export const QueryDS = () => ({
  fields: [
    {
      name: 'reportType',
      type: 'string',
      defaultValue: 'IQC',
    },
    // 组织
    {
      label: '组织',
      name: 'organizationObj',
      type: 'object',
      lovCode: common.organization,
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'time',
      type: 'date',
      label: '起止日期',
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
    },
    // 仓库范围
    {
      label: '仓库范围',
      name: 'warehouseJournal',
      type: 'object',
      lovCode: ReceiveAndStoreReportConfig.warehouseJournal,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    // 物料
    {
      label: '物料',
      name: 'itemObj',
      type: 'object',
      ignore: 'always',
      lovCode: ReceiveAndStoreReportConfig.itemWm,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    // 物料类型
    {
      label: '物料类型',
      name: 'itemType',
      type: 'string',
      lookupCode: ReceiveAndStoreReportConfig.itemType,
    },
    // 物料类别
    {
      label: '物料类别',
      name: 'itemCategory',
      type: 'object',
      lovCode: common.categories,
      lovPara: {
        categorySetCode: 'ITEM_WM',
      },
    },
  ],
});

// 底部表格DS
export const TableDS = () => ({
  selection: false,
  transport: {
    read: ({ data }) => {
      const { warehouseId } = data;
      return {
        url: generateUrlWithGetParam(url, {
          warehouseId,
        }),
        data: {
          ...data,
          warehouseId: undefined,
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
      name: 'description',
      type: 'string',
    },
    {
      label: '物料类型',
      name: 'itemTypeMeaning',
      type: 'string',
    },
    {
      label: '物料类别',
      name: 'wmCategoryName',
      type: 'string',
    },
    {
      label: '仓库',
      name: 'warehouseName',
      type: 'string',
    },
    {
      label: '单位',
      name: 'uomName',
      type: 'string',
    },
    {
      label: '单价',
      name: 'price',
      type: 'string',
    },
    {
      label: '期初数量',
      name: 'openingQty',
      type: 'string',
    },
    {
      label: '期初金额',
      name: 'openingAccount',
      type: 'string',
    },
    {
      label: '接收数量',
      name: 'receivedQty',
      type: 'string',
    },
    {
      label: '接收金额',
      name: 'receivedAccount',
      type: 'string',
    },
    {
      label: '发出数量',
      name: 'shippedQty',
      type: 'string',
    },
    {
      label: '发出金额',
      name: 'shippedAccount',
      type: 'string',
    },
    {
      label: '期末数量',
      name: 'closingQty',
      type: 'string',
    },
    {
      label: '期末金额',
      name: 'closingAccount',
      type: 'string',
    },
    {
      label: '期间数量',
      name: 'periodQty',
      type: 'string',
    },
    {
      label: '期间金额',
      name: 'periodAccount',
      type: 'string',
    },
  ],
});
