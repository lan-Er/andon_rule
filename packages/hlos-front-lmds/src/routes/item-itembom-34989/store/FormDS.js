import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getTlsRecord, convertFieldName } from 'hlos-front/lib/utils/utils';
import moment from 'moment';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/item-boms`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
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
      label: intl.get(`${commonCode}.itemDescription`).d('物料描述'),
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.categoryObj`).d('物料类别'),
      lovCode: common.categories,
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organization.meOuCode',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.itemMe,
      ignore: 'always',
      required: true,
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
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'item.itemDescription',
    },
    {
      name: 'itemCategory',
      type: 'string',
      label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
    },
    {
      name: 'bom',
      type: 'object',
      lovCode: common.bom,
      label: intl.get(`${preCode}.bom`).d('BOM'),
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
      label: intl.get(`${preCode}.bomCode`).d('BOM描述'),
      bind: 'bom.bomDescription',
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('是否标识'),
      renderer: yesOrNoRender,
    },
    {
      name: 'startDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'endDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
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
        method: 'POST',
      };
    },
    update: ({ data }) => {
      console.log(data[0]);
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
  },
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
  events: {
    update: ({ dataSet }) => {
      console.log(dataSet);
    },
  },
});
