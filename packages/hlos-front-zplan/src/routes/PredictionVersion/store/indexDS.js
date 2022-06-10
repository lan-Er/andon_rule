/**
 * @Description: 预测版本DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-22 14:15:17
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

// const HLOS_ZPLAN = '/zplan-32184';
const intlPrefix = 'zplan.predictionVersion.model';
const organizationId = getCurrentOrganizationId();
const { common, predictionVersion } = codeConfig.code;
const dateEnd = moment().add(90, 'days').format(DEFAULT_DATE_FORMAT);
const lineUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-version-details`;

const PredictionVersionListDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'saleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本编号'),
    },
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
    },
    {
      name: 'saleVersionStatusList',
      type: 'string',
      lookupCode: predictionVersion.saleVersionStatus,
      label: intl.get(`${intlPrefix}.saleVersionStatus`).d('预测版本状态'),
      multiple: true,
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      lookupCode: predictionVersion.saleTemplateType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      name: 'predictedByObj',
      type: 'object',
      lovCode: common.userOrg,
      lovPara: {
        enabledFlag: 1,
        tenantId: organizationId,
      },
      ignore: 'always',
      label: intl.get(`${intlPrefix}.predictedName`).d('预测人'),
    },
    {
      name: 'predictedBy',
      type: 'string',
      bind: 'predictedByObj.id',
    },
    {
      name: 'predictionEndDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'predictionEndDateEnd',
      type: 'date',
      bind: 'predictionEndDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
    {
      name: 'predictionStartDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'predictionStartDateEnd',
      type: 'date',
      bind: 'predictionStartDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
  ],
  fields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
    },
    {
      name: 'saleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本'),
    },
    {
      name: 'saleTemplateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      lookupCode: predictionVersion.saleTemplateType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      name: 'predictedName',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictedName`).d('预测人'),
    },
    {
      name: 'predictionStartDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
    },
    {
      name: 'predictionEndDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
    },
    {
      name: 'predictionGap',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionGap`).d('预测日期间隔（天）'),
    },
    {
      name: 'saleVersionStatus',
      type: 'string',
      lookupCode: predictionVersion.saleVersionStatus,
      label: intl.get(`${intlPrefix}.status`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleVersionStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions`, {
          saleVersionStatusList,
        }),
        data: {
          ...data,
          saleVersionStatusList: null,
        },
        method: 'GET',
      };
    },
  },
});

const PredictionVersionHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'saleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本编号'),
    },
    {
      name: 'saleVersionStatus',
      type: 'string',
      lookupCode: predictionVersion.saleVersionStatus,
      label: intl.get(`${intlPrefix}.saleVersionStatus`).d('预测版本状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'saleTemplateObj',
      type: 'object',
      lovCode: predictionVersion.planTemplate,
      lovPara: {
        saleTemplateStatus: 'RUNNING',
        saleTemplateType: 'MANUAL',
      },
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'saleTemplateId',
      type: 'string',
      bind: 'saleTemplateObj.saleTemplateId',
    },
    {
      name: 'saleTemplateNum',
      type: 'string',
      bind: 'saleTemplateObj.saleTemplateNum',
    },
    {
      name: 'saleTemplateName',
      type: 'string',
      bind: 'saleTemplateObj.saleTemplateName',
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'predictedName',
      type: 'string',
      bind: 'saleTemplateObj.predictedName',
      label: intl.get(`${intlPrefix}.predictedName`).d('预测人'),
    },
    {
      name: 'predictionStartDate',
      type: 'string',
      bind: 'saleTemplateObj.predictionStartDate',
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      transformResponse: (val) => (val ? val.substring(0, 10) : ''),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'predictionEndDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
      transformResponse: (val) => (val ? val.substring(0, 10) : ''),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'predictionGap',
      type: 'string',
      bind: 'saleTemplateObj.predictionGap',
      label: intl.get(`${intlPrefix}.predictionGap`).d('预测日期间隔（天）'),
    },
    {
      name: 'newestSaleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.newestSaleVersionNum`).d('最新预测版本'),
    },
    {
      name: 'newestSaleVersionStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.newestSaleVersionStatus`).d('最新版本状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-versions/${data.saleVersionId}`,
        data: { ...data, saleVersionId: null },
        method: 'GET',
      };
    },
  },
});

const PredictionVersionLineQueryDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'saleDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.saleDate`).d('预测日期范围'),
      defaultValue: { start: new Date(), end: dateEnd },
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'saleDateEnd',
      type: 'date',
      bind: 'saleDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      lovPara: { enabledFlag: 1 },
      label: intl.get(`${intlPrefix}.salesEntity`).d('销售实体'),
      ignore: 'always',
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
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      ignore: 'always',
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
    },
    {
      name: 'itemAttr',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
  ],
});

const PredictionVersionLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'salesEntityObj',
      type: 'object',
      lovCode: common.salesEntity,
      lovPara: { enabledFlag: 1 },
      label: intl.get(`${intlPrefix}.salesEntity`).d('销售实体'),
      ignore: 'always',
      required: true,
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
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      ignore: 'always',
      required: true,
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
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      bind: 'itemObj.itemDesc',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'uomCode',
      type: 'string',
      bind: 'itemObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'itemObj.uomName',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'correctRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.correctRate`).d('平均准确率'),
      defaultValue: '100',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: lineUrl,
        data: {
          ...data,
          ...data.queryObj,
          queryObj: null,
        },
        method: 'GET',
        transformResponse: (value) => {
          const newValue = JSON.parse(value);
          let content;
          if (newValue && !newValue.failed && newValue.content) {
            content = newValue.content.map((v) => {
              let obj;
              v.planSaleVersionDayList.forEach((lv) => {
                obj = Object.assign({}, obj, {
                  [lv.saleDate.substring(0, 10)]: lv.manualCount,
                  [`objectVersionNumber${lv.saleDate.substring(0, 10)}`]: lv.objectVersionNumber,
                  [`saleVersionDayId${lv.saleDate.substring(0, 10)}`]: lv.saleVersionDayId,
                  [`manualFlag${lv.saleDate.substring(0, 10)}`]: lv.manualFlag,
                });
              });
              return Object.assign({}, v, obj);
            });
          }
          return { ...newValue, content };
        },
      };
    },
    create: ({ data }) => {
      const planSaleVersionDayList = [];
      Object.keys(data[0]).forEach((v) => {
        if (v.indexOf('-') === 4) {
          planSaleVersionDayList.push({
            saleDate: `${v} 00:00:00`,
            manualCount: data[0][v],
            saleVersionId: data[0].saleVersionId,
            saleVersionNum: data[0].saleVersionNum,
          });
        }
      });
      return {
        data: [
          {
            ...data[0],
            planSaleVersionDayList,
          },
        ],
        url: lineUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      const planSaleVersionDayList = [];
      Object.keys(data[0]).forEach((v) => {
        if (v.indexOf('-') === 4) {
          planSaleVersionDayList.push({
            saleDate: `${v} 00:00:00`,
            manualCount: data[0][v],
            saleVersionId: data[0].saleVersionId,
            saleVersionNum: data[0].saleVersionNum,
            saleVersionDayId: data[0][`saleVersionDayId${v}`],
            objectVersionNumber: data[0][`objectVersionNumber${v}`],
            manualFlag: data[0].saleTemplateType === 'AUTO' ? 1 : 0,
          });
        }
      });
      return {
        data: [
          {
            ...data[0],
            planSaleVersionDayList,
          },
        ],
        url: lineUrl,
        method: 'POST',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${lineUrl}/remove`,
        data,
        method: 'DELETE',
      };
    },
  },
});

const PredictionVersionSourceDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'salesEntityName',
      type: 'string',
      label: intl.get(`${intlPrefix}.salesEntity`).d('销售实体'),
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
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'saleDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleDate`).d('销售日期'),
    },
    {
      name: 'predictionBasicCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictionBasicCount`).d('基本预测数量'),
    },
    {
      name: 'monthCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.monthCount`).d('月份调整'),
    },
    {
      name: 'weekCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.weekCount`).d('星期调整'),
    },
    {
      name: 'festivalCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.festivalCount`).d('节日调整'),
    },
    {
      name: 'activityCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.activityCount`).d('促销活动调整'),
    },
    {
      name: 'discountCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.discountCount`).d('折扣调整'),
    },
    {
      name: 'lifecycleCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.lifecycleCount`).d('生命周期调整'),
    },
    {
      name: 'aiQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.aiQty`).d('智能预测销量'),
    },
    {
      name: 'manualCount',
      type: 'string',
      label: intl.get(`${intlPrefix}.manualCount`).d('人工预测调整'),
    },
    {
      name: 'manualDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.manualDesc`).d('调整说明'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-version-days`,
        data: {
          ...data,
          ...data.queryObj,
          queryObj: null,
        },
        method: 'GET',
      };
    },
  },
});

export {
  PredictionVersionListDS,
  PredictionVersionHeadDS,
  PredictionVersionLineQueryDS,
  PredictionVersionLineDS,
  PredictionVersionSourceDS,
};
