/*
 * @Descripttion: 入料检验数据分析记录表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-19 17:52:02
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-06-09 14:27:05
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const { common } = codeConfig.code;
const intlPrefix = 'ldab.equipment';
const organizationId = getCurrentOrganizationId();

export default function magerialRequirementsDs() {
  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    queryFields: [
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        multiple: true,
        textField: 'description',
      },
      {
        name: 'itemIds',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'creatorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${intlPrefix}.worker`).d('检验员'),
        ignore: 'always',
        multiple: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'inspectionWorkerIds',
        bind: 'creatorObj.workerId',
      },
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${intlPrefix}.worker`).d('供应商'),
        ignore: 'always',
        multiple: true,
      },
      {
        name: 'partyIds',
        bind: 'supplierObj.partyId',
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.category`).d('物料类型'),
        lovCode: common.category,
        lovPara: { categorySetCode: 'ITEM_WM' },
        ignore: 'always',
        multiple: true,
        noCache: true,
      },
      {
        name: 'itemTypes',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'fromCreationDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.fromCreationDate`).d('发生时间从'),
        max: 'toCreationDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'toCreationDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.toCreationDate`).d('发生时间至'),
        min: 'fromCreationDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'mrr',
        type: 'string',
        label: 'MRR编号',
      },
      {
        name: 'inspectionOrderNum',
        type: 'string',
        label: '检验单号',
      },
      {
        name: 'creationDate',
        type: 'date',
        label: '来料日期',
      },
      {
        name: 'exceptionResultMeaning',
        type: 'string',
        label: '异常来源',
      },
      {
        name: 'itemCode',
        type: 'string',
        label: '物料编码',
      },
      {
        name: 'categoryName',
        type: 'string',
        label: '材料种类',
      },
      {
        name: 'itemDesc',
        type: 'string',
        label: '物料描述',
      },
      {
        name: 'specification',
        type: 'string',
        label: '物料规格',
      },
      {
        name: 'inspectionWorkerName',
        type: 'string',
        label: '检验员',
      },
      {
        name: 'partyName',
        type: 'string',
        label: '供应商',
      },
      {
        name: 'lotProjectNum',
        type: 'string',
        label: '批次处理方案',
      },
      {
        name: 'batchQty',
        type: 'string',
        label: '来料数量/分选数量',
      },
      {
        name: 'sampleQty',
        type: 'string',
        label: '批次处理记录',
      },
      {
        name: 'ngDescription',
        type: 'string',
        label: '不合格的描述',
      },
      {
        name: 'qcNgQty',
        type: 'string',
        label: '不良数量',
      },
      {
        name: 'processResultMeaning',
        type: 'string',
        label: '处理结果',
      },
      {
        name: 'remark',
        type: 'string',
        label: '备注',
      },
      {
        name: 'responsible',
        type: 'string',
        label: '责任归属',
      },
      {
        name: 'year',
        type: 'string',
        label: '年',
      },
      {
        name: 'month',
        type: 'string',
        label: '月',
      },
      {
        name: 'week',
        type: 'string',
        label: '周',
      },
      {
        name: 'isOpenning',
        type: 'string',
        label: '是否关闭',
      },
    ],
    transport: {
      read: ({ data }) => {
        const url = `${HLOS_LWMSS}/v1/${organizationId}/raumplus-report/disqualification-report`;
        return {
          data,
          url,
          method: 'POST',
        };
      },
    },
  };
}
