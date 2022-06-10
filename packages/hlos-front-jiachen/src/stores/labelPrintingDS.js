import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code; // jiachenLabelPrinting

const preCode = 'jiachen.labelPrinting';

const queryHeadDS = () => ({
  queryFields: [
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.model.item`).d('物料'),
      lovCode: common.item,
      textField: 'itemCode',
      ignore: 'always',
      required: true,
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'startNum',
      type: 'string',
      label: intl.get(`${preCode}.model.startNum`).d('起始流水'),
      validator: (value) => {
        if (!/^[0-9]+$/.test(value)) {
          return '请输入0-9的数字';
        }
        return true;
      },
      required: true,
    },
    {
      name: 'tagNum',
      type: 'number',
      label: intl.get(`${preCode}.model.tagNum`).d('标签数量'),
      min: 1,
      step: 1,
      // validator: (value, name, record) => {
      //   if (!(/^[1-9][0-9]+$/.test(value))) {
      //     return '请输入大于1的数字'
      //   }
      //   return true
      // },
      required: true,
    },
  ],
});

export { queryHeadDS };
