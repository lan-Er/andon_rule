/*
 * @module: SMD在制DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-01 16:31:06
 * @LastEditTime: 2021-07-29 11:31:49
 * @copyright: Copyright (c) 2021,Hand
 */
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmes.smdMaking.model';
const { common } = codeConfig.code;
const headerQueryUrl = `${HLOS_LMES}/v1/${organizationId}/smd-wip-headers/head-list`;
const lineQueryUrl = `${HLOS_LMES}/v1/${organizationId}/smd-wip-lines/line-list`;
const tempLineSubmitUrl = `${HLOS_LMES}/v1/${organizationId}/smd-wip-lines/save-smd-wip-temp-line`;

const getCommonFields = () => [
  {
    name: 'organizationObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.org`).d('组织'),
    lovCode: common.organization,
    required: true,
  },
  {
    name: 'organizationName',
    type: 'string',
    bind: 'organizationObj.organizationName',
    ignore: 'always',
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
    ignore: 'always',
  },
  {
    name: 'itemObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.productRequest`).d('物料'),
    lovCode: 'LMDS.ITEM',
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
    name: 'itemDescription',
    type: 'string',
    bind: 'itemObj.description',
    ignore: 'always',
  },
  {
    name: 'moObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.MO`).d('MO号'),
    lovCode: 'LMES.MO',
    // cascadeMap: { organizationId: 'organizationId' },
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'moNum',
    type: 'string',
    bind: 'moObj.moNum',
    ignore: 'always',
  },
  {
    name: 'moId',
    type: 'string',
    bind: 'moObj.moId',
  },
  {
    name: 'moCode',
    type: 'string',
    bind: 'moObj.moCode',
    ignore: 'always',
  },
  {
    name: 'equipmentObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.MO`).d('设备'),
    lovCode: 'LMDS.EQUIPMENT',
    // cascadeMap: { organizationId: 'organizationId' },
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'equipmentName',
    type: 'string',
    bind: 'equipmentObj.equipmentName',
    ignore: 'always',
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
    ignore: 'always',
  },
  {
    name: 'pcbMountSide',
    type: 'string',
    multiple: true,
    // defaultValue: ['NEW', 'RELEASED', 'EXECUTED'],
    lookupCode: 'LMDS.SMT_PCB_MOUNT_SIDE',
    label: intl.get(`${intlPrefix}.transferRequestStatus`).d('贴片面'),
  },
  {
    name: 'prodLineObj',
    type: 'object',
    noCache: true,
    label: intl.get(`${intlPrefix}.prodLineCode`).d('生产线'),
    lovCode: 'LMDS.PRODLINE',
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'prodLineId',
    bind: 'prodLineObj.prodLineId',
  },
  {
    name: 'prodLineCode',
    bind: 'prodLineObj.prodLineCode',
    ignore: 'always',
  },
  {
    name: 'prodLineName',
    bind: 'prodLineObj.resourceName',
    ignore: 'always',
  },
  {
    name: 'workcellObj',
    type: 'object',
    noCache: true,
    label: intl.get(`${intlPrefix}.workcell`).d('工位'),
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
    name: 'trolleyObj',
    type: 'object',
    label: intl.get(`${intlPrefix}.feederTrolley`).d('料车'),
    lovCode: 'LMDS.FEEDER_TROLLEY',
    ignore: 'always',
    noCache: true,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'trolleyId',
    bind: 'trolleyObj.trolleyId',
  },
  {
    name: 'trolleyCode',
    bind: 'trolleyObj.trolleyCode',
    ignore: 'always',
  },
  {
    name: 'trolleyName',
    bind: 'trolleyObj.trolleyName',
    ignore: 'always',
  },
  {
    name: 'loadedTimeFrom',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.startTime`).d('上料时间>='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      max: ({ record }) => {
        if (record.get('loadedTimeTo')) {
          return 'loadedTimeTo';
        }
      },
    },
  },
  {
    name: 'loadedTimeTo',
    type: 'dateTime',
    label: intl.get(`${intlPrefix}.endTime`).d('上料时间<='),
    format: DEFAULT_DATETIME_FORMAT,
    dynamicProps: {
      min: ({ record }) => {
        if (record.get('loadedTimeFrom')) {
          return 'loadedTimeFrom';
        }
      },
    },
  },
  {
    name: 'loadedWorkerObj',
    type: 'object',
    noCache: true,
    ignore: 'always',
    label: intl.get(`${intlPrefix}.worker`).d('上料员工'),
    lovCode: common.worker,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
  },
  {
    name: 'loadedWorkerId',
    type: 'string',
    bind: 'loadedWorkerObj.workerId',
  },
  {
    name: 'loadedWorkerCode',
    type: 'string',
    bind: 'loadedWorkerObj.workerCode',
    ignore: 'always',
  },
  {
    name: 'loadedWorkerName',
    type: 'string',
    bind: 'loadedWorkerObj.workerName',
    ignore: 'always',
  },
  {
    name: 'smdWipStatus',
    type: 'string',
    multiple: true,
    // defaultValue: ['NEW', 'RELEASED', 'EXECUTED'],
    lookupCode: 'LMES.SMD_WIP_STATUS',
    label: intl.get(`${intlPrefix}.transferRequestStatus`).d('在制状态'),
  },
];

const smdInMakingDS = () => ({
  autoQuery: false,
  selection: 'multiple',
  pageSize: 10,
  queryFields: getCommonFields(true),
  fields: [
    {
      name: 'smdWipId',
    },
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'organizationCode',
      type: 'string',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.org`).d('组织'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
    },
    {
      name: 'moNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.moNum`).d('MO'),
    },
    {
      name: 'makeQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.makeQty`).d('制造数量'),
    },
    {
      name: 'smdWipStatus',
      type: 'string',
    },
    {
      name: 'smdWipStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.smdWipStatusMeaning`).d('在制状态'),
    },
    {
      name: 'pcbMountSideMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.pcbMountSideMeaning`).d('贴片面'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.prodLineName`).d('生产线'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.equipmentName`).d('贴片设备'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.workcellName`).d('工位'),
    },
    {
      name: 'location',
      type: 'string',
      label: intl.get(`${intlPrefix}.location`).d('地点'),
    },
    {
      name: 'mounterPositionMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.mounterPositionMeaning`).d('设备方位'),
    },
    {
      name: 'mounterGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.mounterGroup`).d('设备组'),
    },
    {
      name: 'mounterCategoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.mounterCategoryName`).d('设备类别'),
    },
    {
      name: 'trolleyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.trolleyName`).d('料车'),
    },
    {
      name: 'trolleyCategoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.trolleyCategoryName`).d('料车类别'),
    },
    {
      name: 'product',
      type: 'string',
      label: intl.get(`${intlPrefix}.product`).d('产品'),
    },
    {
      name: 'productId',
      type: 'string',
    },
    {
      name: 'productCode',
      type: 'string',
    },
    {
      name: 'productDescription',
      type: 'string',
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.partyName`).d('客户'),
    },
    {
      name: 'pcbProductQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.pcbProductQty`).d('单板产出'),
    },
    {
      name: 'deviceSumQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.deviceSumQty`).d('元件总数'),
    },
    {
      name: 'mountMethodMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.mountMethodMeaning`).d('贴片方式'),
    },
    {
      name: 'prepareMethodMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.prepareMethodMeaning`).d('备料方式'),
    },
    {
      name: 'smdVersion',
      type: 'string',
      label: intl.get(`${intlPrefix}.smdVersion`).d('版本'),
    },
    {
      name: 'smtProgram',
      type: 'string',
      label: intl.get(`${intlPrefix}.smtProgram`).d('程序名'),
    },
    {
      name: 'errorProofingRuleName',
      type: 'string',
      label: intl.get(`${intlPrefix}.errorProofingRuleName`).d('防错规则'),
    },
    {
      name: 'loadedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.loadedWorkerName`).d('上料员工'),
    },
    {
      name: 'loadedTime',
      type: 'date',
      label: intl.get(`${intlPrefix}.loadedTime`).d('上料时间'),
    },
    {
      name: 'moRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.moRemark`).d('MO备注'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: headerQueryUrl,
        method: 'GET',
        paramsSerializer: (params) => {
          const tmpParams = filterNullValueObject(params);
          const queryParams = new URLSearchParams();
          Object.keys(tmpParams).forEach((key) => {
            queryParams.append(key, tmpParams[key]);
          });
          return queryParams.toString();
        },
      };
    },
  },
});

