/*
 * @Description: 质量检模板--DS
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common, inspectionTemplate } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/inspection-templates`;
const commonCode = 'lmds.common.model';

const noticeMessage = intl
  .get('lmds.inspectionTemplate.model.min-max-valid')
  .d('默认上限需大等于默认下限');

const inspectionTemListDS = () => {
  return {
    primaryKey: 'templateId',
    name: 'inspectionTemplate',
    autoQuery: true,
    transport: {
      // read: ({ config }) => {
      //   return {
      //     url: commonUrl,
      //     ...config,
      //     method: 'GET',
      //   };
      // },
      read: ({ data }) => {
        const { inspectionTemplateType: inspectionTemplateTypeList } = data;
        return {
          url: generateUrlWithGetParam(commonUrl, {
            inspectionTemplateTypeList,
          }),
          data: {
            ...data,
            inspectionTemplateType: undefined,
          },
          method: 'GET',
        };
      },
    },
    // inspectionTemplateType

    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.mode.item').d('物料'),
        lovCode: common.item,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'inspectionGroupObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.inspectionItemGroupName').d('检验项目组'),
        lovCode: common.inspectionGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'inspectionGroupId',
        type: 'string',
        bind: 'inspectionGroupObj.inspectionGroupId',
      },
      {
        name: 'inspectionTemplateType',
        type: 'string',
        multiple: true,
        label: intl.get('lmds.inspectionTemplate.model.inspectionTemplateType').d('模板类型'),
        lookupCode: inspectionTemplate.templateType,
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.itemCategory').d('物料类别'),
        lovCode: common.categories,
        lovPara: { categorySetCode: 'MEWM' },
        ignore: 'always',
      },
      {
        name: 'categoryId',
        type: 'string',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.modeldevice.party').d('商业伙伴'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.partyId',
      },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.operation').d('工序'),
        lovCode: common.operation,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'operationId',
        type: 'string',
        bind: 'operationObj.operationId',
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.resource').d('资源'),
        ignore: 'always',
        lovCode: common.resource,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
    ],
    fields: [
      {
        name: 'organizationName',
        type: 'string',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'organizationCode',
        type: 'string',
      },
      {
        name: 'inspectionGroupName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionGroupName').d('检验组'),
      },
      {
        name: 'inspectionTemplateTypeMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionTemplateType').d('模板类型'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.mode.item').d('物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        validator: descValidator,
      },
      {
        name: 'categoryName',
        type: 'string',
        label: intl.get('hiot.deviceManage.model.itemCategory').d('物料类别'),
      },
      {
        name: 'operationName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.operation').d('工序'),
      },
      {
        name: 'routingOperationName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.routingOperation').d('工艺路线工序'),
      },
      {
        name: 'partyName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.party').d('商业伙伴'),
      },
      {
        name: 'resourceName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.resource').d('资源'),
      },
      {
        name: 'inspectorGroupName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectorGroup').d('检验员组'),
      },
      {
        name: 'inspectorName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspector').d('检验员'),
      },
      {
        name: 'inspectionStandard',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionStandard').d('检验标准'),
      },
      {
        name: 'samplingTypeMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.samplingType').d('抽样类型'),
      },
      {
        name: 'samplingStandardMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.samplingStandard').d('抽样标准'),
      },
      {
        name: 'sampleValue',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.sampleValue').d('检验样品值'),
      },
      {
        name: 'sampleJudgeModeMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.sampleJudgeModeMeaning').d('判定模式'),
      },
      {
        name: 'frequencyTypeMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.frequencyType').d('检验频率类型'),
      },
      {
        name: 'frequencyValue',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.frequencyValue').d('检验频率值'),
      },
      {
        name: 'standardInspectTime',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.standardInspectTime').d('标准时长（h）'),
      },
      {
        name: 'docProcessRuleName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.ruleName').d('检验单处理规则'),
      },
      {
        name: 'autoFeedbackResult',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.autoFeedbackResult').d('是否自动反馈'),
      },
      {
        name: 'referenceDocument',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.autoFeedbackResult').d('参考文件'),
      },
      {
        name: 'instruction',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.instruction').d('操作说明'),
      },
      {
        name: 'drawingCode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.drawingCode').d('参考图纸'),
      },
      {
        name: 'autoJudgeFlag',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.autoJudgeFlag').d('是否自动判定'),
      },
      {
        name: 'syncFlag',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.syncFlag').d('同步'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      },
    ],
  };
};
// 质检模板详情
const inspectionTemDetailDS = () => {
  return {
    primaryKey: 'templateId',
    name: 'inspectionTemplateDetail',
    autoQuery: false,
    transport: {
      read: ({ config }) => {
        return {
          ...config,
          url: commonUrl,
          method: 'get',
        };
      },
      /**
       * 创建质检模板
       * @param data
       */
      submit: ({ data }) => ({
        url: commonUrl,
        method: 'post',
        data: data[0],
      }),
    },
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'inspectionGroupObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.inspectionGroupName').d('检验组'),
        lovCode: common.inspectionGroup,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'inspectionGroupId',
        type: 'string',
        bind: 'inspectionGroupObj.inspectionGroupId',
      },
      {
        name: 'inspectionGroupName',
        type: 'string',
        bind: 'inspectionGroupObj.inspectionGroupName',
      },
      {
        name: 'inspectionTemplateType',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionTemplateType').d('模板类型'),
        lookupCode: inspectionTemplate.templateType,
        required: true,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.mode.item').d('物料'),
        lovCode: common.item,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        bind: 'itemObj.description',
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.itemCategory').d('物料类别'),
        lovCode: common.categories,
        lovPara: { categorySetCode: 'MEWM' },
        ignore: 'always',
      },
      { name: 'categoryId', type: 'string', bind: 'itemCategoryObj.categoryId' },
      { name: 'categoryName', type: 'string', bind: 'itemCategoryObj.categoryName' },
      { name: 'categoryCode', type: 'string', bind: 'itemCategoryObj.categoryCode' },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.operation').d('工序'),
        lovCode: common.operation,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'operationId',
        type: 'string',
        bind: 'operationObj.operationId',
      },
      {
        name: 'operationName',
        type: 'string',
        bind: 'operationObj.operationName',
      },
      {
        name: 'operation',
        type: 'string',
        bind: 'operationObj.operationCode',
      },
      {
        name: 'routingOperationObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.routingOperation').d('工艺路线工序'),
        lovCode: inspectionTemplate.routingOperation,
        textField: 'operationName',
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemId: record.get('itemId'),
            categoryId: record.get('categoryId'),
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'routingOperationId',
        type: 'string',
        bind: 'routingOperationObj.routingOperationId',
      },
      {
        name: 'routingOperationName',
        type: 'string',
        bind: 'routingOperationObj.operationName',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.modeldevice.party').d('商业伙伴'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        bind: 'partyObj.partyName',
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.resource').d('资源'),
        ignore: 'always',
        lovCode: common.resource,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceName',
        type: 'string',
        bind: 'resourceObj.resourceName',
      },
      {
        name: 'inspectorGroupObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.inspectorGroup').d('检验员组'),
        ignore: 'always',
        lovCode: common.workerGroup,
      },
      {
        name: 'inspectorGroupId',
        type: 'string',
        bind: 'inspectorGroupObj.workerGroupId',
      },
      {
        name: 'inspectorGroupName',
        type: 'string',
        bind: 'inspectorGroupObj.workerGroupName',
      },
      {
        name: 'inspectorObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.inspector').d('检验员'),
        lovCode: common.worker,
        dynamicProps: {
          lovPara: ({ record }) => ({
            WORKER_TYPE: 'INSPECTOR',
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'inspectorId',
        type: 'string',
        bind: 'inspectorObj.workerId',
      },
      {
        name: 'inspectorName',
        type: 'string',
        bind: 'inspectorObj.workerName',
      },
      {
        name: 'inspectionStandard',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionStandard').d('检验标准'),
      },
      {
        name: 'samplingType',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.samplingType').d('抽样类型'),
        lookupCode: inspectionTemplate.samplingType,
      },
      {
        name: 'samplingStandard',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.samplingStandard').d('抽样标准'),
        lookupCode: inspectionTemplate.samplingStandard,
      },
      {
        name: 'sampleValue',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.sampleValue').d('检验样品值'),
      },
      {
        name: 'sampleJudgeMode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.sampleJudgeMode').d('判定模式'),
        lookupCode: inspectionTemplate.sampleJudgeMode,
      },
      {
        name: 'frequencyType',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.frequencyType').d('检验频率类型'),
        lookupCode: inspectionTemplate.frequencyType,
      },
      {
        name: 'frequencyValue',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.frequencyValue').d('检验频率值'),
        min: 1,
        step: 1,
      },
      {
        name: 'standardInspectTime',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.standardInspectTime').d('标准时长（h）'),
        min: 0,
        step: 0.01,
      },
      {
        name: 'docProcessRuleObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.ruleName').d('检验单处理规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleClass: 'INSPECTION',
          ruleType: 'DOC_PROCESS',
        },
      },
      {
        name: 'docProcessRuleId',
        type: 'string',
        bind: 'docProcessRuleObj.ruleId',
      },
      {
        name: 'docProcessRuleName',
        type: 'string',
        bind: 'docProcessRuleObj.ruleName',
      },
      {
        name: 'autoFeedbackResult',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.autoFeedbackResult').d('是否自动反馈'),
      },
      {
        name: 'referenceDocument',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.autoFeedbackResult').d('参考文件'),
      },
      {
        name: 'instruction',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.instruction').d('操作说明'),
      },
      {
        name: 'drawingCode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.drawingCode').d('参考图纸'),
      },
      {
        name: 'syncFlag',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.syncFlag').d('同步'),
      },
      {
        name: 'autoJudgeFlag',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.autoJudgeFlag').d('是否自动判定'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
        defaultValue: true,
        required: true,
      },
    ],
    events: {
      update: ({ record, name }) => {
        if (name === 'organizationObj') {
          record.set('inspectionGroupObj', null);
          record.set('itemObj', null);
          record.set('operationObj', null);
          record.set('routingOperationObj', null);
          record.set('resourceObj', null);
        }
        if (name === 'itemObj') {
          record.set('routingOperationObj', null);
        }
        if (name === 'itemCategoryObj') {
          record.set('routingOperationObj', null);
        }
      },
    },
  };
};

