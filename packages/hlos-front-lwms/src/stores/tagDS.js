/**
 * @Description: 实物标签管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:47:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsTag } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.tag.model';
const commonCode = 'lwms.common.model';

const commonFields = [
  {
    name: 'organization',
    label: intl.get(`${commonCode}.org`).d('组织'),
  },
  {
    name: 'tagCode',
    label: intl.get(`${commonCode}.tag`).d('标签'),
  },
  {
    name: 'itemCode',
    label: intl.get(`${commonCode}.item`).d('物料'),
  },
  {
    name: 'itemDescription',
    label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
  },
  {
    name: 'uomName',
    type: 'string',
    label: intl.get(`${commonCode}.uom`).d('单位'),
  },
  {
    name: 'quantity',
    label: intl.get(`${preCode}.quantity`).d('数量'),
  },
  {
    name: 'lotNumber',
    label: intl.get(`${commonCode}.lot`).d('批次'),
  },
  {
    name: 'traceNum',
    label: intl.get(`${preCode}.traceNum`).d('批次跟踪号'),
  },
  {
    name: 'innerTagCode',
    label: intl.get(`${preCode}.innerTag`).d('内标签'),
  },
  {
    name: 'warehouse',
    type: 'string',
    label: intl.get(`${commonCode}.warehouse`).d('仓库'),
  },
  {
    name: 'wmArea',
    label: intl.get(`${commonCode}.wmArea`).d('货位'),
  },
  {
    name: 'wmUnit',
    label: intl.get(`${commonCode}.wmUnit`).d('货格'),
  },
  {
    name: 'qcStatusMeaning',
    label: intl.get(`${preCode}.qcStatus`).d('质量状态'),
  },
  {
    name: 'ownerTypeMeaning',
    type: 'string',
    label: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
  },
  {
    name: 'owner',
    label: intl.get(`${commonCode}.owner`).d('所有者'),
  },
  {
    name: 'secondUomName',
    label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
  },
  {
    name: 'secondQuantity',
    label: intl.get(`${preCode}.secondQuantity`).d('辅助单位数量'),
  },
  {
    name: 'featureType',
    label: intl.get(`${preCode}.featureType`).d('特征值类型'),
  },
  {
    name: 'featureValue',
    label: intl.get(`${preCode}.featureValue`).d('特征值'),
  },
  {
    name: 'projectNum',
    label: intl.get(`${preCode}.projectNum`).d('项目号'),
  },
  {
    name: 'sourceNum',
    label: intl.get(`${preCode}.sourceNum`).d('来源编号'),
  },

  {
    name: 'assignedTime',
    label: intl.get(`${preCode}.assignedTime`).d('赋值时间'),
  },
  {
    name: 'madeDate',
    type: 'string',
    label: intl.get(`${preCode}.madeDate`).d('生产日期'),
  },

  {
    name: 'expireDate',
    type: 'string',
    label: intl.get(`${preCode}.expireDate`).d('失效日期'),
  },
  {
    name: 'netWeight',
    label: intl.get(`${preCode}.netWeight`).d('净重'),
  },
  {
    name: 'grossWeight',
    label: intl.get(`${preCode}.assignedTime`).d('总重'),
  },

  {
    name: 'qcRemark',
    label: intl.get(`${preCode}.qcRemark`).d('质量备注'),
  },
  {
    name: 'thingRemark',
    label: intl.get(`${preCode}.thingRemark`).d('实物备注'),
  },
  {
    name: 'tagThingTypeMeaning',
    label: intl.get(`${preCode}.tagThingType`).d('实物类型'),
  },
  // 实物标签 分两次展示
  {
    name: 'tagStatusMeaning',
    label: intl.get(`${preCode}.tagStatus`).d('标签状态'),
  },
  {
    name: 'loadFlag',
    label: intl.get(`${preCode}.loadFlag`).d('装载标识'),
  },
  {
    name: 'tagTypeMeaning',
    label: intl.get(`${preCode}.tagType`).d('标签类型'),
  },
  {
    name: 'tagCategory',
    label: intl.get(`${preCode}.tagCategory`).d('标签分类'),
  },
  {
    name: 'verificationCode',
    label: intl.get(`${preCode}.verificationCode`).d('校验码'),
  },
  {
    name: 'dCode',
    label: intl.get(`${preCode}.dCode`).d('二维码'),
  },
  {
    name: 'productTagCode',
    label: intl.get(`${preCode}.productTagCode`).d('产品标签'),
  },
  {
    name: 'outerTagCode',
    label: intl.get(`${preCode}.outerTagCode`).d('外标签'),
  },
  {
    name: 'resource',
    label: intl.get(`${commonCode}.resource`).d('资源'),
  },
  {
    name: 'operation',
    label: intl.get(`${preCode}.operation`).d('工序'),
  },
  {
    name: 'documentType',
    label: intl.get(`${commonCode}.documentType`).d('单据类型'),
  },
  {
    name: 'documentNum',
    label: intl.get(`${commonCode}.documentNum`).d('单据号'),
  },
  {
    name: 'documentLineNum',
    label: intl.get(`${commonCode}.documentLineNum`).d('单据行号'),
  },
  {
    name: 'containerType',
    label: intl.get(`${preCode}.containerType`).d('容器类型'),
  },
  {
    name: 'container',
    label: intl.get(`${preCode}.container`).d('容器'),
  },
  {
    name: 'containerOwnerTypeMeaning',
    label: intl.get(`${preCode}.containerOwnerType`).d('容器所有者类型'),
  },
  {
    name: 'containerOwner',
    label: intl.get(`${preCode}.containerOwner`).d('容器所有者'),
  },
  {
    name: 'containerWeight',
    label: intl.get(`${preCode}.containerWeight`).d('容器重量'),
  },
  {
    name: 'capacityQty',
    label: intl.get(`${preCode}.capacityQty`).d('满载数量'),
  },
  {
    name: 'location',
    label: intl.get(`${commonCode}.location`).d('地点位置'),
  },
  {
    name: 'printedDate',
    label: intl.get(`${preCode}.printedDate`).d('打印时间'),
  },
  {
    name: 'printedFlag',
    label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
  },
  {
    name: 'printedCount',
    label: intl.get(`${preCode}.printedCount`).d('打印次数'),
  },
  {
    name: 'remark',
    label: intl.get(`${commonCode}.remark`).d('备注'),
  },
];

const tagHeaderDS = () => {
  return {
    selection: false,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'wmsOrganizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${commonCode}.tag`).d('标签'),
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
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('wmsOrganizationId'),
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
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${commonCode}.lot`).d('批次'),
      },
      {
        name: 'ownerObj',
        type: 'object',
        label: intl.get(`${preCode}.owner`).d('所有者'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'ownerId',
        type: 'string',
        bind: 'ownerObj.partyId',
      },
      {
        name: 'ownerName',
        type: 'string',
        bind: 'ownerObj.partyName',
        ignore: 'always',
      },
      {
        name: 'outerTag',
        type: 'string',
        label: intl.get(`${preCode}.outerTagCode`).d('外标签'),
      },
      {
        name: 'productTagCode',
        type: 'string',
        label: intl.get(`${preCode}.productTagCode`).d('产品标签'),
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get(`${commonCode}.resource`).d('资源'),
        ignore: 'always',
        lovCode: common.resource,
      },
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceName',
        type: 'string',
        bind: 'resourceObj.resourceName',
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${preCode}.document`).d('单据'),
        lovCode: common.document,
        ignore: 'always',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentObj.documentNum',
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'documentObj.documentId',
        ignore: 'always',
      },
      {
        name: 'tagStatusList',
        type: 'string',
        label: intl.get(`${preCode}.tagStatus`).d('标签状态'),
        lookupCode: lwmsTag.tagStatus,
      },
      {
        name: 'qcStatusList',
        type: 'string',
        label: intl.get(`${preCode}.qcStatus`).d('质量状态'),
        lookupCode: lwmsTag.qcStatus,
      },
      {
        name: 'tagType',
        type: 'string',
        label: intl.get(`${preCode}.tagType`).d('标签类型'),
        lookupCode: lwmsTag.tagType,
      },
      {
        name: 'loadThingFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.loadThingFlag`).d('是否装载'),
        defaultValue: true,
      },
      {
        name: 'poNumObj',
        type: 'object',
        label: intl.get(`${commonCode}.poNum`).d('采购订单号'),
        lovCode: common.document,
        ignore: 'always',
        lovPara: { documentClass: 'PO' },
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poNumObj.documentNum',
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'organizationObj') {
          record.set('warehouseObj', null);
        }
      },
    },
  };
};

const tagListDS = () => {
  return {
    selection: false,
    pageSize: 10,
    fields: commonFields,
    transport: {
      read: ({ data }) => {
        const { tagStatusList, qcStatusList } = data;

        return {
          url: generateUrlWithGetParam(`${HLOS_LWMS}/v1/${organizationId}/tag-things`, {
            tagStatusList,
            qcStatusList,
          }),
          data: {
            ...data,
            tagStatusList: undefined,
            qcStatusList: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const tagHisFields = [
  {
    name: 'eventId',
    label: intl.get(`${commonCode}.eventId`).d('事件ID'),
  },
  {
    name: 'eventType',
    label: intl.get(`${commonCode}.eventType`).d('事件类型'),
  },
  {
    name: 'eventTime',
    label: intl.get(`${preCode}.eventTime`).d('发生时间'),
  },
  {
    name: 'eventByName',
    label: intl.get(`${preCode}.eventBy`).d('提交者'),
  },
];
const tagHisListDS = () => {
  return {
    selection: false,
    pageSize: 10,
    fields: tagHisFields.concat(commonFields),
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LWMS}/v1/${organizationId}/tag-hiss`,
          data,
          method: 'GET',
        };
      },
    },
  };
};
const hisHeaderDS = () => {
  return {
    autoCreate: true,
    selection: false,
    fields: [
      {
        name: 'tagObj',
        type: 'object',
        label: intl.get(`${commonCode}.tag`).d('标签'),
        lovCode: lwmsTag.tag,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: () => ({
            needAll: 'Y',
          }),
        },
      },
      {
        name: 'tagId',
        type: 'string',
        bind: 'tagObj.tagId',
      },
      {
        name: 'tagCode',
        type: 'string',
        bind: 'tagObj.tagCode',
        ignore: 'always',
      },
    ],
  };
};

export {
  tagHeaderDS, // 实物标签查询条件
  tagListDS, // 实物列表
  hisHeaderDS, // 实物标签历史查询条件
  tagHisListDS, // 实物标签历史列表
};
