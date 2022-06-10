/*
 * @Description: 任务处理
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-15 15:12:46
 */

import React, { Fragment, useState } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Button } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { TaskProcessingDS } from '../store/processingDS';
import { branchTaskExecute } from '@/services/taskProcessingService';

const preCode = 'lmds.taskProcessing';
const taskProcessingFactory = () => new DataSet(TaskProcessingDS());

function TaskProcessing() {
  const listDS = useDataSet(taskProcessingFactory, TaskProcessing);
  const [taskInfoId, setTaskInfoId] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  const commonColumns = () => [
    { name: 'taskInfoTypeMeaning', width: 128, tooltip: 'overflow' },
    { name: 'taskStatusMeaning', width: 128, tooltip: 'overflow' },
    // { name: 'documentInfo', width: 128, tooltip: 'overflow' },
    { name: 'creator', width: 128, tooltip: 'overflow' },
    { name: 'tenantName', width: 128, tooltip: 'overflow' },
  ];

  const getColumns = () => [
    ...commonColumns(),
    { name: 'creationDate', tooltip: 'overflow' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 200,
      command: ({ record }) => {
        return [
          <Button
            key="edit"
            color="primary"
            funcType="flat"
            onClick={() => handleHeadRowClick(record)}
          >
            {intl.get(`${preCode}.view.button.handleJournal`).d('处理日志')}
          </Button>,
          <Button key="edit" color="primary" funcType="flat" onClick={() => handleExecute(record)}>
            {intl.get(`${preCode}.view.button.handle`).d('执行')}
          </Button>,
        ];
      },
      lock: 'right',
    },
  ];

  const lineColumns = () => [
    ...commonColumns(),
    { name: 'creationDate', width: 144, tooltip: 'overflow' },
    { name: 'taskParam', width: 128 },
    { name: 'taskErrorTrack', width: 128 },
  ];

  const handleExecute = async (record) => {
    const resp = await branchTaskExecute({
      taskInfoId: record.get('taskInfoId'),
    });
    if (getResponse(resp)) {
      notification.success({
        message: '提交成功',
      });
      listDS.query();
    }
  };

  const handleHeadRowClick = (record) => {
    if (!inProgress) {
      setInProgress(true);
      setTaskInfoId(record.get('taskInfoId'));
    }
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.taskProcessing`).d('任务管理')} />
      <Content>
        <Table
          dataSet={listDS}
          columns={getColumns()}
          queryFieldsLimit={4}
          columnResizable="true"
          editMode="inline"
        />
        {taskInfoId && (
          <Table
            dataSet={listDS.children.lineList}
            columns={lineColumns()}
            columnResizable="true"
            selectionMode="dblclick"
            editMode="inline"
          />
        )}
      </Content>
    </Fragment>
  );
}

export default TaskProcessing;
