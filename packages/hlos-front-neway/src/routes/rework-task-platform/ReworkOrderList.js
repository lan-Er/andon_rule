import React from 'react';
import { Table } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';

// import styles from './style.module.less';

// const commonCode = 'neway.common.model';
const ReworkOrderList = (props) => {
  const { tableDs, handleToDetail } = props;

  const columns = [
    { name: 'organizationName', width: 130 },
    {
      name: 'moNum',
      width: 130,
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value}</a>;
      },
    },
    { name: 'itemCode', width: 120 },
    { name: 'itemDesc', width: 150 },
    { name: 'moStatus', width: 100 },
    { name: 'moTypeName', width: 100 },
    { name: 'demandQty', width: 100 },
    { name: 'uom', width: 80 },
    { name: 'remark', width: 130 },
    { name: 'documentTypeName', width: 130 },
    { name: 'sourceDocNum', width: 130 },
    {
      name: 'actualCompletedQty',
      width: 100,
    },
    { name: 'completedQty', width: 100 },
    { name: 'scrappedQty', width: 100 },
  ];

  return <Table dataSet={tableDs} columns={columns} columnResizable="true" />;
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(ReworkOrderList);
