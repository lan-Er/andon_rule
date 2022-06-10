/**
 * @Description: 制造协同-核企物料主数据查询DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-03 11:13:38
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.item.model';
const commonCode = 'zmda.common.model';
const { zmdaItem, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/item-views/queryItem`;

export default () => ({
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('公司代码'),
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.meOuName',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      unique: true,
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
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('主单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'uomId',
      type: 'string',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'uomObj.uomName',
    },
    {
      name: 'secondUomObj',
      type: 'object',
      label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'secondUomObj.uomCode',
    },
    {
      name: 'secondUomId',
      type: 'string',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUomName',
      type: 'string',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'uomConversionValue',
      type: 'number',
      label: intl.get(`${preCode}.uomConversionValue`).d('主辅单位换算'),
    },
    {
      name: 'length',
      type: 'number',
      label: intl.get(`${preCode}.length`).d('长'),
    },
    {
      name: 'width',
      type: 'number',
      label: intl.get(`${preCode}.width`).d('宽'),
    },
    {
      name: 'height',
      type: 'number',
      label: intl.get(`${preCode}.height`).d('高'),
    },
    {
      name: 'area',
      type: 'number',
      label: intl.get(`${preCode}.area`).d('面积'),
    },
    {
      name: 'volume',
      type: 'number',
      label: intl.get(`${preCode}.volume`).d('体积'),
    },
    {
      name: 'unitWeight',
      type: 'number',
      label: intl.get(`${preCode}.unitWeight`).d('单重'),
    },
    {
      name: 'grossWeight',
      type: 'number',
      label: intl.get(`${preCode}.grossWeight`).d('毛重'),
    },
    {
      name: 'itemIdentifyCode',
      type: 'string',
      label: intl.get(`${preCode}.itemIdentifyCode`).d('物料识别码'),
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: intl.get(`${preCode}.drawingCode`).d('产品图纸编号'),
    },
    {
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.featureCode`).d('特征值编码'),
    },
    {
      name: 'featureDesc',
      type: 'string',
      label: intl.get(`${preCode}.featureDesc`).d('特征描述'),
    },
    {
      name: 'packingGroup',
      type: 'string',
      label: intl.get(`${preCode}.packingGroup`).d('装箱组'),
    },
    {
      name: 'hazardClass',
      type: 'string',
      label: intl.get(`${preCode}.hazardClass`).d('危险品标识'),
      lookupCode: zmdaItem.hazardClass,
    },
    {
      name: 'unNumber',
      type: 'string',
      label: intl.get(`${preCode}.unNumber`).d('UN号'),
    },
    {
      name: 'standardCost',
      type: 'number',
      label: intl.get(`${preCode}.standardCost`).d('标准成本'),
    },
    {
      name: 'standardSalesPrice',
      type: 'number',
      label: intl.get(`${preCode}.standardSalesPrice`).d('标准售价'),
    },
    {
      name: 'externalItemCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.externalItemCode`).d('对应外部物料编码'),
      textField: 'itemCode',
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'externalItemCode',
      type: 'string',
      bind: 'externalItemCodeObj.itemCode',
    },
    {
      name: 'externalDescription',
      type: 'string',
      label: intl.get(`${preCode}.externalItemDescription`).d('对应外部物料描述'),
      bind: 'externalItemCodeObj.itemDescription',
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.file`).d('文件'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
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
  },
});
