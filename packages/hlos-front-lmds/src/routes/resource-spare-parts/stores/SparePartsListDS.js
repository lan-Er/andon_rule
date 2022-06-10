/**
 * @Description: 备品备件管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-05 19:22:32
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import {
  positiveNumberValidator,
  getTlsRecord,
  convertFieldName,
  codeValidator,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const urlPrefix = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts`;
const preCode = 'lmds.sparePart.model';
const commonCode = 'lmds.common.model';
const { common, lmdsSpareParts } = codeConfig.code;
const {
  lovPara: { spareParts },
} = statusConfig.statusValue.lmds;

export default () => ({
  pageSize: 10,
  autoQuery: true,
  selection: false,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'sparePart', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: (config) => {
      const url = `${urlPrefix}`;
      return {
        ...config,
        url,
        method: 'get',
      };
    },
    update: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'PUT',
      };
    },
    create: ({ data }) => {
      return {
        url: `${urlPrefix}`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  queryFields: [
    {
      name: 'sparePartCode',
      type: 'String',
      label: intl.get(`${preCode}.sparePart`).d('备品备件'),
    },
    {
      name: 'sparePartName',
      type: 'String',
      label: intl.get(`${preCode}.sparePartName`).d('备品备件名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      ignore: 'always',
    },
    { name: 'organizationId', type: 'string', bind: 'organizationObj.meOuId' },
    { name: 'organizationCode', type: 'string', bind: 'organizationObj.meOuCode' },
    { name: 'organizationName', type: 'string', bind: 'organizationObj.organizationName' },
    {
      name: 'sparePartCode',
      type: 'string',
      label: intl.get(`${preCode}.sparePart`).d('备品备件'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'sparePartName',
      type: 'intl',
      label: intl.get(`${preCode}.sparePartName`).d('备品备件名称'),
      required: true,
    },
    {
      name: 'sparePartAlias',
      type: 'intl',
      label: intl.get(`${preCode}.sparePartAlias`).d('备品备件简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${commonCode}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'sparePartType',
      type: 'string',
      label: intl.get(`${preCode}.sparePartType`).d('备品备件类型'),
      lookupCode: lmdsSpareParts.sparePartType,
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.picture`).d('图片'),
    },
    {
      name: 'sparePartCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.sparePartCategory`).d('类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: spareParts },
      ignore: 'always',
    },
    {
      name: 'sparePartCategoryId',
      type: 'string',
      bind: 'sparePartCategoryObj.categoryId',
    },
    {
      name: 'sparePartCategoryCode',
      type: 'string',
      bind: 'sparePartCategoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'sparePartCategoryObj.categoryName',
    },
    {
      name: 'sparePartGroup',
      type: 'string',
      label: intl.get(`${preCode}.sparePartGroup`).d('备品备件组'),
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${preCode}.chiefPosition`).d('主管岗位'),
      lovCode: common.position,
      ignore: 'always',
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'chiefPosition',
      type: 'string',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'positionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${preCode}.department`).d('主管部门'),
      lovCode: common.department,
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'department',
      type: 'string',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'supervisorObj',
      type: 'object',
      label: intl.get(`${preCode}.worker`).d('责任员工'),
      lovCode: common.worker,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'supervisorId',
      type: 'string',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'supervisor',
      type: 'string',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorName',
      type: 'string',
      bind: 'supervisorObj.workerName',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('使用资源'),
      lovCode: common.resource,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.itemMe,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.itemDescription',
    },
    {
      name: 'scmOuObj',
      type: 'object',
      lovCode: common.scmOu,
      label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmOuObj.scmOuId',
    },
    {
      name: 'scmOuCode',
      type: 'string',
      bind: 'scmOuObj.scmOuCode',
    },
    {
      name: 'scmOuName',
      type: 'string',
      bind: 'scmOuObj.scmOuName',
    },
    {
      name: 'sparePartPlanRule',
      type: 'string',
      lookupCode: lmdsSpareParts.planRule,
      label: intl.get(`${preCode}.planRule`).d('计划规则'),
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.partyNumber',
    },
    {
      name: 'supplier',
      type: 'string',
      bind: 'supplierObj.partyName',
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
    {
      name: 'servicePhone',
      type: 'number',
      step: 1,
      min: 0,
      label: intl.get(`${preCode}.servicePhone`).d('服务电话'),
    },
    {
      name: 'minStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minStockQty`).d('最小库存数'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maxStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxStockQty`).d('最大库存数'),
      // 最大库存量不可小于最小库存量
      validator: (value, name, record) => {
        if (value && value <= record.get('minStockQty')) {
          return intl.get(`lmds.item.validation.biggerStock`).d('最大库存必须大于最小库存');
        }
      },
    },
    {
      name: 'safetyStockQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.safetyStockQty`).d('安全库存数'),
      validator: positiveNumberValidator,
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${commonCode}.uom`).d('单位'),
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
      name: 'roundQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.roundQty`).d('圆整数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'minOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minOrderQty`).d('最小订购量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'maxOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxOrderQty`).d('最大订购量'),
      // 最大起订量不可小于最小起订量
      validator: (value, name, record) => {
        if (value && value <= record.get('minOrderQty')) {
          return intl.get(`lmds.item.validation.biggerOrder`).d('最大起订量必须大于最小起订量');
        }
      },
    },
    {
      name: 'fixedLotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.fixedLotFlag`).d('固定批次标识'),
    },
    {
      name: 'fixedOrderQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.fixedOrderQty`).d('固定订购量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'marketPrice',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.marketPrice`).d('市场价格'),
      validator: positiveNumberValidator,
    },
    {
      name: 'purchasePrice',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.purchasePrice`).d('采购价格'),
      validator: positiveNumberValidator,
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currencyCode',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyName',
    },
    {
      name: 'leadTime',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.leadTime`).d('采购提前期(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('默认储存仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      cascadeMap: { organizationId: 'organizationId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
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
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('默认存储货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'wmUnitObj',
      type: 'object',
      label: intl.get(`${preCode}.wmUnit`).d('默认存储货格'),
      lovCode: common.wmUnit,
      ignore: 'always',
      cascadeMap: { wmAreaId: 'wmAreaId' },
    },
    {
      name: 'wmUnitId',
      type: 'string',
      bind: 'wmUnitObj.wmUnitId',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      bind: 'wmUnitObj.wmUnitCode',
    },
    {
      name: 'expireAlertDays',
      type: 'number',
      label: '预警期(天)',
      min: 1,
      step: 1,
    },
    {
      name: 'alertRuleObj',
      type: 'object',
      label: '预警规则',
      lovCode: common.rule,
      ignore: 'always',
      lovPara: {
        ruleClass: 'SPARE_PARTS',
      },
    },
    {
      name: 'alertRuleId',
      type: 'string',
      bind: 'alertRuleObj.ruleId',
    },
    {
      name: 'alertRule',
      type: 'string',
      bind: 'alertRuleObj.ruleJson',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'alertRuleObj.ruleName',
    },
    {
      name: 'lotControlType',
      type: 'string',
      label: intl.get(`${preCode}.lotControlType`).d('批次控制类型'),
      lookupCode: lmdsSpareParts.lotControlType,
    },
    {
      name: 'tpmInterval',
      type: 'number',
      step: 1,
      min: 0,
      label: intl.get(`${preCode}.TpmInterval`).d('TPM周期'),
    },
    {
      name: 'tpmNeedDays',
      type: 'number',
      step: 1,
      min: 0,
      label: intl.get(`${preCode}.TpmNeedDays`).d('TPM时间(天)'),
    },
    {
      name: 'tpmTimes',
      type: 'number',
      step: 1,
      min: 0,
      label: intl.get(`${preCode}.TpmTimes`).d('TPM次数'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
      required: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('resourceObj', {});
        record.set('scmOuObj', {});
        record.set('itemObj', {});
        record.set('warehouseObj', {});
        record.set('supervisorObj', {});
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
        record.set('wmUnitObj', null);
      }
      if (name === 'wmAreaObj') {
        record.set('wmUnitObj', null);
      }
    },
  },
});
