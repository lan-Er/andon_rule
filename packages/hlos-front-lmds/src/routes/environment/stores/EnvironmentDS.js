/*
 * @Description: 海马汇 API 配置 - tableDS
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-13 17:02:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-09-04 11:18:10
 * @Copyright: Copyright (c) 2018, Hand
 */

import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const preCode = 'lmds.andonRank.model';
const commonUrl = `${HLOS_LMDS}/v1/environments`;
const BEFORE_URL = /(http|https):\/\//;
const STRICT_URL = /[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])?/;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'environmentName',
      type: 'string',
      label: intl.get(`${preCode}.andonRank`).d('环境名称'),
    },
  ],
  fields: [
    {
      name: 'serialNumber',
      type: 'number',
      label: intl.get(`${preCode}.serialNumber`).d('序号'),
      required: true,
      defaultValue: 0,
    },
    {
      name: 'environmentName',
      type: 'intl',
      label: intl.get(`${preCode}.environmentName`).d('环境名称'),
      maxLength: 60,
      required: true,
    },
    {
      name: 'addonBefore',
      type: 'string',
      required: true,
      defaultValue: 'http://',
      transformResponse: (value, object) => {
        const { environmentApi } = object;
        if (!environmentApi) return 'http://';
        const addonBefore = environmentApi.match(BEFORE_URL)[0];
        return addonBefore;
      },
    },
    {
      name: 'addonAfter',
      type: 'string',
      required: true,
      pattern: STRICT_URL,
      format: 'lowercase',
      defaultValidationMessages: {
        patternMismatch: '请输入有效网址', // 正则不匹配的报错信息
        valueMissingNoLabel: '请输入环境地址',
      },
      transformResponse: (value, object) => {
        const { environmentApi } = object;
        if (!environmentApi) return '';
        if (!STRICT_URL.test(environmentApi)) return;
        const addonAfter = environmentApi.match(STRICT_URL)[0];
        return addonAfter;
      },
    },
    {
      name: 'environmentApi',
      type: 'string',
      label: intl.get(`${preCode}.environmentApi`).d('环境地址'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${commonUrl}/list`,
        data,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'DELETE',
      };
    },
    create: ({ data }) => {
      const { addonBefore, addonAfter, ...rest } = data[0];
      const newData = {
        ...rest,
        environmentApi: `${addonBefore}${addonAfter}`,
      };
      return {
        url: commonUrl,
        method: 'POST',
        data: newData,
      };
    },
    update: ({ data }) => {
      const { addonBefore, addonAfter, ...rest } = data[0];
      const newData = {
        ...rest,
        environmentApi: `${addonBefore}${addonAfter}`,
      };
      return {
        url: commonUrl,
        method: 'PUT',
        data: newData,
      };
    },
  },
});
