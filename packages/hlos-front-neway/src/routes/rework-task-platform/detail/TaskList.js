import React from 'react';
import { Table } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'utils/renderer';

// import styles from './style.module.less';

// const commonCode = 'neway.common.model';
const TaskList = (props) => {
  const { tableDs } = props;

  const columns = [
    { name: 'organizationName', width: 130, align: 'center' },
    { name: 'taskNum', width: 130, align: 'center' },
    { name: 'productCode', width: 120, align: 'center' },
    { name: 'itemDesc', width: 150, align: 'center' },
    { name: 'operationName', width: 130, align: 'center' },
    { name: 'uom', width: 80, align: 'center' },
    { name: 'reworkQty', width: 100, align: 'center' },
    { name: 'taskQty', width: 100, align: 'center' },
    { name: 'description', width: 150, align: 'center' },
    { name: 'documentNum', width: 130, align: 'center' },
    { name: 'documentTypeName', width: 130, align: 'center' },
    { name: 'sourceTaskNum', width: 130, align: 'center' },
    { name: 'taskStatus', width: 100, align: 'center' },
    {
      name: 'firstOperationFlag',
      width: 100,
      align: 'center',
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    {
      name: 'lastOperationFlag',
      width: 100,
      align: 'center',
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    { name: 'workCenterName', width: 120, align: 'center' },
    { name: 'workGroupName', width: 120, align: 'center' },
    { name: 'workName', width: 120, align: 'center' },
    { name: 'actualStartTime', width: 150, align: 'center' },
    { name: 'actualEndTime', width: 150, align: 'center' },
  ];

  return <Table dataSet={tableDs} columns={columns} columnResizable="true" />;
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(TaskList);
