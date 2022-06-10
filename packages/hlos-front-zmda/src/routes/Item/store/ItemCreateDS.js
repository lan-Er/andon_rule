/**
 * @Description: 物料映射新建DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-10 16:08:32
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.item.model';
const commonCode = 'zmda.common.model';
const { zmdaItem } = codeConfig.code;

export default () => ({
  fields: [
    {
      name: 'enterpriseObj',
      type: 'object',
      label: intl.get(`${commonCode}.enterprise`).d('公司名称'),
      lovCode: zmdaItem.enterprise,
      ignore: 'always',
      required: true,
    },
    {
      name: 'enterpriseId',
      type: 'string',
      bind: 'enterpriseObj.enterpriseId',
    },
    {
      name: 'enterpriseName',
      type: 'string',
      bind: 'enterpriseObj.enterpriseName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料编码'),
      lovCode: zmdaItem.item,
      dynamicProps: {
        lovPara: ({ record }) => ({
          enterpriseId: record.get('enterpriseId'),
        }),
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
      name: 'description',
      label: '物料描述',
      labelWidth: 150,
      required: false,
      bind: 'itemObj.description',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
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
      label: intl.get(`${preCode}.supplierItem`).d('供应商物料编码'),
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
      label: intl.get(`${preCode}.supplierItemDescription`).d('供应商物料描述'),
      bind: 'supplierItemObj.description',
      labelWidth: 150,
      required: false,
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'enterpriseObj') {
        record.set('itemObj', null);
      }
    },
  },
});
