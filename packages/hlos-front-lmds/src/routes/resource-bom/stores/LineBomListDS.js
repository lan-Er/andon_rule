/*
 * @Author: zhang yang
 * @Description:  明细 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsResourceBom } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceBom.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/resource-bom-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'bomLineNum',
      type: 'number',
      label: intl.get(`${preCode}.bomLineNum`).d('行号'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'subResource',
      type: 'object',
      label: intl.get(`${preCode}.subResource`).d('下级资源'),
      lovCode: lmdsResourceBom.resource,
      ignore: 'always',
      required: true,
    },
    {
      name: 'subResourceId',
      type: 'string',
      bind: 'subResource.resourceId',
    },
    {
      name: 'subResourceCode',
      type: 'string',
      bind: 'subResource.resourceCode',
    },
    {
      name: 'subResourceName',
      type: 'string',
      bind: 'subResource.resourceName',
    },
    {
      name: 'bomUsage',
      type: 'number',
      label: intl.get(`${preCode}.bomUsage`).d('用量'),
      validator: positiveNumberValidator,
      required: true,
    },
    {
      name: 'spareQty',
      type: 'number',
      label: intl.get(`${preCode}.spareQty`).d('备件用量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'substituteFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.substituteFlag`).d('替代标识'),
    },
    {
      name: 'substituteGroup',
      type: 'string',
      label: intl.get(`${preCode}.substituteGroup`).d('替代组'),
    },
    {
      name: 'substitutePriority',
      type: 'number',
      label: intl.get(`${preCode}.substitutePriority`).d('替代优先级'),
      min: 1,
      step: 1,
    },
    {
      name: 'supplier',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: lmdsResourceBom.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplier.partyId',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplier.partyNumber',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplier.partyName',
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      max: 'endDate',
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
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
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
