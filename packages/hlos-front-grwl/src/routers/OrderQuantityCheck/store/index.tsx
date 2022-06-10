/*
 * @module: 订单数据检查Ds
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-12 13:42:31
 * @LastEditTime: 2021-05-14 16:35:48
 * @copyright: Copyright (c) 2020,Hand
 */
import { getCurrentOrganizationId } from 'utils/utils';
import lovCodeList, { myModule } from '../../../common/index';

type FormDsType = {
  queryFields: object[];
  transport: object;
  pageSize: number;
};

export default (): FormDsType => {
  return {
    pageSize: 20,
    queryFields: [
      {
        name: 'soNum',
        type: 'string',
        label: '单据号',
      },
      {
        name: 'soLineStatusList',
        type: 'string',
        lookupCode: lovCodeList.lineStatus,
        multiple: ',',
        label: '单据状态',
      },
      {
        name: 'itemObject',
        type: 'object',
        label: '物料',
        ignore: 'always',
        lovCode: lovCodeList.item,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObject.itemId',
      },
      {
        name: 'itemName',
        type: 'string',
        bind: 'itemObject.itemName',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObject.itemCode',
      },
      {
        name: 'creationDateStart',
        type: 'dateTime',
        max: 'creationDateEnd',
        label: '制单日期从',
      },
      {
        name: 'creationDateEnd',
        type: 'dateTime',
        min: 'creationDateStart',
        label: '制单日期至',
      },
      {
        name: 'demandDateStart',
        type: 'dateTime',
        label: '需求日期从',
        max: 'demandDateEnd',
      },
      {
        name: 'demandDateEnd',
        type: 'dateTime',
        label: '需求日期至',
        min: 'demandDateStart',
      },
      {
        name: 'customerPo',
        type: 'string',
        label: '客户PO',
      },
      {
        name: 'customerObject',
        type: 'object',
        label: '客户',
        lovCode: lovCodeList.customer,
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObject.customerId',
      },
      {
        name: 'itemQrCodePrintedFlag',
        type: 'string',
        label: '是否打印',
        lookupCode: 'GRWL.LWMS.PRINT_STATUS',
      },
    ],
    transport: {
      read: (): object => {
        return {
          url: `${myModule.lsops}/v1/${getCurrentOrganizationId()}/grwl-so-lines/check`,
          method: 'GET',
        };
      },
    },
  };
};
