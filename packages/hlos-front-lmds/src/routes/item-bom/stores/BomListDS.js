/**
 * @Description: Bom管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-22 10:42:44
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';

import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/boms`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'bomType',
      type: 'string',
      lookupCode: 'LMDS.BOM_TYPE',
      label: intl.get(`${preCode}.bomType`).d('BOM类型'),
      multiple: true,
      // defaultValue: ['PRODCUT', 'NAME'],
    },
    {
      name: 'bomCode',
      type: 'string',
      label: 'BOM',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'componentItemObj',
      type: 'object',
      label: intl.get(`${commonCode}.component`).d('组件'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'componentItemId',
      type: 'string',
      bind: 'componentItemObj.itemId',
    },
  ],
  fields: [
    {
      name: 'bomTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.bomType`).d('BOM类型'),
      // lookupCode: lmdsBom.bomtype,
      // required: true,
    },
    {
      name: 'bomCode',
      type: 'string',
      label: 'BOM',
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${common}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'bomVersion',
      type: 'string',
      label: intl.get(`${preCode}.bomVersion`).d('版本'),
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
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
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
    },
  ],
  transport: {
    read: ({ data }) => {
      const { bomType: typeList } = data;
      return {
        url: generateUrlWithGetParam(url, {
          typeList,
        }),
        data: {
          ...data,
          bomType: undefined,
        },
        method: 'get',
      };
    },
    create: () => {
      return {
        url,
        method: 'post',
      };
    },
    update: () => {
      return {
        url,
        method: 'put',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
