/**
 * @Description: 生产任务进度报表--DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-18 17:37:18
 */

import moment from 'moment';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'zexe.common.model';
const preCode = 'zexe.productTaskProgressReport.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/report/task/product`;

const ListDS = () => {
  return {
    selection: false,
    transport: {
      read: () => ({
        url,
        method: 'GET',
      }),
    },
    queryFields: [
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonCode}.supplier`).d('供应商编码'),
        lovCode: common.supplier,
        textField: 'supplierNumber',
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
        ignore: 'always',
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
        lovCode: common.supplierMeOu,
        ignore: 'always',
        required: true,
        noCache: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.meOuName',
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
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'MO' },
        noCache: true,
      },
      {
        name: 'moId',
        bind: 'moNumObj.documentId',
      },
      {
        name: 'moNum',
        bind: 'moNumObj.documentNum',
      },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get(`${commonCode}.operation`).d('工序'),
        lovCode: common.operation,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'operationId',
        bind: 'operationObj.operationId',
      },
      {
        name: 'operationName',
        bind: 'operationObj.operationName',
      },
      {
        name: 'planStartTimeFrom',
        type: 'dateTime',
        label: intl.get(`${preCode}.planStartTimeFrom`).d('计划开始时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planStartTimeTo')) {
              return 'planStartTimeTo';
            }
          },
        },
      },
      {
        name: 'planStartTimeTo',
        type: 'dateTime',
        label: intl.get(`${preCode}.planStartTimeTo`).d('计划开始时间<='),
        min: 'planStartTimeFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'planEndTimeFrom',
        type: 'dateTime',
        label: intl.get(`${preCode}.planEndTimeFrom`).d('计划结束时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planEndTimeTo')) {
              return 'planEndTimeTo';
            }
          },
        },
      },
      {
        name: 'planEndTimeTo',
        type: 'dateTime',
        label: intl.get(`${preCode}.planEndTimeTo`).d('计划结束时间<='),
        min: 'planEndTimeFrom',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
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
        name: 'workcellName',
        bind: 'workcellObj.workcellName',
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
        name: 'equipmentName',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.worker`).d('员工'),
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'supervisorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.supervisor`).d('管理员工'),
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'supervisorId',
        bind: 'supervisorObj.workerId',
      },
      {
        name: 'supervisorName',
        bind: 'supervisorObj.workerName',
        ignore: 'always',
      },
      {
        name: 'taskObj',
        type: 'object',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'TASK' },
        noCache: true,
      },
      {
        name: 'taskId',
        bind: 'taskObj.documentId',
      },
      {
        name: 'taskNum',
        bind: 'taskObj.documentNum',
      },
    ],
    fields: [
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonCode}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      },
      {
        name: 'organizationName',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
      },
      {
        name: 'taskNum',
        label: intl.get(`${commonCode}.taskNum`).d('任务号'),
      },
      {
        name: 'productCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'productDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'operationName',
        label: intl.get(`${commonCode}.operation`).d('工序'),
      },
      {
        name: 'taskStatusMeaning',
        label: intl.get(`${commonCode}.taskStatus`).d('任务状态'),
      },
      {
        name: 'completedPercent',
        label: intl.get(`${preCode}.completedPercent`).d('完工进度'),
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'taskQty',
        label: intl.get(`${preCode}.taskQty`).d('任务数量'),
      },
      {
        name: 'executableQty',
        label: intl.get(`${preCode}.executableQty`).d('可执行数量'),
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
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
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
        name: 'standardWorkTime',
        label: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      },
      {
        name: 'processedTime',
        label: intl.get(`${preCode}.processedTime`).d('实际工时'),
      },
      {
        name: 'efficiency',
        label: intl.get(`${preCode}.efficiency`).d('工时效率'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
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
        label: intl.get(`${commonCode}.prodline`).d('生产线'),
      },
      {
        name: 'workcellName',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
      },
      {
        name: 'equipmentName',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
      },
      {
        name: 'locationName',
        label: intl.get(`${preCode}.location`).d('位置'),
      },
      {
        name: 'workerName',
        label: intl.get(`${preCode}.worker`).d('员工'),
      },
    ],
  };
};

export { ListDS };
