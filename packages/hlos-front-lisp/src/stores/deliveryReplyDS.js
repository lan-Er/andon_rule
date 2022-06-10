/*
 * @Description: 交期回复
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-05 18:27:16
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { generateUrlWithGetParam, getCurrentUser } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const queryUrl = `${HLOS_LISP}/v1/datas/solution-pack`;
const { loginName } = getCurrentUser();

export const deliveryReplyDS = () => ({
  primaryKey: 'deliveryReplyDSId',
  name: 'deliveryReplyDS',
  autoCreate: true,
  autoQuery: true,
  pageSize: 10,

  queryFields: [
    {
      name: 'attribute28',
      label: '客户采购订单',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '客户',
      type: 'string',
    },
    {
      name: 'demandDateStart',
      type: 'date',
      label: '需求时间＞＝',
      max: 'demandDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'demandDateEnd',
      type: 'date',
      label: '需求时间＜＝',
      min: 'demandDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
  ],
  fields: [
    {
      name: 'attribute5&6',
      label: '销售订单号',
      type: 'string',
    },
    {
      name: 'attribute9&10',
      label: '物料',
      type: 'string',
    },
    {
      name: 'attribute3',
      label: '客户',
      type: 'string',
    },
    {
      name: 'attribute14&13',
      label: '数量',
      type: 'string',
    },
    {
      name: 'attribute20&21',
      label: '金额',
      type: 'string',
      sortable: true,
    },
    {
      name: 'attribute17',
      label: '需求日期',
    },
    {
      name: 'attribute18',
      label: '承诺日期',
      type: 'date',
      transformResponse: (val, object) => {
        if (object.attribute8 === '已回复') {
          return val;
        }

        let adviseDate = '';
        if (object.attribute31) {
          // console.log('计划完工时间不为空  ：计划完工时间+运输时长值', record.get('attribute31'), record.get('attribute19'));
          adviseDate = moment(object.attribute31)
            .add(Number(object.attribute19), 'days')
            .format(DEFAULT_DATE_FORMAT);
        } else {
          // console.log('计划完工时间为空：系统当前时间+运输时长值');
          adviseDate = moment().add(Number(object.attribute19), 'days').format(DEFAULT_DATE_FORMAT);
        }
        if (moment(adviseDate) > moment(object.attribute17)) {
          adviseDate = object.attribute17;
        }
        return adviseDate;
      },
    },
    {
      name: 'adviseDate',
      label: '建议交期',
      type: 'date',
      transformResponse: (val, object) => {
        let adviseDate = '';
        if (object.attribute31) {
          // console.log('计划完工时间不为空  ：计划完工时间+运输时长值', record.get('attribute31'), record.get('attribute19'));
          adviseDate = moment(object.attribute31)
            .add(Number(object.attribute19), 'days')
            .format(DEFAULT_DATE_FORMAT);
        } else {
          // console.log('计划完工时间为空：系统当前时间+运输时长值');
          adviseDate = moment().add(Number(object.attribute19), 'days').format(DEFAULT_DATE_FORMAT);
        }
        if (moment(adviseDate) > moment(object.attribute17)) {
          adviseDate = object.attribute17;
        }
        return adviseDate;
      },
    },
    {
      name: 'attribute31',
      label: '计划完工时间',
      type: 'date',
    },
    {
      name: 'attribute19',
      label: '运输时长',
      type: 'string',
    },
    {
      name: 'attribute32',
      label: '库存可用量',
      type: 'string',
    },
    {
      name: 'attribute28&29',
      label: '客户采购订单',
      type: 'string',
    },
    {
      name: 'attribute11&12',
      label: '客户物料',
      type: 'string',
    },
    {
      name: 'attribute7',
      label: '销售员',
      type: 'string',
    },
  ],
  transport: {
    read: ({ data }) => {
      let url = queryUrl;
      if (Number(data.tabIndex) === 0) {
        url = generateUrlWithGetParam(queryUrl, {
          attribute2: '',
          attribute8: '已确认',
        });
      } else {
        url = generateUrlWithGetParam(queryUrl, {
          attribute2: '',
          attribute8: '已回复',
        });
      }
      return {
        url,
        data: {
          ...data,
          user: loginName,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'SALES_ORDER',
        },
        method: 'GET',
      };
    },
  },
});
