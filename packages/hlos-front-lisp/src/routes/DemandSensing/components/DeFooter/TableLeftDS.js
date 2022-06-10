import intl from 'utils/intl';

const preCode = 'lisp.completion.entry';

export const ListDS = () => {
  return {
    autoQuery: false,
    paging: false,
    selection: 'single',
    fields: [
      {
        name: 'poNumber',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('采购订单'),
      },
      {
        name: 'demandQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('需求数量'),
      },
      {
        name: 'subQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('交货数量'),
      },
      {
        name: 'zaiTuQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('在途'),
      },
      {
        name: 'unReciveQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('未收货数量'),
      },
      {
        name: 'replyDate',
        type: 'string',
        label: intl.get(`${preCode}.replyDate`).d('供应商回复交期'),
      },
    ],
    transport: {
      // read: ({ data }) => {
      //     return {
      //         url,
      //         data: {
      //             ...data,
      //             functionType: 'SUPPLIER_CHAIN',
      //             dataType: 'ME_EXECUTE',
      //             user: loginName,
      //         },
      //         method: 'GET',
      //     };
      // },
    },
  };
};
