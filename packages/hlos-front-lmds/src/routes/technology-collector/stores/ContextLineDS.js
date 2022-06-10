/*
 * @Author: zhang yang
 * @Description: 数据收集项 明细 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsCollector } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.collector.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/collector-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'contextType',
      type: 'string',
      label: intl.get(`${preCode}.contextType`).d('类型'),
      lookupCode: lmdsCollector.contextType,
      required: true,
    },
    {
      name: 'contextCode',
      type: 'string',
      label: intl.get(`${preCode}.contextCode`).d('编码'),
      required: true,
    },
    {
      name: 'referenceValue',
      type: 'string',
      label: intl.get(`${preCode}.referenceValue`).d('参考值'),
      dynamicProps: ({ record }) => {
        if (record.get('contextType') === 'Number') {
          return {
            type: 'number',
          };
        }
      },
    },
    {
      name: 'defaultValue',
      type: 'string',
      label: intl.get(`${preCode}.defaultValue`).d('默认值'),
      dynamicProps: ({ record }) => {
        if (record.get('contextType') === 'Number') {
          return {
            type: 'number',
          };
        }
      },
    },
    {
      name: 'maxValue',
      type: 'string',
      label: intl.get(`${preCode}.maxValue`).d('最大值'),
      dynamicProps: ({ record }) => {
        if (record.get('contextType') === 'Number') {
          return {
            type: 'number',
          };
        }
      },
    },
    {
      name: 'minValue',
      type: 'string',
      label: intl.get(`${preCode}.minValue`).d('最小值'),
      dynamicProps: ({ record }) => {
        if (record.get('contextType') === 'Number') {
          return {
            type: 'number',
          };
        }
      },
    },
    {
      name: 'keyFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.keyFlag`).d('关键标识'),
      defaultValue: false,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('显示顺序'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
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
      if (name === 'contextType') {
        if (!isEmpty(record.get('referenceValue'))) {
          record.set('referenceValue', null);
        }
        if (!isEmpty(record.get('defaultValue'))) {
          record.set('defaultValue', null);
        }
        if (!isEmpty(record.get('maxValue'))) {
          record.set('maxValue', null);
        }
        if (!isEmpty(record.get('minValue'))) {
          record.set('minValue', null);
        }
      }
    },
  },
});
