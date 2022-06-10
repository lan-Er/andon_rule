/*
 * @Description: 配置分配-DataSet
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
 * 配置分配-DataSet
 */
export const configurationAssignDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'tenant',
        type: 'object',
        label: '租户',
        lovCode: 'HPFM.TENANT_PAGING',
        ignore: 'always',
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenant.tenantId',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenant.tenantName',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenant.tenantNum',
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
        name: 'tenant',
        type: 'object',
        label: '租户',
        lovCode: 'HPFM.TENANT_PAGING',
        ignore: 'always',
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenant.tenantId',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenant.tenantName',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenant.tenantNum',
      },
      {
        name: 'categoryTemplateFunction',
        type: 'object',
        label: '功能',
        lovCode: 'LMDS.CONFIG_TEMPLATE_FUNCTION',
      },
      {
        name: 'categoryTemplateFunctionId',
        type: 'string',
        bind: 'categoryTemplateFunction.functionId',
      },
      {
        name: 'categoryTemplateFunctionName',
        type: 'string',
        bind: 'categoryTemplateFunction.categoryTemplateFunctionName',
        ignore: 'always',
      },
      {
        name: 'categoryTemplateName',
        type: 'string',
        label: '类别',
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
        name: 'categoryTemplateDesc',
        type: 'string',
        label: '描述',
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: '是否有效',
        defaultValue: true,
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/category-pages/list`,
          method: 'GET',
        };
      },
    },
  };
};

/**
 * 配置分配明细头-DataSet
 */
export const configurationAssignDetailHeadDS = () => {
  return {
    autoQuery: false,
    selection: false,
    autoCreate: true,
    fields: [
      {
        name: 'tenant',
        type: 'object',
        label: '租户',
        lovCode: 'HPFM.TENANT_PAGING',
        ignore: 'always',
        required: true,
      },
      {
        name: 'tenantId',
        type: 'string',
        bind: 'tenant.tenantId',
      },
      {
        name: 'tenantName',
        type: 'string',
        bind: 'tenant.tenantName',
      },
      {
        name: 'tenantNum',
        type: 'string',
        bind: 'tenant.tenantNum',
      },
      {
        name: 'categoryPageCode',
        type: 'string',
        label: '配置编码',
        required: true,
      },
      {
        name: 'categoryPageDesc',
        type: 'string',
        label: '描述',
      },
      {
        name: 'category',
        type: 'object',
        label: '配置类别',
        lovCode: 'LMDS.CONFIG_TEMPLATE_CATE',
        ignore: 'always',
        required: true,
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
        name: 'template',
        type: 'object',
        label: '模板编码',
        lovCode: 'LMDS.CONFIG_TEMPLATE',
        cascadeMap: { categoryTemplateId: 'categoryTemplateId' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'templateName',
        type: 'string',
        label: '模版名称',
        bind: 'template.templateName',
      },
      {
        name: 'templateCode',
        type: 'string',
        bind: 'template.templateCode',
      },
      {
        name: 'templateId',
        type: 'string',
        bind: 'template.templateId',
      },
      {
        name: 'enabledFlag',
        type: 'boolean',
        label: '是否有效',
        defaultValue: true,
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/category-pages/template-detail`,
          method: 'GET',
        };
      },
    },
  };
};
