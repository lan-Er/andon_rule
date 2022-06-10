/**
 * @Description: 生产执行明细--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-28 10:10:58
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesProductionExecution, lmesTask } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.productionExecution.model';
const commonCode = 'lmes.common.model';

const ProductionExecutionListDS = () => {
  return {
    selection: false,
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
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
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
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
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
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
        name: 'produceLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workcellId',
        type: 'string',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'executeType',
        type: 'string',
        label: intl.get(`${preCode}.executeType`).d('执行类型'),
        lookupCode: lmesProductionExecution.executeType,
      },
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        lovCode: common.worker,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${commonCode}.workGroup`).d('班组'),
        lovCode: common.workerGroup,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workerGroupId',
        type: 'string',
        bind: 'workerGroupObj.workerGroupId',
      },
      {
        name: 'workerGroupName',
        type: 'string',
        bind: 'workerGroupObj.workerGroupName',
        ignore: 'always',
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tag`).d('标签'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lot`).d('批次'),
      },
      {
        name: 'operation',
        type: 'string',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'assemblyObj',
        type: 'object',
        label: intl.get(`${preCode}.assembly`).d('装配件'),
        lovCode: common.item,
        ignore: 'always',
      },
      {
        name: 'assemblyItemId',
        type: 'string',
        bind: 'assemblyObj.itemId',
      },
      {
        name: 'assemblyItemCode',
        type: 'string',
        bind: 'assemblyObj.itemCode',
      },
      {
        name: 'assemblyTagCode',
        type: 'string',
        label: intl.get(`${preCode}.assemblyTag`).d('装配件标签'),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'calendarDay',
        type: 'date',
        label: intl.get(`${preCode}.calendarDay`).d('工作日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'calendarShiftCode',
        type: 'string',
        label: intl.get(`${preCode}.calendarShift`).d('班次'),
        lookupCode: lmesTask.shift,
      },
      {
        name: 'executeTimeMin',
        type: 'dateTime',
        label: intl.get(`${preCode}.executeTimeMin`).d('执行时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('executeTimeMax')) {
              return 'executeTimeMax';
            }
          },
        },
      },
      {
        name: 'executeTimeMax',
        type: 'dateTime',
        label: intl.get(`${preCode}.executeTimeMax`).d('执行时间<='),
        dynamicProps: {
          min: ({ record }) => {
            if (record.get('executeTimeMin')) {
              return 'executeTimeMin';
            }
          },
        },
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
        transformResponse: (val, object) =>
          val ||
          `${object.organizationCode}\n${object.organizationName}`.replace(/undefined/g, ' '),
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
        name: 'uom',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'documentType',
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
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
        name: 'operation',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'executeTypeMeaning',
        label: intl.get(`${preCode}.executeType`).d('执行类型'),
      },
      {
        name: 'executeTime',
        label: intl.get(`${preCode}.executeTime`).d('执行时间'),
      },
      {
        name: 'executeQty',
        label: intl.get(`${preCode}.executeQty`).d('执行数量'),
      },
      {
        name: 'executeNgQty',
        label: intl.get(`${preCode}.executeNgQty`).d('不合格数量'),
      },
      {
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      },
      {
        name: 'rawNgQty',
        label: intl.get(`${preCode}.rawNgQty`).d('来料不合格'),
      },
      {
        name: 'reworkQty',
        label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      },
      {
        name: 'pendingQty',
        label: intl.get(`${preCode}.pendingQty`).d('待处理数量'),
      },
      {
        name: 'wipQty',
        label: intl.get(`${preCode}.wipQty`).d('在制数量'),
      },
      {
        name: 'secondUom',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondExecuteQty',
        label: intl.get(`${preCode}.secondExecuteQty`).d('辅助执行数量'),
      },
      {
        name: 'processedTime',
        label: intl.get(`${preCode}.processedTime`).d('实际加工工时'),
      },
      {
        name: 'assemblyItemCode',
        label: intl.get(`${preCode}.assembly`).d('装配件'),
      },
      {
        name: 'assemblyItemDesctription',
        label: intl.get(`${preCode}.assemblyDesc`).d('装配件描述'),
      },
      {
        name: 'assemblyTagCode',
        label: intl.get(`${preCode}.assemblyTag`).d('装配件标签'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('批次号'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tag`).d('标签'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${commonCode}.projectNum`).d('项目号'),
      },
      {
        name: 'wbsNum',
        label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      },
      {
        name: 'prodLine',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      },
      {
        name: 'equipment',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
      },
      {
        name: 'workcell',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
      },
      {
        name: 'workerGroup',
        label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      },
      {
        name: 'workerName',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
      },
      {
        name: 'locationName',
        label: intl.get(`${commonCode}.location`).d('地点'),
      },
      {
        name: 'calendarDay',
        label: intl.get(`${preCode}.calendarDay`).d('工作日期'),
      },
      {
        name: 'calendarShiftCodeMeaning',
        label: intl.get(`${preCode}.calendarShift`).d('班次'),
      },
      {
        name: 'warehouse',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        transformResponse: (val, object) =>
          val || `${object.warehouseCode}\n${object.warehouseName}`.replace(/undefined/g, ' '),
      },
      {
        name: 'wmArea',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
        transformResponse: (val, object) =>
          val || `${object.wmAreaCode}\n${object.wmAreaName}`.replace(/undefined/g, ' '),
      },
      {
        name: 'wmUnitCode',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      },
      {
        name: 'partyName',
        label: intl.get(`${commonCode}.partyName`).d('商业伙伴'),
      },
      {
        name: 'partySite',
        label: intl.get(`${commonCode}.partySite`).d('商业伙伴地点'),
      },
      {
        name: 'sourceDocType',
        label: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'confirmedFlag',
        label: intl.get(`${preCode}.confirmedFlag`).d('确认标识'),
      },
      {
        name: 'collector',
        label: intl.get(`${preCode}.collector`).d('数据收集'),
      },
      {
        name: 'pictures',
        label: intl.get(`${commonCode}.picture`).d('图片'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'eventTypeName',
        label: intl.get(`${preCode}.eventType`).d('事件类型'),
      },
      {
        name: 'eventId',
        label: intl.get(`${preCode}.eventId`).d('事件ID'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/execute-lines/query`,
          method: 'GET',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const ProductionExecutionProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(ProductionExecutionListDS()), []);
  const value = {
    ...props,
    listDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
