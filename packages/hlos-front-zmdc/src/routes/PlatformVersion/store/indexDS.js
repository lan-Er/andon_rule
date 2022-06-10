/*
 * @Descripttion:平台产品
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-07-28 10:33:55
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-07-28 14:03:40
 */
import intl from 'utils/intl';
import moment from 'moment';
import { HLOS_ZMDC } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const intlPrefix = 'zmdc.platformProduct';
const url = `${HLOS_ZMDC}/v1/versions`;

const listDS = () => ({
  autoQuery: true,
  fields: [
    {
      name: 'versionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionCode`).d('版本号'),
    },
    {
      name: 'versionName',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionName`).d('版本名称'),
      required: true,
    },
    {
      name: 'versionRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionRemark`).d('版本备注'),
      width: 150,
    },
    {
      name: 'segment1',
      type: 'number',
      label: intl.get(`${intlPrefix}.segment1`).d('版本段1'),
      required: true,
      min: 0,
      step: 1,
    },
    {
      name: 'segment2',
      disabled: true,
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${intlPrefix}.segment2`).d('版本段2'),
    },
    {
      name: 'segment3',
      disabled: true,
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${intlPrefix}.segment3`).d('版本段3'),
    },
    // {
    //   name: 'versionDate',
    //   disabled: true,
    //   type: 'date',
    //   min: 0,
    //   step: 1,
    //   label: intl.get(`${intlPrefix}.versionDate`).d('版本段4'),
    // },
    {
      name: 'segment4',
      disabled: true,
      type: 'date',
      label: intl.get(`${intlPrefix}.segment4`).d('版本段4'),
      transformRequest: (val) => {
        if (val) {
          const segmentValue = moment(val).format(DEFAULT_DATE_FORMAT)?.replace(/-/g, '');
          return !Number(segmentValue) ? '' : segmentValue;
        }
      },
      transformResponse: (value) => {
        if (value) {
          return `${value.substr(0, 4)}-${value.substr(4, 2)}${value.substr(6, 2)}`;
        }
        return value;
      },
    },
    {
      name: 'segmentNum',
      type: 'number',
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data: data[0],
        url,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record, dataSet }) => {
      if (name.indexOf('segment') > -1 && name !== 'segmentNum') {
        const segmentNum = name.slice(7);
        let versionCode = '';

        // 当前段值有效时，后面的段值disabled置为false
        if (dataSet.fields.get(`segment${Number(segmentNum) + 1}`)) {
          dataSet.fields.get(`segment${Number(segmentNum) + 1}`).set('disabled', false);
        }

        // 当其中有字段值修改后并且修改的值无效时，后面的字段值清空并且disabled置为true
        for (let i = 1; i < Number(segmentNum) + 1; i++) {
          if (
            name === `segment${i}` &&
            !record.data[`segment${i}`] &&
            parseInt(record.data[`segment${i}`], 10) !== 0
          ) {
            for (let a = i; a < 5; a++) {
              record.set(`segment${i + 1}`, '');
              if (dataSet.fields.get(`segment${i + 1}`)) {
                dataSet.fields.get(`segment${i + 1}`).set('disabled', true);
              }
            }
            record.set('segmentNum', i - 1);
          } else {
            record.set('segmentNum', segmentNum);
          }
        }

        // 计算versionCode
        for (let i = 1; i < 5; i++) {
          if (record.data[`segment${i}`] || parseInt(record.data[`segment${i}`], 10) === 0) {
            if (i === 4) {
              // date格式转为string,再计算versionCode
              const segmentValue = moment(record.data.segment4)
                .format(DEFAULT_DATE_FORMAT)
                ?.replace(/-/g, '');
              versionCode = `${versionCode}${!Number(segmentValue) ? '' : segmentValue}`;
            } else {
              // segment3后计算versionCode不要.
              versionCode =
                i === 3
                  ? `${versionCode}${record.data[`segment${i}`]}`
                  : `${versionCode}${record.data[`segment${i}`]}.`;
            }
          }
        }

        record.set('versionCode', versionCode);
      }
    },
  },
});

export { listDS };
