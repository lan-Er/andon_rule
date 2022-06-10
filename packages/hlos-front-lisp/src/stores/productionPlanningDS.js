/*
 * @Description: 排产计划
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-05 18:28:49
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, generateUrlWithGetParam } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const { loginName } = getCurrentUser();
const queryUrl = `${HLOS_LISP}/v1/datas/mo-quantity`;
let needLoadFlag = true;
export const rowCombineArr = [];
export const rowCombineItem = [];

const transformData = (ds) => {
  const data = ds.toData();
  let currentDate = null;
  let repeatNum = 0;
  let repeatStart = 0;

  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    // 根据日期date进行合并
    const attribute = moment(record.date).format(DEFAULT_DATE_FORMAT);
    if (currentDate === null) {
      currentDate = moment(attribute).format(DEFAULT_DATE_FORMAT);
      repeatNum = 1;
      repeatStart = i;
      rowCombineArr[repeatStart] = 1;
    } else if (currentDate === attribute) {
      rowCombineArr[i] = 0;
      repeatNum++;
      // console.log('currentDate和当前时间相同', rowCombineArr);
    } else {
      currentDate = null;
      rowCombineArr[repeatStart] = repeatNum;
      repeatNum = 0;
      i--;
      // console.log('currentDate和当前时间不同', rowCombineArr);
    }
    if (i === data.length - 1) {
      rowCombineArr[repeatStart] = repeatNum;
    }
  }
  ds.loadData(data);
};

export const deliveryReplyDS = () => ({
  // primaryKey: 'deliveryReplyDSId',
  name: 'productionPlanningDS',
  autoCreate: true,
  autoQuery: true,
  paging: false,
  selection: false,
  queryFields: [
    {
      name: 'productionScheduleFinishTimeStart',
      label: '完工时间从',
      max: 'productionScheduleFinishTimeEnd',
      format: 'YYYY-MM-DD',
      type: 'date',
    },
    {
      name: 'productionScheduleFinishTimeEnd',
      label: '完工时间至',
      min: 'productionScheduleFinishTimeStart',
      format: 'YYYY-MM-DD',
      type: 'date',
      defaultValue: '2020-08-04',
    },
    {
      name: 'attribute39',
      label: '供应商',
      type: 'string',
    },
    {
      name: 'attribute35',
      label: '物料',
      type: 'string',
    },
  ],
  fields: [
    {
      name: 'date',
      label: '日期',
      type: 'date',
    },
    {
      name: 'item&description',
      label: '物料',
      type: 'string',
    },
    {
      name: 'supplier',
      label: '供应商',
      type: 'string',
    },
    {
      name: 'demandQty',
      label: '需求数量',
      type: 'string',
    },
    {
      name: 'reportQty',
      label: '完工数量',
      type: 'number',
    },
    {
      name: 'makingQty',
      label: '在制数量',
      type: 'number',
    },
    {
      name: 'instockQty',
      label: '入库数量',
      type: 'number',
    },
    {
      name: 'supplyQty',
      label: '供应数量',
      type: 'number',
    },
    {
      name: 'processBar',
      label: '进度',
    },
  ],
  transport: {
    read: ({ data }) => {
      let order = null;
      let url = '';
      if (data.finishTimeOrder === undefined) {
        order = 1;
      } else {
        order = data.finishTimeOrder;
      }
      url = generateUrlWithGetParam(queryUrl, {
        finishTimeOrder: order,
        field: 'date',
      });
      return {
        url,
        data: {
          ...data,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'MAKE_ORDER',
        },
        method: 'GET',
      };
    },
  },
  events: {
    load: ({ dataSet }) => {
      if (dataSet.records.length === 0) return;
      if (needLoadFlag) {
        needLoadFlag = false;
        transformData(dataSet);
      } else {
        needLoadFlag = true;
      }
    },
  },
});
