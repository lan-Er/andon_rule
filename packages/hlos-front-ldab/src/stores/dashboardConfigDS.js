/*
 * @Description: 看板配置--DashboardConfigDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-05-22 11:20:42
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LDAB } from 'hlos-front/lib/utils/config';
import { codeValidator, positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import { DataSet } from 'choerodon-ui/pro';

const intlPrefix = 'ldab.dashboardConfig';
const tenantId = getCurrentOrganizationId();
const dashboardUrl = `${HLOS_LDAB}/v1/${tenantId}/dashboard-settings`;
const settingDetailUrl = `${HLOS_LDAB}/v1/${tenantId}/dashboard-settings/get-dashboard`;
const cardUrl = `${HLOS_LDAB}/v1/${tenantId}/dashboard-cards`;
const { common, ldabDashboardConfig } = codeConfig.code;

export function dashboardSettingDSConfig(mode = 'list') {
  return {
    autoCreate: mode !== 'list',
    selection: false,
    transport: {
      read: () => ({
        url: mode === 'list' ? dashboardUrl : settingDetailUrl,
        method: 'GET',
      }),
      submit: ({ data }) => ({
        url: dashboardUrl,
        data: {
          ...data[0],
          tenantId,
        },
        method: 'PUT',
      }),
    },
    queryFields: [
      {
        name: 'dashboardCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardCode`).d('看板'),
      },
      {
        name: 'dashboardName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardName`).d('看板名称'),
      },
      {
        name: 'dashboardClass',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardClass,
        label: intl.get(`${intlPrefix}.model.dashboardClass`).d('看板大类'),
      },
      {
        name: 'dashboardType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardType,
        label: intl.get(`${intlPrefix}.model.dashboardType`).d('看板类型'),
      },
      {
        name: 'displayTerminalType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardDisplayTerminalType,
        label: intl.get(`${intlPrefix}.model.displayTerminalType`).d('展示终端类型'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        ignore: 'always',
        lovCode: common.organization,
        label: intl.get(`${intlPrefix}.model.organization`).d('限定组织'),
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
    ],
    fields: [
      {
        name: 'dashboardClass',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardClass,
        label: intl.get(`${intlPrefix}.model.dashboardClass`).d('看板大类'),
        required: true,
      },
      {
        name: 'dashboardType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardType,
        label: intl.get(`${intlPrefix}.model.dashboardType`).d('看板类型'),
        required: true,
      },
      {
        name: 'dashboardCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardCode`).d('看板'),
        validator: codeValidator,
        maxLength: CODE_MAX_LENGTH,
        required: true,
      },
      {
        name: 'dashboardName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardName`).d('看板名称'),
        required: true,
      },
      {
        name: 'dashboardAlias',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardAlias`).d('看板简称'),
      },
      {
        name: 'description',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.description`).d('看板描述'),
      },
      {
        name: 'displayTerminalType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardDisplayTerminalType,
        label: intl.get(`${intlPrefix}.model.displayTerminalType`).d('展示终端类型'),
      },
      {
        name: 'displayTerminal',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.displayTerminal`).d('展示终端'),
      },
      {
        name: 'fixedResolution',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.fixedResolution`).d('固定分辨率'),
        validator(value) {
          if (value === '' || value === undefined || value === null) {
            return true;
          }
          const reg = /^\d+\*\d+$/;
          if (!reg.test(value)) {
            return intl
              .get(`${intlPrefix}.view.message.invalid`)
              .d('格式必须满足1024*768,中间和前后不可包含空格');
          }
          return true;
        },
      },
      {
        name: 'logoUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.logo`).d('LOGO'),
      },
      {
        name: 'noticeMsg',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.noticeMsg`).d('通知信息'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        ignore: 'always',
        lovCode: common.organization,
        label: intl.get(`${intlPrefix}.model.organization`).d('限定组织'),
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'dashboardControl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.dashboardControl`).d('看板扩展信息'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
        defaultValue: true,
      },
    ],
  };
}

export function dashboardCardDSConfig() {
  return {
    selection: false,
    pageSize: 100,
    transport: {
      read: () => ({
        url: cardUrl,
        method: 'GET',
      }),
    },
    fields: [
      {
        name: 'cardNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.cardNum`).d('序号'),
      },
      {
        name: 'cardCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.cardCode`).d('卡片'),
        validator: codeValidator,
        maxLength: CODE_MAX_LENGTH,
        required: true,
      },
      {
        name: 'cardTitle',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.cardTitle`).d('卡片标题'),
        required: true,
      },
      {
        name: 'cardType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardCardType,
        label: intl.get(`${intlPrefix}.model.cardType`).d('业务类型'),
        required: true,
      },
      {
        name: 'displayCardTitle',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.displayCardTitle`).d('是否显示标题'),
      },
      {
        name: 'cardTemplate',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.cardTemplate`).d('卡片模板'),
      },
      {
        name: 'cardDataType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardCardDataType,
        label: intl.get(`${intlPrefix}.model.cardDataType`).d('卡片数据类型'),
        required: true,
      },
      {
        name: 'cardLength',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.cardLength`).d('长（厘米）'),
        validator: positiveNumberValidator,
      },
      {
        name: 'cardWidth',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.cardWidth`).d('宽（厘米）'),
        validator: positiveNumberValidator,
      },
      {
        name: 'cardLocationX',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.axis.x`).d('坐标X'),
        validator: positiveNumberValidator,
      },
      {
        name: 'cardLocationY',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.axis.y`).d('坐标Y'),
        validator: positiveNumberValidator,
      },
      {
        name: 'refreshType',
        type: 'string',
        lookupCode: ldabDashboardConfig.dashboardCardRefreshType,
        label: intl.get(`${intlPrefix}.model.refreshType`).d('刷新方式'),
      },
      {
        name: 'refreshInterval',
        type: 'string',
        min: 0,
        label: intl.get(`${intlPrefix}.model.refreshInterval`).d('刷新间隔时间（秒 ）'),
      },
      {
        name: 'loopDisplay',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.loopDisplay`).d('是否滚动刷新'),
      },
      {
        name: 'loopDisplayInterval',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.model.loopDisplayInterval`).d('滚动刷新间隔'),
      },
      {
        name: 'initialValue',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.initialValue`).d('初始值'),
      },
      {
        name: 'onlyInitialFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.onlyInitialFlag`).d('只显示初始值'),
      },
      {
        name: 'referenceValue',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.referenceValue`).d('参考值'),
      },
      {
        name: 'sourceReport',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.sourceReport`).d('数据来源报表'),
      },
      {
        name: 'cardControl',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.cardControl`).d('扩展信息'),
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
        defaultValue: true,
      },
    ],
  };
}

export function createAndEditDashboardConfig() {
  return {
    ...dashboardSettingDSConfig('detail'),
    primaryKey: 'dashboardId',
    autoQueryAfterSubmit: false,
    children: {
      cardLineList: new DataSet(dashboardCardDSConfig()),
    },
  };
}
