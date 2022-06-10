/**
 * @Description: MO工作台管理信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Lov,
  Form,
  Button,
  DatePicker,
  DateTimePicker,
  TextField,
  Select,
  DataSet,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import { ExportButton } from 'hlos-front/lib/components';
import intl from 'utils/intl';
import { tableScrollWidth, createPagination } from 'utils/utils';
import withProps from 'utils/withProps';
import { Header, Content } from 'components/Page';
import useChangeWidth from '@/utils/useChangeWidth';
import { MoListDS } from '../store/moWorkspaceDS';

import MainTable from './MainTable';
import DemandTable from './DemandTable';
import ExecuteTable from './ExecuteTable';
import PlanTable from './PlanTable';
import './style.less';

const { TabPane } = Tabs;

const preCode = 'zexe.moWorkspace';

const MoList = ({ listDS, history, dispatch, dataSource, pagination }) => {
  const [showFlag, setShowFlag] = useState(false);
  const showQueryNumber = useChangeWidth();
  const [moListLoading, setMoListLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    // async function defaultLovSetting() {
    //   const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    //   if (getResponse(res)) {
    //     if (res && res.content && res.content[0]) {
    //       listDS.queryDataSet.current.set('organizationObj', {
    //         organizationId: res.content[0].organizationId,
    //         organizationName: res.content[0].organizationName,
    //       });
    //     }
    //   }
    // }
    // defaultLovSetting();
  }, []);

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="supplierObj" noCache key="supplierObj" />,
      <TextField name="supplierName" key="supplierName" />,
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Select name="moStatus" key="moStatus" />,
      <Lov name="apsOuObj" noCache key="apsOuObj" />,
      <Lov name="apsGroupObj" noCache key="apsGroupObj" />,
      <Lov name="apsResourceObj" noCache key="apsResourceObj" />,
      <Lov name="moTypeObj" noCache key="moTypeObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <TextField name="topMoNum" key="topMoNum" />,
      <TextField name="parentMoNums" key="parentMoNums" />,
      <Lov name="soObj" noCache key="soObj" />,
      <Lov name="demandObj" noCache key="demandObj" />,
      <TextField name="customerName" key="customerName" />,
      <TextField name="projectNum" key="projectNum" />,
      <DatePicker name="demandDateStart" key="demandDateStart" />,
      <DatePicker name="demandDateEnd" key="demandDateEnd" />,
      <DateTimePicker name="planStartDateLeft" key="planStartDateLeft" />,
      <DateTimePicker name="planStartDateRight" key="planStartDateRight" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.queryDataSet.validate(false, false);
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
    setMoListLoading(true);
    if (page) {
      const { current, pageSize } = page;
      listDS.setQueryParameter('page', current ? current - 1 : 0);
      listDS.setQueryParameter('size', pageSize);
    } else {
      const { current, pageSize } = pagination;
      listDS.setQueryParameter('page', current - 1);
      listDS.setQueryParameter('size', pageSize);
    }
    const result = await listDS.query();
    dispatch({
      type: 'moWorkSpace/updateDataSource',
      payload: {
        list: result.content,
        pagination: createPagination(result),
      },
    });
    // 清空勾选
    handleSelectRowKeys();
    setMoListLoading(false);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(url) {
    history.push(url);
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer(value, record) {
    return (
      <a
        onClick={() =>
          handleToDetailPage(
            `/zexe/mo-workspace/detail/${record.ownerOrganizationId}/${record.moId}`
          )
        }
      >
        {value}
      </a>
    );
  }
  /**
   * MO选择操作
   * @param {array<String>} selectedRowKeys - moId唯一标识列表
   */
  function handleSelectRowKeys(rowKeys = []) {
    setSelectedRowKeys(rowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectRowKeys,
  };

  const mainProps = {
    loading: moListLoading,
    dataSource,
    pagination,
    tableScrollWidth,
    handlePagination,
    linkRenderer,
    rowSelection,
  };

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}>
        <ExportButton
          reportCode={['LMES.MO']}
          exportTitle={
            intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台') +
            intl.get('hzero.common.button.export').d('导出')
          }
        />
      </Header>
      <Content className="zexe-moWorkspace-content">
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
          <Form dataSet={listDS.queryDataSet} columns={showQueryNumber} style={{ flex: 'auto' }}>
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
        <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
          <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
            <MainTable {...mainProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.demand`).d('需求')} key="demand">
            <DemandTable {...mainProps} />
          </TabPane>

          <TabPane tab={intl.get(`${preCode}.view.title.plan`).d('计划')} key="plan">
            <PlanTable {...mainProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.execute`).d('执行')} key="execute">
            <ExecuteTable {...mainProps} />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};

export default connect(({ moWorkSpace: { dataSource, pagination } }) => ({
  dataSource,
  pagination,
}))(
  withProps(
    () => {
      const listDS = new DataSet(MoListDS());
      return { listDS };
    },
    { cacheState: true }
  )(MoList)
);
