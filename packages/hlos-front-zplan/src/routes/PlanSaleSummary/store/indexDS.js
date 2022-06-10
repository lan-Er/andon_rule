/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';
import moment from 'moment';

const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, planSaleSummary } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summarys`;
const selectVersionListUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates/template-and-version-list`;

const versionListUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-lines`;
const entityRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-summary-results`;

const handleSelectedLoad = async ({ dataSet }) => {
  await dataSet.ready();
  dataSet.records.forEach((item) => {
    if (item.get('saleVersionStatus') !== 'CONFIRMED') {
      item.selectable = false;
    }
  });
};

const listDS = () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'saleSummaryNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryNum`).d('预测汇总编号'),
    },
    {
      name: 'saleSummaryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryName`).d('预测汇总名称'),
    },
    {
      name: 'saleSummaryStatusList',
      type: 'string',
      lookupCode: planSaleSummary.saleSummaryStatus,
      multiple: true,
      label: intl.get(`${intlPrefix}.saleSummaryStatusList`).d('预测汇总状态'),
    },
    {
      name: 'predictionStartDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionStartDateStart`).d('预测日期从'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'predictionStartDateEnd',
      type: 'date',
      bind: 'predictionStartDateStart.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
    {
      name: 'predictionEndDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionEndDateStart`).d('预测日期至'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'predictionEndDateEnd',
      type: 'date',
      bind: 'predictionEndDateStart.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
  ],
  fields: [
    {
      name: 'saleSummaryNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryNum`).d('预测汇总编号'),
    },
    {
      name: 'saleSummaryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryName`).d('预测汇总名称'),
    },
    {
      name: 'predictionCalibrationFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.predictionCalibrationFlag`).d('人工预测校准'),
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测时间从'),
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测时间至'),
    },
    {
      name: 'predictionGap',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.predictionGap`).d('预测日期间隔（天）'),
    },
    {
      name: 'cleaningStatus',
      type: 'string',
      lookupCode: planSaleSummary.cleaningStatus,
      label: intl.get(`${intlPrefix}.cleaningStatus`).d('汇总计算状态'),
    },
    {
      name: 'saleSummaryStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryStatusMeaning`).d('预测汇总状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleTemplateStatusList } = data;
      return {
        data: {
          ...data,
          saleTemplateStatusList: undefined,
        },
        url: generateUrlWithGetParam(url, {
          saleTemplateStatusList,
        }),
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
  },
});

const headDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'saleSummaryNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryNum`).d('预测汇总编号'),
    },
    {
      name: 'saleSummaryName',
      required: true,
      type: 'string',
      label: intl.get(`${intlPrefix}.saleSummaryName`).d('预测汇总名称'),
    },
    {
      name: 'saleSummaryStatus',
      type: 'string',
      required: true,
      lookupCode: planSaleSummary.saleSummaryStatus,
      label: intl.get(`${intlPrefix}.saleSummaryStatus`).d('预测汇总状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'predictionCalibrationFlag',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.predictionCalibrationFlag`).d('人工预测校准'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '1',
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      max: 'predictionEndDate',
      required: true,
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      min: moment().format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      min: 'predictionStartDate',
      required: true,
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      name: 'predictionGap',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.predictionGap`).d('预测日期间隔（天）'),
      min: 1,
      validator: positiveNumberValidator,
    },
    {
      name: 'saleSummaryRule',
      type: 'string',
      lookupCode: planSaleSummary.saleSummaryRule,
      required: true,
      label: intl.get(`${intlPrefix}.saleSummaryRule`).d('汇总规则'),
    },
    {
      name: 'cleaningStatus',
      type: 'string',
      lookupCode: planSaleSummary.cleaningStatus,
      label: intl.get(`${intlPrefix}.cleaningStatus`).d('汇总计算状态'),
    },
    {
      name: 'cleaningProgress',
      type: 'number',
      label: intl.get(`${intlPrefix}.cleaningProgress`).d('汇总计算进度'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { saleSummaryId } = data;
      return {
        data,
        url: `${url}/${saleSummaryId}`,
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
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const versionListDS = () => {
  return {
    autoQuery: false,
    fields: [
      {
        name: 'saleTemplateNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
      },
      {
        name: 'saleTemplateName',
        type: 'string',
        label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
      },
      {
        name: 'saleVersionNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本'),
      },
      {
        name: 'saleTemplateTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.saleTemplateTypeMeaning`).d('预测类型'),
      },
      {
        name: 'predictedName',
        type: 'string',
        label: intl.get(`${intlPrefix}.predictedName`).d('预测人'),
      },
      {
        name: 'predictionStartDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      },
      {
        name: 'predictionEndDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
      },
      {
        name: 'predictionGap',
        type: 'string',
        label: intl.get(`${intlPrefix}.predictionGap`).d('预测日期间隔（天）'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          data,
          url: versionListUrl,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          data: data[0],
          url: versionListUrl,
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          data: data[0],
          url: versionListUrl,
          method: 'PUT',
        };
      },
      destroy: ({ data }) => {
        return {
          url: versionListUrl,
          data,
          method: 'DELETE',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

const selectVersionListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
    },
    {
      name: 'saleTemplateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'saleTemplateStatusList',
      type: 'string',
      lookupCode: planSaleSummary.saleTemplateStatus,
      multiple: true,
      label: intl.get(`${intlPrefix}.saleTemplateStatusList`).d('预测任务状态'),
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      lookupCode: planSaleSummary.saleTemplateType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      name: 'saleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本编号'),
    },
    {
      name: 'saleVersionStatusList',
      type: 'string',
      lookupCode: planSaleSummary.saleVersionStatus,
      multiple: true,
      label: intl.get(`${intlPrefix}.saleVersionStatusList`).d('预测版本状态'),
    },
    {
      name: 'receiverUserObj',
      lovCode: planSaleSummary.userOrg,
      type: 'object',
      label: intl.get(`${intlPrefix}.receiverUserObj`).d('预测人'),
      lovPara: {
        tenantId: organizationId,
      },
      ignore: 'always',
    },
    {
      name: 'predictedBy',
      type: 'string',
      bind: 'receiverUserObj.id',
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionEndDate`).d('预测日期至'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
    },
    {
      name: 'predictionEndDateEnd',
      type: 'date',
      bind: 'predictionEndDate.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
    },
    {
      name: 'latestFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.latestFlag`).d('仅显示最新版本'),
      trueValue: 1,
      falseValue: null,
      defaultValue: 1,
    },
  ],
  fields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
    },
    {
      name: 'saleTemplateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'saleTemplateStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateStatusMeaning`).d('预测任务状态'),
    },
    {
      name: 'saleVersionNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleVersionNum`).d('预测版本'),
    },
    {
      name: 'saleVersionStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateStatusMeaning`).d('预测版本状态'),
    },
    {
      name: 'saleTemplateTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateTypeMeaning`).d('预测类型'),
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
  ],
  transport: {
    read: ({ data }) => {
      const { saleTemplateStatusList, saleVersionStatusList } = data;

      return {
        data: {
          ...data,
          saleTemplateStatusList: null,
          saleVersionStatusList: null,
        },
        url: generateUrlWithGetParam(selectVersionListUrl, {
          saleTemplateStatusList,
          saleVersionStatusList,
        }),
        method: 'GET',
      };
    },
  },
  events: {
    load: handleSelectedLoad,
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const saleDataListDS = (list) => {
  let addFields = [];
  if (list && list.length) {
    addFields = list.map((i) => ({
      name: i,
      type: 'string',
      label: i,
    }));
  }

  const normalFields = [
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
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDesc`).d('单位'),
    },
    // {
    //   name: 'correctRate',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.correctRate`).d('平均准确率'),
    // },
  ];

  const fields = normalFields.concat(addFields);
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'startDate',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.startDate`).d('预测日期范围'),
        transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
      },
      {
        name: 'endDate',
        type: 'date',
        bind: 'startDate.end',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
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
        name: 'saleTemplateStatusList',
        type: 'string',
        lookupCode: planSaleSummary.saleTemplateStatus,
        multiple: true,
        label: intl.get(`${intlPrefix}.saleTemplateStatusList`).d('预测汇总状态'),
      },
    ],
    fields,
    transport: {
      read: ({ data }) => {
        return {
          data,
          url: entityRelsUrl,
          method: 'GET',
          transformResponse: (value) => {
            if (!value) {
              return;
            }

            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item) => {
                const params = {};
                if (item.planSaleSummaryDayList && item.planSaleSummaryDayList.length) {
                  item.planSaleSummaryDayList.forEach((ele) => {
                    params[ele.saleDate.split(' ')[0]] = ele.predictionQty;
                  });
                }

                return {
                  ...item,
                  ...params,
                };
              });
            }
            return { ...newValue, content };
          },
        };
      },
      create: ({ data }) => {
        return {
          data: data[0],
          url: entityRelsUrl,
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          data: data[0],
          url: entityRelsUrl,
          method: 'PUT',
        };
      },
      destroy: ({ data }) => {
        return {
          url: entityRelsUrl,
          data,
          method: 'DELETE',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

const selectHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'startDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.startDate`).d('预测日期范围'),
      transformRequest: (val) => (val ? moment(val.start).format('YYYY-MM-DD 00:00:00') : null),
      defaultValue: { start: new Date() },
    },
    {
      name: 'endDate',
      type: 'date',
      bind: 'startDate.end',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 23:59:59') : null),
      defaultValue: moment(new Date()).add(90, 'days'),
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
      name: 'itemDesc',
      type: 'string',
      bind: 'itemObj.itemDesc',
    },
    {
      name: 'itemAttr',
      type: 'object',
      ignore: 'always',
      label: intl.get(`${intlPrefix}.itemObj`).d('关键属性'),
    },
  ],
});
export { listDS, headDS, versionListDS, saleDataListDS, selectVersionListDS, selectHeadDS };
