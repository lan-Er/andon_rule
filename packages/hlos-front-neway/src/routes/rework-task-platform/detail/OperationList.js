import React from 'react';
import { Table } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'utils/renderer';
import intl from 'utils/intl';
import { getFileName } from 'hlos-front/lib/utils/utils';

// const commonCode = 'neway.common.model';
const OperationList = (props) => {
  const { tableDs } = props;

  const columns = [
    { name: 'sequenceNum', width: 60, align: 'center' },
    { name: 'operationCode', width: 130, align: 'center' },
    { name: 'operationName', width: 130, align: 'center' },
    { name: 'description', width: 130, align: 'center' },
    { name: 'operationType', width: 120, align: 'center' },
    {
      name: 'keyOperationFlag',
      width: 100,
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    {
      name: 'firstOperationFlag',
      width: 100,
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    {
      name: 'lastOperationFlag',
      width: 100,
      renderer: ({ value }) => {
        return yesOrNoRender(Number(value));
      },
    },
    { name: 'preSequenceNum', width: 120, align: 'center' },
    { name: 'standardWorkTime', width: 130, align: 'center' },
    { name: 'processTime', width: 130, align: 'center' },
    {
      name: 'referenceDocument',
      width: 120,
      align: 'center',
      renderer: ({ value }) => {
        return (
          <>
            {value && (
              <a
                title={intl.get('hzero.common.button.download').d('下载')}
                href={value}
                rel="noopener noreferrer"
                target="_blank"
                download={getFileName(value)}
              >
                {getFileName(value)}
              </a>
            )}
          </>
        );
      },
    },
    { name: 'instruction', width: 120, align: 'center' },
    { name: 'executeRuleDescription', width: 120, align: 'center' },
    { name: 'inspectionRuleDescription', width: 120, align: 'center' },
    { name: 'attributeString3', width: 120, align: 'center' },
    { name: 'remark', width: 150, align: 'center' },
  ];

  return (
    <Table
      dataSet={tableDs}
      columns={columns}
      // columnResizable="true"
    />
  );
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(OperationList);
