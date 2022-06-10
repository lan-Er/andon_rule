/**
 * @Description: PSI要素分配管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 13:54:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsPsiElementAssign, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.psiElementAssign.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/psi-element-assigns`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'assignType',
      type: 'string',
      label: intl.get(`${preCode}.assignType`).d('分配类型'),
      lookupCode: lmdsPsiElementAssign.assignType,
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${preCode}.source`).d('来源'),
      ignore: "always",
      lovCode: lmdsPsiElementAssign.source,
      dynamicProps: {
        lovPara: ({ record }) => ({
          assignType: record.get('assignType'),
        }),
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      bind: 'sourceObj.sourceId',
    },
    {
      name: 'sourceName',
      type: 'string',
      bind: 'sourceObj.sourceName',
    },
    {
      name: 'displayArea',
      type: 'string',
      label: intl.get(`${preCode}.displayArea`).d('显示区域'),
      lookupCode: common.psiDisplayArea,
    },
  ],
  fields: [
    {
      name: 'assignType',
      type: 'string',
      label: intl.get(`${preCode}.assignType`).d('分配类型'),
      lookupCode: lmdsPsiElementAssign.assignType,
      required: true,
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${preCode}.source`).d('来源'),
      ignore: "always",
      lovCode: lmdsPsiElementAssign.source,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          assignType: record.get('assignType'),
        }),
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      bind: 'sourceObj.sourceId',
    },
    {
      name: 'sourceName',
      type: 'string',
      bind: 'sourceObj.sourceName',
    },
    {
      name: 'elementObj',
      type: 'object',
      label: intl.get(`${preCode}.elementCode`).d('要素编码'),
      lovCode: lmdsPsiElementAssign.psiElement,
      required: true,
      ignore: 'always',
    },
    {
      name: 'elementId',
      type: 'string',
      bind: 'elementObj.elementId',
    },
    {
      name: 'elementCode',
      type: 'string',
      bind: 'elementObj.elementCode',
    },
    {
      name: 'displayAreaMeaning',
      type: 'string',
      label: intl.get(`${preCode}.displayArea`).d('显示区域'),
      bind: 'elementObj.meaning',
    },
    {
      name: 'mainCategory',
      type: 'string',
      label: intl.get(`${preCode}.mainCategory`).d('大类'),
      bind: 'elementObj.mainCategory',
    },
    {
      name: 'subCategory',
      type: 'string',
      label: intl.get(`${preCode}.subCategory`).d('小类'),
      bind: 'elementObj.subCategory',
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${commonCode}.description`).d('描述'),
      bind: 'elementObj.description',
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('显示顺序'),
      bind: 'elementObj.orderByCode',
    },
    {
      name: 'displayFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.displayFlag`).d('是否显示'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'post',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'put',
      };
    },
    destroy: ({ data }) => {
      const delObj = {
        assignId: data[0].assignId,
        _token: data[0]._token,
      };
      return {
        url,
        data: delObj,
        method: 'delete',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if(name === 'assignType') {
        record.set('sourceObj', null);
      }
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
