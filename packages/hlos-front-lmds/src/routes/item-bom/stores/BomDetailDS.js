/**
 * @Description: Bom详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 12:41:54
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ChildrenDS from './ComponentListDS';

const { lmdsBom, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/boms`;

export default () => ({
  primaryKey: 'bomId',
  children: {
    bomComponentList: new DataSet({ ...ChildrenDS() }),
  },
  fields: [
    {
      name: 'bomType',
      type: 'string',
      label: intl.get(`${preCode}.bomType`).d('BOM类型'),
      lookupCode: lmdsBom.bomtype,
      required: true,
    },
    {
      name: 'bomCode',
      type: 'string',
      label: 'BOM',
      validator: codeValidator,
      maxLength: 60,
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.bomDesc`).d('BOM描述'),
      validator: descValidator,
    },
    {
      name: 'bomVersion',
      type: 'string',
      label: intl.get(`${preCode}.bomVersion`).d('版本'),
      required: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.itemMe,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          meOuId: record.get('organizationObj') && record.get('organizationObj').meOuId,
        }),
      },
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.itemDescription',
    },
    {
      name: 'alternate',
      type: 'string',
      label: intl.get(`${preCode}.alternate`).d('替代项'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
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
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
      defaultValue: '2100-1-1',
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
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('itemObj', null);
      }
    },
  },
});
