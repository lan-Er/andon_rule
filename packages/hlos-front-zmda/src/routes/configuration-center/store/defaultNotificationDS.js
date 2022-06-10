/**
 * @Description: 默认通知规则DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-31 16:25:00
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { zmdaConfigCenter } = codeConfig.code;
const intlPrefix = 'zmda.configurationCenter.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/notification-rules`;

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

const getTemplateCode = (type) => {
  let code;
  switch (type) {
    case 'PO':
      code = 'ZCOM.ORDER.DEFAULT.NOTIFICATION';
      break;
    case 'DELIVERY_APPLY':
      code = 'ZCOM.DELIVERY_APPLY.DEFAULT.NOTIFICATION';
      break;
    case 'DELIVERY_ORDER':
      code = 'ZCOM.DELIVERY.DEFAULT.NOTIFICATION';
      break;
    case 'QUOTATION_ORDER':
      code = 'ZCOM.QUOTATION.DEFAULT.NOTIFICATION';
      break;
    case 'WITHHOLDING_ORDER':
      code = 'ZCOM.WITHHOLDING.DEFAULT.NOTIFICATION';
      break;
    case 'VERIFICATION_ORDER':
      code = 'ZCOM.VERIFICATION.DEFAULT.NOTIFICATION';
      break;
    default:
      code = '';
  }
  return code;
};

// 获取多选下拉框传给接口所需格式的数组数据
const getSelectedList = (data, record, fieldName) => {
  const arr =
    data && data.length
      ? data.map((v) => {
          return {
            [`${fieldName}Code`]: v,
            [`${fieldName}Meaning`]: record.fields.get(`${fieldName}List`).getText(v),
          };
        })
      : [];
  return arr;
};

// 获取多选下拉框组件所需格式的数组数据
const getSelectedData = (data, field) => {
  const arr = data && data.length ? data.map((v) => v[field]) : [];
  return arr;
};

const DefaultNotificationConfigDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'notificationOrderType',
      type: 'string',
      lookupCode: zmdaConfigCenter.notificationOrderType,
      label: intl.get(`${intlPrefix}.notificationOrderType`).d('单据类型'),
      required: true,
    },
    {
      name: 'notificationStatusList',
      type: 'string',
      label: intl.get(`${intlPrefix}.notificationStatus`).d('通知状态'),
      dynamicProps: {
        disabled: ({ record }) => !record?.get('notificationOrderType'),
        lookupCode: ({ record }) => getNotificationStatusCode(record?.get('notificationOrderType')),
      },
      transformRequest: (val, object) => getSelectedList(val, object, 'notificationStatus'),
      transformResponse: (val) => getSelectedData(val, 'notificationStatusCode'),
      multiple: true,
      required: true,
    },
    {
      name: 'notificationTypeList',
      type: 'string',
      lookupCode: zmdaConfigCenter.notificationType,
      label: intl.get(`${intlPrefix}.notificationType`).d('消息类型'),
      transformRequest: (val, object) => getSelectedList(val, object, 'notificationType'),
      transformResponse: (val) => getSelectedData(val, 'notificationTypeCode'),
      multiple: true,
      defaultValue: ['EMAIL'],
    },
    {
      name: 'notificationContactsFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.notificationContactsFlag`).d('通知联系人'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
    },
    {
      name: 'notificationOperatorFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.notificationOperatorFlag`).d('通知操作用户'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 0,
    },
    {
      name: 'notificationCreatorFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.notificationCreatorFlag`).d('通知创建用户'),
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
  transport: {
    read: ({ data }) => {
      return {
        url,
        data: {
          ...data,
          defaultFlag: 1,
        },
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          defaultFlag: 1,
          templateCode: getTemplateCode(data[0].notificationOrderType),
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          defaultFlag: 1,
          templateCode: getTemplateCode(data[0].notificationOrderType),
        },
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
});

export { DefaultNotificationConfigDS };
