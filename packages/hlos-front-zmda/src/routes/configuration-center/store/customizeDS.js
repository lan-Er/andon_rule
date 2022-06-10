/**
 * @Description: 配置中心DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-11 17:28:54
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { zmdaConfigCenter } = codeConfig.code;
const intlPrefix = 'zmda.configurationCenter.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/notification-rules`;

// const statusLovList = [
//   {
//     name: 'PO',
//     lookupCode: zmdaConfigCenter.poStatus,
//   },
//   {
//     name: 'DELIVERY_APPLY',
//     lookupCode: zmdaConfigCenter.deliveryApplyStatus,
//   },
//   {
//     name: 'DELIVERY_ORDER',
//     lookupCode: zmdaConfigCenter.deliveryOrderStatus,
//   },
//   {
//     name: 'QUOTATION_ORDER',
//     lookupCode: zmdaConfigCenter.quotationOrderStatus,
//   },
//   {
//     name: 'WITHHOLDING_ORDER',
//     lookupCode: zmdaConfigCenter.withholdingOrderStatus,
//   },
//   {
//     name: 'VERIFICATION_ORDER',
//     lookupCode: zmdaConfigCenter.verificationOrderStatus,
//   },
// ];

const getNotificationStatusCode = (type) => {
  let code;
  switch (type) {
    case 'PO':
      code = zmdaConfigCenter.poStatus;
      break;
    case 'DELIVERY_APPLY':
      code = zmdaConfigCenter.deliveryApplyStatus;
      break;
    case 'DELIVERY_ORDER':
      code = zmdaConfigCenter.deliveryOrderStatus;
      break;
    case 'QUOTATION_ORDER':
      code = zmdaConfigCenter.quotationOrderStatus;
      break;
    case 'WITHHOLDING_ORDER':
      code = zmdaConfigCenter.withholdingOrderStatus;
      break;
    case 'VERIFICATION_ORDER':
      code = zmdaConfigCenter.verificationOrderStatus;
      break;
    default:
      code = '';
  }
  return code;
};

const customizeDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'notificationOrderType',
      type: 'string',
      lookupCode: zmdaConfigCenter.notificationOrderType,
      required: true,
      label: intl.get(`${intlPrefix}.notificationOrderType`).d('单据类型'),
    },
    {
      name: 'notificationStatusList',
      type: 'string',
      lookupCode: zmdaConfigCenter.quotationOrderStatus,
      multiple: true,
      required: true,
      label: intl.get(`${intlPrefix}.notificationStatusList`).d('通知状态'),
      transformRequest: (val, object) => {
        if (val && val.length) {
          return val.map((i) => ({
            notificationStatusCode: i,
            notificationStatusMeaning: object.fields.get('notificationStatusList').getText(i),
          }));
        }
        return null;
      },
      transformResponse: (val) => {
        if (val && val.length) {
          return val.map((i) => i.notificationStatusCode);
        }
        return null;
      },
      dynamicProps: {
        // lookupCode: ({ record }) => {
        //   const { notificationOrderType } = record?.data;
        //   if (notificationOrderType) {
        //     const filterData = statusLovList.filter((i) => i.name === notificationOrderType);
        //     return filterData.length && filterData[0].lookupCode;
        //   }
        //   return null;
        // },
        lookupCode: ({ record }) => getNotificationStatusCode(record?.get('notificationOrderType')),
        disabled: ({ record }) => !record?.get('notificationOrderType'),
      },
    },
    {
      name: 'notificationTypeList',
      type: 'string',
      lookupCode: zmdaConfigCenter.notificationType,
      multiple: true,
      required: true,
      label: intl.get(`${intlPrefix}.notificationTypeList`).d('消息类型'),
      transformRequest: (val, object) => {
        if (val && val.length) {
          return val.map((i) => ({
            notificationTypeCode: i,
            notificationTypeMeaning: object.fields.get('notificationTypeList').getText(i),
          }));
        }
        return null;
      },
      transformResponse: (val) => {
        if (val && val.length) {
          return val.map((i) => i.notificationTypeCode);
        }
        return null;
      },
    },
    {
      name: 'receiverTypeObj',
      type: 'object',
      lovCode: zmdaConfigCenter.receiver,
      label: intl.get(`${intlPrefix}.customer`).d('接收组'),
      lovPara: {
        tenantId: organizationId,
      },
      ignore: 'always',
    },
    {
      name: 'receiverTypeId',
      type: 'string',
      bind: 'receiverTypeObj.receiverTypeId',
    },
    {
      name: 'receiverTypeCode',
      type: 'string',
      bind: 'receiverTypeObj.typeCode',
    },
    {
      name: 'receiverTypeName',
      type: 'string',
      bind: 'receiverTypeObj.typeName',
    },
    {
      name: 'receiverUserObj',
      lovCode: zmdaConfigCenter.userOrg,
      type: 'object',
      label: intl.get(`${intlPrefix}.receiverUserObj`).d('指定用户'),
      lovPara: {
        tenantId: organizationId,
      },
      ignore: 'always',
    },
    {
      name: 'receiverUserId',
      type: 'string',
      bind: 'receiverUserObj.id',
    },
    {
      name: 'receiverUserCode',
      type: 'string',
      bind: 'receiverUserObj.loginName',
    },
    {
      name: 'receiverUserName',
      type: 'string',
      bind: 'receiverUserObj.realName',
    },
    {
      name: 'templateObj',
      type: 'object',
      lovCode: zmdaConfigCenter.messageTemplate,
      label: intl.get(`${intlPrefix}.templateObj`).d('消息模板'),
      ignore: 'always',
      textField: 'templateName',
      lovPara: {
        tenantId: organizationId,
      },
    },
    {
      name: 'templateId',
      type: 'string',
      bind: 'templateObj.templateId',
    },
    {
      name: 'templateCode',
      type: 'string',
      bind: 'templateObj.templateCode',
    },
    {
      name: 'templateName',
      type: 'string',
      bind: 'templateObj.templateName',
    },
    {
      name: 'executeDefaultFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.executeDefaultFlag`).d('继续执行默认规则'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url,
        data: {
          ...data,
          defaultFlag: 0,
        },
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          defaultFlag: 0,
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data,
        method: 'DELETE',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'notificationOrderType') {
        record.set('notificationStatusList', null);
      }
    },
  },
});

export { customizeDS };
