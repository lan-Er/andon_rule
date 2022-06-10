/**
 * @Description: 资源分配 DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 15:33:09
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
  lmds: { qualificationAssign },
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
      lookupCode: lmdsQualification.sourceTypeAssign,
    },
    {
      name: 'obj1',
      type: 'object',
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'obj2',
      type: 'object',
      lovCode: common.workerGroup,
      ignore: 'always',
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${sourceCode}.sourceName`).d('来源名称'),
      required: true,
      ignore: 'always',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationAssign.worker) {
          return {
            lovCode: common.worker,
            textField: 'workerName',
            valueField: 'workerId',
          };
        } else if (type === qualificationAssign.workerGroup) {
          return {
            lovCode: common.workerGroup,
            textField: 'workerGroupName',
            valueField: 'workerGroupId',
          };
        }
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationAssign.worker) {
          return {
            bind: 'sourceObj.workerId',
          };
        } else if (type === qualificationAssign.workerGroup) {
          return {
            bind: 'sourceObj.workerGroupId',
          };
        }
      },
    },
    {
      name: 'sourceName',
      type: 'string',
      ignore: 'always',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === qualificationAssign.worker) {
          return {
            bind: 'sourceObj.workerName',
          };
        } else if (type === qualificationAssign.workerGroup) {
          return {
            bind: 'sourceObj.workerGroupName',
          };
        }
      },
    },
    {
      name: 'performanceLevel',
      type: 'string',
      label: intl.get(`${preCode}.performanceLevel`).d('熟练等级'),
      lookupCode: lmdsQualification.performanceLevel,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('endDate'))) {
          return {
            max: 'endDate',
          };
        }
      },
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
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
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification-assign/${data.qualificationId}/page`,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification-assign/${data[0].qualificationId}/${data[0].assignId}`,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
  events: {
    update: ({ record, name }) => {
      if (name === 'sourceType') {
        record.set('sourceObj', {});
      }
    },
  },
});
