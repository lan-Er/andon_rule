/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-30 16:15:17
 * @LastEditTime: 2020-09-07 17:28:54
 * @Description:
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';

const preCode = 'lisp.completion.entry';
const url = `${HLOS_LISP}/v1/datas/supplier-chain`;
const { loginName } = getCurrentUser();

export const qualityInspectionResultEnquiryDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'oranizationObj',
        type: 'object',
        lovCode: 'LISP.ORGANIZATION',
        label: intl.get(`${preCode}.oranizationName`).d('组织'),
        required: true,
        defaultValue: '上海工厂',
        ignore: 'always',
      },
      {
        name: 'oranizationName',
        type: 'string',
        bind: 'oranizationObj.attribute1',
        ignore: 'always',
      },
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: 'LISP.STATEMENT_SUPPLIER',
        label: intl.get(`${preCode}.supplierName`).d('供应商'),
        required: true,
        ignore: 'always',
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.attribute1',
        ignore: 'always',
      },
      {
        name: 'PO',
        type: 'object',
        lovCode: 'LISP.WI_PO_NUM',
        required: true,
        label: 'PO',
        ignore: 'always',
      },
      {
        name: 'attribute25',
        type: 'string',
        bind: 'PO.attribute2',
      },
      {
        name: 'item',
        type: 'object',
        lovCode: 'LISP.WI_ITEM',
        cascadeMap: { attribute3: 'attribute25' },
        label: intl.get(`${preCode}.item`).d('物料'),
        noCache: true,
        ignore: 'always',
      },
      {
        name: 'attribute1',
        type: 'string',
        bind: 'item.attribute2',
      },
      {
        name: 'processObj',
        type: 'object',
        lovCode: 'LISP.WI_TASK',
        label: '工序',
        cascadeMap: { attribute1: 'attribute1' },
        textField: 'attribute3',
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'attribute3',
        type: 'string',
        bind: 'processObj.attribute3',
      },
      {
        name: 'lotCode',
        type: 'object',
        lovCode: 'LISP.WI_LOT_SEARCH',
        label: intl.get(`${preCode}.lotCode`).d('批次'),
        ignore: 'always',
      },
      {
        name: 'date',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${preCode}.date`).d('生产日期'),
        validator: () => {
          return true;
        },
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('attribute3')) {
              return true;
            }
          },
        },
        ignore: 'always',
      },
      {
        name: 'makeDateStart',
        type: 'string',
        bind: 'date.start',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'makeDateEnd',
        type: 'string',
        bind: 'date.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('物料'),
      },
      {
        name: 'attribute25',
        type: 'string',
        label: intl.get(`${preCode}.attribute25`).d('PO'),
      },
      {
        name: 'attribute3',
        type: 'string',
        label: intl.get(`${preCode}.attribute3`).d('工序'),
      },
      {
        name: 'attribute4',
        type: 'string',
        label: intl.get(`${preCode}.attribute4`).d('加工数量'),
      },
      {
        name: 'attribute5',
        type: 'string',
        label: intl.get(`${preCode}.attribute5`).d('生产日期'),
      },
      {
        name: 'attribute6',
        type: 'string',
        label: intl.get(`${preCode}.attribute6`).d('生产日期'),
      },
      {
        name: 'attribute7',
        type: 'string',
        label: intl.get(`${preCode}.attribute7`).d('质检结果'),
      },
      {
        name: 'attribute8',
        type: 'string',
        label: intl.get(`${preCode}.attribute8`).d('合格数量'),
      },
      {
        name: 'attribute9',
        type: 'string',
        label: intl.get(`${preCode}.attribute9`).d('不合格数量'),
      },
      {
        name: 'attribute10',
        type: 'string',
        label: intl.get(`${preCode}.attribute10`).d('不合格原因'),
      },
      {
        name: 'attribute11',
        type: 'string',
        label: intl.get(`${preCode}.attribute11`).d('检验项目组'),
      },
      {
        name: 'attribute16',
        type: 'string',
        label: intl.get(`${preCode}.attribute16`).d('检验项目'),
      },
      {
        name: 'attribute17',
        type: 'string',
        label: intl.get(`${preCode}.attribute17`).d('结果'),
      },
      {
        name: 'attribute18',
        type: 'string',
        label: intl.get(`${preCode}.attribute18`).d('检验项目'),
      },
      {
        name: 'attribute19',
        type: 'string',
        label: intl.get(`${preCode}.attribute19`).d('结果'),
      },
      {
        name: 'attribute20',
        type: 'string',
        label: intl.get(`${preCode}.attribute20`).d('检验项目'),
      },
      {
        name: 'attribute21',
        type: 'string',
        label: intl.get(`${preCode}.attribute21`).d('结果'),
      },
      {
        name: 'attribute22',
        type: 'string',
      },
      {
        name: 'attribute23',
        type: 'string',
      },
      {
        name: 'attribute24',
        type: 'string',
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'QC_RESULT',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