const smdInMakingLineDS = () => ({
  pageSize: 100,
  selection: false,
  fields: [
    {
      name: 'smdLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.smdLineNum`).d('行号'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.org`).d('组织'),
    },
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'organizationCode',
      type: 'string',
    },
    {
      name: 'deviceItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.deviceItemCode`).d('贴片元件'),
    },
    {
      name: 'deviceItemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.deviceItemDescription`).d('元件描述'),
    },
    {
      name: 'loadSeat',
      type: 'string',
      label: intl.get(`${intlPrefix}.loadSeat`).d('给料站位'),
    },
    {
      name: 'deviceUsage',
      type: 'number',
      label: intl.get(`${intlPrefix}.deviceUsage`).d('元件用量'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tagCode`).d('标签'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
    },
    {
      name: 'deviceOnhandQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.deviceOnhandQty`).d('数量'),
    },
    {
      name: 'deviceWarningQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.deviceWarningQty`).d('警告数量'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
    },
    {
      name: 'supplierLotNumber',
      type: 'number',
      label: intl.get(`${intlPrefix}.supplierLotNumber`).d('供应商批次'),
    },
    {
      name: 'pcbMountPosition',
      type: 'string',
      label: intl.get(`${intlPrefix}.pcbMountPosition`).d('贴片点位'),
    },
    {
      name: 'deviceSubstituteGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.deviceSubstituteGroup`).d('替代组'),
    },
    {
      name: 'deviceSubstituteFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.deviceSubstituteFlag`).d('替代标识'),
    },
    {
      name: 'feederName',
      type: 'string',
      label: intl.get(`${intlPrefix}.feederName`).d('飞达'),
    },
    {
      name: 'feederCategoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.feederCategoryName`).d('飞达类别'),
    },
    {
      name: 'feederLayLength',
      type: 'string',
      label: intl.get(`${intlPrefix}.feederLayLength`).d('飞达绞距'),
    },
    {
      name: 'loadedFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.loadedFlag`).d('上料标识'),
    },
    {
      name: 'preparedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.preparedWorkerName`).d('备料员工'),
    },
    {
      name: 'preparedTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.preparedTime`).d('备料时间'),
    },
    {
      name: 'checkedFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.checkedFlag`).d('复核标识'),
    },
    {
      name: 'checkedWorkerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.checkedWorkerName`).d('复核员工'),
    },
    {
      name: 'checkedTime',
      type: 'string',
      label: intl.get(`${intlPrefix}.checkedTime`).d('复核时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: ({ params }) => ({
      url: lineQueryUrl,
      method: 'GET',
      params: {
        ...params,
      },
    }),
  },
});

