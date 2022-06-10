/*
 * @Author: zhang yang
 * @Description: 时段 明细 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.period.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/period-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      max: 'endDate',
      required: true,
      defaultValue: NOW_DATE,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: val => val ? moment(val).format(DEFAULT_DATE_FORMAT) : null,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('endDate'))) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      required: true,
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
      transformRequest: val => val ? moment(val).format(DEFAULT_DATE_FORMAT) : null,
    },
    {
      name: 'segmentCode',
      type: 'string',
      label: intl.get(`${preCode}.segmentCode`).d('分段编码'),
    },
    {
      name: 'segment1',
      type: 'string',
      label: intl.get(`${preCode}.segment1`).d('段一'),
      required: true,
    },
    {
      name: 'segment2',
      type: 'string',
      label: intl.get(`${preCode}.segment2`).d('段二'),
    },
    {
      name: 'segment3',
      type: 'string',
      label: intl.get(`${preCode}.segment3`).d('段三'),
    },
  ],
  transport: {
    read: config => {
      return {
        ...config,
        url,
        method: 'GET',
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
    update: ({ name, record }) => {
      if (name === 'segment1' || name === 'segment2' || name === 'segment3') {
        let seg1 = '';
        let seg2 = '';
        let seg3 = '';
        if (!isEmpty(record.get('segment1'))) {
          seg1 = record.get('segment1');
        }
        if (!isEmpty(record.get('segment2'))) {
          seg2 = record.get('segment2');
        }
        if (!isEmpty(record.get('segment3'))) {
          seg3 = record.get('segment3');
        }
        record.set('segmentCode', `${seg1}${seg2?'.':''}${seg2}${seg3?'.':''}${seg3}`);
      }
    },
  },
});
