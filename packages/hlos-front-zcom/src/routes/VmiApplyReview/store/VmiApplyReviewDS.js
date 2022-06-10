/*
 * @Descripttion:VMI申请单审核
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-19 11:34:06
 */
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam, getCurrentUser } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.vmiApplyReviewReview.model';
const { vmiApplyReview, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const returnReviewListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'vmiApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单编码'),
      },
      {
        name: 'vmiWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.vmiWarehouseObj`).d('VMI仓库'),
        lovCode: vmiApplyReview.supplierWarehouse,
        ignore: 'always',
      },
      {
        name: 'vmiWarehouseCode',
        type: 'string',
        bind: 'vmiWarehouseObj.warehouseCode',
      },
      {
        name: 'vmiWarehouseId',
        type: 'string',
        bind: 'vmiWarehouseObj.warehouseId',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
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
        ignore: 'always',
      },
      {
        name: 'createdByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
      },
      {
        name: 'statusList',
        type: 'string',
        lookupCode: vmiApplyReview.vmiApplyStatus,
        label: intl.get(`${intlPrefix}.vmiApplyStatus`).d('VMI申请单状态'),
        multiple: true,
        defaultValue: ['RELEASED', 'CONFIRMED', 'REFUSED', 'DELIVERED', 'RECEIVING', 'RECEIVED'],
        dynamicProps: {
          lookupAxiosConfig: () => ({
            transformResponse(data) {
              let newData = [];
              if (data && data.length) {
                data.forEach((item) => {
                  if (item.value !== 'NEW') {
                    newData.push(item);
                  }
                });
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
      },
      {
        name: 'submitDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.submitDateStart`).d('提交日期从'),
        max: 'submitDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'submitDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.submitDateEnd`).d('提交日期至'),
        min: 'submitDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'approvalByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
      },
    ],
    fields: [
      {
        name: 'vmiApplyNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单号'),
      },
      {
        name: 'vmiApplyStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiApplyStatusMeaning`).d('VMI申请单状态'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'vmiMeOuName',
        type: 'string',
        label: intl.get(`${commonPrefix}.vmiMeOuName`).d('工厂'),
      },
      {
        name: 'vmiWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiWarehouseName`).d('VMI仓库'),
      },
      {
        name: 'createdByName',
        type: 'string',
        label: intl.get(`${commonPrefix}.createdByName`).d('创建人'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'submitDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.submitDate`).d('提交日期'),
      },
      {
        name: 'approvalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.approvalDate`).d('审核日期'),
        required: true,
      },
      {
        name: 'approvalByName',
        type: 'string',
        label: intl.get(`${commonPrefix}.approvalByName`).d('审核人'),
        required: true,
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
      {
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${commonPrefix}.creationDate`).d('查看附件'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { statusList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/list-for-verify`,
            { statusList }
          ),
          data: {
            ...data,
            submitDateStart: data.submitDateStart ? data.submitDateStart.concat(' 00:00:00') : null,
            submitDateEnd: data.submitDateEnd ? data.submitDateEnd.concat(' 23:59:59') : null,
            statusList: null,
          },
          method: 'GET',
          transformResponse: (value) => {
            const newValue = JSON.parse(value);

            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item) => ({
                ...item,
                approvalByName:
                  item.vmiApplyStatus !== 'RELEASED'
                    ? item.approvalByName
                    : getCurrentUser().realName,
                approvalDate:
                  item.vmiApplyStatus !== 'RELEASED'
                    ? item.approvalDate
                    : moment().format(DEFAULT_DATETIME_FORMAT),
              }));
            }
            return { ...newValue, content };
          },
        };
      },
    },
  };
};

const returnReviewHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'vmiApplyNum',
        type: 'string',
        label: intl.get(`${commonPrefix}.vmiApplyNum`).d('VMI申请单号'),
      },
      {
        name: 'vmiMeOuName',
        type: 'string',
        label: intl.get(`${commonPrefix}.vmiMeOuName`).d('工厂'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'vmiWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiWarehouseName`).d('VMI仓库'),
      },
      {
        name: 'vmiApplyStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiApplyStatusMeaning`).d('申请单状态'),
      },
      {
        name: 'approvalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.printedDate`).d('审核日期'),
        required: true,
      },
      {
        name: 'createdByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
      },
      {
        name: 'approvalByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonPrefix}.remark`).d('备注'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${commonPrefix}.remark`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { vmiApplyId } = data;
        return {
          data: {
            ...data,
            vmiApplyId: undefined,
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/${vmiApplyId}`,
          method: 'GET',
          transformResponse: (value) => {
            let newValue = JSON.parse(value);
            if (newValue && newValue.vmiApplyStatus === 'RELEASED') {
              newValue = {
                ...newValue,
                approvalByName: getCurrentUser().realName,
                approvalDate: moment().format(DEFAULT_DATETIME_FORMAT),
              };
            }
            return newValue;
          },
        };
      },
    },
  };
};

const returnReviewLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'vmiApplyLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.vmiApplyLineNum`).d('VMI申请单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'applyQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${commonPrefix}.uomName`).d('物料单位'),
      },
      {
        name: 'receiveWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveWarehouseName`).d('VMI接收仓库'),
      },
      {
        name: 'applyDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.applyDate`).d('申请到货日期'),
      },
      {
        name: 'promiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseQty`).d('实发数量'),
        required: true,
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDate`).d('发货日期'),
        required: true,
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-lines`,
          method: 'GET',
          transformResponse: (value) => {
            const newValue = JSON.parse(value);

            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item) => ({
                ...item,
                promiseQty:
                  item.promiseQty || item.promiseQty === 0 ? item.promiseQty : item.applyQty,
                promiseDate: item.promiseDate || moment().format(DEFAULT_DATETIME_FORMAT),
              }));
            }
            return { ...newValue, content };
          },
        };
      },
    },
  };
};

export { returnReviewListDS, returnReviewHeadDS, returnReviewLineDS };
