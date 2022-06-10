/*
 * @Author: zhang yang
 * @Description: 物料bom  - dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 16:38:27
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import { getTlsRecord, convertFieldName } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemBom.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/item-boms`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovCode: common.categories,
      lovPara: {
        categorySetCode: 'ITEM_ME',
      },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
      ignore: 'always',
    },
  ],
  fields: [
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organization.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      dynamicProps: ({ record }) => {
        if (record.get('organization') !== undefined && record.get('organization') !== null) {
          return {
            lovPara: {
              meOuId: `${record.get('organization').meOuId}`,
            },
          };
        }
      },
      lovCode: common.itemMe,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      bind: 'item.itemDescription',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'itemCategory',
      type: 'object',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
      lovPara: { categorySetCode: 'ITEM_ME' },
      lovCode: common.categories,
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'itemCategory.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'itemCategory.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'itemCategory.categoryName',
    },
    {
      name: 'bom',
      type: 'object',
      lovCode: common.bom,
      label: intl.get(`${preCode}.bom`).d('BOM'),
      dynamicProps: ({ record }) => {
        if (record.get('organization') !== undefined && record.get('organization') !== null) {
          return {
            lovPara: {
              organizationId: `${record.get('organization').meOuId}`,
            },
          };
        }
      },
      required: true,
      ignore: 'always',
    },
    {
      name: 'bomCode',
      type: 'string',
      bind: 'bom.bomCode',
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bom.bomId',
    },
    {
      name: 'bomDescription',
      type: 'string',
      bind: 'bom.bomDescription',
      label: intl.get(`${preCode}.bomDesc`).d('BOM描述'),
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('主要标识'),
      defaultValue: true,
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
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'organization') {
        record.set('item', null);
        record.set('bom', null);
      }
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'itembom', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: {
          _token,
          fieldName,
        },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => {
      return {
        url: commonUrl,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      console.log(data[0]);
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
