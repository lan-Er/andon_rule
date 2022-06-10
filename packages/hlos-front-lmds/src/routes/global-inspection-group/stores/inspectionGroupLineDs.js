/*
 * @Author: zhang yang
 * @Description: file content
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-21 11:13:26
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { isEmpty } from 'lodash';

import codeConfig from '@/common/codeConfig';

const { lmdsInspectionGroup } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.inspectionGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/inspection-group-lines`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'orderByCode',
      type: 'numebr',
      label: intl.get(`${preCode}.orderByCode`).d('排序编码'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'inspectionItem',
      type: 'object',
      label: intl.get(`${preCode}.inspectionItemName`).d('检验项目名称'),
      lovCode: lmdsInspectionGroup.inspectionItem,
      ignore: 'always',
      required: true,
      dynamicProps: ({ dataSet }) => {
        const parentObj = dataSet.parent.current.data;
        let lovPara = {};
        if (!isEmpty(parentObj.organizationObj)) {
          lovPara = {
            organizationId: parentObj.organizationObj.meOuId,
          };
          return {
            lovPara,
          };
        }
      },
    },
    {
      name: 'inspectionItemId',
      type: 'string',
      bind: 'inspectionItem.inspectionItemId',
    },
    {
      name: 'inspectionItemCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionItem`).d('检验项目编码'),
      bind: 'inspectionItem.inspectionItemCode',
    },
    {
      name: 'inspectionItemName',
      type: 'string',
      bind: 'inspectionItem.inspectionItemName',
    },
    {
      name: 'inspectionResource',
      type: 'string',
      label: intl.get(`${preCode}.inspectionResource`).d('检测工具'),
      bind: 'inspectionItem.inspectionResource',
    },
    {
      name: 'resultType',
      type: 'string',
    },
    {
      name: 'resultTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.resultType`).d('结果类型'),
      bind: 'inspectionItem.resultTypeMeaning',
    },
    {
      name: 'defaultUcl',
      type: 'string',
      label: intl.get(`${preCode}.defaultUcl`).d('默认上限'),
      bind: 'inspectionItem.defaultUcl',
    },
    {
      name: 'defaultUclAccept',
      type: 'boolean',
      label: intl.get(`${preCode}.defaultUclAccept`).d('包含默认上限值'),
      bind: 'inspectionItem.defaultUclAccept',
    },
    {
      name: 'defaultLcl',
      type: 'string',
      label: intl.get(`${preCode}.defaultLcl`).d('默认下限'),
      bind: 'inspectionItem.defaultLcl',
    },
    {
      name: 'defaultLclAccept',
      type: 'boolean',
      label: intl.get(`${preCode}.defaultLclAccept`).d('包含默认下限值'),
      bind: 'inspectionItem.defaultLclAccept',
    },
    {
      name: 'necessaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.necessaryFlag`).d('是否必输'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'inspectionSection',
      type: 'string',
      label: intl.get(`${preCode}.inspectionSection`).d('分段'),
    },
    {
      name: 'sectionOrderCode',
      type: 'string',
      label: intl.get(`${preCode}.sectionOrderCode`).d('分段排序'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: commonUrl,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});
