/**
 * @Description: 平台产品详情页DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-07-28 11:11:26
 */

import intl from 'utils/intl';
import { HLOS_ZMDC } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const intlPrefix = 'zmdc.platformProduct.model';

const getMasterUser = (val, object) => {
  if (object.productVersionMasterList) {
    const arr = object.productVersionMasterList.map((v) => ({
      id: v.masterUserId,
      realName: v.masterUserName,
    }));
    return arr;
  }
  return [];
};

const BasicInfoDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'productName',
      type: 'string',
      label: intl.get(`${intlPrefix}.productName`).d('产品名称'),
      required: true,
    },
    {
      name: 'productCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.productCode`).d('产品编码'),
      required: true,
      pattern: /^[A-Za-z0-9]+$/,
    },
    {
      name: 'productVersionStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.productVersionStatus`).d('版本状态'),
    },
    {
      name: 'versionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.versionCode`).d('版本号'),
    },
    {
      name: 'previousVersionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.previousVersionCode`).d('当前版本号'),
    },
    {
      name: 'productIcon',
      type: 'string',
      label: intl.get(`${intlPrefix}.productIcon`).d('产品图标'),
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('上架状态'),
      defaultValue: '0',
    },
    {
      name: 'masterUserObj',
      type: 'object',
      lovCode: common.siteUser,
      label: intl.get(`${intlPrefix}.masterUser`).d('产品团队'),
      textField: 'realName',
      multiple: true,
      required: true,
      transformResponse: (val, object) => getMasterUser(val, object),
    },
    {
      name: 'productIntroduction',
      type: 'string',
      label: intl.get(`${intlPrefix}.productIntroduction`).d('产品简介'),
    },
    {
      name: 'productApplicableScene',
      type: 'string',
      label: intl.get(`${intlPrefix}.productApplicableScene`).d('适用场景'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { productVersionId } = data;
      return {
        url: `${HLOS_ZMDC}/v1/product-versions/${productVersionId}`,
        data,
        method: 'GET',
      };
    },
  },
});

const RoleSelectDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'roleObj',
      type: 'object',
      lovCode: common.assignableRole,
      multiple: true,
    },
  ],
});

const VersionDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'currentVersionCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.currentVersionCode`).d('当前版本号'),
    },
    {
      name: 'versionCodeObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.versionCode`).d('版本号'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'versionId',
      type: 'string',
      bind: 'versionCodeObj.value',
    },
    {
      name: 'versionCode',
      type: 'string',
      bind: 'versionCodeObj.meaning',
    },
    {
      name: 'productVersionRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.productVersionRemark`).d('版本升级描述'),
      required: true,
    },
  ],
});

export { BasicInfoDS, RoleSelectDS, VersionDS };
