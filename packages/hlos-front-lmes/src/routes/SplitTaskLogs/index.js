import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table } from 'choerodon-ui/pro';
import { queryHeadDS } from '../../stores/splitTaskLogsDS';

const headDS = new DataSet(queryHeadDS());

const SplitTaskLogs = () => {
  const [logsVal, setLogsVal] = useState(null);

  useEffect(() => {
    headDS.addEventListener('query', () => setLogsVal(null));
  }, []);

  const HeadColumns = [
    { name: 'batchId', width: 150 },
    { name: 'creationDate', width: 150 },
    { name: 'status', width: 150 },
    {
      name: 'process',
      width: 150,
      renderer: ({ value }) => {
        let showValue = value;
        if (showValue) {
          showValue = (Math.floor(showValue * 100) / 100) * 100;
          return <span>{showValue}</span>;
        }
        return <span>0</span>;
      },
    },
    {
      name: 'result',
      renderer: ({ value }) => {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div>;
      },
      tooltip: 'overflow', // 'always',
    },
  ];

  function handleClick({ record }) {
    return {
      onClick: () => {
        setLogsVal(record.data.result);
      },
    };
  }

  return (
    <Fragment>
      <Header title="任务日志" />
      <Content>
        <Table
          selectionMode="none"
          dataSet={headDS}
          columns={HeadColumns}
          queryFieldsLimit={4}
          onRow={(record) => handleClick(record)}
          pagination={{
            onChange: () => setLogsVal(null),
          }}
        />
        {logsVal && <div style={{ whiteSpace: 'pre-wrap' }}>{logsVal}</div>}
      </Content>
    </Fragment>
  );
};

export default SplitTaskLogs;
