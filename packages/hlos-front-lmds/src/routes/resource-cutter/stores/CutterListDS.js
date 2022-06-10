/*
 * @Author: zhang yang
 * @Description: 刀具 DS
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 20:08:19
 */

import { getCurrentOrganizationId, generateUrlWithGetParam, isTenantRoleLevel } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { getEnvConfig } from 'utils/iocUtils';

import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/cutters`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.cutter.model';

const { common, lmdsCutter } = codeConfig.code;

export default () => ({
  autoQuery: true,
  selection: false,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'cutter', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => ({
      url,
      method: 'get',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'post',
    }),
    submit: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
        },
        method: 'put',
      };
    },
  },
  fields: [
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organization.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'cutterCode',
      type: 'string',
      label: intl.get(`${preCode}.cutter`).d('刀具'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'cutterName',
      type: 'intl',
      label: intl.get(`${preCode}.cutterName`).d('刀具名称'),
      required: true,
    },
    {
      name: 'cutterAlias',
      type: 'intl',
      label: intl.get(`${preCode}.cutterAlias`).d('刀具简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.cutterDesc`).d('刀具描述'),
      validator: descValidator,
    },
    {
      name: 'cutterType',
      type: 'string',
      label: intl.get(`${preCode}.relationType`).d('刀具类型'),
      required: true,
      lookupCode: lmdsCutter.relationType,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.picture`).d('图片'),
    },
    {
      name: 'category',
      type: 'object',
      label: intl.get(`${preCode}.cutterCategory`).d('刀具类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'CUTTER' },
      ignore: 'always',
    },
    {
      name: 'cutterCategoryId',
      type: 'string',
      bind: 'category.categoryId',
    },
    {
      name: 'cutterCategoryCode',
      type: 'string',
      bind: 'category.categoryCode',
    },
    {
      name: 'cutterCategoryName',
      type: 'string',
      bind: 'category.categoryName',
    },
    {
      name: 'cutterGroup',
      type: 'string',
      label: intl.get(`${preCode}.cutterGroup`).d('刀具组'),
    },
    {
      name: 'cutterBodyObj',
      type: 'object',
      label: '关联刀体',
      lovCode: lmdsCutter.cutterBody,
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovQueryAxiosConfig: ({ record }) => {
          const { API_HOST } = getEnvConfig();
          const link = `${API_HOST}${HLOS_LMDS}/v1/${
            isTenantRoleLevel() ? `${getCurrentOrganizationId()}/` : ''
          }cutters/getCutterLov?lovCode=LMDS.CUTTER_URL&page=0&size=10`;
          return {
            url: generateUrlWithGetParam(link, {
              organizationId: record.get('organizationId'),
              cutterTypeList: ['CUTTER_BODY', 'CUTTER_DISK'],
            }),
            method: 'GET',
          };
        },
      },
      ignore: 'always',
    },
    {
      name: 'cutterBodyId',
      type: 'string',
      bind: 'cutterBodyObj.cutterId',
    },
    {
      name: 'cutterBodyCode',
      type: 'string',
      bind: 'cutterBodyObj.cutterCode',
    },
    {
      name: 'cutterBodyName',
      type: 'string',
      bind: 'cutterBodyObj.cutterName',
    },
    {
      name: 'cutterHeadQty',
      type: 'number',
      label: '刀头数量',
      dynamicProps: {
        disabled: ({ record }) => record.get('cutterType') === 'CUTTER_HEAD',
      },
    },
    {
      name: 'cutterHead',
      type: 'string',
      label: '刀头信息',
      dynamicProps: {
        disabled: ({ record }) => record.get('cutterType') === 'CUTTER_HEAD',
      },
    },
    {
      name: 'toolMagazine',
      type: 'string',
      label: '所处刀库',
    },
    {
      name: 'toolMagazinePosition',
      type: 'string',
      label: '所处刀库位置',
    },
    {
      name: 'ownerType',
      type: 'string',
      label: '所有类型',
      lookupCode: 'LMDS.OWNER_TYPE',
    },
    {
      name: 'owner',
      type: 'object',
      label: intl.get(`${preCode}.owner`).d('所有者'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.departmentId',
    },
    {
      name: 'ownerNumber',
      type: 'string',
      bind: 'owner.departmentCode',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.departmentName',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.chiefPosition`).d('主管岗位'),
      lovCode: common.position,
      ignore: 'always',
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'chiefPosition',
      type: 'string',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'chiefPositionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: '主管部门',
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'department',
      type: 'string',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'supervisorObj',
      type: 'object',
      label: '责任员工',
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'workerGroupObj',
      type: 'object',
      label: '当前使用班组',
      lovCode: common.workerGroup,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
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
      label: '当前使用员工',
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
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
      name: 'cutterStatus',
      type: 'string',
      label: intl.get(`${preCode}.cutterStatus`).d('刀具状态'),
      lookupCode: lmdsCutter.cutterStatus,
    },
    {
      name: 'purchaseDate',
      type: 'date',
      label: intl.get(`${preCode}.purchaseDate`).d('采购日期'),
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('startUseDate'))) {
            return 'startUseDate';
          }
        },
      },
    },
    {
      name: 'startUseDate',
      type: 'date',
      label: intl.get(`${preCode}.startUseDate`).d('开始使用日期'),
      format: DEFAULT_DATE_FORMAT,
      min: 'purchaseDate',
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('lastSharpenedDate'))) {
            return 'lastSharpenedDate';
          }
        },
      },
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
      name: 'BOM',
      type: 'object',
      label: intl.get(`${preCode}.BOM`).d('刀具BOM'),
      lovCode: common.resourceBom,
      ignore: 'always',
      lovPara: { resourceBomType: 'CUTTER' },
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'BOM.resourceBomId',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'BOM.resourceBomCode',
    },
    {
      name: 'bomName',
      type: 'string',
      bind: 'BOM.resourceBomName',
    },
    {
      name: 'valueCurrencyObj',
      type: 'object',
      label: intl.get(`${preCode}.valueCurrency`).d('估值货币'),
      lovCode: common.currency,
      ignore: 'always',
    },
    // {
    //   name: 'valueCurrency',
    //   type: 'string',
    //   bind: 'valueCurrencyObj.currencyCode',
    // },
    {
      name: 'currency',
      type: 'string',
      bind: 'valueCurrencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'valueCurrencyObj.currencyId',
    },
    {
      name: 'initialValue',
      type: 'string',
      label: intl.get(`${preCode}.initialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'string',
      label: intl.get(`${preCode}.currentValue`).d('当前价值'),
    },
    {
      name: 'prodLine',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: lmdsCutter.prodLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLine.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLine.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLine.resourceName',
    },
    {
      name: 'equipment',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: lmdsCutter.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipment.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipment.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipment.equipmentName',
    },
    {
      name: 'workcell',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      lovCode: lmdsCutter.workcell,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcell.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcell.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcell.workcellName',
    },
    {
      name: 'warehouse',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      lovCode: lmdsCutter.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'wmArea',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: lmdsCutter.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmArea.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmArea.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmArea.wmAreaName',
    },
    {
      name: 'wmUnit',
      type: 'object',
      label: intl.get(`${preCode}.wmUnit`).d('货格'),
      lovCode: lmdsCutter.wmUnit,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          wmAreaId: record.get('wmAreaId'),
        }),
      },
    },
    {
      name: 'wmUnitId',
      type: 'string',
      bind: 'wmUnit.wmUnitId',
    },
    {
      name: 'wmUnitName',
      type: 'string',
      bind: 'wmUnit.wmUnitName',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnit.wmUnitCode',
    },
    {
      name: 'location',
      type: 'object',
      label: intl.get(`${preCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'location.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'location.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'location.locationName',
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
    },
    {
      name: 'referenceDocument',
      type: 'string',
      label: '参考文件',
    },
    {
      name: 'instruction',
      type: 'string',
      label: '操作说明',
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: '图纸编号',
    },
    {
      name: 'tpmGroupObj',
      type: 'object',
      label: '维护班组',
      lovCode: common.workerGroup,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      label: '维护员工',
      lovCode: common.worker,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({record}) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'cutterLifetimeCount',
      type: 'number',
      label: intl.get(`${preCode}.cutterLifetimeCount`).d('寿命次数'),
      min: 0,
      step: 1,
    },
    {
      name: 'cutterUsedCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.cutterUsedCount`).d('已使用次数'),
    },
    {
      name: 'planSharpenTimes',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.planSharpenTimes`).d('计划刃磨次数'),
    },
    {
      name: 'sharpenedTimes',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.sharpenedTimes`).d('已刃磨次数'),
    },
    {
      name: 'nextPlanCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.nextPlanCount`).d('下回计划次数'),
    },
    {
      name: 'nextUsedCount',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.nextUsedCount`).d('下回使用次数'),
    },
    {
      name: 'lastSharpenedDate',
      type: 'date',
      label: intl.get(`${preCode}.lastSharpenedDate`).d('上次刃磨日期'),
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
      min: 'startUseDate',
    },
    {
      name: 'lastSharpenedMan',
      type: 'string',
      label: intl.get(`${preCode}.lastSharpenedMan`).d('上次刃磨人'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'cutterCode', type: 'string', label: intl.get(`${preCode}.cutterCode`).d('刀具') },
    {
      name: 'cutterName',
      type: 'string',
      label: intl.get(`${preCode}.cutterName`).d('刀具名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
