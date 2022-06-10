/**
 * @Description:销售预测任务-销售预测详情
 * @Author: qifeng.deng@hand.com
 * @Date: 2021-06-22 21:26:02
 */

// 多语言处理工具
import intl from 'utils/intl';
// 引入utils里的两个方法   干啥用的?
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
// 后端API基地址  先注释使用本地服务地址
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';

// 正则判断校验
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { naturalNumberValidator } from '@/utils/validator';
// 值集的引入
import codeConfig from '@/common/codeConfig';
// 时间处理插件
import moment from 'moment';
// 时间处理规则
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

// 自定义基地址常量
// const HLOS_ZPLAN = '/hzmc-plan-32184';
const intlPrefix = 'zplan.saleTemlate.model';
// 用于获取所需要的值集对象
const { common, saleTemplate, saleTask } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
// 修改基地址 加上-工号
const url = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-templates`;
const itemRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-item-rels`;
const entityRelsUrl = `${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-entity-rels`;

const listDS = () => ({
  // autoQuery:true 自动先查询获取相关数据
  autoQuery: true,
  // 查询方式 name为字段名  type是输入框的类型 string普通input输入框  label文本提示,intl为多语言处理
  // lookupCode下拉列表 值列表diamante  multiple 查询时将字符串分割成数组,提交时将数组拼接成字符串  required 是否必填
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
      // lookupCode下拉列表
      // 他的值是怎么引入的
      lookupCode: saleTask.predictionStatus,
      multiple: true, // 设置多选
      label: intl.get(`${intlPrefix}.saleTemplateStatusList`).d('预测任务状态'),
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      lookupCode: saleTask.predictionType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      name: 'userMessage',
      type: 'object',
      // LOV配置代码
      lovCode: common.userOrg,
      // lovPara  LOV或Lookup查询的对象
      lovPara: {
        enabledFlag: 1,
      },
      // 忽略提交  总是忽略
      ignore: 'always',
      label: intl.get(`${intlPrefix}.userMessage`).d('预测人'),
    },
    {
      name: 'predictedBy',
      type: 'string',
      bind: 'userMessage.id',
    },
    // 将两个日期分开来传
    {
      name: 'predictionStartDate',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      // format: 'YYYY-MM-DD HH:mm:ss',
      // val是当前的对象有两个值start,end 所以需要.start取值
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'predictionEndDate',
      type: 'date',
      bind: 'predictionStartDate.end',
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      // format: 'YYYY-MM-DD HH:mm:ss',
      // 这里已经bind绑定了predictionStartDate.end  所以val值就是end的值
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
      name: 'saleTemplateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      required: true,
      lookupCode: saleTask.predictionType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      name: 'predictedName',
      type: 'string',
      label: intl.get(`${intlPrefix}.predictedName`).d('预测人'),
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      required: true,
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      // 在发送请求之前对数据进行处理  相当于Vue中的filter局部过滤器 val是当前值
      transformRequest: (val) => (val ? moment(val).format('YYYY/MM/DD') : null),
      format: 'YYYY/MM/DD',
      // transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      // format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'saleTemplateStatus',
      type: 'string',
      lookupCode: saleTemplate.saleTemplateStatus,
      required: true,
      label: intl.get(`${intlPrefix}.saleTemplateStatus`).d('状态'),
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
  // 初始化时，如果没有记录且 autoQuery 为 false，则自动创建记录
  autoCreate: true,
  fields: [
    {
      name: 'saleTemplateNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.saleTemplateNum`).d('预测任务编号'),
    },
    {
      name: 'saleTemplateName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.saleTemplateName`).d('预测任务名称'),
    },
    {
      name: 'saleTemplateStatus',
      type: 'string',
      lookupCode: saleTask.predictionStatus,
      defaultValue: 'NEW', // 默认值
      // 如果设置multiple: true, 会传数组类型,可能需要做处理
      label: intl.get(`${intlPrefix}.saleTemplateStatus`).d('预测任务状态'),
    },
    {
      name: 'saleTemplateType',
      type: 'string',
      required: true,
      lookupCode: saleTask.predictionType,
      label: intl.get(`${intlPrefix}.saleTemplateType`).d('预测类型'),
    },
    {
      // userMessage是自己定义的字段名 用于存储值集对象
      name: 'userMessage',
      type: 'object', // 值集类型要写成object
      lovCode: common.userOrg,
      lovPara: {
        enabledFlag: 1,
      },
      // 提交时忽略
      ignore: 'always',
      // required: true,
      // textField: 'salesEntityCode',
      label: intl.get(`${intlPrefix}.userMessage`).d('预测人'),
      // 动态属性
      dynamicProps: {
        required: ({ record }) => {
          return record.get('saleTemplateType') === 'MANUAL';
        },
      },
    },
    // bind 绑定两个值进行调用接口传参
    {
      name: 'predictedBy',
      type: 'string',
      bind: 'userMessage.id',
    },
    {
      name: 'predictedName',
      type: 'string',
      bind: 'userMessage.realName',
    },
    {
      name: 'predictionStartDate',
      type: 'date',
      required: true,
      label: intl.get(`${intlPrefix}.predictionStartDate`).d('预测日期从'),
      // 前端传给后端的
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD 00:00:00') : null),
      // 前端自己处理显示的
      format: 'YYYY-MM-DD',
    },
    {
      name: 'predictionGap',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.predictionGap`).d('预期日期间隔(天)'),
      validator: naturalNumberValidator,
    },
  ],
  // 进行相关DS操作时会调用transport里的
  transport: {
    // data就是DS里传过来的所有数据
    read: ({ data }) => {
      const { saleTemplateId } = data;
      return {
        data,
        url: `${url}/${saleTemplateId}`,
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

const paramsDS = () => ({
  // autoCreate点击编号跳转详情页就可以拿到paramsDS了
  autoCreate: true,
  fields: [
    {
      name: 'lifecycleLength',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.lifecycleLength`).d('预测日期长度(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'runStartDate',
      type: 'date',
      required: true,
      label: intl.get(`${intlPrefix}.runStartDate`).d('运行开始时间'),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'runEndDate',
      type: 'date',
      required: true,
      // 最小值为运行开始时间
      min: 'runStartDate',
      label: intl.get(`${intlPrefix}.runEndDate`).d('运行结束时间'),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'runGap',
      type: 'number',
      required: true,
      label: intl.get(`${intlPrefix}.runGap`).d('运行间隔 (小时)'),
    },
    {
      name: 'lastRunDate',
      type: 'date',
      ignore: 'clean',
      label: intl.get(`${intlPrefix}.lastRunDate`).d('上次运行时间'),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'nextRunDate',
      type: 'date',
      ignore: 'clean',
      min: 'lastRunDate',
      label: intl.get(`${intlPrefix}.nextRunDate`).d('下次运行时间'),
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
  ],
  transport: {
    // data就是DS里传过来的所有数据
    read: ({ data }) => {
      const { saleTemplateId } = data;
      return {
        data,
        url: `${url}/${saleTemplateId}`,
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

const saleItemRelDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.item,
      label: intl.get(`${intlPrefix}.itemObj`).d('物料编码'),
      required: true,
      // ignore: 'always',
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
  ],
  // 这是网络请求调用后端接口
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: itemRelsUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        data: data[0],
        url: itemRelsUrl,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        data: data[0],
        url: itemRelsUrl,
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: itemRelsUrl,
        data,
        method: 'DELETE',
      };
    },
  },
  // 这是生命周期吗?
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const entityItemRelDS = () => ({
  autoQuery: false,
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
      textField: 'salesEntityCode',
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
      label: intl.get(`${intlPrefix}.salesEntityObj`).d('销售实体说明'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: entityRelsUrl,
        method: 'GET',
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
});

export { listDS, headDS, saleItemRelDS, entityItemRelDS, paramsDS };
