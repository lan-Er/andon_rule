/**
 * @Description: 生产版本--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-09 20:25:14
 * @LastEditors: yiping.liu
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { descValidator } from 'hlos-front/lib/utils/utils';
// import statusConfig from '@/common/statusConfig';

const preCode = 'lmds.productionVersion';
const commonCode = 'lmds.common';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
// const { lovPara: { itemMe } } = statusConfig.statusValue.lmds;
const url = `${HLOS_LMDS}/v1/${organizationId}/production-versions`;

export default () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.item`).d('物料'),
      ignore: 'always',
      lovCode: common.itemMe,
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
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.model.category`).d('类别'),
      lovCode: common.categories,
      // lovPara: { categorySetCode: itemMe },
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
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      ignore: 'always',
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
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.item`).d('物料'),
      ignore: 'always',
      lovCode: common.itemMe,
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
      type: 'intl',
      label: intl.get(`${preCode}.model.itemDescription`).d('物料描述'),
      validator: descValidator,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.model.category`).d('类别'),
      lovCode: common.categories,
      // lovPara: { categorySetCode: itemMe },
      ignore: 'always',
      dynamicProps: ({ record }) => {
        return {
          required: isEmpty(record.get('itemObj')),
        };
      },
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
      name: 'productionVersion',
      type: 'string',
      label: intl.get(`${preCode}.model.prodVersion`).d('生产版本'),
      required: true,
    },
    {
      name: 'bomVersionObj',
      type: 'object',
      label: intl.get(`${preCode}.model.bomVersion`).d('BOM版本'),
      lovCode: common.itemBom,
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        let lovPara = {};
        if (!isEmpty(record.get('itemObj')) && isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
          };
        } else if (isEmpty(record.get('itemObj')) && !isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            categoryId: record.get('categoryObj') && record.get('categoryObj').categoryId,
          };
        } else if (!isEmpty(record.get('itemObj')) && !isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
            categoryId: record.get('categoryObj') && record.get('categoryObj').categoryId,
          };
        }
        return {
          lovPara,
        };
      },
    },
    {
      name: 'bomId',
      type: 'string',
      bind: 'bomVersionObj.bomId',
    },
    {
      name: 'bomVersion',
      type: 'string',
      bind: 'bomVersionObj.bomVersion',
    },
    {
      name: 'routingVersionObj',
      type: 'object',
      label: intl.get(`${preCode}.model.routingVersionObj`).d('工艺版本'),
      lovCode: common.itemRouting,
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        let lovPara = {};
        if (!isEmpty(record.get('itemObj')) && isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
          };
        } else if (isEmpty(record.get('itemObj')) && !isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            categoryId: record.get('categoryObj') && record.get('categoryObj').categoryId,
          };
        } else if (!isEmpty(record.get('itemObj')) && !isEmpty(record.get('categoryObj'))) {
          lovPara = {
            organizationId: record.get('organizationObj') && record.get('organizationObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
            categoryId: record.get('categoryObj') && record.get('categoryObj').categoryId,
          };
        }
        return {
          lovPara,
        };
      },
    },
    {
      name: 'routingId',
      type: 'string',
      bind: 'routingVersionObj.routingId',
    },
    {
      name: 'routingVersion',
      type: 'string',
      bind: 'routingVersionObj.routingVersion',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.model.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.model.startDate`).d('开始日期'),
      defaultValue: NOW_DATE,
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('endDate'))) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.model.endDate`).d('结束日期'),
      min: 'startDate',
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ record, name, value }) => {
      if (name === 'itemObj') {
        if (!isEmpty(record.get('itemObj'))) {
          record.set('itemDescription', value.itemDescription);
        } else {
          record.set('itemDescription', null);
        }
      }
    },
  },
});
