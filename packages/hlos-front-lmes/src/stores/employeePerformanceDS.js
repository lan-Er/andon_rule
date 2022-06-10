/*
 * @Description: 员工实绩DS
 * @Author: tw
 * @LastEditTime: 2021-05-28 09:48:27
 */
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam, isTenantRoleLevel } from 'utils/utils';
import { getEnvConfig } from 'utils/iocUtils';
// import codeConfig from '@/common/codeConfig';
// import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { NOW_DATE_START, NOW_DATE_END } from 'hlos-front/lib/utils/constants';

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/workerPerformance/getWorkerPerformanceList`;
// const { lmesNonConformingProcessing } = codeConfig.code;
const employeeQueryDS = () => ({
  // autoCreate: true,
  autoQuery: false,
  // pageSize: 100,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.ORGANIZATION',
      label: '组织',
      required: true,
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
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.WORKER_GROUP',
      label: '班组',
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
      name: 'workerGroupCode',
      type: 'string',
      bind: 'workerGroupObj.workerGroupCode',
      ignore: 'always',
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
      noCache: true,
      lovCode: 'LMDS.WORKER',
      label: '员工',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          workerGroupId: record.get('workerGroupId'),
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
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'confirmedFlag',
      type: 'string',
      noCache: true,
      label: '实绩状态',
      lookupCode: 'LMES.PERFORMANCE_STATUS',
      required: true,
      // transformRequest: (value, record) => {
      //   console.log(value);
      //   console.log(record);
      //   return value;
      // },
      defaultValue: '1',
      // multiple: true,
    },
    {
      name: 'calendarYear',
      type: 'year',
      label: '年份',
    },
    {
      name: 'calendarMonth',
      type: 'month',
      label: '月份',
    },
    {
      name: 'calendarWeek',
      type: 'week',
      label: '周次',
    },
    {
      name: 'calendarShift',
      // name: 'calendarShiftCodeMeaning',
      type: 'string',
      label: '班次',
      lookupCode: 'LMDS.SHIFT_CODE',
    },
    {
      name: 'startDay',
      type: 'date',
      format: 'YYYY-MM-DD',
      max: 'endDay',
      label: '起始日期',
    },
    {
      name: 'endDay',
      type: 'date',
      format: 'YYYY-MM-DD',
      min: 'startDay',
      label: '结束日期',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'documentObj',
      type: 'object',
      label: '关联单据',
      lovCode: 'LMDS.DOCUMENT',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
        lovQueryAxiosConfig: () => {
          const { API_HOST } = getEnvConfig();
          const link = `${API_HOST}${HLOS_LMDS}/v1/${
            isTenantRoleLevel() ? `${getCurrentOrganizationId()}/` : ''
          }document-types/query-document-type-lov?lovCode=LMDS.DOCUMENT`;
          return {
            url: generateUrlWithGetParam(link, {
              documentClassList: ['TASK', 'MO'],
            }),
            method: 'GET',
          };
        },
      },
    },
    {
      name: 'documentTypeId',
      type: 'string',
      bind: 'documentObj.documentTypeId',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      bind: 'documentObj.documentTypeCode',
    },
    {
      name: 'summaryConditions',
      type: 'string',
      label: '汇总选项',
      multiple: true,
      border: 'none',
      lookupCode: 'LMES.PROFORMANCE_COLLECT',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
    },
    {
      name: 'workerGroup',
      type: 'string',
      label: '班组',
    },
    {
      name: 'workerName',
      type: 'string',
      label: '员工',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'operation',
      type: 'string',
      label: '工序',
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: '生产线',
    },
    {
      name: 'workcellName',
      type: 'string',
      label: '工位',
    },
    {
      name: 'locationName',
      type: 'string',
      label: '位置',
    },
    {
      name: 'processOkQty',
      type: 'number',
      label: '合格数量',
    },
    {
      name: 'processNgQty',
      type: 'number',
      label: '不合格数量',
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: '报废数量',
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: '返修数量',
    },
    {
      name: 'firstPassQty',
      type: 'number',
      label: '一次合格数量',
    },
    {
      name: 'firstPassRate',
      type: 'number',
      label: '一次合格率',
    },
    {
      name: 'moNum',
      type: 'string',
      label: 'MO',
    },
    {
      name: 'taskNum',
      type: 'string',
      label: '任务',
    },
    {
      name: 'standardWorkTime',
      type: 'string',
      label: '标准工时',
    },
    {
      name: 'processedTime',
      type: 'string',
      label: '实际工时',
    },
    {
      name: 'confirmedQty',
      type: 'string',
      label: '确认数量',
    },
    {
      name: 'confirmedTime',
      type: 'string',
      label: '确认工时',
    },
    {
      name: 'unitPrice',
      type: 'string',
      label: '工时单价',
    },
    {
      name: 'confirmedWage',
      type: 'string',
      label: '确认工资',
    },
    {
      name: 'confirmedFlagMeaning',
      type: 'string',
      label: '实绩确认标识',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'calendarYear',
      type: 'string',
      label: '年份',
    },
    {
      name: 'calendarMonth',
      type: 'string',
      label: '月份',
    },
    {
      name: 'calendarWeek',
      type: 'string',
      label: '周次',
    },
    {
      name: 'calendarDayStr',
      type: 'string',
      label: '日期',
    },
    {
      name: 'calendarShiftMeaning',
      type: 'string',
      label: '班次',
    },
  ],
  transport: {
    read: ({ params, data }) => {
      const _data = { ...data };
      if (_data.calendarYear) {
        _data.calendarYear = moment(_data.calendarYear).format('YYYY');
      }
      if (_data.calendarMonth) {
        _data.calendarYear = moment(_data.calendarYear).format('YYYY');
        const month = Number(moment(_data.calendarMonth).format('MM'));
        _data.calendarMonth = month.toString();
      }
      if (_data.calendarWeek) {
        _data.calendarYear = moment(_data.calendarYear).format('YYYY');
        const monthNum = Number(moment(_data.calendarMonth).format('MM'));
        _data.calendarMonth = monthNum.toString();
        const weekNum = Number(moment(_data.calendarWeek).format('WW'));
        _data.calendarWeek = weekNum.toString();
      }
      return {
        url,
        method: 'POST',
        params: {
          ...params,
          size: data.size,
          page: data.page,
        },
        data: {
          ..._data,
        },
      };
    },
  },
});

const employeeConfirmQueryDS = () => ({
  // autoCreate: true,
  // autoQuery: true,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.ORGANIZATION',
      label: '组织',
      required: true,
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
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'executeTimeMin',
      type: 'dateTime',
      label: '执行时间>=',
      required: true,
      defaultValue: NOW_DATE_START,
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
      label: '执行时间<=',
      required: true,
      defaultValue: NOW_DATE_END,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      dynamicProps: {
        min: ({ record }) => {
          if (record.get('executeTimeMin')) {
            return 'executeTimeMin';
          }
        },
      },
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.WORKER_GROUP',
      label: '班组',
      ignore: 'always',
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
      name: 'workerObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.WORKER',
      label: '员工',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
          workerGroupId: record.get('workerGroupId'),
        }),
      },
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.PRODLINE',
      label: '生产线',
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
      name: 'equipmentObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.EQUIPMENT',
      label: '设备',
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
      name: 'collectOptions',
      type: 'string',
      label: '汇总选项',
      multiple: true,
      border: 'none',
      lookupCode: 'LMES.COLLECT_OPTIONS',
      ignore: 'always',
    },
    {
      name: 'savePerformanceType',
      type: 'string',
      label: '确认类型',
      border: 'none',
      defaultValue: 'QTY',
      lookupCode: 'LMES.SAVE_PERFORMANCE_TYPE',
      ignore: 'always',
    },
    {
      name: 'positivePriceFlag',
      type: 'boolean',
      label: '仅查看单价有值',
      defaultValue: false,
    },
    {
      name: 'moObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMES.MO',
      label: 'MO',
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
      bind: 'moObj.moId',
    },
    {
      name: 'moNum',
      type: 'string',
      bind: 'moObj.moNum',
    },
  ],
});

const employeeConfirmLineDS = () => ({
  // autoCreate: true,
  // autoQuery: true,
  fields: [
    {
      name: 'organization',
      type: 'string',
      label: '组织',
    },
    {
      name: 'workerName',
      type: 'string',
      label: '员工',
    },
    {
      name: 'workerGroup',
      type: 'string',
      label: '班组',
    },
    {
      name: 'calendarDay',
      type: 'string',
      label: '工作日期',
    },
    {
      name: 'calendarShiftCodeMeaning',
      type: 'string',
      label: '班次',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'operation',
      type: 'string',
      label: '工序',
    },
    {
      name: 'executeQty',
      type: 'number',
      label: '合格数量',
    },
    {
      name: 'uom',
      type: 'string',
      label: '单位',
    },
    {
      name: 'confirmedQty',
      type: 'string',
      label: '确认数量',
    },
    {
      name: 'confirmedTime',
      type: 'string',
      label: '确认工时',
    },
    {
      name: 'confirmedWage',
      type: 'string',
      label: '确认工资',
    },
    {
      // name: 'standardWorkTime',
      name: 'taskStandardWorkTime',
      type: 'string',
      label: '标准工时',
    },
    {
      name: 'processedTime',
      type: 'string',
      label: '实际工时',
    },
    {
      name: 'unitPrice',
      type: 'string',
      label: '单价',
    },
    {
      name: 'executeNgQty',
      type: 'number',
      label: '不合格数量',
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: '报废数量',
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: '返修数量',
    },
    {
      name: 'prodLine',
      type: 'string',
      label: '生产线',
    },
    {
      name: 'equipment',
      type: 'string',
      label: '设备',
    },
    {
      name: 'moNum',
      type: 'string',
      label: 'MO',
    },
    // {
    //   name: 'collectOptions',
    //   type: 'string',
    //   multiple: true,
    //   border: 'none',
    //   lookupCode: 'LMES.COLLECT_OPTIONS',
    // },
    // {
    //   name: 'savePerformanceType',
    //   type: 'string',
    //   border: 'none',
    //   defaultValue: ['QTY'],
    //   lookupCode: 'LMES.SAVE_PERFORMANCE_TYPE',
    // },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/execute-lines/query-group`,
        method: 'GET',
      };
    },
  },
  // events: {
  //   select: ({ record }) => {
  //     if (record.get('savePerformanceType') === 'QTY') {
  //       record.set('confirmedQty', record.get('executeQty'));
  //     } else if (record.get('savePerformanceType') === 'WORK_TIME') {
  //       record.set('confirmedTime', record.get('processedTime'));
  //     }
  //   },
  //   selectAll: ({ dataSet }) => {
  //     console.log('bbb')
  //     const { records } = dataSet;
  //     records.forEach((record) => {
  //       if (record.get('savePerformanceType') === 'QTY') {
  //         record.set('confirmedQty', record.get('executeQty'));
  //       } else if (record.get('savePerformanceType') === 'WORK_TIME') {
  //         record.set('confirmedTime', record.get('processedTime'));
  //       }
  //     });
  //   },
  // },
});

export { employeeQueryDS, employeeConfirmQueryDS, employeeConfirmLineDS };
