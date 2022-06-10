/**
 * @Description: 物料详情页面--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-02 09:42:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  positiveNumberValidator,
  //  descValidator
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ApsListDS from './ApsListDS';
import MeListDS from './MeListDS';
import ScmListDS from './ScmListDS';
import SopListDS from './SopListDS';
import WmListDS from './WmListDS';
import statusConfig from '@/common/statusConfig';

const { lmdsItem, common } = codeConfig.code;
const {
  lovPara: { item },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.item.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/items`;

export default () => ({
  primaryKey: 'itemId',
  children: {
    itemAps: new DataSet({ ...ApsListDS() }),
    itemMe: new DataSet({ ...MeListDS() }),
    itemScm: new DataSet({ ...ScmListDS() }),
    itemSop: new DataSet({ ...SopListDS() }),
    itemWm: new DataSet({ ...WmListDS() }),
  },
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      // validator: descValidator,
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
      lookupCode: lmdsItem.itemType,
    },
    {
      name: 'mdsCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.mdsCategory`).d('物料类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: item },
      ignore: 'always',
    },
    {
      name: 'mdsCategoryId',
      type: 'string',
      bind: 'mdsCategoryObj.categoryId',
    },
    {
      name: 'mdsCategoryCode',
      type: 'string',
      bind: 'mdsCategoryObj.categoryCode',
    },
    {
      name: 'mdsCategoryName',
      type: 'string',
      bind: 'mdsCategoryObj.categoryName',
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
      required: true,
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
      name: 'secondUomId',
      type: 'string',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUom',
      type: 'string',
      bind: 'secondUomObj.uomCode',
    },
    {
      name: 'secondUomName',
      type: 'string',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'uomConversionValue',
      type: 'number',
      validator: positiveNumberValidator,
      label: intl.get(`${preCode}.uomConversionValue`).d('主辅单位换算'),
    },
    {
      name: 'length',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.length`).d('长'),
    },
    {
      name: 'width',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.width`).d('宽'),
    },
    {
      name: 'height',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.height`).d('高'),
    },
    {
      name: 'uolObj',
      type: 'object',
      label: intl.get(`${preCode}.uol`).d('长度单位'),
      lovCode: common.uom,
      ignore: 'always',
      textField: 'uomCode',
    },
    {
      name: 'uolId',
      type: 'string',
      bind: 'uolObj.uomId',
    },
    {
      name: 'uolCode',
      type: 'string',
      bind: 'uolObj.uomCode',
    },
    {
      name: 'uolName',
      type: 'string',
      bind: 'uolObj.uomName',
    },
    {
      name: 'area',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.area`).d('面积'),
    },
    {
      name: 'uoaObj',
      type: 'object',
      label: intl.get(`${preCode}.uoa`).d('面积单位'),
      lovCode: common.uom,
      ignore: 'always',
      textField: 'uomCode',
    },
    {
      name: 'uoaId',
      type: 'string',
      bind: 'uoaObj.uomId',
    },
    {
      name: 'uoaCode',
      type: 'string',
      bind: 'uoaObj.uomCode',
    },
    {
      name: 'uoaName',
      type: 'string',
      bind: 'uoaObj.uomName',
    },
    {
      name: 'volume',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.volume`).d('体积'),
    },
    {
      name: 'uovObj',
      type: 'object',
      label: intl.get(`${preCode}.uov`).d('体积单位'),
      lovCode: common.uom,
      ignore: 'always',
      textField: 'uomCode',
    },
    {
      name: 'uovId',
      type: 'string',
      bind: 'uovObj.uomId',
    },
    {
      name: 'uovCode',
      type: 'string',
      bind: 'uovObj.uomCode',
    },
    {
      name: 'uovName',
      type: 'string',
      bind: 'uovObj.uomName',
    },
    {
      name: 'unitWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.unitWeight`).d('单重'),
    },
    {
      name: 'grossWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.grossWeight`).d('毛重'),
    },
    {
      name: 'uowObj',
      type: 'object',
      label: intl.get(`${preCode}.uow`).d('重量单位'),
      lovCode: common.uom,
      ignore: 'always',
      textField: 'uomCode',
    },
    {
      name: 'uowId',
      type: 'string',
      bind: 'uowObj.uomId',
    },
    {
      name: 'uowCode',
      type: 'string',
      bind: 'uowObj.uomCode',
    },
    {
      name: 'uowName',
      type: 'string',
      bind: 'uowObj.uomName',
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
      lookupCode: lmdsItem.hazardClass,
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
      validator: positiveNumberValidator,
    },
    {
      name: 'standardSalesPrice',
      type: 'number',
      label: intl.get(`${preCode}.standardSalesPrice`).d('标准售价'),
      validator: positiveNumberValidator,
    },
    {
      name: 'externalItemCodeObj',
      type: 'object',
      label: intl.get(`${preCode}.externalItemCode`).d('对应外部物料编码'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'externalItemCode',
      type: 'string',
      bind: 'externalItemCodeObj.itemCode',
    },
    {
      name: 'externalItemId',
      type: 'string',
      bind: 'externalItemCodeObj.itemId',
    },
    {
      name: 'externalDescription',
      type: 'string',
      label: intl.get(`${preCode}.externalItemDescription`).d('对应外部物料描述'),
      bind: 'externalItemCodeObj.description',
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
      required: true,
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
    submit: ({ data, params }) => {
      return {
        url,
        data: {
          ...data[0],
          itemAps: data[0].itemAps[0],
          itemMe: data[0].itemMe[0],
          itemScm: data[0].itemScm[0],
          itemSop: data[0].itemSop[0],
          itemWm: data[0].itemWm[0],
        },
        params,
        method: 'POST',
      };
    },
  },
});
