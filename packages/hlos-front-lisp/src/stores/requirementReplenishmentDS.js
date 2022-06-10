/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-08-21 16:30:47
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-09 14:11:54
 */

import { getCurrentUser } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import moment from 'moment';
import { getdiffdate, getPrevDate } from '@/utils/timeServer';

const { loginName } = getCurrentUser();
const url = `${HLOS_LISP}/v1/datas`;
let needLoadFlag = true;
export const rowCombineArr = [];

const minDate = moment(new Date()).format('YYYY-MM-DD');
const maxDate = getPrevDate(minDate, -14);

const timeList = getdiffdate(minDate, maxDate);

const transformData = (ds) => {
  const data = ds.toData();
  let currentItem = null;
  let repeatNum = 0;
  let repeatStart = 0;

  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    // 根据物料进行合并
    const { attribute1 } = record;
    if (currentItem === null) {
      currentItem = attribute1;
      repeatNum = 1;
      repeatStart = i;
      rowCombineArr[repeatStart] = 1;
    } else if (currentItem === attribute1) {
      rowCombineArr[i] = 0;
      repeatNum++;
    } else {
      currentItem = null;
      rowCombineArr[repeatStart] = repeatNum;
      repeatNum = 0;
      i--;
    }
    if (i === data.length - 1) {
      rowCombineArr[repeatStart] = repeatNum;
    }
  }
  ds.loadData(data);
};

export const ListDS = () => {
  return {
    autoCreate: true,
    autoQuery: true,
    selection: false,
    autoLocateFirst: false,
    queryFields: [
      {
        name: 'searchDate',
        type: 'date',
        range: ['start', 'end'],
        label: '日期',
        min: minDate,
        max: maxDate,
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: '物料',
        type: 'string',
      },
      {
        name: 'attribute2',
        label: '要素类型',
        type: 'string',
      },
      {
        name: 'attribute3',
        label: '值',
        type: 'string',
      },
      {
        name: 'attribute4',
        label: '预计下单数量',
        type: 'string',
      },
      {
        name: 'attribute5',
        label: '今日库存数量',
        type: 'string',
      },
      {
        name: 'attribute6',
        label: '建议补货供应商排序',
        type: 'string',
      },
      {
        name: 'attribute7',
        label: timeList[0],
        type: 'string',
      },
      {
        name: 'attribute8',
        label: timeList[1],
        type: 'string',
      },
      {
        name: 'attribute9',
        label: timeList[2],
        type: 'string',
      },
      {
        name: 'attribute10',
        label: timeList[3],
        type: 'string',
      },
      {
        name: 'attribute11',
        label: timeList[4],
        type: 'string',
      },
      {
        name: 'attribute12',
        label: timeList[5],
        type: 'string',
      },
      {
        name: 'attribute13',
        label: timeList[6],
        type: 'string',
      },
      {
        name: 'attribute14',
        label: timeList[7],
        type: 'string',
      },
      {
        name: 'attribute15',
        label: timeList[8],
        type: 'string',
      },
      {
        name: 'attribute16',
        label: timeList[9],
        type: 'string',
      },
      {
        name: 'attribute17',
        label: timeList[10],
        type: 'string',
      },
      {
        name: 'attribute18',
        label: timeList[11],
        type: 'string',
      },
      {
        name: 'attribute19',
        label: timeList[12],
        type: 'string',
      },
      {
        name: 'attribute20',
        label: timeList[13],
        type: 'string',
      },
      {
        name: 'attribute21',
        label: '物料描述',
        type: 'string',
      },
      {
        name: 'checkBox',
        type: 'boolean',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'Check_mangenment',
            user: loginName,
            sort: 'attribute1,data_id',
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
  };
};
