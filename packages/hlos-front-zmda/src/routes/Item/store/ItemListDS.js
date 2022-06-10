/**
 * @Description: 制造协同-物料主数据DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-29 11:23:55
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.item.model';
const commonCode = 'zmda.common.model';
const { zmdaItem } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/item-views`;

export default () => ({
  selection: 'multiple',
  pageSize: 10,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('公司名称'),
      lovCode: zmdaItem.enterprise,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.enterpriseId',
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.enterpriseName',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料编码'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${commonCode}.supplier`).d('供应商名称'),
      lovCode: zmdaItem.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
      ignore: 'always',
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
      bind: 'supplierObj.supplierName',
    },
    {
      name: 'mappingStatus',
      type: 'string',
      lookupCode: zmdaItem.mappingStatus,
      label: intl.get(`${preCode}.mappingStatus`).d('映射状态'),
    },
  ],
  fields: [
    {
      name: 'objectVersionNumber',
      type: 'string',
    },
    {
      name: '_token',
      type: 'string',
    },
    {
      name: 'itemMappingId',
      type: 'string',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('公司名称'),
    },
    {
      name: 'meOuName',
      type: 'string',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemAlias',
      type: 'intl',
      label: intl.get(`${preCode}.itemAlias`).d('物料别名'),
    },
    {
      name: 'shortCode',
      type: 'string',
      label: intl.get(`${preCode}.shortCode`).d('物料简码'),
    },
    {
      name: 'itemType',
      type: 'string',
      label: intl.get(`${preCode}.itemType`).d('物料类型'),
      lookupCode: zmdaItem.itemType,
    },
    {
      name: 'designCode',
      type: 'string',
      label: intl.get(`${preCode}.designCode`).d('产品图号'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.specification`).d('型号'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('主单位'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商名称'),
      lovCode: zmdaItem.supplier,
      ignore: 'always',
      required: true,
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
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplierObj.supplierName',
    },
    {
      name: 'supplierItemObj',
      type: 'object',
      label: intl.get(`${preCode}.supplierItem`).d('物料编码'),
      lovCode: zmdaItem.item,
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierItemId',
      type: 'string',
      bind: 'supplierItemObj.itemId',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      bind: 'supplierItemObj.itemCode',
    },
    {
      name: 'supplierItemDescription',
      type: 'string',
      label: intl.get(`${preCode}.supplierItemDescription`).d('物料名称'),
      bind: 'supplierItemObj.description',
    },
    {
      name: 'supplierItemUomId',
      type: 'string',
      bind: 'supplierItemObj.uomId',
    },
    {
      name: 'supplierItemUom',
      type: 'string',
      label: intl.get(`${preCode}.supplierItemUom`).d('单位'),
      bind: 'supplierItemObj.uomName',
    },
    {
      name: 'mappingStatus',
      type: 'string',
      label: intl.get(`${preCode}.mappingStatus`).d('映射状态'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    // submit: () => ({
    //   url: `${HLOS_ZMDA}/v1/${organizationId}/work-times/batch-update-remark`,
    //   method: 'POST',
    // }),
  },
  // events: {
  //   submitSuccess: ({ dataSet }) => {
  //     dataSet.query();
  //   },
  // },
});
