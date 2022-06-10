/**
 * @Description: 齐套配置--listDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-11 10:13:09
 * @LastEditors: yu.na
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemKittingSet.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-sets`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-set-lines`;
const detailLineUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-set-supplys`;

export default () => ({
  selection: false,
  primaryKey: 'kittingSetId',
  children: {
    lineDTOList: new DataSet(LineDS()),
  },
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organization`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
      noCache: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationId',
      ignore: 'always',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.organization`).d('组织'),
    },
    {
      name: 'kittingReviewTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.kittingReviewType`).d('检查类型'),
      // lookupCode: lmdsItemKittingSet.reviewType,
    },
    {
      name: 'kittingSetCode',
      type: 'string',
      label: intl.get(`${preCode}.kittingSetCode`).d('检查集'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.description`).d('检查描述'),
    },
    {
      name: 'kittingReviewRuleMeaning',
      type: 'string',
      label: intl.get(`${preCode}.kittingReviewRule`).d('齐套规则'),
      // lookupCode: lmdsItemKittingSet.reviewRule,
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
      transformResponse: (val, object) =>
        `${val || ''} ${object.itemDescription ? `-${object.itemDescription}` : ''}`,
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料类别'),
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${preCode}.party`).d('商业伙伴'),
    },
    {
      name: 'ruleName',
      type: 'string',
      label: intl.get(`${preCode}.adviseRule`).d('齐套建议'),
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('首选标识'),
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
    },
  ],
  transport: {
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
  },
});

const LineDS = () => ({
  primaryKey: 'kittingSetLineId',
  selection: false,
  pageSize: 100,
  transport: {
    read: () => {
      return {
        url: lineUrl,
        method: 'GET',
      };
    },
  },
  children: {
    detailDTOList: new DataSet(DetailLineDS()),
  },
  fields: [
    {
      name: 'setLineNum',
      type: 'string',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
    },
    {
      name: 'setLineTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.setLineType`).d('类型'),
      // lookupCode: lmdsItemKittingSet.lineType,
    },
    {
      name: 'reviewItemType',
      type: 'string',
      label: intl.get(`${preCode}.reviewItemType`).d('检查物料类型'),
    },
    {
      name: 'reviewItemCode',
      type: 'string',
      label: intl.get(`${preCode}.reviewItem`).d('检查物料'),
      transformResponse: (val, object) =>
        `${val || ''} ${object.reviewItemDescription ? `-${object.reviewItemDescription}` : ''}`,
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${preCode}.reviewCategory`).d('检查类别'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
    },
  ],
});

const DetailLineDS = () => ({
  selection: false,
  pageSize: 100,
  primaryKey: 'kittingSetSupplyId',
  transport: {
    read: () => {
      return {
        url: detailLineUrl,
        method: 'GET',
      };
    },
  },
  fields: [
    {
      name: 'supplyLineNum',
      type: 'string',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
    },
    {
      name: 'kittingSupplyTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
      // lookupCode: lmdsItemKittingSet.supplyType,
    },
    {
      name: 'kittingTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.kittingType`).d('齐套类型'),
      // lookupCode: lmdsItemKittingSet.kittingType,
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.organization`).d('组织'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.warehouse`).d('供应仓库'),
    },
    // {
    //   name: 'wmAreaName',
    //   type: 'string',
    //   label: intl.get(`${preCode}.wmArea`).d('供应货位'),
    // },
    {
      name: 'documentTypeName',
      type: 'string',
      label: intl.get(`${preCode}.documentType`).d('单据类型'),
    },
    {
      name: 'priority',
      type: 'string',
      label: intl.get(`${preCode}.priority`).d('优先级'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
    },
  ],
});
