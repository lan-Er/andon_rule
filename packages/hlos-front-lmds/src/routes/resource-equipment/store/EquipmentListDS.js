/*
 * @Description: 设备管理信息--EquipmentListDs
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-08 16:47:30
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  positiveNumberValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common, lmdsEquipment } = codeConfig.code;
const {
  lovPara: { equipment },
} = statusConfig.statusValue.lmds;

const intlPrefix = 'lmds.equipment';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/equipments`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  queryFields: [
    {
      name: 'equipmentCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentNumber`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentName`).d('设备名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
    },
    { name: 'organizationName', type: 'string', bind: 'organizationObj.organizationName' },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.meOuId' },
    { name: 'organizationCode', type: 'string', bind: 'organizationObj.meOuCode' },
    {
      name: 'equipmentCode',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.model.equipmentNumber`).d('设备编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'equipmentName',
      type: 'intl',
      required: true,
      label: intl.get(`${intlPrefix}.model.equipmentName`).d('设备名称'),
    },
    {
      name: 'equipmentAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.equipmentAlias`).d('设备简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.equipmentDesc`).d('设备描述'),
      validator: descValidator,
    },
    {
      name: 'equipmentType',
      type: 'string',
      lookupCode: lmdsEquipment.equipmentType,
      required: true,
      label: intl.get(`${intlPrefix}.model.equipmentType`).d('设备类型'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentPicture`).d('图片'),
    },
    {
      name: 'equipmentCategoryObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentCategory`).d('设备类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: equipment },
      ignore: 'always',
    },
    { name: 'equipmentCategoryId', type: 'string', bind: 'equipmentCategoryObj.categoryId' },
    { name: 'equipmentCategoryCode', type: 'string', bind: 'equipmentCategoryObj.categoryCode' },
    { name: 'categoryName', type: 'string', bind: 'equipmentCategoryObj.categoryName' },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.ownProdLine`).d('所属生产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
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
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.ownWorkcell`).d('所属工作单元'),
      lovCode: common.workcell,
      ignore: 'always',
      cascadeMap: {
        organizationId: 'organizationId',
        prodLineId: 'prodLineId',
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
      name: 'workerGroupObj',
      type: 'object',
      label: '所属班组',
      lovCode: common.workerGroup,
      cascadeMap: {
        organizationId: 'organizationId',
      },
      ignore: 'always',
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
      label: '所属操作工',
      lovCode: common.worker,
      cascadeMap: {
        organizationId: 'organizationId',
        workerGroupId: 'workerGroupId',
      },
      ignore: 'always',
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
      name: 'tpmGroupObj',
      type: 'object',
      label: '设备维修班组',
      lovCode: common.workerGroup,
      cascadeMap: {
        organizationId: 'organizationId',
      },
      ignore: 'always',
    },
    {
      name: 'tpmGroupId',
      type: 'string',
      bind: 'tpmGroupObj.workerGroupId',
    },
    {
      name: 'tpmGroup',
      type: 'string',
      bind: 'tpmGroupObj.workerGroupCode',
    },
    {
      name: 'tpmGroupName',
      type: 'string',
      bind: 'tpmGroupObj.workerGroupName',
    },
    {
      name: 'tpmWorkerObj',
      type: 'object',
      label: '设备维修员工',
      lovCode: common.worker,
      cascadeMap: {
        organizationId: 'organizationId',
        workerGroupId: 'tpmGroupId',
      },
      ignore: 'always',
    },
    {
      name: 'tpmWorkerId',
      type: 'string',
      bind: 'tpmWorkerObj.workerId',
    },
    {
      name: 'tpmWorker',
      type: 'string',
      bind: 'tpmWorkerObj.workerCode',
    },
    {
      name: 'tpmWorkerName',
      type: 'string',
      bind: 'tpmWorkerObj.workerName',
    },
    {
      name: 'ownerObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentOwner`).d('所有者'),
      lovCode: lmdsEquipment.owner,
      ignore: 'always',
    },
    { name: 'ownerId', type: 'string', bind: 'ownerObj.ownerId' },
    { name: 'ownerNumber', type: 'string', bind: 'ownerObj.ownerCode' },
    { name: 'unitName', type: 'string', bind: 'ownerObj.ownerName' },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentChiefPosition`).d('主管岗位'),
      lovCode: common.position,
      lovPara: { supervisorFlag: 1 },
      ignore: 'always',
    },
    { name: 'chiefPositionId', type: 'string', bind: 'chiefPositionObj.positionId' },
    { name: 'chiefPosition', type: 'string', bind: 'chiefPositionObj.positionCode' },
    { name: 'chiefPositionName', type: 'string', bind: 'chiefPositionObj.positionName' },
    {
      name: 'departmentObj',
      type: 'object',
      label: '部门',
      lovCode: common.department,
      ignore: 'always',
    },
    { name: 'departmentId', type: 'string', bind: 'departmentObj.departmentId' },
    { name: 'department', type: 'string', bind: 'departmentObj.departmentCode' },
    { name: 'departmentName', type: 'string', bind: 'departmentObj.departmentName' },
    {
      name: 'supervisorObj',
      type: 'object',
      label: '责任人',
      lovCode: common.worker,
      cascadeMap: {
        departmentId: 'departmentId',
      },
      ignore: 'always',
    },
    {
      name: 'supervisorId',
      type: 'string',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'supervisor',
      type: 'string',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorName',
      type: 'string',
      bind: 'supervisorObj.workerName',
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentCalendar`).d('工作日历'),
      lovCode: common.calendar,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          resourceId: record.get('equipmentId'),
        }),
      },
    },
    { name: 'calendarId', type: 'string', bind: 'calendarObj.calendarId' },
    { name: 'calendarCode', type: 'string', bind: 'calendarObj.calendarCode' },
    { name: 'calendarName', type: 'string', bind: 'calendarObj.calendarName' },
    {
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentAssetNum`).d('资产编号'),
    },
    {
      name: 'equipmentStatus',
      type: 'string',
      lookupCode: lmdsEquipment.equipmentStatus,
      label: intl.get(`${intlPrefix}.model.equipmentStatus`).d('设备状态'),
    },
    {
      name: 'purchaseDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${intlPrefix}.model.equipmentPurchaseDate`).d('设备采购日期'),
    },
    {
      name: 'startUseDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${intlPrefix}.model.equipmentStartUseDate`).d('开始使用日期'),
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentSupplier`).d('供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentManufacturer`).d('制造商'),
    },
    {
      name: 'nameplateNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentNameplateNum`).d('设备铭牌号'),
    },
    {
      name: 'servicePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentServicePhone`).d('维修电话'),
    },
    {
      name: 'maintenanceInterval',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.maintenanceInterval`).d('检修周期'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maintenanceNeedDays',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.maintenanceNeedDays`).d('检修所需时间'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maintenancedTimes',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.maintenancedTimes`).d('累计检修次数'),
    },
    {
      name: 'lastTpmDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastTpmDate`).d('上次检修时间'),
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'lastTpmManName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastTpmMan`).d('上次检修人'),
    },
    {
      name: 'nextTpmStartDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.nextTpmStartDate`).d('下次计划检修开始时间'),
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'nextTpmEndDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.nextTpmEndDate`).d('下次计划检修结束时间'),
    },
    {
      name: 'breakdownTimes',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.breakdownTimes`).d('累计故障次数'),
    },
    {
      name: 'lastBreakdowmDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastBreakdownDate`).d('上次故障时间'),
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'lastRepairedDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastRepairedDate`).d('上次维修时间'),
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'lastRepairedManName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastRepairedMan`).d('上次维修人'),
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentBom`).d('设备BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: equipment },
      ignore: 'always',
    },
    { name: 'bomId', type: 'string', bind: 'bomObj.resourceBomId' },
    { name: 'bomVersion', type: 'string', bind: 'bomObj.resourceBomVersion' },
    { name: 'bomName', type: 'string', bind: 'bomObj.resourceBomName' },
    {
      name: 'valueCurrencyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.equipmentValueCurrency`).d('估值货币'),
      lovCode: common.currency,
      ignore: 'always',
    },
    { name: 'currency', type: 'string', bind: 'valueCurrencyObj.currencyCode' },
    { name: 'valueCurrencyName', type: 'string', bind: 'valueCurrencyObj.currencyName' },
    {
      name: 'initialValue',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.equipmentInitialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.equipmentCurrentValue`).d('当前价值'),
    },
    {
      name: 'locationObj',
      type: 'object',
      lovCode: common.location,
      lovPara: { tenantId: organizationId },
      ignore: 'always',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
    },
    { name: 'locationName', type: 'string', bind: 'locationObj.locationName' },
    { name: 'locationCode', type: 'string', bind: 'locationObj.locationCode' },
    { name: 'locationId', type: 'string', bind: 'locationObj.locationId' },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.outSideLocation`).d('外部地点'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.model.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      required: true,
      defaultValue: true,
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.referenceDoc`).d('设备指导参考文件'),
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.instruction`).d('设备操作说明'),
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.drawingCode`).d('设备图纸编号'),
    },
  ],
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'equipment', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
    update: () => {
      return {
        url,
        method: 'PUT',
      };
    },
    create: () => {
      return {
        url,
        method: 'POST',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ record, name, value, oldValue }) => {
      const hasUpdate = (!oldValue && value) || (oldValue && !value);
      if (name === 'organizationObj' && (hasUpdate || value?.meOuId !== oldValue?.meOuId)) {
        record.set('prodLineObj', null);
        record.set('workcellObj', null);
      } else if (
        name === 'chiefPositionObj' &&
        (hasUpdate || value?.chiefPositionId !== oldValue?.chiefPositionId)
      ) {
        record.set('supervisorObj', null);
      } else if (
        name === 'workerGroupObj' &&
        (hasUpdate || value?.workerGroupId !== oldValue?.workerGroupId)
      ) {
        record.set('workerObj', null);
      } else if (
        name === 'tpmGroupObj' &&
        (hasUpdate || value?.workerGroupId !== oldValue?.workerGroupId)
      ) {
        record.set('tpmWorkerObj', null);
      } else if (
        name === 'prodLineObj' &&
        (hasUpdate || value?.prodLineId !== oldValue?.prodLineId)
      ) {
        record.set('workcellObj', null);
      }
    },
  },
});
