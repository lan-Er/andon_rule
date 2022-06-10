/**
 * @Description: 货格管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-06 14:35:02
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmdsWmUnit } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.wmUnit.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/wm-units`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'wmUnit',
      type: 'string',
      label: intl.get(`${commonCode}.wmUnit`).d('货格'),
    },
    {
      name: 'wareHouseName',
      type: 'string',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
    },
  ],
  fields: [
    {
      name: 'wmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
      lovCode: common.wmOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'wmOuName',
      type: 'string',
      bind: 'wmOuObj.wmOuName',
    },
    {
      name: 'wmOuCode',
      type: 'string',
      bind: 'wmOuObj.wmOuCode',
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          wmOuId: record.get('wmOuId'),
          needAll: 'Y',
        }),
      },
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wareHouseName',
      type: 'string',
      label: intl.get(`${preCode}.warehouseName`).d('仓库名称'),
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      label: intl.get(`${preCode}.wmUnit`).d('货格'),
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'wmUnitType',
      type: 'string',
      label: intl.get(`${preCode}.wmUnitType`).d('货格类型'),
      lookupCode: lmdsWmUnit.wmUnitType,
      required: true,
    },
    {
      name: 'segment01',
      type: 'string',
      label: intl.get(`${preCode}.segment1`).d('段1'),
      validator: codeValidator,
      required: true,
    },
    {
      name: 'segment02',
      type: 'string',
      label: intl.get(`${preCode}.segment2`).d('段2'),
      validator: codeValidator,
    },
    {
      name: 'segment03',
      type: 'string',
      label: intl.get(`${preCode}.segment3`).d('段3'),
      validator: codeValidator,
    },
    {
      name: 'segment04',
      type: 'string',
      label: intl.get(`${preCode}.segment4`).d('段4'),
      validator: codeValidator,
    },
    {
      name: 'segment05',
      type: 'string',
      label: intl.get(`${preCode}.segment5`).d('段5'),
      validator: codeValidator,
    },
    {
      name: 'multiItemEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.multiItem`).d('物料混放'),
      defaultValue: true,
    },
    {
      name: 'multiLotEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.multiLot`).d('批次混放'),
      defaultValue: true,
    },
    {
      name: 'length',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.length`).d('长（米）'),
    },
    {
      name: 'width',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.width`).d('宽（米）'),
    },
    {
      name: 'height',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.height`).d('高（米）'),
    },
    {
      name: 'maxVolume',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxVolume`).d('最大体积（立方米）'),
    },
    {
      name: 'maxWeight',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.maxWeight`).d('最大重量（千克）'),
    },
    {
      name: 'maxItemQty',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.maxItemQty`).d('最大物料数量'),
    },
    {
      name: 'maxContainerQty',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.maxContainerQty`).d('最大包装数量'),
    },
    {
      name: 'maxPalletQty',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.maxPalletQty`).d('最大托盘箱数'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
      validator: descValidator,
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      const segment = [
        record.get('segment01'),
        record.get('segment02'),
        record.get('segment03'),
        record.get('segment04'),
        record.get('segment05'),
      ];

      if (record.get('segment01') !== undefined) {
        const segRes = [];

        segment.forEach((item) => {
          if (!isEmpty(item)) {
            segRes.push(item);
          }
        });

        const wmUnitStr = segRes.join('-');

        record.set('wmUnitCode', wmUnitStr);
      }

      if (name === 'wmOuObj') {
        record.set('warehouseObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
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
