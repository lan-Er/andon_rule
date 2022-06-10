
/**
 * @Description: 事务查询管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 11:47:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.transaction.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_LMDS}/v1/${organizationId}/transactions`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'organizationName',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'transactionTime',
      label: intl.get(`${preCode}.transactionTime`).d('事务时间'),
    },
    {
      name: 'transactionTypeName',
      label: intl.get(`${preCode}.transactionType`).d('事务类型'),
    },
    {
      name: 'itemCode',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'transactionQty',
      label: intl.get(`${preCode}.transactionQty`).d('数量'),
    },
    {
      name: 'transactionUom',
      label: intl.get(`${commonCode}.uom`).d('单位'),
    },
    {
      name: 'featureCode',
      label: intl.get(`${preCode}.featureCode`).d('特性值'),
    },
    {
      name: 'description',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'warehouseName',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    },

    {
      name: 'wmAreaName',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
    },
    {
      name: 'wmUnitCode',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'transactionDate',
      label: intl.get(`${preCode}.transactionDate`).d('事务日期'),
    },
    {
      name: 'documentTypeName',
      label: intl.get(`${preCode}.documentType`).d('单据类型'),
    },
    {
      name: 'documentNum',
      label: intl.get(`${preCode}.documentNum`).d('单据号'),
    },
    {
      name: 'documentLineNum',
      label: intl.get(`${preCode}.documentLineNum`).d('单据行号'),
    },
    {
      name: 'sourceDocTypeName',
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
      name: 'lotNumber',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
    },
    {
      name: 'tagCode',
      label: intl.get(`${preCode}.tagCode`).d('标签条码'),
    },
    {
      name: 'partyTypeMeaning',
      label: intl.get(`${preCode}.partyType`).d('商业伙伴类型'),
    },
    {
      name: 'partyName',
      label: intl.get(`${preCode}.party`).d('商业伙伴'),
    },
    {
      name: 'partySiteName',
      label: intl.get(`${preCode}.partySite`).d('商业伙伴地点'),
    },
    {
      name: 'locationName',
      label: intl.get(`${preCode}.location`).d('地点位置'),
    },
    {
      name: 'toWarehouseName',
      label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
    },
    {
      name: 'toWmAreaName',
      label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
    },
    {
      name: 'toWmUnitCode',
      label: intl.get(`${preCode}.toWmUnit`).d('目标货格'),
    },
    {
      name: 'moveTypeName',
      label: intl.get(`${preCode}.moveType`).d('移动类型'),
    },
    {
      name: 'toOrganizationName',
      label: intl.get(`${preCode}.toOrganization`).d('目标组织'),
    },
    {
      name: 'finCostCode',
      label: intl.get(`${preCode}.costCode`).d('成本中心'),
    },
    {
      name: 'toItemCode',
      label: intl.get(`${preCode}.toItem`).d('目标物料'),
    },
    {
      name: 'toItemDescription',
      label: intl.get(`${preCode}.toItemDescription`).d('目标物料描述'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'workerName',
      label: intl.get(`${preCode}.worker`).d('操作工'),
    },
    {
      name: 'workerGroupName',
      label: intl.get(`${preCode}.workerGroup`).d('班组'),
    },
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
    },
    {
      name: 'workcellName',
      label: intl.get(`${preCode}.workcell`).d('工位'),
    },
    {
      name: 'equipmentName',
      label: intl.get(`${preCode}.equipment`).d('设备'),
    },
    {
      name: 'cutterName',
      label: intl.get(`${preCode}.cutter`).d('刀具'),
    },
    {
      name: 'dieName',
      label: intl.get(`${preCode}.die`).d('模具'),
    },
    {
      name: 'processedTime',
      label: intl.get(`${preCode}.processTime`).d('加工工时'),
    },
    {
      name: 'calendarDay',
      label: intl.get(`${preCode}.calendarDay`).d('日历日期'),
    },
    {
      name: 'calendarShiftCode',
      label: intl.get(`${preCode}.calendarShiftCode`).d('日历班次'),
    },
    {
      name: 'transactionId',
      label: intl.get(`${preCode}.transactionId`).d('事务ID'),
    },
    {
      name: 'parentTransactionId',
      label: intl.get(`${preCode}.parentTransactionId`).d('父事务ID'),
    },
    {
      name: 'referenceTransactionId',
      label: intl.get(`${preCode}.referenceTransactionId`).d('关联事务ID'),
    },
    {
      name: 'inverseTransactionId',
      label: intl.get(`${preCode}.inverseTransactionId`).d('反向事务ID'),
    },
    {
      name: 'eventRequestId',
      label: intl.get(`${preCode}.eventTransactionId`).d('事件请求ID'),
    },
    {
      name: 'accountDate',
      label: intl.get(`${preCode}.accountDate`).d('记账日期'),
    },
    {
      name: 'transactionReasonCode',
      label: intl.get(`${preCode}.reasonCode`).d('原因代码'),
    },
    {
      name: 'remark',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'syncFlagMeaning',
      label: intl.get(`${preCode}.syncFlag`).d('是否同步'),
    },
    {
      name: 'syncStatusMeaning',
      label: intl.get(`${preCode}.syncStatus`).d('同步状态'),
    },
    {
      name: 'syncGroup',
      label: intl.get(`${preCode}.syncGroup`).d('同步批次'),
    },
    {
      name: 'syncExternalId',
      label: intl.get(`${preCode}.syncExternalId`).d('同步外部ID'),
    },

  ],
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
  },
});
