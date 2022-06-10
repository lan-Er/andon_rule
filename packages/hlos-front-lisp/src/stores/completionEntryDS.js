/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-23 19:12:44
 * @LastEditTime: 2020-08-04 17:39:50
 * @Description:
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { isEmpty } from 'lodash';
import moment from 'moment';

const preCode = 'lisp.completion.entry';
const url = `${HLOS_LISP}/v1/datas/supplier-chain`;
const { loginName } = getCurrentUser();

export const ListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'attribute1',
        type: 'object',
        lovCode: 'LISP.ORGANIZATION',
        label: intl.get(`${preCode}.attribute1`).d('组织'),
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute2',
        type: 'object',
        lovCode: 'LISP.MO_NUMBER',
        label: intl.get(`${preCode}.attribute2`).d('MO号'),
        transformRequest: (value) => {
          return value && value.attribute2;
        },
      },
      {
        name: 'attribute3',
        type: 'object',
        label: intl.get(`${preCode}.itemObj`).d('物料名称'),
        lovCode: 'LISP.ITEM',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute11',
        type: 'object',
        label: intl.get(`${preCode}.productLineObj`).d('生产线'),
        lovCode: 'LISP.PRODLINE',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'attribute12',
        type: 'object',
        label: intl.get(`${preCode}.attribute12`).d('设备'),
        lovCode: 'LISP.EQUIPMENT',
        transformRequest: (value) => {
          return value && value.attribute1;
        },
      },
      {
        name: 'finishTimeStart',
        type: 'dateTime',
        label: intl.get(`${preCode}.finishTimeStart`).d('完工时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record.get('finishTimeEnd'))) {
              return 'finishTimeEnd';
            }
          },
        },
      },
      {
        name: 'finishTimeEnd',
        type: 'dateTime',
        label: intl.get(`${preCode}.finishTimeStart`).d('完工时间<='),
        min: 'finishTimeStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'importTimeStart',
        type: 'dateTime',
        label: intl.get(`${preCode}.importTimeStart`).d('导入时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record.get('importTimeEnd'))) {
              return 'importTimeEnd';
            }
          },
        },
      },
      {
        name: 'importTimeEnd',
        type: 'dateTime',
        label: intl.get(`${preCode}.importTimeEnd`).d('导入时间<='),
        min: 'importTimeStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('组织'),
      },
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.attribute2`).d('MO号'),
      },
      {
        name: 'attribute3',
        type: 'string',
        label: intl.get(`${preCode}.attribute3`).d('物料'),
      },
      {
        name: 'attribute13',
        type: 'string',
        label: intl.get(`${preCode}.attribute13`).d('物料'),
      },
      {
        name: 'attribute7',
        type: 'string',
        label: intl.get(`${preCode}.attribute7`).d('完工数'),
      },
      {
        name: 'attribute8',
        type: 'string',
        label: intl.get(`${preCode}.attribute8`).d('合格数'),
      },
      {
        name: 'attribute9',
        type: 'string',
        label: intl.get(`${preCode}.attribute9`).d('报废数'),
      },
      {
        name: 'attribute10',
        type: 'string',
        label: intl.get(`${preCode}.attribute10`).d('报废原因'),
      },
      {
        name: 'attribute11',
        type: 'string',
        label: intl.get(`${preCode}.attribute11`).d('生产线'),
      },
      {
        name: 'attribute12',
        type: 'string',
        label: intl.get(`${preCode}.attribute12`).d('设备'),
      },
      {
        name: 'attribute5',
        type: 'string',
        label: intl.get(`${preCode}.attribute5`).d('员工'),
      },
      {
        name: 'attribute4',
        type: 'string',
        label: intl.get(`${preCode}.attribute4`).d('完工时间'),
      },
      {
        name: 'attribute14',
        type: 'string',
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${preCode}.creationDate`).d('导入时间'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'ME_EXECUTE',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
