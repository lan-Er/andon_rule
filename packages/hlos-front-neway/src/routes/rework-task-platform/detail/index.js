import React, { useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Form, TextField } from 'choerodon-ui/pro';
import { Divider, Icon, Tabs } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { DetailFormDs } from '@/stores/reworkTaskPlatformDs';

import OperationList from './OperationList';
import TaskList from './TaskList';

const preCode = 'neway.reworkTaskPlatform.model';
const { TabPane } = Tabs;

const ReworkTaskDetail = (props) => {
  const formDs = useDataSet(() => new DataSet(DetailFormDs()), []);
  const operationListDs = formDs.children.operationList;
  const taskListDs = formDs.children.taskList;

  const moId = props.match?.params?.moId;

  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    formDs.setQueryParameter('moId', moId);
    formDs.query();
  }, [formDs]);

  /**
   * 切换显示隐藏
   */
  function handleLineToggle() {
    setShowLine(!showLine);
  }

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.moOperation`).d('MO工序')}
        backPath="/neway/rework-task-platform/list"
      />
      <Content>
        <Form dataSet={formDs} columns={4} disabled>
          <TextField name="organizationName" />
          <TextField name="moNum" />
          <TextField name="itemCode" />
          <TextField name="itemDesc" />
        </Form>
        <Divider>
          <div>
            <span onClick={handleLineToggle} style={{ cursor: 'pointer' }}>
              {intl.get(`${preCode}.view.title.operationDetail`).d('展开')}
            </span>
            <Icon type={!showLine ? 'expand_more' : 'expand_less'} />
          </div>
        </Divider>
        <div style={showLine ? { display: 'block' } : { display: 'none' }}>
          <Form dataSet={formDs} columns={4} disabled>
            <TextField name="moStatus" />
            <TextField name="moTypeName" />
            <TextField name="demandQty" />
            <TextField name="uom" />
            <TextField name="description" />
            <TextField name="documentTypeName" />
            <TextField name="documentNum" />
            <TextField name="actualCompletedQty" />
            <TextField name="completedQty" />
            <TextField name="scrappedQty" />
          </Form>
          <Tabs size="large" tabBarGutter={0} animated={false} defaultActiveKey="operation">
            <TabPane
              tab={intl.get('hmsg.cards.message.platformAnnounce').d('工序')}
              key="operation"
            >
              <OperationList tableDs={operationListDs} />
            </TabPane>
            <TabPane tab={intl.get('hmsg.cards.message.platformAnnounce').d('任务')} key="task">
              <TaskList tableDs={taskListDs} />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </>
  );
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(ReworkTaskDetail);
