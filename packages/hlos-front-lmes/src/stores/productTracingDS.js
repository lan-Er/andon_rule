/**
 * @Description: 生产任务管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:54:36
 * @LastEditors: yu.na
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lmesProductTracing } = codeConfig.code;

const preCode = 'lmes.productTracing.model';

const TreeDS = () => ({
  primaryKey: 'id',
  parentField: 'parentLineId',
  expandField: 'expand',
  idField: 'id',
  queryFields: [
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'traceDirection',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'traceType0',
      type: 'string',
      label: intl.get(`${preCode}.traceType`).d('原材料->成品'),
      lookupCode: lmesProductTracing.traceCondition0,
    },
    {
      name: 'traceType1',
      type: 'string',
      label: intl.get(`${preCode}.traceType`).d('成品->原材料'),
      lookupCode: lmesProductTracing.traceCondition1,
      required: true,
    },
    {
      name: 'traceType',
      type: 'string',
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('traceDirection')) {
            return 'traceType0';
          }
          return 'traceType1';
        },
      },
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
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
      name: 'soId',
      type: 'string',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soNum',
      type: 'string',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'shipOrderObj',
      type: 'object',
      label: intl.get(`${preCode}.shipOrder`).d('发货单'),
      lovCode: common.shipOrder,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'shipOrderId',
      type: 'string',
      bind: 'shipOrderObj.shipOrderId',
    },
    {
      name: 'shipOrderNum',
      type: 'string',
      bind: 'shipOrderObj.shipOrderNum',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.product`).d('产品'),
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
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('标签号'),
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
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
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
    },
  ],
  fields: [
    { name: 'id', type: 'number' },
    { name: 'expand', type: 'boolean' },
    { name: 'parentId', type: 'number' },
  ],
});

export { TreeDS };
