/**
 * @Description: 飞达料车-ListDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-04 16:53:29
 * @LastEditors: yu.na
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
  positiveNumberValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsFeederTrolley, lmdsFeeder, common } = codeConfig.code;
const {
  lovPara: { trolley },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.feeder.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/feeder-trolleys`;

const ListDS = () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'trolleyCode',
      type: 'string',
      label: intl.get(`${preCode}.trolleyCode`).d('料车编码'),
    },
    {
      name: 'trolleyName',
      type: 'string',
      label: intl.get(`${preCode}.trolleyName`).d('料车名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'trolleyCode',
      type: 'string',
      label: intl.get(`${preCode}.trolleyCode`).d('料车编码'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'trolleyName',
      type: 'intl',
      label: intl.get(`${preCode}.trolleyName`).d('料车名称'),
      required: true,
    },
    {
      name: 'trolleyAlias',
      type: 'intl',
      label: intl.get(`${preCode}.trolleyAlias`).d('料车简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.trolleyDesc`).d('料车描述'),
      validator: descValidator,
    },
    {
      name: 'trolleyType',
      type: 'string',
      label: intl.get(`${preCode}.trolleyType`).d('料车类型'),
      lookupCode: lmdsFeederTrolley.trolleyType,
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${commonCode}.picture`).d('图片'),
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.feederTrolleyCategory`).d('飞达料车类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: trolley },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'trolleyCategoryId',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'trolleyCategoryCode',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'trolleyCategoryName',
      bind: 'categoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'trolleyGroup',
      type: 'string',
      label: intl.get(`${preCode}.trolleyGroup`).d('飞达料车分组'),
    },
    {
      name: 'trolleyStatus',
      type: 'string',
      label: intl.get(`${preCode}.trolleyStatus`).d('料车状态'),
      lookupCode: lmdsFeederTrolley.trolleyStatus,
      required: true,
    },
    {
      name: 'loadSeatQty',
      type: 'number',
      label: intl.get(`${preCode}.loadSeatQty`).d('站位数量'),
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.chiefPosition`).d('主管岗位'),
      lovCode: common.position,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'chiefPositionId',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'chiefPosition',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'chiefPositionName',
      bind: 'chiefPositionObj.positionName',
      ignore: 'always',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${preCode}.department`).d('部门'),
      required: false,
      lovCode: common.department,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'departmentId',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'department',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      bind: 'departmentObj.departmentName',
      ignore: 'always',
    },
    {
      name: 'supervisorObj',
      type: 'object',
      label: intl.get(`${preCode}.supervisor`).d('责任人'),
      lovCode: common.worker,
      cascadeMap: {
        departmentId: 'departmentId',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'supervisorId',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'supervisor',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorName',
      bind: 'supervisorObj.workerName',
      ignore: 'always',
    },
    {
      name: 'ownerType',
      type: 'string',
      label: intl.get(`${preCode}.ownType`).d('所有类型'),
      lookupCode: lmdsFeeder.ownType,
    },
    {
      name: 'ownerObj',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.party,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'ownerId',
      bind: 'ownerObj.partyId',
    },
    {
      name: 'ownerNumber',
      bind: 'ownerObj.partyNumber',
    },
    {
      name: 'ownerName',
      bind: 'ownerObj.partyName',
      ignore: 'always',
    },
    {
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${preCode}.assetNumber`).d('资产编号'),
    },
    {
      name: 'purchaseDate',
      type: 'date',
      label: intl.get(`${preCode}.purchaseDate`).d('采购日期'),
    },
    {
      name: 'startUseDate',
      type: 'date',
      label: intl.get(`${preCode}.startUseDate`).d('开始使用日期'),
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
    {
      name: 'servicePhone',
      type: 'string',
      label: intl.get(`${preCode}.servicePhone`).d('维修电话'),
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${preCode}.trolleyBom`).d('料车BOM'),
      lovCode: common.resourceBom,
      lovPara: { resourceBomType: trolley },
      textField: 'resourceBomVersion',
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'bomId',
      bind: 'bomObj.resourceBomId',
    },
    {
      name: 'bomVersion',
      bind: 'bomObj.resourceBomVersion',
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('估值货币'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'currency',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyName',
      bind: 'currencyObj.currencyName',
      ignore: 'always',
    },
    {
      name: 'initialValue',
      type: 'number',
      label: intl.get(`${preCode}.initialValue`).d('初始价值'),
      validator: positiveNumberValidator,
    },
    {
      name: 'currentValue',
      type: 'number',
      label: intl.get(`${preCode}.currentValue`).d('当前价值'),
      validator: positiveNumberValidator,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'loadFeeder',
      type: 'string',
      label: intl.get(`${preCode}.loadFeeder`).d('飞达信息'),
    },
    {
      name: 'prodLineObj',
      type: 'object',
      lovCode: common.prodLine,
      label: intl.get(`${commonCode}.prodLine`).d('生产线'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'prodLineId',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'equipmentId',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'workcellId',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      lovCode: common.workerGroup,
      label: intl.get(`${commonCode}.workerGroup`).d('班组'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'workerGroupId',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroup',
      bind: 'workerGroupObj.workerGroupCode',
    },
    {
      name: 'workerGroupName',
      bind: 'workerGroupObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'wmUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.wmUnit`).d('货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'wmUnitId',
      bind: 'wmUnitObj.wmUnitId',
    },
    {
      name: 'wmUnitCode',
      bind: 'wmUnitObj.wmUnitCode',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${preCode}.location`).d('地点'),
      lovCode: common.location,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'locationId',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      bind: 'locationObj.locationName',
      ignore: 'always',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'tpmGroupObj',
      type: 'object',
      lovCode: common.workerGroup,
      label: intl.get(`${preCode}.tpmGroup`).d('维修班组'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'tpmGroupId',
      bind: 'tpmGroupObj.workerGroupId',
    },
    {
      name: 'tpmGroup',
      bind: 'tpmGroupObj.workerGroupCode',
    },
    {
      name: 'tpmGroupName',
      bind: 'tpmGroupObj.workerGroupName',
      ignore: 'always',
    },
    {
      name: 'tpmWorkerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.tpmWorker`).d('维修员工'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'tpmWorkerId',
      bind: 'tpmWorkerObj.workerId',
    },
    {
      name: 'tpmWorker',
      bind: 'tpmWorkerObj.workerCode',
    },
    {
      name: 'tpmWorkerName',
      bind: 'tpmWorkerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'trolleyUsedCount',
      type: 'number',
      label: intl.get(`${preCode}.usedCount`).d('已使用次数'),
      min: 0,
      step: 1,
    },
    {
      name: 'maintenancedTimes',
      type: 'number',
      label: intl.get(`${preCode}.maintenancedTimes`).d('检修次数'),
      min: 0,
      step: 1,
    },
    {
      name: 'lastTpmDate',
      type: 'date',
      label: intl.get(`${preCode}.lastTpmDate`).d('上次检修时间'),
    },
    {
      name: 'lastTpmManObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.lastTpmMan`).d('上次检修人'),
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'lastTpmManId',
      bind: 'lastTpmManObj.workerId',
    },
    {
      name: 'lastTpmMan',
      bind: 'lastTpmManObj.workerCode',
    },
    {
      name: 'lastTpmManName',
      bind: 'lastTpmManObj.workerName',
      ignore: 'always',
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: intl.get(`${preCode}.referenceDocument`).d('作业指导'),
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: intl.get(`${preCode}.drawing`).d('图纸'),
    },
    {
      name: 'instruction',
      type: 'string',
      label: intl.get(`${preCode}.instruction`).d('操作说明'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'feederTrolley', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
  },
});

const DetailDS = () => ({
  autoQuery: true,
  selection: false,
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
  },
});

export { ListDS, DetailDS };
