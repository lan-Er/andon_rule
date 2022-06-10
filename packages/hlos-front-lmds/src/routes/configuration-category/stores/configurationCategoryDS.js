/*
 * @Description: 配置类别-DataSet
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 16:11:20
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 17:30:27
 * @Copyright: Copyright (c) 2018, Hand
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LMDS}/v1/${organizationId}/template-categorys`;

/**
 * 配置类别-DataSet
 */
export const configurationCategoryDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'categoryTemplateFunction',
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
        name: 'categoryTemplateFunction',
        type: 'string',
        label: '功能',
        lookupCode: 'LMDS.CONFIG_TEMPLATE_FUNCTION',
      },
      {
        name: 'categoryTemplateCode',
        type: 'string',
        label: '类别编码',
        required: true,
      },
      {
        name: 'categoryTemplateName',
        type: 'string',
        label: '类别名字',
        required: true,
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
          url,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url,
          data: data[0],
          method: 'PUT',
        };
      },
      submit: ({ data }) => {
        return {
          url,
          data: data[0],
          method: 'POST',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => dataSet.query(),
    },
  };
};
