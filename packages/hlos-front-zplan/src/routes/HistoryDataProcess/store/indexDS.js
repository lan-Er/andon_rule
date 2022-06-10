/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
// import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-records`;

const listDS = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      ignore: 'always',
      lovPara: {
        enabledFlag: 1,
      },
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体'),
    },
    {
      name: 'salesEntityId',
      type: 'string',
      bind: 'salesEntityObj.salesEntityId',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'saleDateLeft',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.saleDateLeft`).d('销售日期'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'saleDateRight',
      type: 'date',
      bind: 'saleDateLeft.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
  ],
  fields: [
    {
      name: 'saleRecordNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleRecordNum`).d('数据编码'),
    },
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntityName`).d('销售实体'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'saleDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.saleDate`).d('销售日期'),
    },
    {
      name: 'saleCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleCount`).d('销量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
    },
    {
      name: 'standardPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.standardPrice`).d('标准销售价'),
    },
    {
      name: 'actualPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.actualPrice`).d('实付均价'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.currencyCode`).d('币种'),
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
        data,
        url,
        method: 'PUT',
      };
    },
  },
});

export { listDS };
