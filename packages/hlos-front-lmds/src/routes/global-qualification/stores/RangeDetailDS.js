/**
 * @Description: 明细范围 DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 15:15:46
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsQualification, common } = codeConfig.code;
const {
  lmds: { qualificationRange },
} = statusConfig.statusValue;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.qualification.model';
const commonCode = 'lmds.common.model';
const sourceCode = 'lmds.privilege.model';

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      required: true,
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
      ignore: 'always',
    },
    {
      name: 'sourceType',
      type: 'string',
      label: intl.get(`${sourceCode}.sourceType`).d('来源类型'),
      required: true,
      lookupCode: lmdsQualification.sourceType,
    },
    {
      name: 'obj1',
      type: 'object',
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'obj2',
      type: 'object',
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'obj3',
      type: 'object',
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${sourceCode}.source`).d('来源'),
      required: true,
      ignore: 'always',
      dynamicProps: {
        lovCode({ record }) {
          const type = record.get('sourceType');
          if (type === qualificationRange.resource) {
            return common.resource;
          } else if (type === qualificationRange.item) {
            return common.item;
          } else if (type === qualificationRange.operation) {
            return common.operation;
          }
        },
        textField({ record }) {
          const type = record.get('sourceType');
          if (type === qualificationRange.operation) {
            return 'operationCode';
          } else if (type === qualificationRange.item) {
            return 'itemCode';
          } else if (type === qualificationRange.resource) {
            return 'resourceCode';
          }
        },
        valueField({ record }) {
          const type = record.get('sourceType');
          if (type === qualificationRange.operation) {
            return 'operationId';
          } else if (type === qualificationRange.item) {
            return 'itemId';
          } else if (type === qualificationRange.resource) {
            return 'resourceId';
          }
        },
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationRange.operation) {
          return {
            bind: 'sourceObj.operationId',
          };
        } else if (type === qualificationRange.item) {
          return {
            bind: 'sourceObj.itemId',
          };
        } else if (type === qualificationRange.resource) {
          return {
            bind: 'sourceObj.resourceId',
          };
        }
      },
    },
    {
      name: 'sourceCode',
      type: 'string',
      ignore: 'always',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationRange.operation) {
          return {
            bind: 'sourceObj.operationCode',
          };
        } else if (type === qualificationRange.item) {
          return {
            bind: 'sourceObj.itemCode',
          };
        } else if (type === qualificationRange.resource) {
          return {
            bind: 'sourceObj.resourceCode',
          };
        }
      },
    },
    {
      name: 'sourceName',
      type: 'string',
      label: intl.get(`${sourceCode}.sourceName`).d('来源名称'),
      ignore: 'always',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationRange.operation) {
          return {
            bind: 'sourceObj.operationName',
          };
        } else if (type === qualificationRange.item) {
          return {
            bind: 'sourceObj.description',
          };
        } else if (type === qualificationRange.resource) {
          return {
            bind: 'sourceObj.resourceName',
          };
        }
      },
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.operationItem`).d('工序对应物料'),
      lovCode: common.item,
      ignore: 'always',
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
      type: 'string',
      bind: 'itemObj.description',
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
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
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification-line/${data.qualificationId}/page`,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification-line/${data[0].qualificationId}/${data[0].lineId}`,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
  events: {
    update: ({ record, name }) => {
      if (name === 'sourceType') {
        record.set('sourceObj', null);
      }
    },
  },
});
