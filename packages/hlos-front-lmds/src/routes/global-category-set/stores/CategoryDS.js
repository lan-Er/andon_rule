/**
 * @Description: 类别管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-14 11:15:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
// import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const preCode = 'lmds.category.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/categorys`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'categoryCode',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
      maxLength: 240,
      dynamicProps: {
        unique: ({ dataSet, record }) => {
          const currentStr = `${record.get('categoryCode')}:${record.get('organizationId')}`;
          const catCodeAndOrgId = dataSet
            .filter((item) => {
              // 过滤掉当前行数据
              return item.data.categoryId !== record.get('categoryId');
            })
            .map((item) => {
              return `${item.data.categoryCode}:${item.data.organizationId}`;
            });
          const flag = catCodeAndOrgId.some((item) => {
            return currentStr === item;
          });
          if (flag) {
            return true;
          } else {
            return false;
          }
        },
      },
    },
    {
      name: 'categoryName',
      type: 'intl',
      label: intl.get(`${preCode}.categoryName`).d('类别名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.categoryDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'segment1',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment1`).d('段1'),
    },
    {
      name: 'segment2',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment2`).d('段2'),
    },
    {
      name: 'segment3',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment3`).d('段3'),
    },
    {
      name: 'segment4',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment4`).d('段4'),
    },
    {
      name: 'segment5',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment5`).d('段5'),
    },
    {
      name: 'segment6',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment6`).d('段6'),
    },
    {
      name: 'segment7',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment7`).d('段7'),
    },
    {
      name: 'segment8',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment8`).d('段8'),
    },
    {
      name: 'segment9',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment9`).d('段9'),
    },
    {
      name: 'segment10',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment10`).d('段10'),
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
    submit: ({ dataSet, data }) => {
      data.map((item) => {
        const dataItem = item;
        dataItem.categorySetId = dataSet.queryParameter.categorySetId;
        return dataItem;
      });
    },
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ record }) => {
      const segment = [
        record.get('segment1'),
        record.get('segment2'),
        record.get('segment3'),
        record.get('segment4'),
        record.get('segment5'),
        record.get('segment6'),
        record.get('segment7'),
        record.get('segment8'),
        record.get('segment9'),
        record.get('segment10'),
      ];

      if (record.get('segment1') !== undefined) {
        const segRes = [];

        segment.forEach((item) => {
          if (!isEmpty(item)) {
            segRes.push(item);
          }
        });

        const categoryCodeStr = segRes.join('.');

        record.set('categoryCode', categoryCodeStr);
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
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});
