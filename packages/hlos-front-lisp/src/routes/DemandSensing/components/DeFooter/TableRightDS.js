import intl from 'utils/intl';

const preCode = 'lisp.completion.entry';

export const ListDS = () => {
  return {
    autoQuery: false,
    paging: false,
    fields: [
      {
        name: 'moNumber',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('MO编码'),
      },
      {
        name: 'makeQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('在制数量'),
      },
      {
        name: 'unCheckQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('不合格数量'),
      },
      {
        name: 'ngQty',
        type: 'string',
        label: intl.get(`${preCode}.attribute1`).d('报废数量'),
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
