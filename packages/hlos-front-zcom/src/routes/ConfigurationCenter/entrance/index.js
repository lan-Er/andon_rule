/*
 * @Descripttion: 配置中心入口
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:26:30
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-25 11:29:20
 */

import React, { Fragment } from 'react';
import { Tabs, Menu, Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import './index.less';

const intlPrefix = 'zcom.configurationCenter';

const { TabPane } = Tabs;

function ZcomConfigurationCenter(props) {
  const goList = (path) => {
    props.history.push(path);
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('配置中心')} />
      <Content className="zcom-configuration-center">
        <Tabs defaultActiveKey="1">
          <TabPane tab="核企" key="1" className="zcom-configuration-tab">
            <Menu defaultSelectedKeys={['1']} mode="inline" inlineCollapsed={false}>
              <Menu.Item key="1">
                <Icon type="pie_chart_outlined" />
                <span>对账管理</span>
              </Menu.Item>
            </Menu>
            <div>
              <div className="conf-title">对账单管理</div>
              <div className="conf-content">
                <div>
                  <p>对账规则设置</p>
                  <p
                    onClick={() => {
                      goList('/zcom/configuration-center/list');
                    }}
                  >
                    进入定义列表
                  </p>
                </div>
                <p>配置采用不同对账方式的对账规则</p>
              </div>

              <div className="conf-content">
                <div>
                  <p>允许账单修改价格</p>
                  <p
                    onClick={() => {
                      goList('/zcom/configuration-center/price-list');
                    }}
                  >
                    进入定义列表
                  </p>
                </div>
                <p>勾选并定义规则后，所定义核企与供应商允许修改对账单价格</p>
              </div>
            </div>
          </TabPane>
          <TabPane tab="供应商" key="2" />
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
