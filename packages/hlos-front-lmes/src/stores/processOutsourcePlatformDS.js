/**
 * @Description: 工序外协平台
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-20 10:20:21
 * @LastEditors: leying.yan
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesOutSource } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.processOutsourcePlatform.model';
const commonCode = 'lmes.common.model';

const commonExecuteFields = [
  {
    name: 'outsourceLineNum',
    type: 'string',
    label: intl.get(`${preCode}.outsourceLineNum`).d('行号'),
  },
  {
    name: 'itemCode',
    label: intl.get(`${commonCode}.item`).d('物料'),
  },
  {
    name: 'applyQty',
    label: intl.get(`${preCode}.applyQty`).d('申请数量'),
  },
  {
    name: 'shippedQty',
    label: intl.get(`${preCode}.shippedQty`).d('发出数量'),
  },
  {
    name: 'completedQty',
    label: intl.get(`${preCode}.completedQty`).d('完工数量'),
  },
  {
    name: 'receivedQty',
    label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
  },
  {
    name: 'okQty',
    label: intl.get(`${preCode}.okQty`).d('合格数量'),
  },
  {
    name: 'ngQty',
    label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
  },
  {
    name: 'scrappedQty',
    label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
  },
  {
    name: 'qcDocNum',
    label: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
  },
  {
    name: 'ngReason',
    label: intl.get(`${preCode}.ngReason`).d('不合格原因'),
  },
  {
    name: 'actualArrivalTime',
    label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
  },
  {
    name: 'receiveWorker',
    label: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
  },
  {
    name: 'inspectedTime',
    label: intl.get(`${preCode}.inspectedTime`).d('检验时间'),
  },
  {
    name: 'inspector',
    label: intl.get(`${preCode}.inspector`).d('检验员工'),
  },
];

// 首页查询条件
const ProcessOutsourceQueryDS = () => {
  return {
    selection: false,
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
        ignore: 'always',
      },
      {
        name: 'outsourceObj',
        type: 'object',
        label: intl.get(`${preCode}.outsourceNum`).d('外协单号'),
        lovCode: lmesOutSource.operOutsource,
        ignore: 'always',
      },
      {
        name: 'outsourceId',
        type: 'string',
        bind: 'outsourceObj.outsourceId',
      },
      {
        name: 'outsourceNum',
        type: 'string',
        bind: 'outsourceObj.outsourceNum',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.party`).d('外协伙伴'),
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
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
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
        ignore: 'always',
      },
      {
        name: 'operation',
        type: 'string',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'taskObj',
        type: 'object',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
        lovCode: common.task,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'taskId',
        type: 'string',
        bind: 'taskObj.taskId',
      },
      {
        name: 'taskNum',
        type: 'string',
        bind: 'taskObj.taskNumber',
      },
      {
        name: 'outsourceStatus',
        type: 'string',
        label: intl.get(`${preCode}.outsourceStatus`).d('外协状态'),
        lookupCode: lmesOutSource.outsourceStatus,
      },
      {
        name: 'demandDateLeft',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandStartDate`).d('需求日期>='),
        // transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('demandDateRight')) {
              return 'demandDateRight';
            }
          },
        },
      },
      {
        name: 'demandDateRight',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandEndDate`).d('<='),
        min: 'demandDateLeft',
        // transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'outsourceTypeObj',
        type: 'object',
        label: intl.get(`${commonCode}.outsourceType`).d('外协类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'OPER_OUTSOURCE' },
        ignore: 'always',
      },
      {
        name: 'outsourceTypeId',
        type: 'string',
        bind: 'outsourceTypeObj.documentTypeId',
      },
      {
        name: 'outsourceTypeCode',
        type: 'string',
        bind: 'outsourceTypeObj.documentTypeCode',
      },
      {
        name: 'shippedDateLeft',
        type: 'dateTime',
        label: intl.get(`${preCode}.shippedStartTime`).d('发出时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('shippedDateRight')) {
              return 'shippedDateRight';
            }
          },
        },
      },
      {
        name: 'shippedDateRight',
        type: 'dateTime',
        label: intl.get(`${preCode}.shippedEndTime`).d('<='),
        min: 'shippedDateLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'actualArrivalTimeLeft',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualArrivalStartTime`).d('接收时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('actualArrivalTimeRight')) {
              return 'actualArrivalTimeRight';
            }
          },
        },
      },
      {
        name: 'actualArrivalTimeRight',
        type: 'dateTime',
        label: intl.get(`${preCode}.actualArrivalEndTime`).d('<='),
        min: 'actualArrivalTimeLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
  };
};
// 首页头明细
const ProcessOutsourceListDS = () => {
  return {
    selection: 'multiple',
    primaryKey: 'outsourceId',
    children: {
      mainLine: new DataSet(mainLineListDS()),
      executeLine: new DataSet(executeLineListDS()),
    },
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
        transformResponse: (val, object) =>
          val || `${object.organizationCode || ''}\n${object.organizationName || ''}`,
      },
      {
        name: 'outsourceNum',
        label: intl.get(`${preCode}.outsourceNum`).d('外协单号'),
      },
      {
        name: 'outsourceTypeName',
        label: intl.get(`${preCode}.outsourceType`).d('外协类型'),
      },
      {
        name: 'outsourceStatusMeaning',
        label: intl.get(`${preCode}.outsourceStatus`).d('外协状态'),
      },
      {
        name: 'partyName',
        label: intl.get(`${preCode}.party`).d('外协伙伴'),
      },
      {
        name: 'partySiteName',
        label: intl.get(`${preCode}.partySite`).d('伙伴地点'),
      },
      {
        name: 'partyContact',
        label: intl.get(`${preCode}.partyContact`).d('伙伴联系人'),
      },
      {
        name: 'contactPhone',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}}.moNum`).d('MO号'),
      },
      {
        name: 'taskNum',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'currencyName',
        label: intl.get(`${preCode}}.currency`).d('币种'),
      },
      {
        name: 'totalAmount',
        label: intl.get(`${preCode}.totalAmount`).d('总价'),
      },
      {
        name: 'creator',
        label: intl.get(`${preCode}.creator`).d('制单员工'),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}.creationDate`).d('制单时间'),
      },
      {
        name: 'printedFlag',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'sourceDocType',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalId',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'shippedDate',
        label: intl.get(`${preCode}.shippedDate`).d('发出时间'),
      },
      {
        name: 'shipWorkerId',
        label: intl.get(`${preCode}.shipWorker`).d('发出员工'),
      },
      {
        name: 'actualArrivalTime',
        label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
      },
      {
        name: 'receiveWorkerId',
        label: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
      },
      {
        name: 'carrier',
        label: intl.get(`${preCode}.carrier`).d('承运人'),
      },
      {
        name: 'carrierContact',
        label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
      },
      {
        name: 'shipTicket',
        label: intl.get(`${preCode}.shipTicket`).d('发货单号'),
      },
      {
        name: 'plateNum',
        label: intl.get(`${preCode}.plateNum`).d('车牌号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/outsource-headers/query-outsource-header`,
          method: 'GET',
        };
      },
    },
  };
};
// 首页行 主要
const mainLineListDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'outsourceLineNum',
        type: 'string',
        label: intl.get(`${preCode}.outsourceLineNum`).d('行号'),
        order: 'asc',
      },
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'applyQty',
        label: intl.get(`${preCode}.applyQty`).d('申请数量'),
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
      },
      {
        name: 'taskNum',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      },
      {
        name: 'moOperationNum',
        label: intl.get(`${preCode}.moOperationNum`).d('MO工序号'),
      },
      {
        name: 'operation',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      },
      {
        name: 'lineStatus',
        label: intl.get(`${preCode}.lineStatus`).d('行状态'),
      },
      {
        name: 'secondUom',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondApplyQty',
        label: intl.get(`${preCode}.secondApplyQty`).d('辅助单位数量'),
      },
      {
        name: 'unitPrice',
        label: intl.get(`${preCode}.unitPrice`).d('单价'),
      },
      {
        name: 'lineAmount',
        label: intl.get(`${preCode}.lineAmount`).d('行总价'),
      },
      {
        name: 'executeRule',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      },
      {
        name: 'inspectionRule',
        label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      },
      {
        name: 'relatedItem',
        label: intl.get(`${preCode}.relatedItem`).d('关联物料'),
      },
      {
        name: 'relatedItemDesc',
        label: intl.get(`${preCode}.relatedItemDesc`).d('关联物料描述'),
      },
      {
        name: 'relatedUom',
        label: intl.get(`${preCode}.relatedUom`).d('关联单位'),
      },
      {
        name: 'relatedApplyQty',
        label: intl.get(`${preCode}.relatedApplyQty`).d('关联数量'),
      },
      {
        name: 'poNum',
        label: intl.get(`${preCode}.poNum`).d('PO号'),
      },
      {
        name: 'poLineNum',
        label: intl.get(`${preCode}.poLineNum`).d('PO行号'),
      },
      {
        name: 'sourceDocType',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'lineRemark',
        label: intl.get(`${preCode}.lineRemark`).d('行备注'),
      },
      {
        name: 'externalId',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'externalLineId',
        label: intl.get(`${preCode}.externalLineId`).d('外部行ID'),
      },
      {
        name: 'externalLineNum',
        label: intl.get(`${preCode}.externalLineNum`).d('外部单据行号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}//outsource-headers/query-outsource-line`,
          method: 'GET',
        };
      },
    },
  };
};
// 首页行 执行
const executeLineListDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: commonExecuteFields,
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}//outsource-headers/query-outsource-line`,
          method: 'GET',
        };
      },
    },
  };
};

// 新增 查询任务信息
const outsourceDetailQueryDS = () => ({
  selection: true,
  pageSize: 100,
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
      name: 'organizationCode',
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
      name: 'moNumObj',
      type: 'object',
      label: intl.get(`${commonCode}.moNum`).d('MO号'),
      lovCode: common.moNum,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'moId',
      type: 'string',
      bind: 'moNumObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moNumObj.moNum',
    },
    {
      name: 'taskObj',
      type: 'object',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      lovCode: common.task,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'taskId',
      type: 'string',
      bind: 'taskObj.taskId',
    },
    {
      name: 'taskNum',
      type: 'string',
      bind: 'taskObj.taskNumber',
    },
    {
      name: 'task',
      type: 'string',
      label: intl.get(`${preCode}.task`).d('任务'),
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      bind: 'itemObj.description',
    },
    {
      name: 'taskTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.taskType`).d('任务类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'TASK' },
      ignore: 'always',
    },
    {
      name: 'taskTypeId',
      type: 'string',
      bind: 'taskTypeObj.documentTypeId',
    },
    {
      name: 'taskTypeCode',
      type: 'string',
      bind: 'taskTypeObj.documentTypeCode',
    },
    {
      name: 'taskTypeName',
      type: 'string',
      bind: 'taskTypeObj.documentTypeName',
    },
    {
      name: 'taskStatus',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      lookupCode: lmesOutSource.taskStatus,
      multiple: true,
      defaultValue: ['RELEASED', 'DISPATCHED', 'QUEUING', 'RUNNING'],
    },
    {
      name: 'outsourceFlag',
      label: intl.get(`${preCode}.outsourceFlag`).d('可外协'),
      defaultValue: 1,
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'validateLevel',
      type: 'number',
      defaultValue: 5,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/tasks/query-task-for-outsource`,
        data: {
          ...data,
          taskStatus: undefined,
          taskStatusList: data.taskStatus,
        },
        method: 'POST',
      };
    },
  },
});
// 新增 头
const outsourceHeadDetailDS = () => ({
  selection: false,
  fields: [
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCode}.party`).d('外协伙伴'),
      lovCode: common.party,
      required: true,
      ignore: 'always',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
    },
    {
      name: 'partySiteObj',
      type: 'object',
      label: intl.get(`${preCode}}.partySite`).d('伙伴地点'),
      lovCode: lmesOutSource.partySite,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          partyId: record.get('partyId'),
        }),
      },
    },
    {
      name: 'partySiteId',
      type: 'string',
      bind: 'partySiteObj.partySiteId',
    },
    {
      name: 'partySiteNumber',
      type: 'string',
      bind: 'partySiteObj.partySiteNumber',
    },
    {
      name: 'partySiteName',
      type: 'string',
      bind: 'partySiteObj.partySiteName',
    },
    {
      name: 'remark',
      type: 'string',
      width: 200,
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'partyContact',
      type: 'string',
      label: intl.get(`${preCode}.partyContact`).d('伙伴联系人'),
    },
    {
      name: 'contactPhone',
      type: 'string',
      label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
    },
    {
      name: 'contactEmail',
      type: 'string',
      label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
    },
    {
      name: 'partyAddress',
      type: 'string',
      label: intl.get(`${preCode}.partyAddress`).d('伙伴地址'),
    },
    {
      name: 'carrier',
      type: 'string',
      label: intl.get(`${preCode}.carrier`).d('承运人'),
    },
    {
      name: 'carrierContact',
      type: 'string',
      label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
    },
    {
      name: 'shipTicket',
      type: 'string',
      label: intl.get(`${preCode}.shipTicket`).d('发运单号'),
    },
    {
      name: 'plateNum',
      type: 'string',
      label: intl.get(`${preCode}.plateNum`).d('车牌号'),
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${commonCode}.projectNum`).d('项目号'),
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      ignore: 'always',
    },
    {
      name: 'currencyCode',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currencyObj.currencyName',
    },
  ],
  transport: {
    submit: ({ data }) => ({
      url: `${HLOS_LMES}/v1/${organizationId}/outsource-headers/create-task-out-source`,
      data: data[0],
      methods: 'POST',
    }),
  },
});
// 新增 行
const outsourceLineDetailDS = () => ({
  fields: [
    {
      name: 'task',
      type: 'string',
      label: intl.get(`${preCode}.task`).d('任务'),
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      required: true,
      noCache: true,
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      bind: 'itemObj.description',
    },
    {
      name: 'documentNum',
    },
    {
      name: 'documentLineNum',
    },
    {
      name: 'applyQty',
      required: true,
      type: 'number',
      label: intl.get(`${preCode}.applyQty`).d('外协数量'),
    },
    {
      name: 'taskQty',
      label: intl.get(`${preCode}.taskQty`).d('任务数量'),
    },
    {
      name: 'outsourceQty',
      type: 'number',
      min: 0,
      required: true,
      label: intl.get(`${preCode}.outsourceQty`).d('外协数量'),
    },
    {
      name: 'demandDate',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      transformResponse: (val, object) => val || `${object.planStartTime || ''}\n`,
    },
    {
      name: 'promiseDate',
      type: 'date',
      label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
    },
    {
      name: 'unitPrice',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.unitPrice`).d('单价'),
    },
    {
      name: 'lineAmount',
      type: 'number',
      // defaultValue: '',
      label: intl.get(`${preCode}.lineAmount`).d('总价'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${preCode}.lineRemark`).d('行备注'),
    },
    {
      name: 'planTime',
      label: intl.get(`${preCode}.planTime`).d('计划时间'),
    },
    {
      name: 'planStartTime',
    },
    {
      name: 'planEndTime',
    },
    {
      name: 'executableQty',
      label: intl.get(`${preCode}.executableQty`).d('可执行数量'),
    },
    {
      name: 'executeQty',
      label: intl.get(`${preCode}.executeQty`).d('执行数量'),
    },
    {
      name: 'taskStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.taskStatus`).d('任务状态'),
    },
    {
      name: 'processOkQty',
    },
    {
      name: 'processNgQty',
    },
    {
      name: 'scrappedQty',
    },
    {
      name: 'reworkQty',
    },
    {
      name: 'pendingQty',
    },
    {
      name: 'wipQty',
    },
    {
      name: 'executeRule',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
    },
    {
      name: 'inspectionRule',
      label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
    },
    {
      name: 'itemControlType',
      label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'remark',
      label: intl.get(`${preCode}.taskRemark`).d('任务备注'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/tasks/query-task-for-outsource`,
        data: {
          ...data,
          taskStatus: undefined,
          taskStatusList: data.taskStatus,
        },
        method: 'POST',
      };
    },
  },
});

const Store = createContext();

export default Store;

export const ProcessOutsourceProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(ProcessOutsourceListDS()), []);
  const queryDS = useMemo(() => new DataSet(ProcessOutsourceQueryDS()), []);
  const detailQueryDS = useMemo(() => new DataSet(outsourceDetailQueryDS()), []);
  const headDetailDS = useMemo(() => new DataSet(outsourceHeadDetailDS()), []);
  const lineDetailDS = useMemo(() => new DataSet(outsourceLineDetailDS()), []);

  const value = {
    ...props,
    listDS,
    queryDS,
    detailQueryDS,
    headDetailDS,
    lineDetailDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
