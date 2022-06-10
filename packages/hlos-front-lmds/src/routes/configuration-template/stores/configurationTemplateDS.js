/*
 * @Description: 配置模版-DataSet
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 16:11:20
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 17:30:27
 * @Copyright: Copyright (c) 2018, Hand
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

/**
 * 配置模版列表-DS
 */
export const configurationTemplateDS = () => {
  return {
    autoQuery: false,
    selection: false,
    queryFields: [
      {
        name: 'templateFunction',
        type: 'string',
        label: '功能',
        lookupCode: 'LMDS.CONFIG_TEMPLATE_FUNCTION',
      },
      {
        name: 'templateCode',
        type: 'string',
        label: '模板编码',
      },
      {
        name: 'templateName',
        type: 'string',
        label: '模板名字',
      },
    ],
    fields: [
      {
        name: 'templateFunction',
        type: 'string',
        label: '功能',
        lookupCode: 'LMDS.CONFIG_TEMPLATE_FUNCTION',
      },
      {
        name: 'templateCode',
        type: 'string',
        label: '模板编码',
      },
      {
        name: 'templateName',
        type: 'string',
        label: '模板名字',
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: '是否有效',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/page-templates`,
          method: 'GET',
        };
      },
    },
  };
};

/**
 * 配置模版明细头-DS
 */
export const configurationTemplateDetailHeadDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    selection: false,
    fields: [
      {
        name: 'templateCode',
        type: 'string',
        label: '模板编码',
        required: true,
      },
      {
        name: 'templateName',
        type: 'string',
        label: '模板名字',
      },
      {
        name: 'templateFunction',
        type: 'string',
        label: '功能',
        lookupCode: 'LMDS.CONFIG_TEMPLATE_FUNCTION',
        required: true,
      },
      {
        name: 'category',
        type: 'object',
        label: '类别',
        lovCode: 'LMDS.CONFIG_TEMPLATE_CATE',
        cascadeMap: { templateFunction: 'templateFunction' },
        required: true,
        ignore: 'always',
      },
      {
        name: 'categoryTemplateId',
        type: 'string',
        bind: 'category.categoryTemplateId',
      },
      {
        name: 'categoryTemplateName',
        type: 'string',
        bind: 'category.categoryName',
      },
      {
        name: 'categoryTemplateCode',
        type: 'string',
        bind: 'category.categoryCode',
      },
      {
        name: 'templateTable',
        type: 'string',
        label: '表',
        required: true,
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: '是否有效',
        defaultValue: true,
      },
    ],
    transport: {
      read: ({ dataSet }) => {
        const {
          templateCode,
          templateName,
          templateFunction,
          categoryTemplateId,
          categoryTemplateName,
          categoryTemplateCode,
          templateTable,
        } = dataSet.toData()[0];
        const { type } = dataSet.queryParameter;

        if (type === 'init') {
          return {
            url: `${HLOS_LMDS}/v1/${organizationId}/customization-templates/init-template`,
            params: {
              templateCode,
              templateName,
              templateFunction,
              categoryTemplateId,
              categoryTemplateName,
              categoryTemplateCode,
              templateTable,
            },
            method: 'GET',
          };
        }
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/customization-templates/query-template`,
          params: {},
          method: 'GET',
        };
      },
      submit: ({ data }) => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/category-pages`,
          method: 'POST',
          data: data[0],
        };
      },
    },
  };
};

/**
 * 配置模版明细行-DS
 */
export const configurationTemplateDetailDLineS = () => {
  return {
    autoQuery: false,
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'customizationCode',
        type: 'string',
        label: '字段编码',
      },
      {
        name: 'customizationName',
        type: 'string',
        label: '字段名字',
      },
      {
        name: 'customizationDesc',
        type: 'string',
        label: '描述',
      },
      {
        name: 'mustInputFlag',
        type: 'boolean',
        label: '是否必输',
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: '配置是否有效',
      },
    ],
  };
};
