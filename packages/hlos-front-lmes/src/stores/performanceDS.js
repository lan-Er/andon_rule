import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/tasks/getExecuteLineForReportWork`;

const { common } = codeConfig.code;

const commonCode = 'lmes.common.model';

export const PerformanceDS = () => ({
  queryFields: [
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${commonCode}.worker`).d('操作工'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'fileUrl',
      type: 'string',
      bind: 'workerObj.fileUrl',
      ignore: 'always',
    },
    {
      name: 'executeTime',
      type: 'date',
      required: true,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'itemObj',
      type: 'object',
      lovCode: common.itemMe,
      label: '物料',
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'moNum',
      type: 'string',
    },
    {
      name: 'taskNum',
      type: 'string',
    },
  ],
  fields: [
    {
      name: 'executeTime',
      type: 'string',
      label: '执行时间',
    },
    {
      name: 'itemCode',
      type: 'string',
    },
    {
      name: 'itemDescription',
      type: 'string',
    },
    {
      name: 'itemCode&itemDescription',
      type: 'string',
      label: '物料',
    },
    {
      name: 'operationName',
      type: 'string',
      label: '工序',
    },
    {
      name: 'uomName',
      type: 'string',
      label: '单位',
    },
    {
      name: 'executeQty',
      type: 'string',
      label: '合格',
    },
    {
      name: 'executeNgQty',
      type: 'string',
      label: '不合格',
    },
    {
      name: 'scrappedQty',
      type: 'string',
      label: '报废',
    },
    {
      name: 'reworkQty',
      type: 'string',
      label: '返修',
    },
    {
      name: 'pendingQty',
      type: 'string',
      label: '待定',
    },
    {
      name: 'executeTypeMeaning',
      type: 'string',
      label: '执行类型',
    },
    {
      name: 'documentNumber',
      type: 'string',
      label: '单据号',
    },
    {
      name: 'moNum',
      type: 'string',
    },
    {
      name: 'taskNum',
      type: 'string',
    },
    {
      name: 'documentNumber',
      type: 'string',
      label: '单据号',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '标签',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'position',
      type: 'string',
      label: '生产地点',
    },
    {
      name: 'projectNum',
      type: 'string',
      label: '项目号',
    },
    {
      name: 'workcellName',
      type: 'string',
      label: '项目号',
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: '项目号',
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: '项目号',
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: 'WBS',
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url,
        method: 'POST',
        params,
      };
    },
  },
});
