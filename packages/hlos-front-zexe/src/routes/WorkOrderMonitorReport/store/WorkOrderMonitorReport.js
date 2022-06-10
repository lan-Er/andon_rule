import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, zexeProductOrderIOReport } = codeConfig.code;
const commonCode = 'zexe.common.model';
const preCode = 'zexe.workOrderMonitorReport.model';

const ListDS = () => ({
  queryFields: [
    {
      name: 'supplierObj',
      label: intl.get(`${commonCode}.supplier`).d('供应商'),
      type: 'object',
      lovCode: common.supplier,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'organizationObj',
      label: intl.get(`${preCode}.organization`).d('组织'),
      type: 'object',
      lovCode: zexeProductOrderIOReport.organization,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'moNumObj',
      label: intl.get(`${commonCode}.moNum`).d('MO号'),
      type: 'object',
      lovCode: common.moNum,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'moTypeObj',
      label: intl.get(`${preCode}.moType`).d('MO类型'),
      type: 'object',
      lovCode: zexeProductOrderIOReport.moType,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'itemNumObj',
      label: intl.get(`${preCode}.moType`).d('物料编码'),
      type: 'object',
      lovCode: '',
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'moStatus',
      label: intl.get(`${preCode}.moStatus`).d('MO状态'),
      type: 'object',
      lovCode: '',
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'demandDateStart',
      label: intl.get(`${preCode}.moStatus`).d('需求日期从'),
      type: 'date',
    },
    {
      name: 'demandDateEnd',
      label: intl.get(`${preCode}.moStatus`).d('需求日期至'),
      type: 'date',
    },
    {
      name: 'releasedDateStart',
      label: intl.get(`${preCode}.moStatus`).d('下达日期从'),
      type: 'date',
    },
    {
      name: 'releasedDateEnd',
      label: intl.get(`${preCode}.moStatus`).d('下达日期至'),
      type: 'date',
    },
  ],
});

export { ListDS };
