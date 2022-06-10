/**
 * @Description: SMD清单-ListDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-07 16:53:29
 * @LastEditors: yu.na
 */
import moment from 'moment';
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsSmd, common } = codeConfig.code;
const {
  lovPara: { equipment, feeder, trolley },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.smd.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/smt-smd-headers`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/smt-smd-lines`;

const commonFields = [
  {
    name: 'organizationObj',
    type: 'object',
    label: intl.get(`${commonCode}.org`).d('组织'),
    lovCode: common.meOu,
    ignore: 'always',
    noCache: true,
    required: true,
  },
  {
    name: 'organizationId',
    bind: 'organizationObj.meOuId',
  },
  {
    name: 'organizationCode',
    bind: 'organizationObj.meOuCode',
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
    required: true,
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
    name: 'itemDescription',
    label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    bind: 'itemObj.itemDescription',
  },
  {
    name: 'categoryObj',
    type: 'object',
    label: intl.get(`${preCode}.mounterCategory`).d('贴片设备'),
    lovCode: common.categories,
    lovPara: { categorySetCode: equipment },
    ignore: 'always',
    noCache: true,
    required: true,
  },
  {
    name: 'mounterCategoryId',
    bind: 'categoryObj.categoryId',
  },
  {
    name: 'mounterCategoryCode',
    bind: 'categoryObj.categoryCode',
  },
  {
    name: 'mounterCategoryName',
    bind: 'categoryObj.categoryName',
    ignore: 'always',
  },
  {
    name: 'pcbMountSide',
    type: 'string',
    label: intl.get(`${preCode}.mountSite`).d('贴片面'),
    lookupCode: lmdsSmd.mountSide,
    required: true,
  },
  {
    name: 'pcbProductQty',
    type: 'number',
    label: intl.get(`${preCode}.productQty`).d('单板产出'),
    min: 1,
    step: 1,
    defaultValue: 1,
    required: true,
  },
  {
    name: 'deviceSumQty',
    type: 'number',
    label: intl.get(`${preCode}.sumQty`).d('贴片总数'),
    min: 1,
    step: 1,
  },
  {
    name: 'mountMethod',
    type: 'string',
    label: intl.get(`${preCode}.mountMethod`).d('贴片方式'),
    lookupCode: lmdsSmd.mountMethod,
    required: true,
  },
  {
    name: 'mounterPosition',
    type: 'string',
    label: intl.get(`${preCode}.mounterPosition`).d('设备方位'),
    lookupCode: lmdsSmd.mounterPosition,
  },
  {
    name: 'prepareMethod',
    type: 'string',
    label: intl.get(`${preCode}.prepareMethod`).d('备料方式'),
    lookupCode: lmdsSmd.prepareMethod,
  },
  {
    name: 'primaryFlag',
    type: 'boolean',
    label: intl.get(`${preCode}.primaryFlag`).d('默认标识'),
    defaultValue: true,
  },
  {
    name: 'prodLineObj',
    type: 'object',
    label: intl.get(`${preCode}.prodLine`).d('生产线'),
    lovCode: common.prodLine,
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'prodLineId',
    bind: 'prodLineObj.prodLineId',
  },
  {
    name: 'prodLineCode',
    bind: 'prodLineObj.prodLineCode',
  },
  {
    name: 'prodLineName',
    bind: 'prodLineObj.resourceName',
    ignore: 'always',
  },
  {
    name: 'productObj',
    type: 'object',
    label: intl.get(`${preCode}.product`).d('产品'),
    lovCode: common.item,
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'productId',
    bind: 'productObj.itemId',
  },
  {
    name: 'productCode',
    bind: 'productObj.itemCode',
  },
  {
    name: 'productDescription',
    bind: 'productObj.description',
  },
  {
    name: 'partyObj',
    type: 'object',
    label: intl.get(`${preCode}.customer`).d('客户'),
    lovCode: common.party,
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'partyId',
    bind: 'partyObj.partyId',
  },
  {
    name: 'partyCode',
    bind: 'partyObj.partyCode',
  },
  {
    name: 'partyName',
    bind: 'partyObj.partyName',
    ignore: 'always',
  },
  {
    name: 'ruleObj',
    type: 'object',
    label: intl.get(`${preCode}.errorProofingRule`).d('防错规则'),
    lovCode: common.rule,
    ignore: 'always',
    noCache: true,
    textField: 'ruleJson',
    lovPara: {
      ruleType: 'ERROR_PROOFING',
    },
  },
  {
    name: 'errorProofingRuleId',
    bind: 'ruleObj.ruleId',
  },
  {
    name: 'errorProofingRule',
    bind: 'ruleObj.ruleJson',
  },
  {
    name: 'errorProofingRuleName',
    bind: 'ruleObj.ruleName',
    ignore: 'always',
  },
  {
    name: 'smdVersion',
    type: 'string',
    label: intl.get(`${preCode}.version`).d('版本'),
  },
  {
    name: 'smtProgram',
    type: 'string',
    label: intl.get(`${preCode}.program`).d('程序名'),
  },
  {
    name: 'designer',
    type: 'string',
    label: intl.get(`${preCode}.designer`).d('编制者'),
  },
  {
    name: 'designedDate',
    type: 'date',
    label: intl.get(`${preCode}.designedDate`).d('编制日期'),
  },
  {
    name: 'reviser',
    type: 'string',
    label: intl.get(`${preCode}.reviser`).d('修订者'),
  },
  {
    name: 'revisedDate',
    type: 'date',
    label: intl.get(`${preCode}.revisedDate`).d('修订日期'),
  },
  {
    name: 'auditor',
    type: 'string',
    label: intl.get(`${preCode}.auditor`).d('审核者'),
  },
  {
    name: 'auditedDate',
    type: 'date',
    label: intl.get(`${preCode}.auditedDate`).d('审核日期'),
  },
  {
    name: 'referenceDocument',
    type: 'string',
    label: intl.get(`${preCode}.referenceDoc`).d('参考文件'),
  },
  {
    name: 'remark',
    type: 'string',
    label: intl.get(`${preCode}.remark`).d('备注'),
  },
  {
    name: 'externalId',
    type: 'number',
    label: intl.get(`${commonCode}.externalId`).d('外部ID'),
  },
  {
    name: 'externalNum',
    type: 'string',
    label: intl.get(`${preCode}.externalNum`).d('外部编号'),
  },
  {
    name: 'startDate',
    type: 'date',
    label: intl.get(`${commonCode}.startDate`).d('开始日期'),
    defaultValue: moment().format(DEFAULT_DATE_FORMAT),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    required: true,
  },
  {
    name: 'endDate',
    type: 'date',
    label: intl.get(`${commonCode}.endDate`).d('结束日期'),
    min: 'startDate',
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
  },
  {
    name: 'enabledFlag',
    type: 'boolean',
    label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
    defaultValue: true,
  },
];

const ListDS = () => ({
  autoQuery: true,
  selection: false,
  primaryKey: 'smdHeaderId',
  children: {
    lineList: new DataSet(ItemDS()),
  },
  queryFields: [
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
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
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.mounterCategory`).d('贴片设备'),
      lovCode: common.categories,
      lovPara: { categorySetCode: equipment },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'mounterCategoryId',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'mounterCategoryName',
      bind: 'categoryObj.categoryName',
      ignore: 'always',
    },
  ],
  fields: commonFields,
  transport: {
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
  },
});

const ItemDS = (flag) => ({
  selection: flag ? 'multiple' : false,
  primaryKey: 'smdLineId',
  pageSize: 100,
  queryFields: [
    {
      name: 'deviceItemObj',
      type: 'object',
      label: intl.get(`${preCode}.deviceItem`).d('贴片元件'),
      lovCode: common.itemMe,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'deviceItemId',
      bind: 'deviceItemObj.itemId',
    },
    {
      name: 'deviceItemCode',
      bind: 'deviceItemObj.itemCode',
    },
    {
      name: 'loadSeat',
      type: 'string',
      label: intl.get(`${preCode}.loadSeat`).d('给料站位'),
    },
  ],
  fields: [
    {
      name: 'smdLineNum',
      type: 'number',
      label: intl.get(`${commonCode}.lineNum`).d('行号'),
      disabled: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      noCache: true,
      required: true,
      disabled: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'deviceItemObj',
      type: 'object',
      label: intl.get(`${preCode}.deviceItem`).d('贴片元件'),
      lovCode: common.itemMe,
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
      name: 'deviceItemId',
      bind: 'deviceItemObj.itemId',
    },
    {
      name: 'deviceItemCode',
      bind: 'deviceItemObj.itemCode',
    },
    {
      name: 'deviceItemDescription',
      label: intl.get(`${preCode}.deviceDesc`).d('元件描述'),
      bind: 'deviceItemObj.itemDescription',
      disabled: true,
    },
    {
      name: 'loadSeat',
      type: 'string',
      label: intl.get(`${preCode}.loadSeat`).d('给料站位'),
      required: true,
    },
    {
      name: 'deviceQty',
      type: 'number',
      label: intl.get(`${preCode}.deviceQty`).d('元件数量'),
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'pcbMountPosition',
      label: intl.get(`${preCode}.pcbMountPosition`).d('贴片点位'),
      type: 'string',
      required: true,
    },
    {
      name: 'deviceSubstituteGroup',
      type: 'string',
      label: intl.get(`${preCode}.deviceSubstituteGroup`).d('替代组'),
    },
    {
      name: 'deviceSubstituteFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.deviceSubstituteFlag`).d('替代标识'),
    },
    {
      name: 'mouterPosition',
      type: 'string',
      label: intl.get(`${preCode}.mounterPosition`).d('设备方位'),
      lookupCode: lmdsSmd.mounterPosition,
    },
    {
      name: 'mouterGroup',
      type: 'string',
      label: intl.get(`${preCode}.mounterGroup`).d('设备组'),
    },
    {
      name: 'trolleyCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.trolley`).d('料车'),
      lovCode: common.categories,
      lovPara: { categorySetCode: trolley },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'trolleyCategoryId',
      bind: 'trolleyCategoryObj.categoryId',
    },
    {
      name: 'trolleyCategoryCode',
      bind: 'trolleyCategoryObj.categoryCode',
    },
    {
      name: 'trolleyCategoryName',
      bind: 'trolleyCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'feederCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.feeder`).d('飞达'),
      lovCode: common.categories,
      lovPara: { categorySetCode: feeder },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'feederCategoryId',
      bind: 'feederCategoryObj.categoryId',
    },
    {
      name: 'feederCategoryCode',
      bind: 'feederCategoryObj.categoryCode',
    },
    {
      name: 'feederCategoryName',
      bind: 'feederCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'feederLayLength',
      type: 'string',
      label: intl.get(`${preCode}.feederLayLength`).d('飞达绞距'),
    },
    {
      name: 'warningQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.warningQty`).d('安全警告数量'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'externalLineId',
      type: 'number',
      label: intl.get(`${commonCode}.externalId`).d('外部ID'),
    },
    {
      name: 'externalLineNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部编号'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url: lineUrl,
        method: 'GET',
      };
    },
    destroy: () => {
      return {
        url: lineUrl,
        method: 'DELETE',
      };
    },
  },
});

const DetailDS = () => ({
  autoCreate: true,
  primaryKey: 'smdHeaderId',
  fields: commonFields,
  children: {
    lineList: new DataSet(ItemDS(true)),
  },
  transport: {
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${commonUrl}/mutations`,
        data: data[0],
        method: 'POST',
      };
    },
  },
});

export { ListDS, DetailDS };
