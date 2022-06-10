/*
 * @Description:
 * @Author: tw
 * @LastEditTime: 2021-07-02 16:10:00
 */
// import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const commonCode = 'lwms.common.model';

const HeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'tagType',
      type: 'string',
      lookupCode: 'LWMS.TAG_PRIMARY_TYPE',
      label: '标签大类',
      defaultValue: 'TEMPLATE_TAG',
      required: true,
      noCache: true,
    },
    {
      name: 'printModel',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: 'LMDS.TAG_TEMPLATE',
      label: '打印模板',
      required: true,
    },
  ],
  transport: {},
});
const ItemTagDS = () => ({
  pageSize: 100,
  queryFields: [
    {
      label: intl.get(`${commonCode}.org`).d('组织'),
      name: 'organizationObj',
      type: 'object',
      ignore: 'always',
      required: true,
      lovCode: common.organization,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'item',
      textField: 'itemCode',
      type: 'object',
      ignore: 'always',
      lovCode: common.item,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
    },
    {
      label: '陶瓷码',
      name: 'outerTagCode',
      type: 'string',
    },
    {
      label: '产线',
      name: 'productLine',
      type: 'string',
      lookupCode: 'LWMS.TF.CHANXIAN',
      defaultValue: 'A',
    },
    {
      label: '炉批次',
      name: 'traceNumObj',
      type: 'object',
      ignore: 'always',
      textField: 'traceNum',
      lovCode: 'LWMS.TF.TRACE_NUM',
    },
    {
      name: 'traceNum',
      type: 'string',
      bind: 'traceNumObj.traceNum',
    },
    {
      label: intl.get(`${commonCode}.facility`).d('设备'),
      name: 'facilityObj',
      type: 'object',
      ignore: 'always',
      lovCode: 'LMDS.WORKCELL',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'facility',
      type: 'string',
      bind: 'facilityObj.workcellCode',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${commonCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
  ],
  fields: [
    {
      label: intl.get(`${commonCode}.org`).d('组织'),
      name: 'organizationName',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.tag`).d('标签'),
      name: 'tagCode',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.item`).d('物料'),
      name: 'itemCode',
      type: 'string',
    },
    {
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      name: 'itemDescription',
      type: 'string',
    },
    {
      label: '陶瓷码',
      name: 'outerTagCode',
      type: 'string',
    },
    {
      label: '炉批次',
      name: 'traceNum',
      type: 'string',
    },
    {
      label: '箱号',
      name: 'num',
      type: 'string',
    },
    {
      label: '位置',
      name: 'location',
    },
    {
      label: '仓库',
      name: 'warehouseName',
    },
    {
      label: '货位',
      name: 'wmAreaName',
    },
    {
      label: '完工时间',
      name: 'dateTime',
      type: 'date',
    },
    {
      label: '操作工',
      name: 'workerName',
      type: 'string',
    },
    {
      label: '打印次数',
      name: 'printedCount',
      type: 'number',
    },
    {
      label: '打印时间',
      name: 'printedDate',
      type: 'date',
    },
    {
      label: '打印人员',
      name: 'printedName',
      type: 'string',
    },
    {
      label: '打印日志',
      name: 'printedLabel',
      type: 'string',
    },
  ],
  transport: {
    read: () => {
      // const { tagType: tagTypeList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/tag-thing-print/finish-product`
        ),
        method: 'GET',
      };
    },
  },
  events: {},
});
const printLableDS = () => ({
  pageSize: 100,
  fields: [
    {
      label: '序号',
      name: 'index',
      type: 'number',
    },
    {
      label: '打印时间',
      name: 'printedDate',
      type: 'date',
    },
    {
      label: '打印人员',
      name: 'printedName',
      type: 'string',
    },
  ],
  transport: {
    read: () => {
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/tag-thing-print/his-print`
        ),
        method: 'GET',
      };
    },
  },
  events: {},
});
export { HeadDS, ItemTagDS, printLableDS };
