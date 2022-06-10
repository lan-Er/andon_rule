/*
 * @Author: zhang yang
 * @Description: 工序 明细 Component DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsOperation } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.operation.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-components`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'lineNum',
      type: 'number',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'componentItem',
      type: 'object',
      label: intl.get(`${preCode}.componentItem`).d('组件物料'),
      lovCode: lmdsOperation.componentItem,
      ignore: 'always',
      required: true,
    },
    {
      name: 'componentItemId',
      type: 'string',
      bind: 'componentItem.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'componentItem.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'componentItem.description',
    },
    {
      name: 'componentQty',
      type: 'number',
      label: intl.get(`${preCode}.componentQty`).d('组件数量'),
      min: 0.001,
      step: 0.001,
      required: true,
    },
    {
      name: 'bom',
      type: 'object',
      label: intl.get(`${preCode}.bom`).d('BOM'),
      lovCode: lmdsOperation.bom,
      ignore: 'always',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bom.bomId',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'bom.bomCode',
    },
    {
      name: 'bomVersion',
      type: 'string',
      label: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
      bind: 'bom.bomVersion',
    },
    {
      name: 'bomLineObj',
      type: 'object',
      label: intl.get(`${preCode}.bomLine`).d('BOM行号'),
      lovCode: lmdsOperation.bomLine,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        if (record.get('bomId') !== undefined) {
          return {
            lovPara: { bomId: record.get('bomId') },
          };
        }
      },
    },
    {
      name: 'bomLineId',
      type: 'string',
      bind: 'bomLineObj.bomLineId',
    },
    {
      name: 'bomLineNum',
      type: 'string',
      bind: 'bomLineObj.bomLineNum',
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
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      format: DEFAULT_DATE_FORMAT,
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
