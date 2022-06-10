/*
 * @Author: zhang yang
 * @Description: 采购订单 ds
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-01-07 11:04:09
 */
import { DataSet } from 'choerodon-ui/pro';

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LSCM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const { common, lscmPos } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lscm.Pos.model';
const commonCode = 'lscm.common.model';

const ScmPoQtyDS = () => {
  return {
    pageSize: 10,
    selection: 'multiple',
    // autoQuery: true,
    autoCreate: true,
    queryFields: [
      {
        name: 'scmOuObj',
        type: 'object',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
        lovCode: common.scmOu,
        ignore: 'always',
        required: true,
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
        name: 'scmOu',
        type: 'string',
        bind: 'scmOuObj.scmOuName',
        ignore: 'always',
      },
      {
        name: 'poNumObj',
        type: 'object',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
        lovCode: lscmPos.poNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (record.get('scmOuId')) {
              const scmOuId = record.get('scmOuId');
              return { scmOuId };
            } else {
              return { scmOuId: 'undefined' };
            }
          },
        },
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poNumObj.poNum',
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poNumObj.poId',
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
        name: 'supplierCode',
        type: 'string',
        bind: 'supplierObj.supplierCode',
      },
      {
        name: 'supplier',
        type: 'string',
        bind: 'supplierObj.partyName',
        ignore: 'always',
      },
      {
        name: 'poStatus',
        type: 'string',
        lookupCode: lscmPos.poStatus,
        label: intl.get(`${preCode}.poStatus`).d('订单状态'),
        multiple: true,
        defaultValue: ['NEW', 'APPROVING', 'APPROVED', 'RECEIVING'],
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${commonCode}.receiveOrg`).d('收货组织'),
        lovCode: common.org,
        ignore: 'always',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
      },
      {
        name: 'receiveOrgName',
        type: 'string',
        bind: 'receiveOrgObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'buyerObj',
        type: 'object',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
        lovCode: common.worker,
        lovPara: { workerType: 'BUYER' },
        ignore: 'always',
      },
      {
        name: 'buyerId',
        type: 'string',
        bind: 'buyerObj.workerId',
      },
      {
        name: 'buyer',
        type: 'string',
      },
      {
        name: 'buyerName',
        type: 'string',
        bind: 'buyerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
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
        ignore: 'always',
      },
      {
        name: 'poType',
        type: 'object',
        lovCode: lscmPos.sourceDocType,
        label: intl.get(`${preCode}.poType`).d('订单类型'),
        lovPara: { documentClass: 'PO' },
        ignore: 'always',
      },
      {
        name: 'poTypeId',
        type: 'string',
        bind: 'poType.documentTypeId',
      },
      {
        name: 'poTypeCode',
        type: 'string',
        bind: 'poType.documentTypeCode',
      },
      {
        name: 'poTypeName',
        type: 'string',
        bind: 'poType.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: lscmPos.sourceDocType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'sourceDocTypeName',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
        lovCode: lscmPos.sourceDoc,
        cascadeMap: { sourceDocTypeId: 'sourceDocTypeId' },
        ignore: 'always',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNumber',
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${preCode}.demandDateStart`).d('需求日期>='),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.demandDateEnd`).d('需求日期<='),
      },
    ],
    fields: [
      {
        name: 'scmOu',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
        // bind: 'scmOuObj.scmOuName',
        // ignore: 'always',
      },
      // {
      //   name: 'scmOuId',
      //   type: 'string',
      //   bind: 'scmOuObj.scmOuId',
      // },
      // {
      //   name: 'scmOuObj',
      //   type: 'object',
      //   label: intl.get(`${preCode}.scmOu`).d('采购中心'),
      //   lovCode: common.scmOu,
      //   ignore: 'always',
      //   required: true,
      // },
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
      },
      {
        name: 'poTypeCode',
        label: intl.get(`${preCode}.poType`).d('订单类型'),
        ignore: 'always',
      },
      {
        name: 'poTypeName',
        // type: 'object',
        // lovCode: lscmPos.sourceDocType,
        label: intl.get(`${preCode}.poType`).d('订单类型'),
        // lovPara: { DOCUMENT_CLASS: 'PO' },
        // ignore: 'always',
        // required: true,
      },
      // {
      //   name: 'poTypeId',
      //   type: 'string',
      //   bind: 'poType.documentTypeId',
      // },
      // {
      //   name: 'poTypeCode',
      //   type: 'string',
      //   bind: 'poType.documentTypeCode',
      //   ignore: 'always',
      // },
      {
        name: 'poStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.poStatus`).d('订单状态'),
      },
      {
        name: 'buyerObj',
        type: 'object',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
        lovCode: common.worker,
        lovPara: { workerType: 'BUYER' },
        ignore: 'always',
      },
      {
        name: 'buyer',
        bind: 'buyerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'buyerId',
        type: 'string',
        bind: 'buyerObj.workerId',
      },
      {
        name: 'supplier',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        ignore: 'always',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
        required: true,
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.partyId',
      },
      {
        name: 'supplierSite',
        label: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
        ignore: 'always',
      },
      {
        name: 'supplierSiteObj',
        type: 'object',
        label: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
        lovCode: lscmPos.supplierSite,
        ignore: 'always',
        // required: true,
      },
      {
        name: 'supplierSiteId',
        type: 'string',
        bind: 'supplierSiteObj.supplierSiteId',
      },
      {
        name: 'supplierContact',
        type: 'string',
        label: intl.get(`${preCode}.supplierContact`).d('供应商联系人'),
      },
      {
        name: 'contactPhone',
        type: 'number',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        type: 'string',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'receiveOrg',
        label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        ignore: 'always',
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${commonCode}.receiveOrg`).d('收货组织'),
        lovCode: common.org,
        ignore: 'always',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
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
        name: 'currencyName',
        bind: 'currencyObj.currencyName',
        ignore: 'always',
      },
      {
        name: 'currency',
        type: 'string',
        bind: 'currencyObj.currencyCode',
      },
      {
        name: 'currencyId',
        type: 'string',
        bind: 'currencyObj.currencyId',
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${preCode}.totalAmount`).d('订单总价'),
      },
      {
        name: 'taxRate',
        type: 'string',
        label: intl.get(`${preCode}.taxRate`).d('税率'),
        min: 0,
      },
      {
        name: 'exchangeRate',
        type: 'string',
        label: intl.get(`${preCode}.exchangeRate`).d('汇率'),
        min: 0,
      },
      {
        name: 'paymentDeadlineMeaing',
        type: 'string',
        label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
        lookupCode: lscmPos.paymentDeadline,
      },
      {
        name: 'paymentMethodMeaning',
        type: 'string',
        label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
        lookupCode: lscmPos.paymentMethod,
      },
      {
        name: 'poVersion',
        type: 'string',
        label: intl.get(`${preCode}.poVersion`).d('订单版本'),
      },
      {
        name: 'approvalRuleMeaning',
        type: 'string',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        lookupCode: lscmPos.approvalRule,
      },
      {
        name: 'approvalChart',
        label: intl.get(`${preCode}.approvalChart`).d('审批流程'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalId',
        type: 'number',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { poStatus: poStatusArray } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LSCM}/v1/${organizationId}/po-headers`, {
            poStatusArray,
          }),
          data: {
            ...data,
            poStatus: undefined,
          },
          method: 'GET',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${HLOS_LSCM}/v1/${organizationId}/po-headers`,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

const ScmPoQtyLineDS = () => {
  return {
    pageSize: 100,
    fields: [
      {
        name: 'poLineNum',
        type: 'number',
        label: intl.get(`${preCode}.poLineNum`).d('行号'),
        min: 0,
        step: 1,
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        ignore: 'always',
        lovCode: common.org,
        required: true,
      },
      {
        name: 'receiveOrg',
        type: 'string',
        bind: 'receiveOrgObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'receiveOrgCode',
        type: 'string',
        bind: 'receiveOrgObj.organizationCode',
        ignore: 'always',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${preCode}.item`).d('物料'),
        lovCode: common.item,
        dynamicProps: {
          lovPara: ({ dataSet }) => {
            const parentObj = dataSet.parent.current;
            if (parentObj) {
              return {
                scmOuId: parentObj.get('scmOuId'),
              };
            }
          },
        },
        ignore: 'always',
        required: true,
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
        label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
        bind: 'itemObj.description',
      },
      {
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${preCode}.uom`).d('单位'),
        lovCode: lscmPos.uom,
        ignore: 'always',
        required: true,
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'uomObj.uomName',
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'uomObj.uomId',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        min: 0,
        required: true,
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        required: true,
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'poLineStatus',
        type: 'string',
        label: intl.get(`${preCode}.poLineStatus`).d('行状态'),
        lookupCode: lscmPos.poLineStatus,
        defaultValue: 'NEW',
        readOnly: true,
      },
      {
        name: 'poLineStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.poLineStatus`).d('行状态'),
      },
      {
        name: 'unitPrice',
        type: 'number',
        label: intl.get(`${preCode}.unitPrice`).d('单价'),
      },
      {
        name: 'lineAmount',
        type: 'number',
        label: intl.get(`${preCode}.lineAmount`).d('行总价'),
      },
      {
        name: 'receiveToleranceType',
        type: 'string',
        label: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
        lookupCode: lscmPos.receiveToleranceType,
      },
      {
        name: 'receiveTolerance',
        type: 'string',
        label: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
        // readOnly: true,
      },
      {
        name: 'receiveWarehouseObj',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
        cascadeMap: { receiveOrgObj: 'receiveOrgObj' },
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('receiveOrgObj'))) {
              return { organizationId: record.get('receiveOrgId') };
            }
          },
        },
      },
      {
        name: 'receiveWarehouse',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWarehouseCode',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseCode',
      },
      {
        name: 'receiveWmAreaObj',
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        type: 'object',
        lovCode: lscmPos.wmArea,
        ignore: 'always',
        cascadeMap: { receiveWarehouseObj: 'receiveWarehouseObj' },
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('receiveWarehouseId'))) {
              return {
                warehouseId: record.get('receiveWarehouseId'),
              };
            }
          },
        },
      },
      {
        name: 'receiveWmArea',
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaName',
      },
      {
        name: 'receiveWmAreaId',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaId',
      },
      {
        name: 'receiveWmAreaCode',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaCode',
      },
      {
        name: 'inventoryWarehouseObj',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
        cascadeMap: { receiveOrgObj: 'receiveOrgObj' },
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('receiveOrgObj'))) {
              return {
                organizationId: record.get('receiveOrgId'),
              };
            }
          },
        },
      },
      {
        name: 'inventoryWarehouse',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWarehouseCode',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseCode',
      },
      {
        name: 'inventoryWmAreaObj',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        type: 'object',
        lovCode: lscmPos.wmArea,
        cascadeMap: { inventoryWarehouseObj: 'inventoryWarehouseObj' },
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('inventoryWarehouseId'))) {
              return {
                organizationId: record.get('inventoryWarehouseId'),
              };
            }
          },
        },
      },
      {
        name: 'inventoryWmArea',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'inventoryWmAreaId',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWmAreaCode',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaCode',
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        type: 'string',
        bind: 'itemObj.secondUomName',
      },
      {
        name: 'secondUom',
        type: 'string',
        bind: 'itemObj.secondUom',
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'itemObj.secondUomId',
      },
      {
        name: 'secondDemandQty',
        type: 'number',
        label: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
        // readOnly: true,
        cascadeMap: { secondUomName: 'secondUomName' },
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${preCode}.supplierItemCode`).d('供应商物料'),
      },
      {
        name: 'supplierItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.supplierItemDesc`).d('供应商物料描述'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${preCode}.lineRemark`).d('行备注'),
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get(`${preCode}.itemCategory`).d('物料采购类别'),
        lovCode: common.categories,
        lovPara: { categorySetCode: 'ITEM_SCM' },
        ignore: 'always',
      },
      {
        name: 'itemCategoryName',
        type: 'string',
        bind: 'itemCategoryObj.categoryName',
        ignore: 'always',
      },
      {
        name: 'itemCategoryId',
        type: 'string',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'receiveRule',
        type: 'string',
        label: intl.get(`${preCode}.receiveRule`).d('收货类型'),
        lookupCode: lscmPos.receiveRule,
        required: true,
      },
      {
        name: 'receiveRuleMeaning',
        type: 'string',
        label: intl.get(`${preCode}.receiveRuleMeaning`).d('收货类型'),
        lookupCode: lscmPos.receiveRuleMeaning,
      },
      {
        name: 'receivedQty',
        label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'returnedQty',
        label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
      {
        name: 'packageNum',
        type: 'string',
        label: intl.get(`${preCode}.packageNum`).d('包装编号'),
      },
      {
        name: 'moNumObj',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        type: 'object',
        lovCode: lscmPos.mo,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('receiveOrgObj'))) {
              return {
                organizationId: record.get('receiveOrgId'),
              };
            }
          },
        },
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNum',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moNumObj.moTypeCode',
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumObj.moId',
      },
      {
        name: 'moOperationObj',
        label: intl.get(`${preCode}.moOperation`).d('工序'),
        type: 'object',
        lovCode: lscmPos.moOperation,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('moId'))) {
              return {
                moId: record.get('moId'),
                organizationId: record.get('receiveOrgId'),
              };
            }
          },
        },
      },
      {
        name: 'moOperationName',
        type: 'string',
        bind: 'moOperationObj.operationName',
      },
      {
        name: 'moOperationId',
        type: 'string',
        bind: 'moOperationObj.operationId',
      },
      {
        name: 'relatedItemCodeObj',
        type: 'object',
        label: intl.get(`${preCode}.relatedItem`).d('关联物料'),
        lovCode: lscmPos.item,
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('receiveOrgObj'))) {
              return {
                organizationId: record.get('receiveOrgId'),
              };
            }
          },
        },
        ignore: 'always',
      },
      {
        name: 'relatedItemId',
        type: 'string',
        bind: 'relatedItemCodeObj.itemId',
      },
      {
        name: 'relatedItemCode',
        type: 'string',
        bind: 'relatedItemCodeObj.itemCode',
      },
      {
        name: 'relatedItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.relatedItemDesc`).d('关联物料描述'),
        bind: 'relatedItemCodeObj.description',
      },
      {
        name: 'relatedUomObj',
        type: 'object',
        label: intl.get(`${preCode}.relatedUom`).d('关联物料单位'),
        bind: 'relatedItemCodeObj.uomName',
        lovCode: lscmPos.uom,
        ignore: 'always',
      },
      {
        name: 'relatedUom',
        type: 'string',
        bind: 'relatedItemCodeObj.uomName',
      },
      {
        name: 'relatedUomId',
        type: 'string',
        bind: 'relatedItemCodeObj.uomId',
      },
      {
        name: 'relatedDemandQty',
        type: 'number',
        label: intl.get(`${preCode}.relatedDemandQty`).d('关联物料数量'),
        min: 0,
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: lscmPos.sourceDocType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeName',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
      },
      {
        name: 'sourceDocTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: lscmPos.sourceDoc,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('sourceDocTypeId'))) {
              return {
                sourceDocTypeId: record.get('sourceDocTypeId'),
              };
            }
          },
        },
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocNumObj.documentNum',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocNumObj.documentId',
      },
      {
        name: 'sourceDocLineNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        lovCode: lscmPos.sourceDocLineNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('sourceDocNum'))) {
              return {
                sourceDocNum: record.get('sourceDocNum'),
              };
            }
          },
        },
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        bind: 'sourceDocLineNumObj.documentLineNum',
      },
      {
        name: 'sourceDocLineId',
        type: 'string',
        bind: 'sourceDocLineNumObj.documentLineId',
      },
      {
        name: 'externalId',
        type: 'number',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
        strp: 1,
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'oFlagValue',
        type: 'number',
        ignore: 'always',
        defaultValue: -1,
      },
      {
        name: 'bFlagValue',
        type: 'number',
        ignore: 'always',
        defaultValue: 1,
      },
    ],
    events: {
      update: ({ name, record, dataSet }) => {
        if (name === 'receiveOrgObj') {
          record.set('itemObj', null);
          record.set('itemDescription', null);
          record.set('uomObj', null);
          record.set('demandQty', null);
          record.set('demandDate', null);
          record.set('promiseDate', null);
          record.set('unitPrice', null);
          record.set('lineAmount', null);
          record.set('receiveToleranceType', null);
          record.set('receiveTolerance', null);
          record.set('receiveWarehouseObj', null);
          record.set('receiveWmAreaObj', null);
          record.set('inventoryWarehouseObj', null);
          record.set('inventoryWmAreaObj', null);
          record.set('projectNum', null);
          record.set('secondUomObj', null);
          record.set('secondDemandQty', null);
          record.set('supplierItemCode', null);
          record.set('supplierItemDesc', null);
          record.set('itemCategoryObj', null);
          record.set('lineRemark', null);
          record.set('receiveRule', null);
          record.set('demandQty', null);
          record.set('receivedQty', null);
          record.set('inventoryQty', null);
          record.set('qcNgQty', null);
          record.set('returnedQty', null);
          record.set('receiveWarehouseObj', null);
          record.set('receiveWmAreaObj', null);
          record.set('inventoryWarehouseObj', null);
          record.set('inventoryWmAreaObj', null);
          record.set('lotNumber', null);
          record.set('tagCode', null);
          record.set('packageNum', null);
          record.set('moNumObj', null);
          record.set('moOperationObj', null);
          record.set('relatedItemCodeObj', null);
          record.set('relatedItemDesc', null);
          record.set('relatedUomObj', null);
          record.set('relatedDemandQty', null);
          record.set('sourceDocTypeObj', null);
          record.set('sourceDocNumObj', null);
          record.set('sourceDocLineNumObj', null);
          record.set('externalId', null);
          record.set('externalNum', null);
        }
        if (name === 'itemObj') {
          const rec = record.get('itemObj');
          if (!isEmpty(rec)) {
            record.set('uomObj', {
              uomId: rec.uomId,
              uomName: rec.uomName,
            });
          } else {
            record.set('uomObj', null);
          }
          record.set('demandQty', null);
          record.set('demandDate', null);
          record.set('promiseDate', null);
          record.set('unitPrice', null);
          record.set('lineAmount', null);
          record.set('receiveToleranceType', null);
          record.set('receiveTolerance', null);
          record.set('receiveWarehouseObj', null);
          record.set('receiveWmAreaObj', null);
          record.set('inventoryWarehouseObj', null);
          record.set('inventoryWmAreaObj', null);
          record.set('projectNum', null);
          record.set('secondUomObj', null);
          record.set('secondDemandQty', null);
          record.set('supplierItemCode', null);
          record.set('supplierItemDesc', null);
          record.set('itemCategoryObj', null);
          record.set('lineRemark', null);
          record.set('receiveRule', null);
          record.set('demandQty', null);
          record.set('receivedQty', null);
          record.set('inventoryQty', null);
          record.set('qcNgQty', null);
          record.set('returnedQty', null);
          record.set('receiveWarehouseObj', null);
          record.set('receiveWmAreaObj', null);
          record.set('inventoryWarehouseObj', null);
          record.set('inventoryWmAreaObj', null);
          record.set('lotNumber', null);
          record.set('tagCode', null);
          record.set('packageNum', null);
          record.set('moNumObj', null);
          record.set('moOperationObj', null);
          record.set('relatedItemCodeObj', null);
          record.set('relatedItemDesc', null);
          record.set('relatedUomObj', null);
          record.set('relatedDemandQty', null);
          record.set('sourceDocTypeObj', null);
          record.set('sourceDocNumObj', null);
          record.set('sourceDocLineNumObj', null);
          record.set('externalId', null);
          record.set('externalNum', null);
        }
        if (name === 'receiveToleranceType') {
          if (record.get('receiveToleranceType') !== null) {
            record.getField('receiveTolerance').set('required', true);
            record.getField('receiveTolerance').set('readOnly', false);
          } else {
            record.getField('receiveTolerance').set('required', false);
            record.getField('receiveTolerance').set('readOnly', true);
          }
          record.set('receiveTolerance', null);
        }
        if (name === 'receiveWarehouseObj') {
          record.set('receiveWmAreaObj', null);
        }
        if (name === 'inventoryWarehouseObj') {
          record.set('inventoryWmAreaObj', null);
        }
        if (name === 'moNumObj') {
          record.set('moOperationObj', null);
        }
        if (name === 'uomObj') {
          if (record.get('uomId') === record.get('secondUomId')) {
            record.set('secondUomObj', null);
          }
        }
        if (name === 'secondUomObj') {
          if (record.get('uomId') === record.get('secondUomId')) {
            record.set('secondUomObj', null);
          }
          if (record.get('secondUomObj') !== null) {
            record.getField('secondDemandQty').set('required', true);
            record.getField('secondDemandQty').set('readOnly', false);
          } else {
            record.getField('secondDemandQty').set('required', false);
            record.getField('secondDemandQty').set('readOnly', true);
          }
          record.set('secondDemandQty', null);
        }
        if (name === 'sourceDocTypeObj') {
          record.set('sourceDocNumObj', null);
          record.set('sourceDocLineNumObj', null);
        }
        if (name === 'demandQty' || name === 'unitPrice') {
          record.set('lineAmount', null);
          if (
            record.get('demandQty') !== null &&
            record.get('demandQty') !== undefined &&
            record.get('unitPrice') !== null &&
            record.get('unitPrice') !== undefined
          ) {
            const deQtyx = record.get('demandQty');
            const uipriy = record.get('unitPrice');
            const amount = deQtyx * uipriy;
            record.set('lineAmount', amount);
          }
        }
        if (name === 'lineAmount') {
          const amountArr = dataSet.records.map(
            (r) => r.data.poLineStatus !== 'CANCELLED' && r.data.lineAmount
          );
          dataSet.parent.current.set(
            'totalAmount',
            amountArr.filter((item) => item).reduce((a, b) => a + b, 0)
          );
        }
      },
    },
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_LSCM}/v1/${organizationId}/po-lines`,
          method: 'GET',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${HLOS_LSCM}/v1/${organizationId}/po-lines`,
          data,
          method: 'DELETE',
        };
      },
    },
  };
};

