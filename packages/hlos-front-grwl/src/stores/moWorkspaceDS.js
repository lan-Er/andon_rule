/**
 * @Description: MO工作台管理信息--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesMoWorkspace } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

const MoListDS = () => {
  return {
    pageSize: 100,
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
        name: 'ownerOrganizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumObj.moId',
        ignore: 'always',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNum',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
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
        ignore: 'always',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: lmesMoWorkspace.moStatus,
        multiple: true,
        defaultValue: ['NEW', 'RELEASED', 'PLANNED', 'PENDING'],
      },
      {
        name: 'apsOuObj',
        type: 'object',
        label: intl.get(`${preCode}.apsOu`).d('计划中心'),
        lovCode: common.apsOu,
        ignore: 'always',
      },
      {
        name: 'apsOuId',
        type: 'string',
        bind: 'apsOuObj.apsOuId',
      },
      {
        name: 'apsOuName',
        type: 'string',
        bind: 'apsOuObj.apsOuName',
        ignore: 'always',
      },
      {
        name: 'apsGroupObj',
        type: 'object',
        label: intl.get(`${preCode}.apsGroup`).d('计划组'),
        lovCode: common.apsGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            apsOuId: record.get('apsOuId'),
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'apsGroupId',
        type: 'string',
        bind: 'apsGroupObj.groupId',
      },
      {
        name: 'apsGroupName',
        type: 'string',
        bind: 'apsGroupObj.groupName',
        ignore: 'always',
      },
      {
        name: 'apsResourceObj',
        type: 'object',
        label: intl.get(`${preCode}.apsResource`).d('计划资源'),
        lovCode: common.apsResource,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            apsOuId: record.get('apsOuId'),
            apsGroupId: record.get('apsGroupId'),
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'apsResourceId',
        type: 'string',
        bind: 'apsResourceObj.apsResourceId',
      },
      {
        name: 'apsResourceName',
        type: 'string',
        bind: 'apsResourceObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
      },
      {
        name: 'moTypeId',
        type: 'string',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'moTypeName',
        type: 'string',
        bind: 'moTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'prodLineId',
        type: 'string',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'equipmentId',
        type: 'string',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'topMoNum',
        type: 'string',
        label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      },
      {
        name: 'parentMoNums',
        type: 'string',
        label: intl.get(`${preCode}.parentMos`).d('父MO'),
      },
      {
        name: 'soObj',
        type: 'object',
        label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
        lovCode: common.soNum,
        ignore: 'always',
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'soObj.soHeaderId',
      },
      {
        name: 'soNum',
        type: 'string',
        bind: 'soObj.soHeaderNumber',
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        lovCode: common.demandNum,
        ignore: 'always',
      },
      {
        name: 'demandId',
        type: 'string',
        bind: 'demandObj.demandId',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandObj.demandNumber',
      },
      {
        name: 'customerName',
        label: intl.get(`${preCode}.customer`).d('客户'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.category`).d('类别'),
        lovCode: common.categories,
        lovPara: { categorySet: 'ITEM_ME' },
        ignore: 'always',
      },
      {
        name: 'categoryId',
        type: 'string',
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'categoryName',
        type: 'string',
        bind: 'categoryObj.categoryName',
      },
      {
        name: 'mtoExploredFlag',
        type: 'string',
        label: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
        lookupCode: common.flag,
      },
      {
        name: 'creatorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.creator`).d('制单人'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'creatorId',
        bind: 'creatorObj.workerId',
      },
      {
        name: 'creatorName',
        bind: 'creatorObj.workerName',
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${preCode}.creationDateStart`).d('制单时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('creationDateEnd')) {
              return 'creationDateEnd';
            }
          },
        },
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.creationDateEnd`).d('制单时间<='),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${preCode}.startDemandDate`).d('需求时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('demandDateEnd')) {
              return 'demandDateEnd';
            }
          },
        },
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.endDemandDate`).d('需求时间<='),
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'planStartDateLeft',
        type: 'time',
        label: intl.get(`${preCode}.startPlanDate`).d('计划开始>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planStartDateRight')) {
              return 'planStartDateRight';
            }
          },
        },
      },
      {
        name: 'planStartDateRight',
        type: 'time',
        label: intl.get(`${preCode}.endPlanDate`).d('计划开始<='),
        min: 'planStartDateLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { moStatus: moStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/mos`, {
            moStatusList,
          }),
          data: {
            ...data,
            moStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DetailPlanDS = () => {
  return {
    autoCreate: true,
    selection: false,
    fields: [
      {
        name: 'organizationId',
        type: 'string',
        ignore: 'always',
      },
      {
        name: 'apsOuObj',
        type: 'object',
        label: intl.get(`${preCode}.apsOu`).d('计划中心'),
        lovCode: common.apsOu,
        ignore: 'always',
      },
      {
        name: 'apsOuId',
        type: 'string',
        bind: 'apsOuObj.apsOuId',
      },
      {
        name: 'apsOuCode',
        type: 'string',
        bind: 'apsOuObj.apsOuCode',
      },
      {
        name: 'apsOuName',
        type: 'string',
        bind: 'apsOuObj.apsOuName',
        ignore: 'always',
      },
      {
        name: 'apsGroupObj',
        type: 'object',
        label: intl.get(`${preCode}.apsGroup`).d('计划组'),
        lovCode: common.apsGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            apsOuId: record.get('apsOuId'),
          }),
        },
      },
      {
        name: 'apsGroupId',
        type: 'string',
        bind: 'apsGroupObj.groupId',
      },
      {
        name: 'apsGroupCode',
        type: 'string',
        bind: 'apsGroupObj.groupCode',
      },
      {
        name: 'apsGroupName',
        type: 'string',
        bind: 'apsGroupObj.groupName',
        ignore: 'always',
      },
      {
        name: 'apsResourceObj',
        type: 'object',
        label: intl.get(`${preCode}.apsResource`).d('计划资源'),
        lovCode: common.apsResource,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            apsOuId: record.get('apsOuId'),
            apsGroupId: record.get('apsGroupId'),
          }),
        },
      },
      {
        name: 'apsResourceId',
        type: 'string',
        bind: 'apsResourceObj.apsResourceId',
      },
      {
        name: 'apsResourceCode',
        type: 'string',
        bind: 'apsResourceObj.apsResourceCode',
      },
      {
        name: 'apsResourceName',
        type: 'string',
        bind: 'apsResourceObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'resourceRule',
        type: 'string',
        label: intl.get(`${preCode}.resourceRule`).d('资源分配规则'),
        lookupCode: common.apsResourceRule,
      },
      {
        name: 'relatedResourceObj',
        type: 'object',
        label: intl.get(`${preCode}.relatedResource`).d('关联资源'),
        lovCode: common.apsResource,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            apsOuId: record.get('apsOuId'),
            apsGroupId: record.get('apsGroupId'),
          }),
        },
      },
      {
        name: 'relatedResourceId',
        type: 'string',
        bind: 'relatedResourceObj.apsResourceId',
      },
      {
        name: 'relatedResourceCode',
        type: 'string',
        bind: 'relatedResourceObj.apsResourceCode',
      },
      {
        name: 'relatedResourceName',
        type: 'string',
        bind: 'relatedResourceObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'planQty',
        label: intl.get(`${preCode}.planQty`).d('计划数量'),
      },
      {
        name: 'planRule',
        type: 'string',
        label: intl.get(`${preCode}.planRule`).d('计划规则'),
        lookupCode: lmesMoWorkspace.planRule,
      },
      {
        name: 'planLevel',
        label: intl.get(`${preCode}.planLevel`).d('计划层级'),
      },
      {
        name: 'planPriority',
        label: intl.get(`${preCode}.planPriorty`).d('计划优先级'),
      },
      {
        name: 'capacityType',
        type: 'string',
        label: intl.get(`${preCode}.capacityType`).d('能力类型'),
        lookupCode: lmesMoWorkspace.capacityType,
      },
      {
        name: 'capacityValue',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.capacityValue`).d('能力值'),
      },
      {
        name: 'moReferenceType',
        type: 'string',
        label: intl.get(`${preCode}.referenceType`).d('参考类型'),
        lookupCode: lmesMoWorkspace.referenceType,
      },
      {
        name: 'referenceMoObj',
        type: 'object',
        label: intl.get(`${preCode}.referenceMo`).d('参考MO'),
        lovCode: common.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'referenceMoId',
        type: 'string',
        bind: 'referenceMoObj.moId',
        ignore: 'always',
      },
      {
        name: 'referenceMoNum',
        type: 'string',
        bind: 'referenceMoObj.moNum',
      },
      {
        name: 'earliestStartTime',
        label: intl.get(`${preCode}.earliestStartTime`).d('最早开始时间'),
      },
      {
        name: 'startTime',
        label: intl.get(`${preCode}.startTime`).d('开始时间'),
      },
      {
        name: 'fulfillTime',
        label: intl.get(`${preCode}.fulfillTime`).d('最终完成时间'),
      },
      {
        name: 'scheduleReleaseTime',
        label: intl.get(`${preCode}.scheduleReleaseTime`).d('计划下达时间'),
      },
      {
        name: 'fpsTime',
        label: 'FPS',
      },
      {
        name: 'fpcTime',
        label: 'FPC',
      },
      {
        name: 'lpsTime',
        label: 'LPS',
      },
      {
        name: 'lpcTime',
        label: 'LPC',
      },
      {
        name: 'mpsLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.mpsLeadTime`).d('主计划提前期(天)'),
      },
      {
        name: 'exceedLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.exceedLead`).d('最大提前(天)'),
      },
      {
        name: 'preProcessLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.preProcessLeadTime`).d('前处理LT(小时)'),
      },
      {
        name: 'processLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.processLeadTime`).d('处理LT(小时)'),
      },
      {
        name: 'postProcessLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.postProcessLeadTime`).d('后处理LT(小时)'),
      },
      {
        name: 'safetyLeadTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.safetyLeadTime`).d('安全周期(小时)'),
      },
      {
        name: 'switchTime',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.switchTime`).d('切换时间(小时)'),
      },
      {
        name: 'releaseTimeFence',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.releaseTimeFence`).d('下达TF(小时)'),
      },
      {
        name: 'orderTimeFence',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.orderTimeFence`).d('订单TF(小时)'),
      },
      {
        name: 'planRemark',
        type: 'string',
        label: intl.get(`${preCode}.planRemark`).d('计划备注'),
      },
      {
        name: 'specialColor',
        type: 'color',
        label: intl.get(`${preCode}.specialColor2`).d('颜色标识'),
        // 颜色选择按钮
      },
      {
        name: 'resourceFixFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.resourceFix`).d('固定资源'),
      },
      {
        name: 'releaseRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.releaseRule`).d('下达策略'),
        lovCode: common.rule,
        textField: 'ruleName',
        ignore: 'always',
        dynamicProps: {
          lovPara: () => ({
            ruleType: 'RELEASE',
          }),
        },
      },
      {
        name: 'releaseRuleId',
        type: 'string',
        bind: 'releaseRuleObj.ruleId',
      },
      {
        name: 'releaseRuleName',
        type: 'string',
        bind: 'releaseRuleObj.ruleName',
      },
      {
        name: 'releaseRule',
        type: 'string',
        bind: 'releaseRuleObj.ruleJson',
      },
      {
        name: 'planFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.planFlag`).d('计划标识'),
        defaultValue: true,
      },
      {
        name: 'endingFlag',
        label: intl.get(`${preCode}.endingFlag`).d('计划尾单'),
      },
      {
        name: 'planWarnningFlag',
        label: intl.get(`${preCode}.planWarnning`).d('计划警告'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-plans/get-mo-plan-by-mo-id`,
          method: 'GET',
        };
      },
    },
    events: {
      update: ({ name, record }) => {
        // const releaseRuleObj = record.get('releaseRuleObj');
        if (name === 'apsOuObj') {
          // record.set('apsGroupObj', null);
          // record.set('apsResourceObj', null);
          // record.set('relatedResourceObj', null);
        }
        if (name === 'apsGroupObj') {
          record.set('apsResourceObj', null);
          record.set('relatedResourceObj', null);
        }
        // if (name === 'releaseRuleObj' && releaseRuleObj && releaseRuleObj.ruleJson) {
        //   record.set('releaseRule', JSON.parse(releaseRuleObj.ruleJson));
        // }
      },
    },
  };
};

const DetailExecuteDS = () => {
  return {
    selection: false,
    fields: [
      {
        name: 'organizationId',
        type: 'string',
      },
      {
        name: 'itemControlType',
        type: 'string',
        label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
        lookupCode: lmesMoWorkspace.itemControlType,
      },
      {
        name: 'meOuObj',
        type: 'object',
        label: intl.get(`${preCode}.meOu`).d('工厂'),
        lovCode: common.meOu,
        ignore: 'always',
      },
      {
        name: 'meOuId',
        type: 'string',
        bind: 'meOuObj.meOuId',
      },
      {
        name: 'meOuCode',
        type: 'string',
        bind: 'meOuObj.meOuCode',
      },
      {
        name: 'meOuName',
        type: 'string',
        bind: 'meOuObj.organizationName',
      },
      {
        name: 'meAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.meArea`).d('车间'),
        lovCode: common.meArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'meAreaId',
        type: 'string',
        bind: 'meAreaObj.meAreaId',
      },
      {
        name: 'meAreaCode',
        type: 'string',
        bind: 'meAreaObj.meAreaCode',
      },
      {
        name: 'meAreaName',
        type: 'string',
        bind: 'meAreaObj.meAreaName',
      },
      {
        name: 'prodLineObj',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        type: 'object',
        lovCode: common.prodLine,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        type: 'string',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineCode',
        type: 'string',
        bind: 'prodLineObj.prodLineCode',
      },
      {
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
      },
      {
        name: 'executeStatus',
        type: 'string',
        label: intl.get(`${preCode}.executeStatus`).d('执行状态'),
        lookupCode: lmesMoWorkspace.executeStatus,
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${preCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workcellId',
        type: 'string',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellCode',
        type: 'string',
        bind: 'workcellObj.workcellCode',
      },
      {
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'equipmentId',
        type: 'string',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentCode',
        type: 'string',
        bind: 'equipmentObj.equipmentCode',
      },
      {
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${preCode}.workGroup`).d('班组'),
        lovCode: common.workerGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            meOuId: record.get('meOuId'),
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerGroupId',
        type: 'string',
        bind: 'workerGroupObj.workerGroupId',
      },
      {
        name: 'workerGroup',
        type: 'string',
        bind: 'workerGroupObj.workerGroupCode',
      },
      {
        name: 'workerGroupName',
        type: 'string',
        bind: 'workerGroupObj.workerGroupName',
      },
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${preCode}.worker`).d('操作工'),
        lovCode: common.worker,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('meOuId'),
            workerType: 'ME_OPERATOR',
          }),
        },
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'worker',
        type: 'string',
        bind: 'workerObj.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
      },
      {
        name: 'calendarDay',
        type: 'date',
        label: intl.get(`${preCode}.calendarDay`).d('指定日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'calendarShiftCode',
        type: 'string',
        label: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
        lookupCode: common.shift,
      },
      {
        name: 'completeWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ dataSet }) => {
            const parentObj = dataSet.parent.current;
            return {
              organizationId: parentObj.get('ownerOrganizationId'),
            };
          },
        },
      },
      {
        name: 'completeWarehouseId',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseId',
      },
      {
        name: 'completeWarehouseCode',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseCode',
      },
      {
        name: 'completeWarehouseName',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseName',
      },
      {
        name: 'completeWmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.completeWmArea`).d('完工货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('completeWarehouseId'),
          }),
        },
      },
      {
        name: 'completeWmAreaId',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaId',
      },
      {
        name: 'completeWmAreaCode',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaCode',
      },
      {
        name: 'completeWmAreaName',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaName',
      },
      {
        name: 'inventoryWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ dataSet }) => {
            const parentObj = dataSet.parent.current;
            return {
              organizationId: parentObj.get('ownerOrganizationId'),
            };
          },
        },
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWarehouseCode',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseCode',
      },
      {
        name: 'inventoryWarehouseName',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
      },
      {
        name: 'inventoryWmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('inventoryWarehouseId'),
          }),
        },
      },
      {
        name: 'inventoryWmAreaId',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWmAreaCode',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaCode',
      },
      {
        name: 'inventoryWmAreaName',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaName',
      },
      {
        name: 'supplyQty',
        label: intl.get(`${preCode}.supplyQty2`).d('供应数量'),
      },
      {
        name: 'inputQty',
        label: intl.get(`${preCode}.inputQty`).d('关键投入'),
      },
      {
        name: 'maxIssuedQty',
        label: intl.get(`${preCode}.maxIssuedQty`).d('最大投入'),
      },
      {
        name: 'issuedSuit',
        label: intl.get(`${preCode}.issuedSuit`).d('投料套数'),
      },
      {
        name: 'completedQty',
        label: intl.get(`${preCode}.completedQty`).d('完工数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      },
      {
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      },
      {
        name: 'ngQty',
        label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      },
      {
        name: 'reworkQty',
        label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      },
      {
        name: 'pendingQty',
        label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      },
      {
        name: 'executePriority',
        label: intl.get(`${preCode}.executePriority`).d('生产优先级'),
      },
      {
        name: 'dispatchRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'DISPATCH',
        },
      },
      {
        name: 'dispatchRuleId',
        type: 'string',
        bind: 'dispatchRuleObj.ruleId',
      },
      {
        name: 'dispatchRuleName',
        type: 'string',
        bind: 'dispatchRuleObj.ruleName',
      },
      {
        name: 'dispatchRule',
        type: 'string',
        bind: 'dispatchRuleObj.ruleJson',
      },
      {
        name: 'dispatchRuleObject',
        type: 'object',
      },
      {
        name: 'executeRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'EXECUTE',
        },
      },
      {
        name: 'executeRuleId',
        type: 'string',
        bind: 'executeRuleObj.ruleId',
      },
      {
        name: 'executeRuleName',
        type: 'string',
        bind: 'executeRuleObj.ruleName',
      },
      {
        name: 'executeRule',
        type: 'string',
        bind: 'executeRuleObj.ruleJson',
      },
      {
        name: 'executeRuleObject',
        type: 'object',
      },
      {
        name: 'inspectionRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'INSPECTION',
        },
      },
      {
        name: 'inspectionRuleId',
        type: 'string',
        bind: 'inspectionRuleObj.ruleId',
      },
      {
        name: 'inspectionRuleName',
        type: 'string',
        bind: 'inspectionRuleObj.ruleName',
      },
      {
        name: 'inspectionRule',
        type: 'string',
        bind: 'inspectionRuleObj.ruleJson',
      },
      {
        name: 'inspectionRuleObject',
        type: 'object',
      },
      {
        name: 'packingRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.packingRule`).d('包装规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'PACKING',
        },
      },
      {
        name: 'packingRuleId',
        type: 'string',
        bind: 'packingRuleObj.ruleId',
      },
      {
        name: 'packingRuleName',
        type: 'string',
        bind: 'packingRuleObj.ruleName',
      },
      {
        name: 'packingRule',
        type: 'string',
        bind: 'packingRuleObj.ruleJson',
      },
      {
        name: 'packingRuleObject',
        type: 'object',
      },
      {
        name: 'reworkRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'REWORK',
        },
      },
      {
        name: 'reworkRuleId',
        type: 'string',
        bind: 'reworkRuleObj.ruleId',
      },
      {
        name: 'reworkRuleName',
        type: 'string',
        bind: 'reworkRuleObj.ruleName',
      },
      {
        name: 'reworkRule',
        type: 'string',
        bind: 'reworkRuleObj.ruleJson',
      },
      {
        name: 'reworkRuleObject',
        type: 'object',
      },
      {
        name: 'collectorObj',
        type: 'object',
        label: intl.get(`${preCode}.collector`).d('数据收集项'),
        lovCode: common.collector,
        ignore: 'always',
      },
      {
        name: 'collectorId',
        type: 'string',
        bind: 'collectorObj.collectorId',
      },
      {
        name: 'collector',
        type: 'string',
        bind: 'collectorObj.collectorName',
      },
      {
        name: 'collectorObject',
        type: 'string',
        bind: 'collectorObj.collectorJson',
      },
      {
        name: 'locationObj',
        type: 'object',
        label: intl.get(`${preCode}.location`).d('地点'),
        lovCode: common.location,
        ignore: 'always',
      },
      {
        name: 'locationId',
        type: 'string',
        bind: 'locationObj.locationId',
      },
      {
        name: 'locationCode',
        type: 'string',
        bind: 'locationObj.locationCode',
      },
      {
        name: 'locationName',
        type: 'string',
        bind: 'locationObj.locationName',
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'executeRemark',
        type: 'string',
        label: intl.get(`${preCode}.executeRemark`).d('执行备注'),
      },
      {
        name: 'completeControlType',
        type: 'string',
        label: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
        lookupCode: lmesMoWorkspace.completeControlType,
      },
      {
        name: 'completeControlValue',
        type: 'number',
        label: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
      },
      {
        name: 'issuedFlag',
        label: intl.get(`${preCode}.issuedFlag`).d('投料标识'),
      },
      {
        name: 'printedFlag',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-executes/get-mo-execute-by-mo-id`,
          method: 'GET',
        };
      },
    },
    events: {
      update: ({ name, record }) => {
        // const dispatchRuleObj = record.get('dispatchRuleObj');
        // const executeRuleObj = record.get('executeRuleObj');
        // const inspectionRuleObj = record.get('inspectionRuleObj');
        // const packingRuleObj = record.get('packingRuleObj');
        // const reworkRuleObj = record.get('reworkRuleObj');
        const collectorObj = record.get('collectorObj');
        if (name === 'completeWarehouseObj') {
          record.set('completeWmAreaObj', null);
        }
        if (name === 'inventoryWarehouseObj') {
          record.set('inventoryWmAreaObj', null);
        }
        if (name === 'meOuObj') {
          // record.set('meAreaObj', null);
          // record.set('prodLineObj', null);
          // record.set('workcellObj', null);
          // record.set('equipmentObj', null);
          // record.set('workerGroupObj', null);
          // record.set('workerObj', null);
          // record.set('completeWarehouseObj', null);
          // record.set('completeWmAreaObj', null);
          // record.set('inventoryWarehouseObj', null);
          // record.set('inventoryWmAreaObj', null);
        }
        // if (name === 'dispatchRuleObj' && dispatchRuleObj && dispatchRuleObj.ruleJson) {
        //   record.set('dispatchRule', JSON.parse(dispatchRuleObj.ruleJson));
        // }
        // if (name === 'executeRuleObj' && executeRuleObj && executeRuleObj.ruleJson) {
        //   record.set('executeRule', JSON.parse(executeRuleObj.ruleJson));
        // }
        // if (name === 'inspectionRuleObj' && inspectionRuleObj && inspectionRuleObj.ruleJson) {
        //   record.set('inspectionRuleObject', JSON.parse(inspectionRuleObj.ruleJson));
        // }
        // if (name === 'packingRuleObj' && packingRuleObj && packingRuleObj.ruleJson) {
        //   record.set('packingRuleObject', JSON.parse(packingRuleObj.ruleJson));
        // }
        // if (name === 'reworkRuleObj' && reworkRuleObj && reworkRuleObj.ruleJson) {
        //   record.set('reworkRule', JSON.parse(reworkRuleObj.ruleJson));
        // }
        if (name === 'collectorObj' && collectorObj && collectorObj.collectorJson) {
          record.set('collectorObject', JSON.parse(collectorObj.collectorJson));
        }
      },
    },
  };
};

const MoDetailDS = () => {
  return {
    selection: false,
    primaryKey: 'moId',
    children: {
      moPlan: new DataSet(DetailPlanDS()),
      moExecute: new DataSet(DetailExecuteDS()),
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
        name: 'ownerOrganizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'ownerOrganizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'moTypeId',
        type: 'string',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moTypeObj.documentTypeCode',
      },
      {
        name: 'moTypeName',
        type: 'string',
        bind: 'moTypeObj.documentTypeName',
      },
      {
        name: 'docProcessRuleObject',
        type: 'object',
      },
      {
        name: 'moNum',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: lmesMoWorkspace.moStatus,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            meOuId: record.get('ownerOrganizationId'),
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
        name: 'uomConversionValue',
        type: 'string',
        bind: 'itemObj.uomConversionValue',
      },
      {
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${preCode}.uom`).d('单位'),
        lovCode: common.uom,
        ignore: 'always',
        // required: true,
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'uomObj.uomId',
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'uomObj.uomCode',
      },
      {
        name: 'uomName',
        type: 'string',
        bind: 'uomObj.uomName',
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        bind: 'itemObj.description',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        min: 0,
        step: 0.0001,
        required: true,
      },
      {
        name: 'demandDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandDate`).d('需求时间'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        required: true,
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deadlineDate',
        type: 'date',
        label: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'releaseTimeStart',
        label: intl.get(`${preCode}.releaseTimeStart`).d('下达时间开始'),
      },
      {
        name: 'releaseTimeEnd',
        label: intl.get(`${preCode}.releaseTimeEnd`).d('下达时间结束'),
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'sourceDocTypeName',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocTypeId: record.get('sourceDocTypeId'),
          }),
        },
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'sourceDocLineObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        lovCode: common.documentLine,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocNum: record.get('sourceDocNum'),
          }),
        },
      },
      {
        name: 'sourceDocLineId',
        type: 'string',
        bind: 'sourceDocLineObj.documentLineId',
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        bind: 'sourceDocLineObj.documentLineNum',
      },
      {
        name: 'externalOrderType',
        type: 'string',
        label: intl.get(`${preCode}.externalOrderType`).d('外部单据类型'),
        lookupCode: common.externalOrderType,
      },
      {
        name: 'externalId',
        type: 'number',
        min: 0,
        step: 1,
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部编号'),
      },
      {
        name: 'externalInfo',
        type: 'string',
        label: intl.get(`${preCode}.externalInfo`).d('外部信息'),
        transformResponse: (val, object) =>
          `${object.externalUpdateDate} ${object.externalCreator} ${object.externalRemark}`.replace(
            /undefined/g,
            ' '
          ),
      },
      {
        name: 'creatorInfo',
        type: 'string',
        label: intl.get(`${preCode}.releaseInfo`).d('制单信息'),
        transformResponse: (val, object) =>
          `${object.creatorName} ${object.creatorDate}`.replace(/undefined/g, ' '),
      },
      {
        name: 'releaseInfo',
        type: 'string',
        label: intl.get(`${preCode}.releaseInfo`).d('下达信息'),
        transformResponse: (val, object) =>
          `${object.releasedBy} ${object.releasedDate}`.replace(/undefined/g, ' '),
      },
      {
        name: 'closeInfo',
        type: 'string',
        label: intl.get(`${preCode}.closeInfo`).d('关闭信息'),
        transformResponse: (val, object) =>
          `${object.closedBy} ${object.closedDate}`.replace(/undefined/g, ' '),
      },
      {
        name: 'moWarnningFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.moWarnning`).d('MO警告'),
      },
      {
        name: 'planStartDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planEndDate')) {
              return 'planEndDate';
            }
          },
        },
      },
      {
        name: 'planEndDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
        min: 'planStartDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'parentMoNums',
        label: intl.get(`${preCode}.parentMos`).d('父级MO'),
      },
      {
        name: 'topMoNum',
        label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      },
      {
        name: 'planSupplyQty',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.planSupplyQty`).d('计划供应数量'),
      },
      {
        name: 'makeQty',
        label: intl.get(`${preCode}.makeQty`).d('制造数量'),
      },
      {
        name: 'moGroup',
        type: 'string',
        label: intl.get(`${preCode}.moGroup`).d('MO组'),
      },
      {
        name: 'moLevel',
        label: intl.get(`${preCode}.moLevel`).d('MO层级'),
      },
      {
        name: 'prodVersionEnable',
        type: 'boolean',
        label: intl.get(`${preCode}.versionEnable`).d('启用版本'),
      },
      {
        name: 'productionVersionObj',
        type: 'object',
        label: intl.get(`${preCode}.prodVersion`).d('生产版本'),
        lovCode: common.productionVersion,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
            itemId: record.get('itemId'),
          }),
        },
        disabled: true,
      },
      {
        name: 'productionVersionId',
        type: 'string',
        bind: 'productionVersionObj.productionVersionId',
      },
      {
        name: 'productionVersion',
        type: 'string',
        bind: 'productionVersionObj.productionVersion',
      },
      {
        name: 'bomObj',
        type: 'object',
        label: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
        lovCode: common.bom,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemId: record.get('itemId'),
          }),
        },
      },
      {
        name: 'bomId',
        type: 'string',
        bind: 'bomObj.bomId',
      },
      {
        name: 'bomVersion',
        type: 'string',
        bind: 'bomObj.bomVersion',
      },
      {
        name: 'routingObj',
        type: 'object',
        label: intl.get(`${preCode}.routingVersion`).d('工艺版本'),
        lovCode: common.routing,
        ignore: 'always',
      },
      {
        name: 'routingId',
        type: 'string',
        bind: 'routingObj.routingId',
      },
      {
        name: 'routingVersion',
        type: 'string',
        bind: 'routingObj.routingVersion',
      },
      {
        name: 'secondUomObj',
        type: 'object',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        lovCode: common.uom,
        ignore: 'always',
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'secondUomObj.uomId',
      },
      {
        name: 'secondUom',
        type: 'string',
        bind: 'secondUomObj.uomCode',
      },
      {
        name: 'secondUomName',
        type: 'string',
        bind: 'secondUomObj.uomName',
      },
      {
        name: 'secondDemandQty',
        type: 'number',
        min: 0,
        step: 0.0001,
        label: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'wbsNum',
        type: 'string',
        label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
        lovCode: common.categories,
        lovPara: { categorySet: 'ITEM_ME' },
        ignore: 'always',
      },
      {
        name: 'itemCategoryId',
        type: 'string',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'itemCategoryCode',
        type: 'string',
        bind: 'itemCategoryObj.categoryCode',
      },
      {
        name: 'itemCategoryName',
        type: 'string',
        bind: 'itemCategoryObj.categoryName',
      },
      {
        name: 'moLotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('生产批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('生产标签'),
      },
      {
        name: 'tagTemplate',
        type: 'string',
        label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      },
      {
        name: 'mtoFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.mto`).d('按单生产'),
      },
      {
        name: 'mtoExploredFlag',
        label: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        lovCode: common.demandNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemId: record.get('itemId'),
          }),
        },
      },
      {
        name: 'demandId',
        type: 'string',
        bind: 'demandObj.demandId',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandObj.demandNumber',
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        bind: 'demandObj.soNum',
      },
      {
        name: 'soLineNum',
        type: 'string',
        label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
        bind: 'demandObj.soLineNum',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${preCode}.customer`).d('客户'),
        lovCode: common.customer,
        textField: 'customerName',
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerNumber',
        type: 'string',
        bind: 'customerObj.customerNumber',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'customerSiteObj',
        type: 'object',
        label: intl.get(`${preCode}.customerSite`).d('客户地点'),
        lovCode: common.customerSite,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            customerId: record.get('customerId'),
          }),
        },
      },
      {
        name: 'customerSiteId',
        type: 'string',
        bind: 'customerSiteObj.customerSiteId',
      },
      {
        name: 'customerSiteNumber',
        type: 'string',
        bind: 'customerSiteObj.customerSiteNumber',
      },
      {
        name: 'customerSiteName',
        type: 'string',
        bind: 'customerSiteObj.customerSiteName',
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
        bind: 'demandObj.customerPo',
      },
      {
        name: 'customerPoLine',
        type: 'string',
        label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
        bind: 'demandObj.customerPoLine',
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${preCode}.customerItem`).d('客户物料'),
        bind: 'demandObj.customerItem',
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
        bind: 'demandObj.customerItemDesc',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          data: {
            ...data[0],
            moExecute: data[0].moExecute[0] || {},
            moPlan: data[0].moPlan[0] || {},
          },
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          data: {
            ...data[0],
            moExecute: data[0].moExecute[0] || null,
            moPlan: data[0].moPlan[0] || null,
          },
          method: 'PUT',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
      update: ({ name, record }) => {
        const demandObj = record.get('demandObj');
        const prodVersionEnable = record.get('prodVersionEnable');
        const customerObj = record.get('customerObj');
        const moTypeObj = record.get('moTypeObj');
        if (name === 'sourceDocTypeObj') {
          record.set('sourceDocObj', null);
          record.set('sourceDocLineObj', null);
        }
        if (name === 'sourceDocObj') {
          record.set('sourceDocLineObj', null);
        }
        if (name === 'demandQty' || name === 'planSupplyQty') {
          record.set('makeQty', null);

          const demandQty = record.get('demandQty');
          const planSupplyQty = record.get('planSupplyQty');
          if (demandQty && planSupplyQty) {
            record.set('makeQty', demandQty - planSupplyQty);
          }
          if (demandQty && !planSupplyQty) {
            record.set('makeQty', demandQty);
          }
        }
        if (name === 'prodVersionEnable') {
          if (prodVersionEnable) {
            record.fields.get('productionVersionObj').set('required', true);
            record.fields.get('productionVersionObj').set('disabled', false);
            record.fields.get('bomObj').set('disabled', true);
            record.set('bomObj', null);
            record.fields.get('routingObj').set('disabled', true);
            record.set('routingObj', null);
          } else {
            record.fields.get('productionVersionObj').set('required', false);
            record.fields.get('productionVersionObj').set('disabled', true);
            record.fields.get('bomObj').set('disabled', false);
            record.fields.get('routingObj').set('disabled', false);
          }
        }
        if (name === 'customerObj') {
          if (customerObj) {
            record.fields.get('customerSiteObj').set('disabled', false);
          } else {
            record.fields.get('customerSiteObj').set('disabled', true);
            record.set('customerSiteObj', null);
          }
        }
        if (name === 'demandObj' && !isEmpty(demandObj)) {
          const { customerId, customerName, customerSiteId, customerSiteName } = demandObj;
          record.set('customerObj', {
            customerId,
            customerName,
          });
          record.set('customerSiteObj', {
            customerSiteId,
            customerSiteName,
          });
        }
        if (name === 'moTypeObj' && !isEmpty(moTypeObj) && moTypeObj.docProcessRule) {
          record.set('docProcessRuleObject', JSON.parse(moTypeObj.docProcessRule));
        }
      },
    },
  };
};

export { MoListDS, MoDetailDS };
