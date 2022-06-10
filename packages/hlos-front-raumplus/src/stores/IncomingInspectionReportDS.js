/*
 * @Descripttion: 入料检验数据分析记录表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-19 17:52:02
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-20 09:39:10
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
        label: intl.get(`${intlPrefix}.fromCreationDate`).d('来料时间从'),
        max: 'toCreationDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'toCreationDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.toCreationDate`).d('来料时间至'),
        min: 'fromCreationDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'fromInspectionDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.fromInspectionDate`).d('检验时间从'),
        max: 'toInspectionDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'toInspectionDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.toInspectionDate`).d('检验时间至'),
        min: 'fromInspectionDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'creationDate',
        type: 'date',
        label: '来料日期',
      },
      {
        name: 'judgedDate',
        type: 'date',
        label: '检验日期',
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
        name: 'categoryName',
        type: 'string',
        label: '类别',
      },
      {
        name: 'itemCode',
        type: 'string',
        label: '物料编码',
      },
      {
        name: 'itemDesc',
        type: 'string',
        label: '系统物料名称',
      },
      {
        name: 'specification',
        type: 'string',
        label: '系统物料规格',
      },
      {
        name: 'batchQty',
        type: 'string',
        label: '来料数量',
      },
      {
        name: 'sampleQty',
        type: 'string',
        label: '检验数量',
      },
      {
        name: 'qcNgQty',
        type: 'string',
        label: '不合格数',
      },
      {
        name: 'qcResultMeaning',
        type: 'string',
        label: '批判断',
      },
      {
        name: 'ngDescription',
        type: 'string',
        label: '不合格的描述',
      },
      {
        name: 'mrr',
        type: 'string',
        label: 'MRR编号',
      },
      {
        name: 'lotProjectNum',
        type: 'string',
        label: '批次处理方案',
      },
      {
        name: 'responsibleWorker',
        type: 'string',
        label: '责任人',
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
        name: 'lotNumber',
        type: 'string',
        label: '批次',
      },
      {
        name: 'receiver',
        type: 'string',
        label: '接收',
      },
      {
        name: 'receiveApply',
        type: 'string',
        label: '接收+允许',
      },
    ],
    transport: {
      read: ({ data }) => {
        const url = `${HLOS_LWMSS}/v1/${organizationId}/raumplus-report/incoming-inspection-report`;

        return {
          data,
          url,
          method: 'POST',
        };
      },
    },
  };
}