const ScmPoDetailDS = () => {
  return {
    pageSize: 10,
    primaryKey: 'poHeaderId',
    children: {
      lineList: new DataSet(ScmPoQtyLineDS()),
    },
    fields: [
      {
        name: 'scmOuObj',
        type: 'object',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
        lovCode: common.scmOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'scmOuName',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
        bind: 'scmOuObj.scmOuName',
        ignore: 'always',
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
        name: 'poNum',
        type: 'string',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
      },
      {
        name: 'poType',
        type: 'object',
        lovCode: lscmPos.sourceDocType,
        label: intl.get(`${preCode}.poType`).d('订单类型'),
        lovPara: { documentClass: 'PO' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'poTypeCode',
        type: 'string',
        bind: 'poType.documentTypeCode',
      },
      {
        name: 'poTypeId',
        type: 'string',
        bind: 'poType.documentTypeId',
      },
      {
        name: 'poTypeName',
        type: 'string',
        bind: 'poType.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'poStatus',
        type: 'string',
        label: intl.get(`${preCode}.poStatus`).d('订单状态'),
        lookupCode: lscmPos.poStatus,
        defaultValue: 'NEW',
      },
      {
        name: 'buyerObj',
        type: 'object',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
        lovCode: common.worker,
        lovPara: { workerType: 'BUYER' },
        ignore: 'always',
      },
      {
        name: 'buyer',
        bind: 'buyerObj.workerName',
      },
      {
        name: 'buyerId',
        type: 'string',
        bind: 'buyerObj.workerId',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
        required: true,
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
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.partyId',
      },
      {
        name: 'supplierSiteObj',
        type: 'object',
        label: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
        lovCode: lscmPos.supplierSite,
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('supplierId'))) {
              return {
                supplierId: record.get('supplierId'),
              };
            }
          },
        },
        ignore: 'always',
      },
      {
        name: 'supplierSite',
        bind: 'supplierSiteObj.supplierSiteName',
        ignore: 'always',
      },
      {
        name: 'supplierSiteNumber',
        type: 'string',
        bind: 'supplierSiteObj.supplierSiteNumber',
      },
      {
        name: 'supplierSiteId',
        type: 'string',
        bind: 'supplierSiteObj.supplierSiteId',
      },
      {
        name: 'supplierContact',
        type: 'string',
        label: intl.get(`${preCode}.supplierContact`).d('供应商联系人'),
      },
      {
        name: 'contactPhone',
        type: 'number',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        type: 'string',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${commonCode}.receiveOrg`).d('收货组织'),
        lovCode: common.org,
        ignore: 'always',
      },
      {
        name: 'receiveOrg',
        type: 'string',
        bind: 'receiveOrgObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'receiveOrgCode',
        type: 'string',
        bind: 'receiveOrgObj.organizationCode',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
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
        name: 'currencyName',
        bind: 'currencyObj.currencyName',
        ignore: 'always',
      },
      {
        name: 'currency',
        type: 'string',
        bind: 'currencyObj.currencyCode',
      },
      {
        name: 'currencyId',
        type: 'string',
        bind: 'currencyObj.currencyId',
      },
      {
        name: 'totalAmount',
        type: 'number',
        label: intl.get(`${preCode}.totalAmount`).d('订单总价'),
      },
      {
        name: 'taxRate',
        type: 'number',
        label: intl.get(`${preCode}.taxRate`).d('税率'),
        min: 0,
      },
      {
        name: 'exchangeRate',
        type: 'number',
        label: intl.get(`${preCode}.exchangeRate`).d('汇率'),
        min: 0,
      },
      {
        name: 'paymentDeadline',
        type: 'string',
        label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
        lookupCode: lscmPos.paymentDeadline,
      },
      {
        name: 'paymentMethod',
        type: 'string',
        label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
        lookupCode: lscmPos.paymentMethod,
      },
      {
        name: 'poVersion',
        type: 'string',
        label: intl.get(`${preCode}.poVersion`).d('订单版本'),
      },
      {
        name: 'approvalRule',
        type: 'string',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        lookupCode: lscmPos.approvalRule,
        bind: 'poType.approvalRule',
      },
      {
        name: 'approvalChart',
        label: intl.get(`${preCode}.approvalChart`).d('审批流程'),
      },
      {
        name: 'docProcessRule',
        type: 'object',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
        bind: 'poType.docProcessRule',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalId',
        type: 'number',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
    ],
    // events: {
    //   update: ({ name, record }) => {
    //     if (name === 'poType') {
    //       // if(record.get('docProcessRule').poNum === undefined){
    //       //   record.getField('poType').set('readOnly', true);
    //       // }else if(record.get('docProcessRule').poNum !== 'manual'){
    //       //     record.getField('poType').set('readOnly', true);
    //       //   }else{ record.getField('poType').set('required', true); }
    //     //   const Rule = record.get('docProcessRule');
    //     //   const ruleObject = JSON.parse(Rule);
    //     //   console.log(ruleObject);
    //     //   if(ruleObject && ruleObject.doc_num && ruleObject.doc_num ==='manual'){
    //     //     console.log(ruleObject.doc_num);
    //     //   }else{
    //     //     console.log('no');
    //     //   }
    //     // }
    //     // if(name === 'docProcessRule'){
    //     //   console.log(record.get('docProcessRule'));
    //     // }
    //   // },
    // },
    transport: {
      read: () => {
        return {
          url: `${HLOS_LSCM}/v1/${organizationId}/po-headers/get`,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: `${HLOS_LSCM}/v1/${organizationId}/po-headers`,
          data: data[0],
          method: 'POST',
        };
      },
      update: ({ data }) => {
        if (data[0]._status === 'update') {
          data[0].lineList.forEach((item) => {
            const lineItem = item;
            lineItem.validateType = 'UPDATE';
          });
        }
        if (data[0]._status === 'create') {
          data[0].lineList.forEach((item) => {
            const lineItem = item;
            lineItem.validateType = 'NEW';
          });
        }
        return {
          url: `${HLOS_LSCM}/v1/${organizationId}/po-headers`,
          data: data[0],
          method: 'POST',
        };
      },
    },
  };
};

const ScmPoLineDS = () => {
  return {
    pageSize: 100,
    fields: [
      {
        name: 'poLineNum',
        type: 'number',
        label: intl.get(`${preCode}.poLineNum`).d('行号'),
        min: 0,
        step: 1,
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        ignore: 'always',
        lovCode: common.org,
      },
      {
        name: 'receiveOrg',
        type: 'string',
        bind: 'receiveOrgObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${preCode}.item`).d('物料'),
        lovCode: lscmPos.item,
        ignore: 'always',
        required: true,
      },
      {
        name: 'itemCode',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'itemDescription',
        label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
        bind: 'itemObj.description',
      },
      {
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${preCode}.uom`).d('单位'),
        lovCode: lscmPos.uom,
        ignore: 'always',
        required: true,
      },
      {
        name: 'uomName',
        type: 'string',
        bind: 'uomObj.uomName',
        ignore: 'always',
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'uomObj.uomId',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        min: 0,
        required: true,
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        required: true,
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'poLineStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.poLineStatus`).d('行状态'),
        lookupCode: lscmPos.poLineStatus,
      },
      {
        name: 'unitPrice',
        type: 'number',
        label: intl.get(`${preCode}.unitPrice`).d('单价'),
      },
      {
        name: 'lineAmount',
        type: 'number',
        label: intl.get(`${preCode}.lineAmount`).d('行总价'),
      },
      {
        name: 'receiveToleranceType',
        type: 'string',
        label: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
        lookupCode: lscmPos.receiveToleranceType,
      },
      {
        name: 'receiveTolerance',
        type: 'string',
        label: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
      },
      {
        name: 'receiveWarehouseObj',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
      },
      {
        name: 'receiveWarehouse',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWmAreaObj',
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('receiveWarehouseId')) {
              return false;
            } else {
              return true;
            }
          },
          lovPara: ({ record }) => {
            if (record.get('receiveWarehouseId')) {
              return {
                warehouseId: record.get('receiveWarehouseId'),
              };
            } else {
              return {
                warehouseId: '',
              };
            }
          },
        },
      },
      {
        name: 'receiveWmArea',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaName',
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'), // 非详情页展示
      },
      {
        name: 'receiveWmAreaId',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWarehouseObj',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
      },
      {
        name: 'inventoryWarehouseName',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWmAreaObj',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        type: 'object',
        lovCode: lscmPos.warehouse,
        ignore: 'always',
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('inventoryWarehouseId')) {
              return false;
            } else {
              return true;
            }
          },
          lovPara: ({ record }) => {
            if (record.get('inventoryWarehouseId')) {
              return {
                warehouseId: record.get('inventoryWarehouseId'),
              };
            } else {
              return {
                warehouseId: '',
              };
            }
          },
        },
      },
      {
        name: 'inventoryWmArea',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaName',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      },
      {
        name: 'inventoryWmAreaId',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaId',
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'secondUomObj',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        type: 'object',
        lovCode: lscmPos.uom,
        ignore: 'always',
      },
      {
        name: 'secondUomName',
        type: 'string',
        bind: 'secondUomObj.uomName',
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'secondUomObj.uomId',
      },
      {
        name: 'secondDemandQty',
        type: 'number',
        label: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${preCode}.supplierItemCode`).d('供应商物料'),
      },
      {
        name: 'supplierItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.supplierItemDesc`).d('供应商物料描述'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${preCode}.lineRemark`).d('行备注'),
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get(`${preCode}.itemCategory`).d('物料采购类别'),
        lovCode: lscmPos.category,
        ignore: 'always',
      },
      {
        name: 'itemCategoryName',
        type: 'string',
        bind: 'itemCategoryObj.categoryName',
        label: intl.get(`${preCode}.itemCategory`).d('物料采购类别'),
      },
      {
        name: 'itemCategoryId',
        type: 'string',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'receiveRule',
        type: 'string',
        label: intl.get(`${preCode}.receiveRule`).d('收货类型'),
        lookupCode: lscmPos.receiveRule,
        required: true,
      },
      {
        name: 'receivedQty',
        label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      },
      {
        name: 'qcNgQty',
        label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      },
      {
        name: 'returnedQty',
        label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
      {
        name: 'packageNum',
        type: 'string',
        label: intl.get(`${preCode}.packageNum`).d('包装编号'),
      },
      {
        name: 'moNumObj',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        type: 'object',
        lovCode: lscmPos.mo,
        ignore: 'always',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNumber',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumObj.moId',
      },
      {
        name: 'moOperationObj',
        label: intl.get(`${preCode}.moOperation`).d('工序'),
        type: 'object',
        lovCode: lscmPos.moOperation,
      },
      {
        name: 'moOperationName',
        type: 'string',
        bind: 'moOperationObj.operationName',
      },
      {
        name: 'moOperationId',
        type: 'string',
        bind: 'moOperationObj.operationId',
      },
      {
        name: 'relatedItemCodeObj',
        type: 'object',
        label: intl.get(`${preCode}.relatedItem`).d('关联物料'),
        lovCode: lscmPos.item,
        ignore: 'always',
      },
      {
        name: 'relatedItemCode',
        type: 'string',
        bind: 'relatedItemCodeObj.itemCode',
      },
      {
        name: 'relatedItemDesc',
        label: intl.get(`${preCode}.relatedItemDesc`).d('关联物料描述'),
        bind: 'relatedItemCodeObj.itemDescription',
      },
      {
        name: 'relatedUomObj',
        type: 'object',
        label: intl.get(`${preCode}.relatedUom`).d('关联物料单位'),
        bind: 'relatedItemCodeObj.uomName',
        lovCode: lscmPos.uom,
        ignore: 'always',
      },
      {
        name: 'relatedUom',
        type: 'string',
        bind: 'relatedItemCodeObj.uomCode',
        label: intl.get(`${preCode}.relatedUom`).d('关联物料单位'),
      },
      {
        name: 'relatedUomId',
        type: 'string',
        bind: 'relatedItemCodeObj.uomId',
      },
      {
        name: 'relatedDemandQty',
        type: 'number',
        label: intl.get(`${preCode}.relatedDemandQty`).d('关联物料数量'),
        min: 0,
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: lscmPos.sourceDocType,
        textField: 'sourceDocTypeName',
        ignore: 'always',
      },
      {
        name: 'sourceDocType',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'sourceDocTypeName',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeName',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: lscmPos.sourceDoc,
        ignore: 'always',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocNumObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'sourceDocNumId',
        type: 'string',
        bind: 'sourceDocNumObj.documentId',
      },
      {
        name: 'sourceDocLineNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        lovCode: lscmPos.sourceDocLineNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => {
            if (!isEmpty(record.get('sourceDocNumId'))) {
              return {
                sourceDocNumId: record.get('sourceDocNumId'),
              };
            }
          },
        },
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        bind: 'sourceDocLineNumObj.documentLineNum',
        ignore: 'always',
      },
      {
        name: 'sourceDocLineNumId',
        type: 'string',
        bind: 'sourceDocLineNumObj.documentLineId',
      },
      {
        name: 'externalId',
        type: 'number',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
        strp: 1,
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_LSCM}/v1/${organizationId}/po-lines`,
          method: 'GET',
        };
      },
    },
  };
};

const ScmWorker = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'workerObj',
      type: 'object',
      label: intl.get(`${preCode}.worker`).d('报检人'),
      lovCode: common.worker,
      dynamicProps: {
        lovPara: ({ record }) => ({ organizationId: record.get('organizationId') }),
      },
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
  ],
});

export { ScmPoQtyDS, ScmPoLineDS, ScmPoDetailDS, ScmWorker };
