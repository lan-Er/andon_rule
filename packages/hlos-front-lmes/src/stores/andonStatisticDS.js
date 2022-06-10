/*
 * @Description: 安灯统计
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-01 14:00:22
 * @LastEditors: 赵敏捷
 */

import moment from 'moment';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'lmes.common.model';
const intlPrefix = 'lmes.andonStatistic.model';
const { common, lmesAndonStatistic } = codeConfig.code;

const day = {
  start: moment().startOf('day'),
  end: moment().endOf('day'),
};

const week = {
  start: moment().startOf('isoWeek'),
  end: moment().endOf('isoWeek'),
};

const month = {
  start: moment().startOf('month'),
  end: moment().endOf('month'),
};

const clearKeyPairs = {
  factoryObj: ['prodLineObj'],
  startDate: ['period'],
  endDate: ['period'],
};

let clearTimeFlag = true;

// 顶部筛选条件DS
const andonStatisticDSConfig = () => ({
  autoCreate: true,
  events: {
    update({ name, value, record }) {
      if (name === 'period') {
        clearTimeFlag = false;
        switch (value) {
          case 'DAY':
            record.set('startDate', day.start);
            record.set('endDate', day.end);
            break;
          case 'WEEK':
            record.set('startDate', week.start);
            record.set('endDate', week.end);
            break;
          case 'MONTH':
            record.set('startDate', month.start);
            record.set('endDate', month.end);
            break;
          default:
            break;
        }
        return;
      }
      const keys = clearKeyPairs[name];
      if (keys) {
        keys.forEach((key) => {
          // 选择日期区间会更新对应的日期范围，选择日期范围也会清空对应的日期区间
          // 对于手动选择区间的情况并不需要清空区间
          if (key === 'period' && !clearTimeFlag) {
            if (name === 'endDate') {
              clearTimeFlag = true;
            }
            return;
          }
          record.set(key, null);
        });
      }
    },
  },
  fields: [
    {
      name: 'factoryObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.factory`).d('工厂'),
      lovCode: lmesAndonStatistic.factory,
      ignore: 'always',
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'factoryObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'factoryObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'factoryObj.meOuName',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      cascadeMap: { organizationId: 'meOuId' },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'period',
      defaultValue: 'WEEK',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      defaultValue: week.start,
      min: moment().startOf('month').subtract(3, 'months').format('YYYY-MM-DD'),
      dynamicProps: {
        max({ record }) {
          if (record.get('endDate')) {
            return 'endDate';
          }
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      defaultValue: week.end,
      dynamicProps: {
        min({ record }) {
          if (record.get('startDate')) {
            return 'startDate';
          }
        },
      },
    },
  ],
});

export { andonStatisticDSConfig };
