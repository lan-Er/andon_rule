/**
 * @Description: 检验项目管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 15:03:52
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmdsInspectionItem } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.inspectionItem.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDSS}/v1/${organizationId}/neway-inspection-items`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'inspectionItemCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
    },
    {
      name: 'inspectionItemName',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItemName`).d('检验项目名称'),
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
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'inspectionItemCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'inspectionItemName',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionItemName`).d('检验项目名称'),
      required: true,
    },
    {
      name: 'inspectionItemAlias',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionItemAlias`).d('检验项目简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionItemDesc`).d('检验项目描述'),
      validator: descValidator,
    },
    {
      name: 'instruction',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionMethod`).d('检验方法'),
    },
    {
      name: 'drawingCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionDrawingCode`).d('检验图纸'),
    },
    {
      name: 'inspectionClass',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItemClass`).d('检验项目大类'),
      lookupCode: lmdsInspectionItem.inspectionClass,
      required: true,
    },
    {
      name: 'standardValue2',
      type: 'string',
      label: intl.get(`${preCode}.nationalStandard`).d('国家标准'),
      dynamicProps: {
        required: ({ record }) => {
          return record.get('inspectionClass') === 'CERTIFICATE';
        },
      },
    },
    {
      name: 'standardValue3',
      type: 'string',
      label: intl.get(`${preCode}.enterpriseStandard`).d('企业标准'),
      dynamicProps: {
        required: ({ record }) => {
          return record.get('inspectionClass') === 'CERTIFICATE';
        },
      },
    },
    {
      name: 'inspectionType',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItemType`).d('检验项目类型'),
      lookupCode: lmdsInspectionItem.inspectionType,
      required: true,
    },
    {
      name: 'resultType',
      type: 'string',
      label: intl.get(`${preCode}.resultType`).d('结果类型'),
      lookupCode: lmdsInspectionItem.resultType,
      required: true,
    },
    {
      name: 'inspectionResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionResource`).d('检测工具'),
      lovCode: common.equipment,
      ignore: 'always',
    },
    {
      name: 'inspectionResourceId',
      type: 'string',
      bind: 'inspectionResourceObj.equipmentId',
    },
    {
      name: 'inspectionResource',
      type: 'string',
      bind: 'inspectionResourceObj.equipmentName',
    },
    {
      name: 'defaultUcl',
      type: 'number',
      label: intl.get(`${preCode}.defaultUCL`).d('默认上限'),
      dynamicProps: {
        required: ({ record }) => {
          return record.get('resultType') === 'NUMBER';
        },
      },
    },
    {
      name: 'defaultUclAccept',
      type: 'boolean',
      label: intl.get(`${preCode}.defaultUCLAccept`).d('包含默认上限值'),
    },
    {
      name: 'defaultLcl',
      type: 'number',
      label: intl.get(`${preCode}.defaultLCL`).d('默认下限'),
      dynamicProps: {
        required: ({ record }) => {
          return record.get('resultType') === 'NUMBER';
        },
      },
    },
    {
      name: 'defaultLclAccept',
      type: 'boolean',
      label: intl.get(`${preCode}.defaultLCLAccept`).d('包含默认下限值'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
