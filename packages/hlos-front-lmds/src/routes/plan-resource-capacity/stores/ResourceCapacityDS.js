/**
 * @Description: 资源能力--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-09 13:55:03
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

import { descValidator } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const preCode = 'lmds.resourceCapacity';
const commonCode = 'lmds.common';
const { lmdsResourceCapaticy, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const {
  lovPara: { itemAps },
} = statusConfig.statusValue.lmds;
const url = `${HLOS_LMDS}/v1/${organizationId}/aps-capacitys`;

export default () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'APSResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.model.apsResource`).d('资源'),
      ignore: 'always',
      lovCode: common.apsResource,
    },
    {
      name: 'apsResourceId',
      type: 'string',
      bind: 'APSResourceObj.apsResourceId',
    },
    {
      name: 'apsResourceName',
      type: 'string',
      bind: 'APSResourceObj.resourceName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.item`).d('物料'),
      ignore: 'always',
      lovCode: common.itemAps,
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
  ],
  fields: [
    {
      name: 'APSOueObj',
      type: 'object',
      label: intl.get(`${preCode}.model.apsOu`).d('计划中心'),
      ignore: 'always',
      lovCode: common.apsOu,
      required: true,
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'APSOueObj.apsOuId',
    },
    {
      name: 'apsOuName',
      type: 'string',
      bind: 'APSOueObj.apsOuName',
    },
    {
      name: 'APSResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.model.apsResource`).d('资源'),
      ignore: 'always',
      lovCode: common.apsResource,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('APSOueObj') && record.get('APSOueObj').apsOuId,
        }),
      },
    },
    {
      name: 'apsResourceId',
      type: 'string',
      bind: 'APSResourceObj.apsResourceId',
    },
    {
      name: 'apsResourceName',
      type: 'string',
      bind: 'APSResourceObj.resourceName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.model.item`).d('物料'),
      ignore: 'always',
      lovCode: common.itemAps,
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('APSOueObj') && record.get('APSOueObj').apsOuId,
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
      lovPara: { categorySetCode: itemAps },
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
      name: 'relatedResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.model.relatedResourceObj`).d('关联资源'),
      lovCode: common.apsResource,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('APSOueObj') && record.get('APSOueObj').apsOuId,
        }),
      },
    },
    {
      name: 'relatedResourceId',
      type: 'string',
      bind: 'relatedResourceObj.apsResourceId',
    },
    {
      name: 'relatedResourceName',
      type: 'string',
      bind: 'relatedResourceObj.resourceName',
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.model.meOuObj`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('APSOueObj') && record.get('APSOueObj').apsOuId,
        }),
      },
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'prodVersionEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.model.prodVersionEnable`).d('启用生产版本'),
    },
    {
      name: 'prodVersionObj',
      type: 'object',
      label: intl.get(`${preCode}.model.prodVersion`).d('生产版本'),
      lovCode: lmdsResourceCapaticy.prodVersion,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        let lovPara = {};
        if (!isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
          };
        } else if (isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
          };
        }
        return {
          lovPara,
          required: record.get('prodVersionEnable'),
        };
      },
    },
    {
      name: 'productionVersionId',
      type: 'string',
      bind: 'prodVersionObj.productionVersionId',
    },
    {
      name: 'productionVersion',
      type: 'string',
      bind: 'prodVersionObj.productionVersion',
    },
    {
      name: 'bomObj',
      type: 'object',
      label: intl.get(`${preCode}.model.bomObj`).d('BOM'),
      lovCode: common.itemBom,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        let lovPara = {};
        if (!isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
          };
        } else if (isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
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
      bind: 'bomObj.bomId',
    },
    {
      name: 'bomVersion',
      type: 'string',
      bind: 'bomObj.bomVersion',
    },
    {
      name: 'routingObj',
      type: 'object',
      label: intl.get(`${preCode}.model.routingObj`).d('工艺路线'),
      lovCode: common.itemRouting,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        let lovPara = {};
        if (!isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
            itemId: record.get('itemObj') && record.get('itemObj').itemId,
          };
        } else if (isEmpty(record.get('itemObj'))) {
          lovPara = {
            meOuId: record.get('meOuObj') && record.get('meOuObj').meOuId,
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
      bind: 'routingObj.routingId',
    },
    {
      name: 'routingVersion',
      type: 'string',
      bind: 'routingObj.routingVersion',
    },
    {
      name: 'capacityType',
      type: 'string',
      label: intl.get(`${preCode}.model.capacityType`).d('能力类型'),
      required: true,
      lookupCode: common.capacityType,
    },
    {
      name: 'capacityValue',
      type: 'number',
      label: intl.get(`${preCode}.model.capacityValue`).d('能力值'),
      required: true,
      min: 0,
      step: 1,
    },
    {
      name: 'activity',
      type: 'number',
      label: intl.get(`${preCode}.model.activity`).d('开动率(%)'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'priority',
      type: 'number',
      label: intl.get(`${preCode}.model.priority`).d('优先级'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'eachProcessOutput',
      type: 'number',
      label: intl.get(`${preCode}.model.eachProcessOutput`).d('单次产出'),
      defaultValue: 1,
      min: 1,
      step: 1,
    },
    {
      name: 'standardCapacityType',
      type: 'string',
      label: intl.get(`${preCode}.model.stdCapacityType`).d('标准能力类型'),
      lookupCode: common.capacityType,
    },
    {
      name: 'standardCapacityValue',
      type: 'number',
      label: intl.get(`${preCode}.model.stdCapacityValue`).d('标准能力值'),
      min: 0,
      step: 1,
    },
    {
      name: 'preProcessLeadTime',
      type: 'number',
      label: intl.get(`${preCode}.model.preProcessLeadTime`).d('前处理时间(小时)'),
      min: 0,
      step: 1,
    },
    {
      name: 'processLeadTime',
      type: 'number',
      label: intl.get(`${preCode}.model.processLeadTime`).d('处理时间(小时)'),
      min: 0,
      step: 1,
    },
    {
      name: 'postProcessLeadTime',
      type: 'number',
      label: intl.get(`${preCode}.model.postProcessLeadTime`).d('后处理时间(小时)'),
      min: 0,
      step: 1,
    },
    {
      name: 'safetyLeadTime',
      type: 'number',
      label: intl.get(`${preCode}.model.safetyLeadTime`).d('安全时间(小时)'),
      min: 0,
      step: 1,
    },
    {
      name: 'autoAssignFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.autoAssign`).d('自动分配'),
      defaultValue: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.model.enabledFlag`).d('是否有效'),
      defaultValue: true,
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
    update: ({ name, record, value }) => {
      if (name === 'itemObj') {
        if (isEmpty(record.get('itemObj'))) {
          record.set('itemDescription', null);
        } else {
          record.set('itemDescription', value.description);
        }
      }
      if (name === 'APSOueObj') {
        if (isEmpty(record.get('APSOueObj'))) {
          record.set('meOuObj', null);
        }
      }
      if (name === 'prodVersionEnable') {
        if (record.get('prodVersionEnable')) {
          record.set('bomObj', null);
          record.set('routingObj', null);
        } else {
          record.set('prodVersionObj', null);
        }
      }
    },
  },
});
