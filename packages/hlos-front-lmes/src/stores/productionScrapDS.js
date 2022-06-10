/*
 * @Descripttion: 生产报废DS
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lmesProductionScrap } = codeConfig.code;
const preCode = 'lmes.productionScrap.model';

const LoginDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'organizationCode',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
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
      name: 'fileUrl',
      type: 'string',
      bind: 'workerObj.fileUrl',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${preCode}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      noCache: true,
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
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${preCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      noCache: true,
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
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${preCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          prodLineId: record.get('prodLineId'),
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
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.workGroup`).d('班组'),
      lovCode: common.workerGroup,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
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
      name: 'reportType',
      type: 'string',
      label: intl.get(`${preCode}.reportType`).d('报工模式'),
      lookupCode: lmesProductionScrap.reportType,
      required: true,
      defaultValue: 'MO',
    },
    {
      name: 'resourceType',
      type: 'string',
      defaultValue: 'workcell',
    },
    {
      name: 'date',
      type: 'date',
      label: intl.get(`${preCode}.date`).d('日期'),
      transformRequest: value => moment(value).format(DEFAULT_DATE_FORMAT),
      required: true,
      defaultValue: moment(),
    },
    {
      name: 'shiftCode',
      type: 'string',
      label: intl.get(`${preCode}.shift`).d('班次'),
      lookupCode: common.shift, // scrappedType
      required: true,
      defaultValue: 'MORNING SHIFT',
    },
  ],
});

const QueryDS = () => ({
  autoCreate: true,
  fields: [
    // {
    //   name: 'inputNum',
    //   type: 'string',
    //   required: true,
    // },
    {
      name: 'moId',
    },
    {
      name: 'organizationId',
    },

    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.moOperation,
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'moOperationId',
      type: 'string',
      bind: 'operationObj.moOperationId',
    },
    {
      name: 'operationCode',
      type: 'string',
      bind: 'operationObj.operationCode',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operationObj.operationName',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'warehouseId',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'reworkFlag',
      type: 'boolean',
    },
    {
      name: 'scrappedType',
      type: 'string',
      lookupCode: lmesProductionScrap.scrappedType,
      defaultValue: 'SCRAPPED',
    },
  ],
  events: {
    update: ({name, record}) => {
      if(name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

export { LoginDS, QueryDS };
