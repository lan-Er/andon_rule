import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { DEFAULT_TIME_FORMAT } from 'utils/constants';
import moment from 'moment';

const { common, senyuTagPrint } = codeConfig.code;
const preCode = 'lwms.tag.model';
const commonCode = 'lwms.common.model';
// const url = `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/sen-yu/item-print/print`;
const printedFlagData = [
  { text: '是', value: true },
  { text: '否', value: false },
];
const printedFlagDs = new DataSet({
  data: printedFlagData,
  selection: 'single',
});
const HeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagType',
      type: 'string',
      lookupCode: 'LWMS.TAG_PRIMARY_TYPE',
      label: '标签大类',
      defaultValue: 'SY_ITEM_TAG', // TEMPLATE_TAG
      ignore: 'always',
    },
    {
      label: '纱批',
      name: 'printYarnBatchObj',
      type: 'object',
      ignore: 'always',
      multiple: true,
      lovCode: common.sypLot,
    },
    {
      name: 'printYarnBatch',
      type: 'string',
      bind: 'printYarnBatchObj.lotNumber',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'printYarnBatchObj.description',
      ignore: 'always',
    },
    {
      name: 'printClothBatch',
      type: 'string',
      label: '布批',
    },
    {
      name: 'printMachineNum',
      type: 'string',
      label: '机台号',
    },
    {
      name: 'printQty',
      type: 'number',
      label: '打印数量',
    },
  ],
  transport: {},
});
const SyTagDS = () => {
  return {
    pageSize: 100,
    queryFields: [
      {
        label: intl.get(`${commonCode}.org`).d('组织'),
        name: 'organizationObj',
        type: 'object',
        ignore: 'always',
        required: true,
        lovCode: common.organization,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        label: intl.get(`${commonCode}.tag`).d('标签'),
        name: 'tagCode',
        type: 'string',
      },
      {
        label: intl.get(`${commonCode}.item`).d('物料'),
        name: 'item',
        type: 'object',
        ignore: 'always',
        lovCode: common.item,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'item.itemId',
      },
      {
        label: 'MO号',
        name: 'moObj',
        type: 'object',
        ignore: 'always',
        lovCode: senyuTagPrint.linkDocument,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'moId',
        bind: 'moObj.moId',
      },
      {
        name: 'moNumber',
        bind: 'moObj.moNum',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: 'MO状态',
        lookupCode: 'LMES.MO_STATUS',
        multiple: true,
        defaultValue: ['NEW', 'RELEASED'],
      },
      {
        label: '创建人',
        name: 'createdByName',
        type: 'string',
      },
      {
        label: '打印标识',
        name: 'printedFlag',
        type: 'number',
        textField: 'text',
        valueField: 'value',
        options: printedFlagDs,
      },
      {
        name: 'madeDateLeft',
        type: 'date',
        label: '生产日期>=',
        max: 'madeDateRight',
      },
      {
        name: 'madeDateRight',
        type: 'date',
        label: '生产日期<=',
        min: 'madeDateLeft',
      },
      {
        name: 'printedDateFrom',
        type: 'date',
        label: '打印日期>=',
        max: 'printedDateTo',
      },
      {
        name: 'printedDateTo',
        type: 'date',
        label: '打印日期<=',
        min: 'printedDateFrom',
      },
    ],
    fields: [
      {
        name: 'tagCode',
        label: intl.get(`${commonCode}.tagCode`).d('标签号'),
        type: 'string',
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        type: 'string',
      },
      {
        name: 'moStatusMeaning',
        label: intl.get(`${commonCode}.moStatusMeaning`).d('MO状态'),
        type: 'string',
      },
      {
        name: 'organizationName',
        label: intl.get(`${commonCode}.organizationName`).d('组织'),
        type: 'string',
      },
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.itemCode`).d('物料'),
        type: 'string',
      },
      {
        name: 'itemDesc',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        type: 'string',
      },
      {
        name: 'customerName',
        label: intl.get(`${preCode}.customerName`).d('客户'),
        type: 'string',
      },
      {
        name: 'supplierName',
        label: intl.get(`${preCode}.supplierName`).d('供应商'),
        type: 'string',
      },
      {
        name: 'makeQty',
        label: intl.get(`${preCode}.makeQty`).d('数量'),
        type: 'string',
      },
      {
        name: 'featureDesc',
        label: intl.get(`${preCode}.featureDesc`).d('颜色'),
        type: 'string',
      },
      {
        name: 'designCode',
        label: intl.get(`${preCode}.designCode`).d('门幅'),
        type: 'string',
      },
      {
        name: 'specification',
        label: intl.get(`${preCode}.specification`).d('规格'),
        type: 'string',
      },
      {
        name: 'machineNum',
        label: intl.get(`${preCode}.machineNum`).d('机台号'),
        type: 'string',
      },
      {
        name: 'uomDesc',
        label: intl.get(`${commonCode}.uomDesc`).d('单位'),
        type: 'string',
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.remark`).d('工艺'),
        type: 'string',
      },
      {
        name: 'location',
        label: intl.get(`${preCode}.location`).d('位置'),
        type: 'string',
      },
      {
        name: 'madeDate',
        label: intl.get(`${preCode}.madeDate`).d('生产日期'),
        type: 'string',
      },
      {
        name: 'printedFlag',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
        type: 'string',
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印日期'),
        type: 'date',
        transformResponse: (val) => moment(val, DEFAULT_TIME_FORMAT),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}.createDate`).d('创建时间'),
        type: 'date',
        transformResponse: (val) => moment(val, DEFAULT_TIME_FORMAT),
      },
      {
        name: 'createdBy',
        type: 'string',
        label: intl.get(`${preCode}.createdBy`).d('创建人'),
      },
      {
        name: 'contractNum',
        label: intl.get(`${preCode}.contractNum`).d('合约号'),
        type: 'string',
      },
      {
        name: 'modelNum',
        label: intl.get(`${preCode}.modelNum`).d('款号'),
        type: 'string',
      },
      {
        name: 'planNum',
        label: intl.get(`${preCode}.planNum`).d('计划单号'),
        type: 'string',
      },
    ],
    transport: {
      read: ({ data }) => {
        const { moStatus: moStatusList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/sen-yu/item-print/print`,
            {
              moStatusList,
            }
          ),
          data: { ...data, moStatus: undefined },
          method: 'GET',
        };
      },
    },
  };
};

export { HeadDS, SyTagDS };
