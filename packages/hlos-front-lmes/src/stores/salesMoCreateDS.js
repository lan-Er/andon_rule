/*
 * @Description: 创建销售MO-DS
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-11 10:01:51
 * @LastEditors: jianjun.tan
 */

import moment from 'moment';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;

const preCode = 'lmes.salesMoCreate.model';
const commonCode = 'lmes.common.model';
const url = `${HLOS_LSOP}/v1/${organizationId}/so-headers/so-create-mo`;

const ListDS = () => {
  return {
    selection: 'multiple',
    pageSize: 100,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
        lovCode: common.organization,
        ignore: 'always',
        noCache: true,
        required: true,
      },
      {
        name: 'shipOrganizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'soObj',
        type: 'object',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        lovCode: common.soNum,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'soHeaderId',
        bind: 'soObj.soHeaderId',
      },
      {
        name: 'soNum',
        bind: 'soObj.soHeaderNumber',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonCode}.customer`).d('客户'),
        lovCode: common.customer,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'customerId',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerName',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'lineStatus',
        type: 'string',
        label: intl.get(`${preCode}.lineStatus`).d('订单行状态'),
        lookupCode: common.soLineStatus,
        multiple: true,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
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
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${preCode}.customerItem`).d('客户物料'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'salesmanObj',
        type: 'object',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
        lovCode: common.worker,
        lovPara: { workerType: 'SALESMAN' },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'salesmanId',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesmanName',
        bind: 'salesmanObj.workerName',
        ignore: 'always',
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${preCode}.demandDateStart`).d('需求日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.demandDateEnd`).d('需求日期<='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentType`).d('订单类型'),
        lovCode: common.documentType,
        ignore: 'always',
        lovPara: {
          documentClass: 'SO',
        },
      },
      {
        name: 'documentTypeId',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeName',
        bind: 'documentTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'unCompleted',
        type: 'boolean',
        label: intl.get(`${preCode}.uncompleted`).d('未计划完成'),
      },
      {
        name: 'mtoFlag',
        type: 'string',
        label: intl.get(`${preCode}.mtoFlag`).d('是否按单'),
        lookupCode: common.flag,
      },
    ],
    fields: [
      {
        name: 'shipOrganizationName',
        label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
      },
      {
        name: 'soLineNum',
        label: intl.get(`${preCode}.soNum`).d('销售订单'),
      },
      {
        name: 'item',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'uomName',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'demandQty',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
      },
      {
        name: 'planQty',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.planQty`).d('本次计划数量'),
        required: true,
        transformResponse: (val, object) => (object.demandQty || 0) - (object.plannedQty || 0),
      },
      {
        name: 'plannedQty',
        label: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
      },
      {
        name: 'onhandQty',
        label: intl.get(`${preCode}.onhandQty`).d('现有量'),
      },
      {
        name: 'customerName',
        label: intl.get(`${preCode}.customer`).d('客户'),
      },
      {
        name: 'demandDate',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      },
      {
        name: 'customerItem',
        label: intl.get(`${preCode}.customerItem `).d('客户物料'),
      },
      {
        name: 'customerPo',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'sopOuName',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      },
      {
        name: 'salesManName',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
      },
      {
        name: 'itemCategoryName',
        label: intl.get(`${preCode}.itemCategory`).d('物料销售类别'),
      },
      {
        name: 'secondDemandQtyAndUom',
        label: intl.get(`${preCode}.secondUomQty`).d('辅助单位数量'),
      },
      {
        name: 'packingRuleName',
        label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      },
      {
        name: 'packingFormatMeaning',
        label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      },
      {
        name: 'packingMaterial',
        label: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
      },
      {
        name: 'minPackingQty',
        label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      },
      {
        name: 'packingQty',
        label: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      },
      {
        name: 'containerQty',
        label: intl.get(`${preCode}.containerQty`).d('箱数'),
      },
      {
        name: 'palletContainerQty',
        label: intl.get(`${preCode}.palletContainerQty`).d('托盘数'),
      },
      {
        name: 'packageNum',
        label: intl.get(`${preCode}.packageNum`).d('包装编号'),
      },
      {
        name: 'tagTemplate',
        label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
      {
        name: 'soTypeName',
        label: intl.get(`${preCode}.orderType`).d('订单类型'),
      },
      {
        name: 'soStatusMeaning',
        label: intl.get(`${preCode}.soStatus`).d('订单状态'),
      },
      {
        name: 'soLineTypeMeaning',
        label: intl.get(`${preCode}.soLineType`).d('行类型'),
      },
      {
        name: 'soLineStatusMeaning',
        label: intl.get(`${preCode}.soLineStatus`).d('行状态'),
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.remark`).d('订单备注'),
      },
      {
        name: 'lineRemark',
        label: intl.get(`${preCode}.lineRemark`).d('订单行备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { lineStatus: lineStatusList } = data;
        return {
          url: generateUrlWithGetParam(url, {
            lineStatusList,
          }),
          data: {
            ...data,
            lineStatus: undefined,
          },
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
      // submit: ({ data }) => {
      //   return {
      //     url: `${HLOS_LMES}/v1/${organizationId}/mos/create-so-mo`,
      //     data: submitData,
      //     method: 'POST',
      //   };
      // },
    },
    // events: {
    //   submitSuccess: ({ dataSet }) => {
    //     dataSet.query();
    //   },
    // },
  };
};

export { ListDS };
