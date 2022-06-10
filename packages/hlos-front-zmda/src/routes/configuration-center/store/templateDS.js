/**
 * @Description: 打印模板设置
 * @Author: qifeng.deng@hand.com
 * @Date: 2021-07-06 18:17:32
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { zmdaConfigCenter } = codeConfig.code;
const intlPrefix = 'zmda.configurationCenter.model';
const organizationId = getCurrentOrganizationId();
// const HLOS_ZCOM = '/hzmc-communication-32184';
const url = `${HLOS_ZCOM}/v1/${organizationId}/print-rules`;

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

const templateDS = () => ({
  autoCreate: true,
  autoQuery: true,
  queryFields: [
    {
      name: 'templateCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.templateCode`).d('打印模板编号'),
    },
    {
      name: 'templateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.templateName`).d('打印模板名称'),
    },
    {
      name: 'printRuleType',
      type: 'string',
      lookupCode: zmdaConfigCenter.templateType,
      label: intl.get(`${intlPrefix}.printRuleType`).d('打印模板类型'),
    },
  ],
  fields: [
    {
      name: 'defaultFlag',
      type: 'number',
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
      required: true,
      label: intl.get(`${intlPrefix}.defaultFlag`).d('是否默认规则'),
    },
    {
      name: 'printRuleType',
      type: 'string',
      lookupCode: zmdaConfigCenter.templateType,
      // multiple: true,
      required: true,
      label: intl.get(`${intlPrefix}.printRuleType`).d('打印模板类型'),
      // transformRequest: (val, object) => {
      //   if (val && val.length) {
      //     return val.map((i) => ({
      //       notificationStatusCode: i,
      //       notificationStatusMeaning: object.fields.get('notificationStatusList').getText(i),
      //     }));
      //   }
      //   return null;
      // },
      // transformResponse: (val) => {
      //   if (val && val.length) {
      //     return val.map((i) => i.notificationStatusCode);
      //   }
      //   return null;
      // },
      // dynamicProps: {
      //   lookupCode: ({ record }) => {
      //     const { notificationOrderType } = record.data;
      //     if (notificationOrderType) {
      //       const filterData = statusLovList.filter((i) => i.name === notificationOrderType);
      //       return filterData.length && filterData[0].lookupCode;
      //     }
      //     return null;
      //   },
      //   // disabled: ({ record }) => !record.get('notificationOrderType'),
      // },
    },
    {
      name: 'templateCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.templateCode`).d('打印模板编号'),
      required: true,
    },
    {
      name: 'templateName',
      type: 'string',
      label: intl.get(`${intlPrefix}.templateName`).d('打印模板名称'),
    },
    {
      name: 'targetNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.targetNumber`).d('指定方编号'),
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('是否启用'),
      required: true,
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
    {
      name: 'tenantId',
      type: 'string',
      defaultValue: organizationId,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url,
        data: {
          ...data,
          // defaultFlag: 0,
        },
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          // defaultFlag: 0,
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
    // 当通知单据类型变更时将通知单状态列表置为null重置
    update: ({ name, record }) => {
      if (name === 'notificationOrderType') {
        record.set('notificationStatusList', null);
      }
    },
  },
});

export { templateDS };
