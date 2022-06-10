import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, zexeProductOrderIOReport } = codeConfig.code;
const commonCode = 'zexe.common.model';
const preCode = 'zexe.deliveryReport.model';

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
      name: 'deliveryNumObj',
      label: intl.get(`${preCode}.deliveryNum`).d('送货单号'),
      type: 'object',
      lovCode: '',
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
      name: 'createTimeStart',
      lable: intl.get(`${preCode}.createTimeStart`).d('创建日期从'),
      type: 'date',
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('maxDemandDate')) {
            return 'maxDemandDate';
          }
        },
      },
    },
    {
      name: 'createTimeEnd',
      lable: intl.get(`${preCode}.deliveryNum`).d('创建日期至'),
      type: 'date',
      min: 'createTimeStart',
    },
  ],
});

export { ListDS };
