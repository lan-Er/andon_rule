/**
 * @Description: 在制品管理
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-11
 * @LastEditors: leying.yan
 */

import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Lov, Form, Button, DateTimePicker, TextField, Select } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { tableScrollWidth, createPagination, getResponse } from 'utils/utils';
import { ExportButton } from 'hlos-front/lib/components';
import { Header, Content } from 'components/Page';
import useChangeWidth from '@/utils/useChangeWidth';
import Store from '@/stores/inProcessManagementDS';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';

import MainTable from './MainTable';
import ExecuteTable from './ExecuteTable';
import './style.less';

const { TabPane } = Tabs;
const { common } = codeConfig.code;

const preCode = 'lmes.inProcessManagement';

export default () => {
  const { listDS, queryDS, executeDS } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [mainResult, setMainResult] = useState({});
  const [executeResult, setExecuteResult] = useState({});
  const showQueryNumber = useChangeWidth();
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({});
  const [inProcessListLoading, setInProcessListLoading] = useState(false);

  useEffect(() => {
    queryDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          queryDS.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [queryDS]);

  useEffect(() => {
    setDataSource(activeTab === 'main' ? mainResult.content : executeResult.content);
  }, [activeTab]);

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Lov name="taskObj" noCache key="taskObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="workcellObj" noCache key="workcellObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="operationObj" noCache key="operationObj" />,
      <Lov name="partyObj" noCache key="partyObj" />,
      <Select name="wipStatus" key="wipStatus" />,
      <TextField name="lotNumber" key="lotNumber" />,
      <TextField name="tagCode" key="tagCode" />,
      <TextField name="productTagCode" key="productTag" />,
      <TextField name="outerTagCode" key="outerTag" />,
      <DateTimePicker name="moveInStartTime" key="moveInStartTime" />,
      <DateTimePicker name="moveInEndTime" key="moveInEndTime" />,
      <DateTimePicker name="moveOutStartTime" key="moveOutStartTime" />,
      <DateTimePicker name="moveOutEndTime" key="moveOutEndTime" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const { pageSize } = pagination;
    handlePagination({ pageSize });
  }

  /**
   * handlePagination - 分页设置
   * @param {object} pagination - 分页对象
   */
  async function handlePagination(page) {
    setInProcessListLoading(true);
    listDS.queryParameter = queryDS.current.toJSONData();
    executeDS.queryParameter = queryDS.current.toJSONData();
    if (page) {
      const { current, pageSize } = page;
      listDS.setQueryParameter('page', current - 1);
      listDS.setQueryParameter('size', pageSize || 100);
      executeDS.setQueryParameter('page', current - 1);
      executeDS.setQueryParameter('size', pageSize || 100);
    } else {
      const { current, pageSize } = pagination;
      listDS.setQueryParameter('page', current - 1);
      listDS.setQueryParameter('size', pageSize);
      executeDS.setQueryParameter('page', current - 1);
      executeDS.setQueryParameter('size', pageSize);
    }
    const main = await listDS.query();
    const execute = await executeDS.query();
    setMainResult(main);
    setExecuteResult(execute);
    const result = activeTab === 'main' ? main : execute;
    setDataSource(result.content);
    setPagination(createPagination(result));
    setInProcessListLoading(false);
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *切换tab页
   *
   * @param {*} newActiveKey
   */
  function handleTabChange(newActiveKey) {
    setActiveTab(newActiveKey);
  }

  const mainProps = {
    loading: inProcessListLoading,
    dataSource,
    pagination,
    tableScrollWidth,
    handlePagination,
  };

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.inProcess`).d('在制管理')}>
        <ExportButton
          reportCode={['']}
          exportTitle={
            intl.get(`${preCode}.view.title.inProcess`).d('在制管理') +
            intl.get('hzero.common.button.export').d('导出')
          }
        />
      </Header>
      <Content className="lmes-moWorkspace-content">
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
          <Form dataSet={queryDS} columns={showQueryNumber} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, showQueryNumber) : queryFields()}
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs
          animated={{ inkBar: true, tabPane: false }}
          defaultActiveKey="main"
          onChange={handleTabChange}
        >
          <TabPane tab={intl.get(`${preCode}.view.title.main`).d('主要')} key="main">
            <MainTable {...mainProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.execute`).d('执行')} key="execute">
            <ExecuteTable {...mainProps} />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};
