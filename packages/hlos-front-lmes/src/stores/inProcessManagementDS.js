/**
 * @Description: 在制管理--DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-11
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

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.inProcessManagement.model';
const commonCode = 'lmes.common.model';

const InProcessQueryDS = () => {
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
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
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
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
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
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
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
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${commonCode}.workerGroupObj`).d('班组'),
        lovCode: common.workerGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
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
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        lovCode: common.worker,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
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
        name: 'operationObj',
        type: 'object',
        label: intl.get(`${preCode}.operation`).d('工序'),
        lovCode: common.operation,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
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
        ignore: 'always',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
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
        name: 'wipStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('WIP状态'),
        lookupCode: common.wipStatus,
        multiple: true,
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tag`).d('标签'),
      },
      {
        name: 'productTagCode',
        type: 'string',
        label: intl.get(`${preCode}.productTag`).d('产品码'),
      },
      {
        name: 'outerTagCode',
        type: 'string',
        label: intl.get(`${preCode}.outerTag`).d('外层标签'),
      },
      {
        name: 'moveInStartTime',
        type: 'date',
        label: intl.get(`${preCode}.moveInStartTime`).d('移入时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('moveInEndTime')) {
              return 'moveInEndTime';
            }
          },
        },
      },
      {
        name: 'moveInEndTime',
        type: 'date',
        label: intl.get(`${preCode}.moveInEndTime`).d('移入时间<='),
        min: 'moveInStartTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'moveOutStartTime',
        type: 'date',
        label: intl.get(`${preCode}.moveOutStartTime`).d('移出时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('moveOutEndTime')) {
              return 'moveOutEndTime';
            }
          },
        },
      },
      {
        name: 'moveOutEndTime',
        type: 'date',
        label: intl.get(`${preCode}.moveOutEndTime`).d('移出时间<='),
        min: 'moveOutStartTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
  };
};

const InProcessListDS = () => {
  return {
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/wips/query-wip-main`,
          params: {
            page: data.page,
            size: data.size,
          },
          data: {
            ...data,
            wipStatus: undefined,
            wipStatusList: data.wipStatus,
          },
          method: 'POST',
        };
      },
    },
  };
};

const InProcessExecuteDS = () => {
  return {
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/wips/query-wip-execute`,
          params: {
            page: data.page,
            size: data.size,
          },
          data: {
            ...data,
            wipStatus: undefined,
            wipStatusList: data.wipStatus,
          },
          method: 'POST',
        };
      },
    },
  };
};

const InProcessDetailDS = () => {
  return {
    selection: false,
    primaryKey: 'wipId',
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'organizationCode',
        type: 'string',
      },
      {
        name: 'organizationName',
        type: 'string',
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
      },
      {
        name: 'taskNum',
        type: 'string',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'operation',
        label: intl.get(`${commonCode}.operation`).d('工序'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'wipQty',
        label: intl.get(`${preCode}.wipQty`).d('在制数量'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tag`).d('标签'),
      },
      {
        name: 'productTagCode',
        label: intl.get(`${preCode}.productTag`).d('产品码'),
      },
      {
        name: 'outerTagCode',
        label: intl.get(`${preCode}.outerTag`).d('外层标签'),
      },
      {
        name: 'verificationCode',
        label: intl.get(`${preCode}.verificationCode`).d('验证码'),
      },
      {
        name: 'nextOperation',
        label: intl.get(`${preCode}.nextOperation`).d('下一工序'),
      },
      {
        name: 'nextTask',
        label: intl.get(`${preCode}.nextTask`).d('下一任务'),
      },
      {
        name: 'wipSequenceNum',
        label: intl.get(`${preCode}.wipSequence`).d('在制顺序'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondWipQty',
        label: intl.get(`${preCode}.secondWipQty`).d('辅助数量'),
      },
      {
        name: 'party',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
      },
      {
        name: 'partySite',
        label: intl.get(`${preCode}.partySite`).d('伙伴地点'),
      },
      {
        name: 'wipStatusMeaning',
        label: intl.get(`${preCode}.inProcessStatus`).d('在制状态'),
      },
      {
        name: 'pictures',
        label: intl.get(`${commonCode}.itemDesc`).d('图片'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.itemDesc`).d('备注'),
      },
    ],
  };
};

const Store = createContext();

export default Store;

export const InProcessProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(InProcessListDS()), []);
  const queryDS = useMemo(() => new DataSet(InProcessQueryDS()), []);
  const detailDS = useMemo(() => new DataSet(InProcessDetailDS()), []);
  const executeDS = useMemo(() => new DataSet(InProcessExecuteDS()), []);
  const value = {
    ...props,
    listDS,
    queryDS,
    detailDS,
    executeDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
