/*
 * @Description: 生产订单进度报表--DS
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-05 11:05:22
 * @LastEditors: 那宇
 */

import moment from 'moment';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const preCode = 'ldab.productionOrderProgressReport.model';
const commonCode = 'ldab.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMES}/v1/${organizationId}/mos/progress`;

const ListDS = () => {
  return {
    selection: false,
    transport: {
      read: ({ data }) => {
        const { moStatus } = data;
        return {
          url: generateUrlWithGetParam(url, {
            moStatus,
          }),
          data: {
            ...data,
            moStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
        lovCode: common.organization,
        lovPara: { organizationClass: 'ME' },
        ignore: 'always',
        required: true,
        noCache: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.itemMe,
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
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonCode}.customer`).d('客户'),
        lovCode: common.customer,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'customerId',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerName',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: common.moStatus,
        multiple: true,
        defaultValue: ['SCHEDULED', 'RELEASED', 'PENDING'],
        required: true,
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'moTypeId',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeName',
        bind: 'moTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.category`).d('物料类别'),
        lovCode: common.itemCategory,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'itemCategoryId',
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'itemCategoryName',
        bind: 'categoryObj.categoryName',
        ignore: 'always',
      },
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'MO' },
        noCache: true,
      },
      {
        name: 'moId',
        bind: 'moObj.documentId',
      },
      {
        name: 'moNum',
        bind: 'moObj.documentNum',
      },
      {
        name: 'soObj',
        type: 'object',
        label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'SO' },
        noCache: true,
      },
      {
        name: 'soId',
        bind: 'soObj.documentId',
      },
      {
        name: 'soNum',
        bind: 'soObj.documentNum',
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'DEMAND' },
        noCache: true,
      },
      {
        name: 'demandId',
        bind: 'demandObj.documentId',
      },
      {
        name: 'demandNum',
        bind: 'demandObj.documentNum',
      },
      {
        name: 'demandDateStart',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandDateStart`).d('需求时间>='),
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
        type: 'dateTime',
        label: intl.get(`${preCode}.demandDateEnd`).d('需求时间<='),
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'delayDaysStart',
        type: 'number',
        label: intl.get(`${preCode}.delayDaysStart`).d('延期时间>='),
        min: 0,
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('delayDaysEnd')) {
              return 'delayDaysEnd';
            }
          },
        },
      },
      {
        name: 'delayDaysEnd',
        type: 'number',
        label: intl.get(`${preCode}.delayDaysEnd`).d('延期时间<='),
        min: 'delayDaysStart',
      },
    ],
    fields: [
      {
        name: 'ownerOrganizationName',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'description',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'customerName',
        label: intl.get(`${commonCode}.customer`).d('客户'),
      },
      {
        name: 'completedPercent',
        label: intl.get(`${preCode}.completedPercent`).d('完工进度'),
      },
      {
        name: 'demandDate',
        label: intl.get(`${preCode}.demandDate`).d('需求时间'),
      },
      {
        name: 'delayDays',
        label: intl.get(`${preCode}.delayDays`).d('延期天数'),
      },
      {
        name: 'uomName',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'demandQty',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
      },
      {
        name: 'makeQty',
        label: intl.get(`${preCode}.makeQty`).d('制造数量'),
      },
      {
        name: 'completedQty',
        label: intl.get(`${preCode}.okQty`).d('合格数量'),
      },
      {
        name: 'processNgQty',
        label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
      },
      {
        name: 'reworkQty',
        label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      },
      {
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      },
      {
        name: 'pendingQty',
        label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      },
      {
        name: 'wipQty',
        label: intl.get(`${preCode}.wipQty`).d('在制数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('已入库数量'),
      },
      {
        name: 'suppliedQty',
        label: intl.get(`${preCode}.suppliedQty`).d('已供应数量'),
      },
      {
        name: 'inputQty',
        label: intl.get(`${preCode}.inputQty`).d('关键投入'),
      },
      {
        name: 'issuedSuit',
        label: intl.get(`${preCode}.issuedQty`).d('投料套数'),
      },
      {
        name: 'maxIssuedQty',
        label: intl.get(`${preCode}.maxIssuedQty`).d('最大投入'),
      },
      {
        name: 'so',
        label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      },
      {
        name: 'demandNum',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
      },
      {
        name: 'moStatusMeaning',
        label: intl.get(`${preCode}.status`).d('状态'),
      },
      {
        name: 'moTypeName',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
      },
      {
        name: 'itemCategoryName',
        label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      },
      {
        name: 'promiseDate',
        label: intl.get(`${preCode}.promiseDate`).d('承诺时间'),
      },
      {
        name: 'planStartTime',
        label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      },
      {
        name: 'planEndTime',
        label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
      },
      {
        name: 'actualStartDate',
        label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      },
      {
        name: 'actualEndDate',
        label: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      },
      {
        name: 'topMoNum',
        label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      },
      {
        name: 'parentMoNums',
        label: intl.get(`${preCode}.parentMo`).d('父MO'),
      },
      {
        name: 'moLevel',
        label: intl.get(`${preCode}.moLevel`).d('MO层级'),
      },
      {
        name: 'prodline',
        label: intl.get(`${preCode}.prodline`).d('生产线'),
      },
      {
        name: 'workcell',
        label: intl.get(`${preCode}.workcell`).d('工位'),
      },
      {
        name: 'equipment',
        label: intl.get(`${preCode}.equipment`).d('设备'),
      },
      {
        name: 'location',
        label: intl.get(`${preCode}.location`).d('位置'),
      },
      {
        name: 'worker',
        label: intl.get(`${preCode}.worker`).d('操作工'),
      },
      {
        name: 'workerGroup',
        label: intl.get(`${preCode}.workerGroup`).d('班组'),
      },
    ],
  };
};

const DetailDS = () => ({
  selection: false,
  paging: false,
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMES}/v1/${organizationId}/tasks/mo-progress-detail`,
        transformResponse: (data) => {
          if (data) {
            const formatData = JSON.parse(data);
            return {
              content: formatData,
            };
          }
        },
        method: 'GET',
      };
    },
  },
  fields: [
    {
      name: 'taskNum',
      label: intl.get(`${commonCode}.taskNum`).d('任务号'),
    },
    {
      name: 'operationName',
      label: intl.get(`${commonCode}.operation`).d('工序'),
    },
    {
      name: 'completedPercent',
      label: intl.get(`${preCode}.completedPercent`).d('完工进度'),
    },
    {
      name: 'taskStatusMeaning',
      label: intl.get(`${preCode}.status`).d('状态'),
    },
    {
      name: 'uomName',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'taskQty',
      label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    },
    {
      name: 'processOkQty',
      label: intl.get(`${preCode}.okQty`).d('合格数量'),
    },
    {
      name: 'processNgQty',
      label: intl.get(`${preCode}.ngQty`).d('不合格数量'),
    },
    {
      name: 'reworkQty',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
    },
    {
      name: 'scrappedQty',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
    },
    {
      name: 'pendingQty',
      label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
    },
    {
      name: 'planStartTime',
      label: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
    },
    {
      name: 'planEndTime',
      label: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
    },
    {
      name: 'actualStartTime',
      label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
    },
    {
      name: 'actualEndTime',
      label: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
    },
    {
      name: 'supervisorName',
      label: intl.get(`${preCode}.supervisor`).d('管理员工'),
    },
    {
      name: 'prodLineName',
      label: intl.get(`${preCode}.prodline`).d('生产线'),
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
      name: 'locationName',
      label: intl.get(`${preCode}.location`).d('位置'),
    },
    {
      name: 'workerName',
      label: intl.get(`${preCode}.worker`).d('员工'),
    },
    {
      name: 'pictureIds',
      label: intl.get(`${preCode}.picture`).d('图纸'),
    },
  ],
});

export { ListDS, DetailDS };
