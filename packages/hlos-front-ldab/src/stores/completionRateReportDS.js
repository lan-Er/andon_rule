/*
 * @Description:加工完成率报表
 * @Author: yu.na@hand-china.com
 * @Date: 2021-03-22 15:44:22
 */
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import intl from 'utils/intl';
import { DATETIME_MAX, DATETIME_MIN } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const preCode = 'ldab.completionRateReport.model';
const tenantId = getCurrentOrganizationId();
const url = `${HLOS_LRPT}/v1/${tenantId}/mos/process-complete-rate`;
const lineUrl = `${HLOS_LRPT}/v1/${tenantId}/mos/delayed-completed-list`;

const commonReadFn = (data, currentUrl) => {
  const {
    organizationIdList: organizationId,
    prodLineIdList: prodLineId,
    itemIdList: itemId,
    itemLargeCategoryCodeList: itemLargeCategoryCode,
    itemSmallCategoryCodeList: itemSmallCategoryCode,
  } = data;
  return {
    url: generateUrlWithGetParam(currentUrl, {
      organizationId,
      prodLineId,
      itemId,
      itemLargeCategoryCode,
      itemSmallCategoryCode,
    }),
    data: {
      ...data,
      organizationIdList: null,
      prodLineIdList: null,
      itemIdList: null,
      itemLargeCategoryCodeList: null,
      itemSmallCategoryCodeList: null,
    },
    method: 'get',
  };
};

export const ListDS = () => ({
  selection: false,
  paging: false,
  transport: {
    read: ({ data }) => commonReadFn(data, url),
  },
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('组织'),
      lovCode: common.singleMeOu,
      ignore: 'always',
      required: true,
      noCache: true,
      multiple: true,
    },
    {
      name: 'organizationIdList',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
      ignore: 'always',
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
      name: 'prodLineIdList',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'itemMeObj',
      type: 'object',
      label: intl.get(`${preCode}.product`).d('产品'),
      lovCode: common.itemMe,
      ignore: 'always',
      noCache: true,
      multiple: true,
    },
    {
      name: 'itemIdList',
      type: 'string',
      bind: 'itemMeObj.itemId',
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.productCategory`).d('产品大类'),
      lovCode: common.categories,
      lovPara: { categorySet: 'ITEM_ME_SET' },
      ignore: 'always',
      noCache: true,
      multiple: true,
    },
    {
      name: 'itemLargeCategoryCodeList',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'secondCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.productSecondCategory`).d('产品小类'),
      lovCode: common.categories,
      lovPara: { categorySet: 'ITEM_ME_SET' },
      ignore: 'always',
      noCache: true,
      multiple: true,
    },
    {
      name: 'itemSmallCategoryCodeList',
      type: 'string',
      bind: 'secondCategoryObj.categoryCode',
    },
    {
      name: 'dateType',
      type: 'string',
      defaultValue: 'month',
    },
    {
      name: 'dimensionType',
      type: 'string',
      defaultValue: 'mo',
    },
    {
      name: 'startDate',
      type: 'date',
      range: ['start', 'end'],
      defaultValue: { start: NOW_DATE, end: NOW_DATE },
      validator: (value) => {
        if (value && value.end > moment(value.start).add(365, 'days')) {
          return `起始结束日期跨度不可超过365天`;
        }
        return true;
      },
      required: true,
      transformRequest: (val) => (val ? moment(val.start).format(DATETIME_MIN) : null),
    },
    {
      name: 'endDate',
      type: 'date',
      bind: 'startDate.end',
      transformRequest: (val) => (val ? moment(val).format(DATETIME_MAX) : null),
    },
  ],
});

export const LineDS = () => ({
  selection: false,
  transport: {
    read: ({ data }) => commonReadFn(data, lineUrl),
  },
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('组织'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${preCode}.moNum`).d('MO号'),
    },
    {
      name: 'itemName',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${preCode}.customer`).d('客户'),
    },
    {
      name: 'delayedDays',
      type: 'number',
      label: intl.get(`${preCode}.delayDays`).d('延期天数'),
      // (ACTUAL_END_TIME-PLAN_END_DATE)单位换算成天，与“天”用空格拼接显示
    },
    {
      name: 'demandQty',
      type: 'number',
      label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    },
    {
      name: 'demandDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.demandDate`).d('需求时间'),
    },
    {
      name: 'planStartDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
    },
    {
      name: 'planEndDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.planEndDate`).d('计划完成时间'),
    },
    {
      name: 'actualStartDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
    },
    {
      name: 'actualEndDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.actualEndTime`).d('实际完成时间'),
    },
    {
      name: 'topMoNum',
      type: 'string',
      label: intl.get(`${preCode}.topMoNum`).d('顶层MO'),
    },
    {
      name: 'parentMoNums',
      type: 'string',
      label: intl.get(`${preCode}.parentMoNums`).d('父MO'),
    },
    {
      name: 'moLevel',
      type: 'string',
      label: intl.get(`${preCode}.moLevel`).d('MO层级'),
    },
  ],
});
