/*
 * @Descripttion:平台产品
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-07-28 10:33:55
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-07-28 14:03:40
 */
import intl from 'utils/intl';
import { generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZMDC } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmdc.platformProduct';
const { common, platformProduct } = codeConfig.code;
const url = `${HLOS_ZMDC}/v1/product-versions`;
const unpublishUrl = `${HLOS_ZMDC}/v1/product-versions/unpublished-list`;

const publishedListDS = () => ({
  queryFields: [
    {
      name: 'productName',
      type: 'string',
      label: intl.get(`${intlPrefix}.productName`).d('产品名称'),
    },
    {
      name: 'masterUserObjList',
      type: 'object',
      lovCode: common.siteUser,
      multiple: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.masterUserObjList`).d('产品团队'),
    },
    {
      name: 'productVersionMasterArray',
      type: 'string',
      bind: 'masterUserObjList.id',
    },
  ],
  fields: [
    {
      name: 'productName',
      type: 'string',
      label: intl.get(`${intlPrefix}.productName`).d('产品名称'),
    },
    {
      name: 'versionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionCode`).d('版本号'),
    },
    {
      name: 'productVersionMaster',
      type: 'string',
      label: intl.get(`${intlPrefix}.masterUserName`).d('产品团队'),
    },
    {
      name: 'productIcon',
      type: 'string',
      label: intl.get(`${intlPrefix}.productIcon`).d('产品图标'),
    },
    {
      name: 'productIntroduction',
      type: 'string',
      label: intl.get(`${intlPrefix}.productIntroduction`).d('产品简介'),
    },
    // {
    //   name: 'createBy',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.createBy`).d('创建人'),
    // },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('上架状态'),
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
    },
    {
      name: 'productVersionStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.productVersionStatus`).d('版本状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { productVersionMasterArray } = data;
      return {
        data: {
          ...data,
          lastVersionFlag: 1,
          productVersionMasterArray: null,
        },
        url: generateUrlWithGetParam(url, {
          productVersionMasterArray,
        }),
        method: 'GET',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

const unpublishListDS = () => ({
  queryFields: [
    {
      name: 'productName',
      type: 'string',
      required: true,
      label: intl.get(`${intlPrefix}.productName`).d('产品名称'),
    },
    {
      name: 'masterUserObjList',
      type: 'object',
      lovCode: common.siteUser,
      multiple: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.masterUserObjList`).d('产品团队'),
    },
    {
      name: 'productVersionMasterArray',
      type: 'string',
      bind: 'masterUserObjList.id',
    },
    {
      name: 'productVersionStatusArray',
      type: 'string',
      lookupCode: platformProduct.productVerSionStatus,
      label: intl.get(`${intlPrefix}.productStatus`).d('版本状态'),
      multiple: true,
      defaultValue: ['Iterating', 'InOperation'],
    },
  ],
  fields: [
    {
      name: 'productName',
      type: 'string',
      label: intl.get(`${intlPrefix}.productName`).d('产品名称'),
    },
    {
      name: 'versionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionCode`).d('版本号'),
    },
    {
      name: 'lastVersionFlag',
      type: 'number',
      label: intl.get(`${intlPrefix}.lastVersionFlag`).d('是否最新版本'),
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'publishDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.publishDate`).d('发布时间'),
    },
    {
      name: 'publishUserName',
      type: 'string',
      label: intl.get(`${intlPrefix}.publishUserName`).d('发布执行人'),
    },
    {
      name: 'productVersionRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.productVersionRemark`).d('版本升级描述'),
    },
    {
      name: 'productVersionMaster',
      type: 'string',
      label: intl.get(`${intlPrefix}.masterUserName`).d('产品团队'),
    },
    {
      name: 'productVersionStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.productVersionStatusMeaning`).d('版本状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { productVersionStatusArray, productVersionMasterArray } = data;
      return {
        data: {
          ...data,
          lastVersionFlag: 0,
          productVersionStatusArray: null,
          productVersionMasterArray: null,
        },
        url: generateUrlWithGetParam(unpublishUrl, {
          productVersionStatusArray,
          productVersionMasterArray,
        }),
        method: 'GET',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});

export { publishedListDS, unpublishListDS };
