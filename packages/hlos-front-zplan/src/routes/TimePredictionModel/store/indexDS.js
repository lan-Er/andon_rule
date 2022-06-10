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
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

// import { codeValidator } from 'hlos-front/lib/utils/utils';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-time-predictions`;

const listDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'categoryObj',
      type: 'object',
      lovCode: common.category,
      label: intl.get(`${intlPrefix}.categoryObj`).d('物料类别'),
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      ignore: 'always',
      // cascadeMap: { categoryId: 'categoryId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          categoryId: record.get('categoryId'),
        }),
      },
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'startDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.arrivalDate`).d('有效日期'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'endDate',
      type: 'date',
      bind: 'startDate.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体'),
      lovPara: {
        enabledFlag: 1,
      },
    },
    {
      name: 'salesEntityId',
      type: 'string',
      bind: 'salesEntityObj.salesEntityId',
    },
  ],
  fields: [
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      ignore: 'always',
      required: true,
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
      name: 'salesEntityCode',
      type: 'string',
      bind: 'salesEntityObj.salesEntityCode',
    },
    {
      name: 'salesEntityName',
      type: 'string',
      bind: 'salesEntityObj.salesEntityName',
    },
    // {
    //   name: 'categorySetObj',
    //   type: 'object',
    //   lovCode: common.categorySet,
    //   ignore: 'always',
    //   required: true,
    //   label: intl.get(`${intlPrefix}.supplierName`).d('物料类别集'),
    // },
    {
      name: 'categorySetId',
      type: 'string',
      bind: 'categoryObj.categorySetId',
    },
    {
      name: 'categorySetCode',
      type: 'string',
      bind: 'categoryObj.categorySetCode',
    },
    {
      name: 'categorySetName',
      type: 'string',
      bind: 'categoryObj.categorySetName',
      label: intl.get(`${intlPrefix}.supplierName`).d('物料类别集'),
    },
    {
      name: 'categoryObj',
      type: 'object',
      lovCode: common.category,
      label: intl.get(`${intlPrefix}.categoryObj`).d('物料类别'),
      ignore: 'always',
      required: true,
      textField: 'categoryCode',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
      label: intl.get(`${intlPrefix}.categoryName`).d('物料类别名称'),
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
      ignore: 'always',
      cascadeMap: { categoryId: 'categoryId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          categoryId: record.get('categoryId'),
        }),
      },
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDesc',
      type: 'string',
      bind: 'itemObj.itemDesc',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'string',
      bind: 'itemObj.itemAttr',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'smoothnessIndex',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.itemAttr`).d('平滑指数α'),
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      max: 'endDate',
      label: intl.get(`${intlPrefix}.startDate`).d('有效日期从'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      min: 'startDate',
      label: intl.get(`${intlPrefix}.endDate`).d('有效日期至'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
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
        data,
        method: 'DELETE',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ record, name }) => {
      if (name === 'categoryObj') {
        record.set('itemObj', {});
      }
      if (name === 'itemObj') {
        record.set('itemAttrId', null);
        record.set('itemAttr', {});
      }
    },
  },
});

export { listDS };