const inspectionTemLineDS = () => {
  return {
    paging: false,
    selection: false,
    primaryKey: 'templateLineId',
    name: 'inspectionTemLine',
    autoQuery: false,
    transport: {
      read: ({ config, data }) => {
        const { templateId: inspectionTemplateId } = data || {};
        return {
          ...config,
          data: { inspectionTemplateId, page: -1 },
          url: `${HLOS_LMDS}/v1/${organizationId}/inspection-template-lines`,
          method: 'get',
        };
      },
    },
    fields: [
      {
        name: 'inspectionItemId',
        type: 'string',
        disabled: true,
      },
      {
        name: 'inspectionItemName',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionItem').d('检验项'),
      },
      {
        name: 'resultType',
        type: 'string',
      },
      {
        name: 'resultTypeMeaning',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.resultType').d('结果类型'),
      },
      {
        name: 'inspectionResourceObj',
        type: 'object',
        label: intl.get('lmds.inspectionTemplate.model.inspectionResource').d('检测工具'),
        lovCode: inspectionTemplate.inspectionResource,
        textField: 'resourceName',
        ignore: 'always',
        readOnly: true,
      },
      {
        name: 'inspectionResourceId',
        type: 'string',
        bind: 'inspectionResourceObj.inspectionResourceId',
      },
      {
        name: 'inspectionResource',
        type: 'string',
        bind: 'inspectionResourceObj.resourceName',
      },
      {
        name: 'ucl',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.ucl').d('默认上限'),
        validator: (value, name, form) => {
          const { ucl, lcl } = form.toData();
          return ucl && lcl ? Number(ucl) >= Number(lcl) || noticeMessage : true;
        },
        readOnly: true,
      },
      {
        name: 'uclAccept',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.uclAccept').d('包含上限值'),
        readOnly: true,
      },
      {
        name: 'lcl',
        type: 'number',
        label: intl.get('lmds.inspectionTemplate.model.lcl').d('默认下限'),
        validator: (value, name, form) => {
          const { ucl, lcl } = form.toData();
          return ucl && lcl ? Number(ucl) >= Number(lcl) || noticeMessage : true;
        },
        readOnly: true,
      },
      {
        name: 'lclAccept',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.lclAccept').d('包含下限值'),
        readOnly: true,
      },
      {
        name: 'necessaryFlag',
        type: 'boolean',
        label: intl.get('lmds.inspectionTemplate.model.necessaryFlag').d('是否必输'),
        readOnly: true,
      },
      {
        name: 'orderByCode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.orderByCode').d('显示顺序'),
        readOnly: true,
      },
      {
        name: 'inspectionSection',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.inspectionSection').d('分段'),
        readOnly: true,
      },
      {
        name: 'sectionOrderCode',
        type: 'string',
        label: intl.get('lmds.inspectionTemplate.model.sectionOrderCode').d('分段顺序'),
        readOnly: true,
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        defaultValue: true,
        label: intl.get('lmds.common.model.enabledFlag').d('是否有效'),
        readOnly: true,
      },
    ],
  };
};

export {
  inspectionTemListDS, // 质量检查列表展示
  inspectionTemDetailDS, // 质量检查详情展示
  inspectionTemLineDS, // 质量检查行展示
};
