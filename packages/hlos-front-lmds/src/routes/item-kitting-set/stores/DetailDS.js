/**
 * @Description: 齐套配置--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-11 10:13:09
 * @LastEditors: yu.na
 */
import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmdsItemKittingSet, lmdsItem } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemKittingSet.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-sets`;
const lineUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-set-lines`;
const detailLineUrl = `${HLOS_LMDS}/v1/${organizationId}/kitting-set-supplys`;

export default () => ({
  autoCreate: true,
  selection: false,
  primaryKey: 'kittingSetId',
  children: {
    lineDTOList: new DataSet(LineDS()),
  },
  fields: [
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
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationId',
      ignore: 'always',
    },
    {
      name: 'kittingReviewType',
      type: 'string',
      label: intl.get(`${preCode}.kittingReviewType`).d('检查类型'),
      lookupCode: lmdsItemKittingSet.reviewType,
      required: true,
    },
    {
      name: 'kittingSetCode',
      type: 'string',
      label: intl.get(`${preCode}.kittingSetCode`).d('检查集'),
      required: true,
    },
    {
      name: 'kittingReviewRule',
      type: 'string',
      label: intl.get(`${preCode}.kittingReviewRule`).d('齐套规则'),
      lookupCode: lmdsItemKittingSet.reviewRule,
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.description`).d('检查描述'),
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      ignore: 'always',
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM' },
      noCache: true,
    },
    {
      name: 'itemCategoryId',
      type: 'string',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'itemCategoryCode',
      type: 'string',
      bind: 'itemCategoryObj.categoryCode',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      ignore: 'always',
      lovCode: common.item,
      noCache: true,
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      bind: 'itemObj.description',
      ignore: 'always',
    },
    {
      name: 'kittingTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.kittingTimeFence`).d('齐套时间栏(天)'),
      min: 0,
      step: 1,
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'itemCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCode}.party`).d('商业伙伴'),
      ignore: 'always',
      lovCode: common.party,
      noCache: true,
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
      ignore: 'always',
    },
    {
      name: 'adviseRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.adviseRule`).d('齐套建议'),
      ignore: 'always',
      lovCode: common.rule,
      lovPara: { ruleType: 'KITTING' },
      noCache: true,
    },
    {
      name: 'adviseRuleId',
      type: 'string',
      bind: 'adviseRuleObj.ruleId',
    },
    {
      name: 'adviseRule',
      type: 'string',
      bind: 'adviseRuleObj.ruleJson',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'adviseRuleObj.ruleName',
      ignore: 'always',
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('首选标识'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});

const LineDS = () => ({
  primaryKey: 'kittingSetLineId',
  pageSize: 100,
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
      name: 'setLineType',
      type: 'string',
      label: intl.get(`${preCode}.setLineType`).d('类型'),
      lookupCode: lmdsItemKittingSet.lineType,
      required: true,
    },
    {
      name: 'reviewItemType',
      type: 'string',
      label: intl.get(`${preCode}.reviewType`).d('检查物料类型'),
      lookupCode: lmdsItem.itemType,
      dynamicProps: {
        required: ({ record }) => record.get('setLineType') === 'ITEM_TYPE',
        disabled: ({ record }) => record.get('setLineType') !== 'ITEM_TYPE',
      },
    },
    {
      name: 'reviewItemObj',
      type: 'object',
      label: intl.get(`${preCode}.reviewItem`).d('检查物料'),
      ignore: 'always',
      lovCode: common.item,
      noCache: true,
      dynamicProps: {
        required: ({ record }) => record.get('setLineType') === 'ITEM_ITEM',
        disabled: ({ record }) => record.get('setLineType') !== 'ITEM_ITEM',
      },
    },
    {
      name: 'reviewItemCode',
      type: 'string',
      bind: 'reviewItemObj.itemCode',
    },
    {
      name: 'reviewItemDescription',
      type: 'string',
      bind: 'reviewItemObj.description',
      ignore: 'always',
    },
    {
      name: 'reviewCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.reviewCategory`).d('检查类别'),
      ignore: 'always',
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM' },
      noCache: true,
      dynamicProps: {
        required: ({ record }) => record.get('setLineType') === 'ITEM_CATEGORY',
        disabled: ({ record }) => record.get('setLineType') !== 'ITEM_CATEGORY',
      },
    },
    {
      name: 'reviewCategoryId',
      type: 'string',
      bind: 'reviewCategoryObj.categoryId',
    },
    {
      name: 'reviewCategoryCode',
      type: 'string',
      bind: 'reviewCategoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'reviewCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
});

const DetailLineDS = () => ({
  primaryKey: 'kittingSetSupplyId',
  pageSize: 100,
  transport: {
    read: () => {
      return {
        url: detailLineUrl,
        method: 'GET',
      };
    },
    destroy: () => {
      return {
        url: detailLineUrl,
        method: 'DELETE',
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
      name: 'kittingSupplyType',
      type: 'string',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
      lookupCode: lmdsItemKittingSet.supplyType,
      required: true,
    },
    // {
    //   name: 'kittingType',
    //   type: 'string',
    //   label: intl.get(`${preCode}.kittingType`).d('齐套类型'),
    //   lookupCode: lmdsItemKittingSet.kittingType,
    //   required: true,
    // },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.organization`).d('供应组织'),
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
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${preCode}.warehouse`).d('供应仓库'),
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
        required: ({ record }) => {
          if (record.get('kittingSupplyType') === 'STOCK') {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    // {
    //   name: 'wmAreaObj',
    //   type: 'object',
    //   label: intl.get(`${preCode}.wmArea`).d('供应货位'),
    //   lovCode: common.wmArea,
    //   ignore: 'always',
    //   noCache: true,
    //   cascadeMap: { warehouseId: 'warehouseId' },
    // },
    // {
    //   name: 'wmAreaId',
    //   type: 'string',
    //   bind: 'wmAreaObj.wmAreaId',
    // },
    // {
    //   name: 'wmAreaCode',
    //   type: 'string',
    //   bind: 'wmAreaObj.wmAreaCode',
    // },
    // {
    //   name: 'wmAreaName',
    //   type: 'string',
    //   bind: 'wmAreaObj.wmAreaName',
    // },
    {
      name: 'documentTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.documentType`).d('单据类型'),
      lovCode: common.documentType,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'documentTypeId',
      type: 'string',
      bind: 'documentTypeObj.documentTypeId',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      bind: 'documentTypeObj.documentTypeCode',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'documentTypeObj.documentTypeName',
    },
    {
      name: 'priority',
      type: 'number',
      label: intl.get(`${preCode}.priority`).d('优先级'),
      min: 1,
      step: 1,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('warehouseObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});
