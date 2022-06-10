/**
 * @Description: 交期结果 - index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-23  16:58:00
 * @LastEditors: yu.na
 */

import React, { useState } from 'react';
import { Button, Lov, Tabs, DataSet, DatePicker, Form, TextField } from 'choerodon-ui/pro';
import { Modal, Icon } from 'choerodon-ui';
import { Header } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ListDS } from '@/stores/deliveryResultDS';
import TabComponent from './TabComponent';

// import GenerateImg from './assets/generate.svg';
// import qiIcon from './assets/qi.svg';
import './style.less';

const { Sidebar } = Modal;
const { TabPane } = Tabs;

const DeliveryResult = () => {
  const ds = () =>
    new DataSet({
      ...ListDS(),
    });
  const listDS = useDataSet(ds, DeliveryResult);

  const [showMore, toggleShowMore] = useState(false);
  const [activeKey, setActiveKey] = useState('wait');

  function tabsArr() {
    return [
      {
        code: 'already',
        title: '已回复',
        component: <TabComponent ds={listDS} tabType="already" />,
      },
      { code: 'wait', title: '待回复', component: <TabComponent ds={listDS} tabType="wait" /> },
    ];
  }

  function handleToggle() {
    toggleShowMore(!showMore);
  }

  /**
   *重置
   */
  async function handleReset() {
    listDS.queryDataSet.current.reset();
    await listDS.query();
    toggleShowMore(false);
  }

  /**
   *查询
   * @returns
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (activeKey === 'wait') {
      listDS.queryParameter = {
        attribute4Status: 1,
      };
    } else {
      listDS.queryParameter = {
        attribute4Status: 2,
      };
    }
    await listDS.query();
    toggleShowMore(false);
  }

  function handleCancel() {
    toggleShowMore(false);
  }

  async function handleTabChange(value) {
    setActiveKey(value);
    if (value === 'wait') {
      listDS.queryParameter = {
        attribute4Status: 1,
      };
    } else {
      listDS.queryParameter = {
        attribute4Status: 2,
      };
    }
    await listDS.query();
  }

  return (
    <div className="lisp-delivery-result">
      <Header title="交期结果查询">
        <Button color="primary" onClick={handleSearch}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        <span className="more-btn" onClick={handleToggle}>
          更多
          <Icon type="expand_more" />
        </span>
        <Lov dataSet={listDS.queryDataSet} name="attribute1" placeholder="采购中心" noCache />
        <Lov dataSet={listDS.queryDataSet} name="attribute2" placeholder="采购订单号" noCache />
        <Lov dataSet={listDS.queryDataSet} name="attribute6" placeholder="供应商" noCache />
      </Header>
      {/* {activeKey === 'already' && (
        <div className="sub-header">
          <Button icon="assignment-o">排产计划</Button>
          <Button icon="verified_user-o">质检信息</Button>
        </div>
      )} */}
      <div className="content">
        <Tabs defaultActiveKey="already" animated={false} onChange={handleTabChange}>
          {tabsArr().map((tab) => (
            <TabPane tab={tab.title} key={tab.code}>
              {tab.component}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <Sidebar
        title="筛选"
        className="lisp-delivery-result-more-modal"
        visible={showMore}
        onCancel={handleCancel}
        cancelText="重置"
        okText="查询"
        width={560}
        closable
        footer={null}
        zIndex={999}
      >
        <Form className="form" dataSet={listDS.queryDataSet}>
          <Lov dataSet={listDS.queryDataSet} name="attribute1" noCache />
          <TextField dataSet={listDS.queryDataSet} name="attribute2" />
          <Lov dataSet={listDS.queryDataSet} name="attribute6" noCache />
          <Lov dataSet={listDS.queryDataSet} name="attribute3" noCache />
          <Lov dataSet={listDS.queryDataSet} name="attribute5" noCache />
          <Lov dataSet={listDS.queryDataSet} name="attribute15" noCache />
          <DatePicker name="demandDateStart" />
          <DatePicker name="promisedDateStart" />
        </Form>
        <div className="foot-btn">
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </Sidebar>
    </div>
  );
};

export default formatterCollections({
  code: ['lisp.deliveryResult', 'lisp.common'],
})(DeliveryResult);
