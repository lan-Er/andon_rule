/**
 * @Description: 工艺路线工序详情--组件tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-components`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'lineNum',
      type: 'string',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
      required: true,
    },
    {
      name: 'componentItemObj',
      type: 'object',
      label: intl.get(`${preCode}.componentItem`).d('组件物料'),
      lovCode: common.item,
      ignore: "always",
      required: true,
    },
    {
      name: 'componentItemId',
      type: 'string',
      bind: 'componentItemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'componentItemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'componentItemObj.description',
    },
    {
      name: 'componentQty',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${preCode}.componentQty`).d('组件数量'),
      required: true,
    },
    {
      name: 'bomObj',
      type: 'object',
      label: 'BOM',
      lovCode: common.bom,
      ignore: 'always',
    },
    {
      name: 'bomVersion',
      type: 'string',
      label: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
      bind: 'bomObj.bomVersion',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bomObj.bomId',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'bomObj.bomCode',
    },
    {
      name: 'bomLineNumObj',
      type: 'object',
      label: intl.get(`${preCode}.bomLineNum`).d('BOM行号'),
      lovCode: common.bomComponent,
      ignore: "always",
      dynamicProps: {
        lovPara: ({ record }) => ({
          componentId: record.get('componentItemId'),
          bomId: record.get('bomId'),
        }),
      },
    },
    {
      name: 'bomLineId',
      type: 'string',
      bind: 'bomLineNumObj.bomLineId',
    },
    {
      name: 'bomLineNum',
      type: 'string',
      bind: 'bomLineNumObj.bomLineNum',
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
      transformRequest: val => moment(val).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: val => val && moment(val).format(DEFAULT_DATE_FORMAT),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if(name === 'componentItemObj' || name === 'bomObj') {
        record.set('bomLineNumObj', null);
      }
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
