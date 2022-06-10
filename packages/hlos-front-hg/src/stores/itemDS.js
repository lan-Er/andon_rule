/**
 * @Description: 物料--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-02 09:42:33
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.item.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/items`;

const DetailDS = () => ({
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
      label: intl.get(`${preCode}.org`).d('组织'),
      lovCode: 'LMDS.ME_OU',
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
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      required: true,
      maxLength: 50,
    },
    {
      name: 'itemAlias',
      type: 'intl',
      label: intl.get(`${preCode}.itemAlias`).d('物料别名'),
      required: true,
    },
    {
      name: 'itemType',
      type: 'string',
      label: intl.get(`${preCode}.itemType`).d('物料类型'),
      lookupCode: 'HG.LMDS.ITEM_TYPE',
      required: true,
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${preCode}.uom`).d('主单位'),
      lovCode: 'LMDS.UOM',
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
      name: 'warehouseObj',
      type: 'object',
      // label: intl.get(`${preCode}.completeWarehouse`).d('默认完工仓库'),
      label: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
      lovCode: 'LMDS.WAREHOUSE',
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.specification`).d('型号'),
    },
    {
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.featureCode`).d('特征值'),
      maxLength: 50,
    },
    {
      name: 'featureDesc',
      type: 'string',
      label: intl.get(`${preCode}.featureDesc`).d('特征描述'),
      maxLength: 200,
    },
    {
      name: 'designCode',
      type: 'string',
      label: intl.get(`${preCode}.designCode`).d('产品图号'),
      maxLength: 50,
    },
    {
      name: 'length',
      type: 'number',
      min: 0,
      step: 0.01,
      label: intl.get(`${preCode}.length`).d('长'),
    },
    {
      name: 'width',
      type: 'number',
      min: 0,
      step: 0.01,
      label: intl.get(`${preCode}.width`).d('宽'),
    },
    {
      name: 'height',
      type: 'number',
      min: 0,
      step: 0.01,
      label: intl.get(`${preCode}.height`).d('高'),
    },
    {
      name: 'attributeBigint1',
      type: 'string',
      label: intl.get(`${preCode}.version`).d('版本号'),
      defaultValue: 1,
    },
    {
      name: 'attributeString1',
      type: 'string',
      label: intl.get(`${preCode}.versionDesc`).d('版本描述'),
      maxLength: 150,
    },
    {
      name: 'lastUpdatedName',
      type: 'string',
      label: intl.get(`${preCode}.lastUpdator`).d('最后更新人'),
    },

    {
      name: 'attributeTinyint1',
      type: 'boolean',
      label: intl.get(`${preCode}.receiveRule`).d('是否免检'),
      defaultValue: false,
    },
    {
      name: 'mtoFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.mtoFlag`).d('按单生产'),
      defaultValue: false,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
    {
      name: 'executeRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.executeRule`).d('执行规则'),
      lovCode: 'LMDS.RULE',
      ignore: 'always',
      // 限定规则类型为EXECUTE
      lovPara: {
        ruleType: 'EXECUTE',
      },
    },
    {
      name: 'executeRuleId',
      type: 'string',
      bind: 'executeRuleObj.ruleId',
    },
    {
      name: 'executeRuleName',
      type: 'string',
      bind: 'executeRuleObj.ruleName',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
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
        method: 'POST',
      };
    },
  },
});

const ListDS = () => ({
  pageSize: 10,
  selection: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemType',
      type: 'string',
      label: intl.get(`${preCode}.itemType`).d('物料类型'),
      lookupCode: 'HG.LMDS.ITEM_TYPE',
    },
    {
      name: 'featureCode',
      type: 'string',
      label: intl.get(`${preCode}.featureCode`).d('特征值'),
    },
    {
      name: 'attributeTinyint1',
      type: 'string',
      label: intl.get(`${preCode}.itemReceive`).d('是否免检'),
      lookupCode: 'LMDS.FLAG',
      transformRequest: (value) => {
        if (value === 'true') {
          return '1';
        } else if (value === 'false') {
          return '0';
        }
      },
    },
    {
      name: 'lastUpdatedByObj',
      type: 'object',
      label: intl.get(`${preCode}.lastUpdator`).d('最后更新人'),
      lovCode: 'HIAM.USER.ORG',
    },
    {
      name: 'lastUpdatedBy',
      bind: 'lastUpdatedByObj.id',
    },
    {
      name: 'lastUpdatedName',
      bind: 'lastUpdatedByObj.realName',
    },
  ],
  fields: [
    {
      name: 'itemCode',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemAlias',
      label: intl.get(`${preCode}.itemAlias`).d('物料别名'),
    },
    {
      name: 'description',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemType',
      type: 'string',
      label: intl.get(`${preCode}.itemType`).d('物料类型'),
      lookupCode: 'HG.LMDS.ITEM_TYPE',
    },
    {
      name: 'uomName',
      label: intl.get(`${preCode}.uom`).d('主单位'),
    },
    {
      name: 'specification',
      label: intl.get(`${preCode}.specification`).d('型号'),
    },
    {
      name: 'featureCode',
      label: intl.get(`${preCode}.featureCode`).d('特征值'),
    },
    {
      name: 'featureDesc',
      label: intl.get(`${preCode}.featureDesc`).d('特征描述'),
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
      name: 'attributeTinyint1',
      label: intl.get(`${preCode}.receiveRule`).d('是否免检'),
    },
    {
      name: 'lastUpdatedName',
      label: intl.get(`${preCode}.lastUpdateBy`).d('最后更新人'),
    },
    {
      name: 'meOuName',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
    },
    {
      name: 'attributeBigint1',
      label: intl.get(`${preCode}.version`).d('版本号'),
    },
    {
      name: 'attributeString1',
      label: intl.get(`${preCode}.versionDesc`).d('版本描述'),
      maxLength: 50,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});

const ApsListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: 'LMDS.ME_OU',
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'apsOuId',
    },
    {
      name: 'apsOuCode',
    },
    {
      name: 'apsOuName',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'mtoFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.mtoFlag`).d('按单生产'),
      defaultValue: false,
    },
    {
      name: 'planFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.planFlag`).d('参与计划'),
      defaultValue: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      let params = data;
      if (data.itemHisId) {
        params = {
          ...data,
          itemId: data.itemHisId,
          itemHisId: null,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/item-apss`,
        data: params,
        method: 'GET',
      };
    },
  },
  events: {
    load: ({ dataSet }) => {
      if (dataSet && dataSet.data[0]) {
        const { mtoFlag } = dataSet.data[0].data;
        dataSet.parent.current.set('mtoFlag', mtoFlag);
      }
    },
  },
});

const MeListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: 'LMDS.ME_OU',
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      // label: intl.get(`${preCode}.completeWarehouse`).d('默认完工仓库'),
      label: intl.get(`${preCode}.inventoryWarehouse`).d('默认入库仓库'),
      lovCode: 'LMDS.WAREHOUSE',
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'inventoryWarehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'inventoryWarehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'inventoryWarehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
    {
      name: 'executeRuleId',
    },
  ],
  transport: {
    read: ({ data }) => {
      let params = data;
      if (data.itemHisId) {
        params = {
          ...data,
          itemId: data.itemHisId,
          itemHisId: null,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/item-mes`,
        data: params,
        method: 'GET',
      };
    },
  },
  events: {
    load: ({ dataSet }) => {
      if (dataSet && dataSet.data[0]) {
        const {
          inventoryWarehouseId,
          inventoryWarehouseCode,
          inventoryWarehouseName,
          executeRuleId,
          executeRuleName,
        } = dataSet.data[0].data;
        if (inventoryWarehouseId) {
          dataSet.parent.current.set('warehouseObj', {
            warehouseId: inventoryWarehouseId,
            warehouseCode: inventoryWarehouseCode,
            warehouseName: inventoryWarehouseName,
          });
        }
        if (executeRuleId) {
          dataSet.parent.current.set('executeRuleObj', {
            ruleId: executeRuleId,
            ruleName: executeRuleName,
          });
        }
      }
    },
  },
});

const ScmListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: 'LMDS.ME_OU',
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'scmOuId',
    },
    {
      name: 'scmOuCode',
    },
    {
      name: 'scmOuName',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      let params = data;
      if (data.itemHisId) {
        params = {
          ...data,
          itemId: data.itemHisId,
          itemHisId: null,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/item-scms`,
        data: params,
        method: 'GET',
      };
    },
  },
});

const WmListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: 'LMDS.ME_OU',
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'wmOuId',
    },
    {
      name: 'wmOuCode',
    },
    {
      name: 'wmOuName',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
    {
      name: 'uomId',
    },
    {
      name: 'uom',
    },
    {
      name: 'uomName',
    },
  ],
  transport: {
    read: ({ data }) => {
      let params = data;
      if (data.itemHisId) {
        params = {
          ...data,
          itemId: data.itemHisId,
          itemHisId: null,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/item-wms`,
        data: params,
        method: 'GET',
      };
    },
  },
});

const SopListDS = () => ({
  selection: false,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: 'LMDS.ME_OU',
      ignore: 'always',
    },
    {
      name: 'meOuId',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'meOuName',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'sopOuId',
      type: 'string',
    },
    {
      name: 'sopOuCode',
      type: 'string',
    },
    {
      name: 'sopOuName',
    },
    {
      name: 'apsOuId',
      type: 'string',
    },
    {
      name: 'apsOuCode',
      type: 'string',
    },
    {
      name: 'apsOuName',
    },
    {
      name: 'itemCode',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      let params = data;
      if (data.itemHisId) {
        params = {
          ...data,
          itemId: data.itemHisId,
          itemHisId: null,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/item-sops`,
        data: params,
        method: 'GET',
      };
    },
  },
});

export { ListDS, DetailDS };
