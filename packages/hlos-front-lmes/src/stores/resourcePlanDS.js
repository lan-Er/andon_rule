/*
 * @Descripttion: 资源计划DS
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */
import codeConfig from '@/common/codeConfig';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { dateRender } from 'utils/renderer';

const { common } = codeConfig.code;

const ScreenFormDS = () => ({
  fields: [
    { name: 'taskNum', type: 'string', label: '任务号' },
    { name: 'itemCode', type: 'string', label: '物料编码' },
    { name: 'documentNum', type: 'string', label: 'MO单据号' },
    {
      name: 'operationObj',
      type: 'object',
      label: '工序',
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'operationId',
      type: 'string',
      bind: 'operationObj.operationId',
    },
    {
      name: 'operationName',
      type: 'string',
      bind: 'operationObj.operationName',
      ignore: 'always',
    },
  ],
});

const PlanDateDS = () => ({
  fields: [
    {
      name: 'startDate',
      type: 'dateTime',
      label: '开始时间',
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endDate')) {
            return 'endDate';
          }
        },
      },
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (value) => dateRender(value),
    },
    {
      name: 'endDate',
      type: 'dateTime',
      label: '结束时间',
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (value) => dateRender(value),
    },
  ],
});

export { ScreenFormDS, PlanDateDS };