const smdTempLineDS = () => ({
  pageSize: 100,
  autoCreate: true,
  selection: false,
  fields: [
    {
      name: 'smdWipId',
      type: 'string',
    },
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'deviceItemObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.org`).d('贴片元件'),
      lovCode: 'LMDS.ITEM_ME',
      required: true,
      textField: 'itemDescription',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'deviceItemId',
      type: 'string',
      bind: 'deviceItemObj.itemId',
    },
    {
      name: 'deviceItemCode',
      type: 'string',
      bind: 'deviceItemObj.itemCode',
    },
    {
      name: 'deviceItemName',
      type: 'string',
      bind: 'deviceItemObj.itemDescription',
      ignore: 'always',
    },
    {
      name: 'loadSeat',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.uomName`).d('给料站位'),
    },
    {
      name: 'deviceUsage',
      type: 'number',
      min: 0,
      step: 1,
      required: true,
      label: intl.get(`${intlPrefix}.itemDescription`).d('元件用量'),
    },
    {
      name: 'pcbMountPosition',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyQty`).d('贴片点位'),
    },
    {
      name: 'deviceWarningQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyQty`).d('警告数量'),
    },
    {
      name: 'deviceSubstituteGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyQty`).d('替代组'),
    },
    {
      name: 'deviceSubstituteFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.applyQty`).d('替代标识'),
    },
    {
      name: 'feederCategoryObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.org`).d('飞达类别'),
      lovCode: 'LMDS.CATEGORIES',
      lovPara: { categorySetCode: 'FEEDER' },
    },
    {
      name: 'feederCategoryId',
      type: 'string',
      bind: 'feederCategoryObj.categoryId',
    },
    {
      name: 'feederCategoryCode',
      type: 'string',
      bind: 'feederCategoryObj.categoryCode',
    },
    {
      name: 'feederLayLength',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyQty`).d('飞达绞距'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.applyQty`).d('备注'),
    },
  ],
  transport: {
    submit: ({ data }) => {
      return {
        url: tempLineSubmitUrl,
        method: 'POST',
        data: [
          {
            smdWipId: data[0].smdWipId,
            validateLevel: 5,
            lineDTOList: [{...data[0]}],
          },
        ],
      };
    },
  },
});

export { smdInMakingDS, smdInMakingLineDS, smdTempLineDS };
