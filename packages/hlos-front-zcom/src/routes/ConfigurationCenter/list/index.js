/*
 * @Descripttion: 配置中心
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:03:18
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-04 17:13:51
 */

import React, { useState, Fragment } from 'react';
import { Tabs } from 'choerodon-ui';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentUser } from 'utils/utils';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';

import { NoAccountRuleDS, AccountRuleDS } from '../store/AccountRuleDS';
import './index.less';

const intlPrefix = 'zcom.configurationCenter';

const { TabPane } = Tabs;

function ZcomConfigurationCenter(props) {
  const [currentTab, setCurrentTab] = useState('NO_RECONCILIATION');

  const noAccountRuleDS = new DataSet(NoAccountRuleDS());
  const accountRuleDS = new DataSet(AccountRuleDS());

  const columns = [
    {
      name: 'poTypeCode',
      editor: true,
      align: 'center',
    },
    {
      name: 'customerTenantName',
      editor: false,
      align: 'center',
    },
    {
      name: 'supplierNumber',
      align: 'center',
      renderer: ({ record }) => {
        const id = record.get('orderConfigId');
        return <a onClick={() => handleToDetail(id)}>查看供应商列表</a>;
      },
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  /**
   * 创建头信息
   */
  const handleCreate = () => {
    const { tenantId, tenantName } = getCurrentUser();
    const params = {
      customerTenantId: tenantId,
      customerTenantName: tenantName,
      tenantId,
      orderConfigType: currentTab,
    };
    if (currentTab === 'NO_RECONCILIATION') {
      noAccountRuleDS.create(params, 0);
      return;
    }
    accountRuleDS.create(params, 0);
  };

  /**
   * 跳转到详情
   */
  const handleToDetail = (id) => {
    if (!id) {
      return;
    }

    const pathName = `/zcom/configuration-center/detail/${currentTab}/${id}`;
    props.history.push(pathName);
  };

  /**
   * 监听tab修改
   */
  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  /**
   * 删除头信息
   * @param {*} record 行记录
   */
  const handleDelhead = async (ds) => {
    const { selected } = ds;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const res = await ds.delete(selected);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      ds.query();
    }
  };

  return (
    <Fragment>
      <Header
        backPath="/zcom/configuration-center/entrance"
        title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('对账规则列表')}
      >
        <Button onClick={handleCreate}>新建</Button>
        <Button
          onClick={() =>
            handleDelhead(currentTab === 'NO_RECONCILIATION' ? noAccountRuleDS : accountRuleDS)
          }
        >
          删除
        </Button>
      </Header>

      <Content className="zcom-requirement-release">
        <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
          <TabPane tab="无需对账" key="NO_RECONCILIATION">
            <Table
              dataSet={noAccountRuleDS}
              columns={columns}
              columnResizable="true"
              queryFieldsLimit={4}
              editMode="inline"
            />
          </TabPane>
          <TabPane tab="对账规则" key="RECONCILIATION">
            <Table
              dataSet={accountRuleDS}
              columns={columns}
              columnResizable="true"
              queryFieldsLimit={4}
              editMode="inline"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomConfigurationCenter {...props} />;
});
