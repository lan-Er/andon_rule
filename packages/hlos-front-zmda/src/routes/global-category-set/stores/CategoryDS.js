/*
 * @Descripttion: 类别管理信息--tableDS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-16 09:26:56
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-16 10:04:22
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
// import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

const organizationId = getCurrentOrganizationId();

const preCode = 'lmds.category.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_ZMDA}/v1/${organizationId}/categorys`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'categoryCode',
      type: 'string',
      label: intl.get(`${preCode}.category`).d('类别'),
      unique: true,
      maxLength: 240,
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
      name: 'segment1',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment1`).d('段1'),
      validator: codeValidator,
    },
    {
      name: 'segment2',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment2`).d('段2'),
      validator: codeValidator,
    },
    {
      name: 'segment3',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment3`).d('段3'),
      validator: codeValidator,
    },
    {
      name: 'segment4',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment4`).d('段4'),
      validator: codeValidator,
    },
    {
      name: 'segment5',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment5`).d('段5'),
      validator: codeValidator,
    },
    {
      name: 'segment6',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment6`).d('段6'),
      validator: codeValidator,
    },
    {
      name: 'segment7',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment7`).d('段7'),
      validator: codeValidator,
    },
    {
      name: 'segment8',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment8`).d('段8'),
      validator: codeValidator,
    },
    {
      name: 'segment9',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment9`).d('段9'),
      validator: codeValidator,
    },
    {
      name: 'segment10',
      type: 'string',
      label: intl.get(`${preCode}.categorySegment10`).d('段10'),
      validator: codeValidator,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: 1,
      trueValue: 1,
      falsevalue: 0,
    },
  ],
  events: {
    submit: ({ dataSet, data }) => {
      data.map((item) => {
        const dataItem = item;
        dataItem.categorySetId = dataSet.queryParameter.categorySetId;
        dataItem.categorySetCode = dataSet.queryParameter.categorySetCode;
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
        url,
        data,
        method: 'GET',
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
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
