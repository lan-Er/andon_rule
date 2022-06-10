/**
 * @Description: 配置中心入口
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 10:14:01
 */

import React, { Fragment } from 'react';
import { Tabs, Menu, Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.configurationCenter';

function ZcomMoConfigurationCenter(props) {
  const goList = (path) => {
    props.history.push(path);
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('配置中心')} />
      <Content className={styles['zcom-mo-configuration-center']}>
        <Tabs defaultActiveKey="coreCompany">
          <TabPane tab="核企" key="coreCompany" className={styles['zcom-configuration-tab']}>
            <Menu defaultSelectedKeys={['coreCompany']} mode="inline" inlineCollapsed={false}>
              <Menu.Item key="coreCompany">
                <Icon type="pie_chart_outlined" />
                <span>对账管理</span>
              </Menu.Item>
            </Menu>
            <div>
              <div className={styles['conf-title']}>对账单管理</div>
              <div className={styles['conf-content']}>
                <div>
                  <p>购销业务对账规则配置</p>
                  <p>进入定义列表</p>
                </div>
                <p>配置“购销业务”采用不同对账方式的对账规则</p>
              </div>
              <div className={styles['conf-content']}>
                <div>
                  <p>代工业务对账规则配置</p>
                  <p
                    onClick={() => {
                      goList('/zcom/mo-configuration-center/foundry-list');
                    }}
                  >
                    进入定义列表
                  </p>
                </div>
                <p>配置“代工业务”采用不同对账方式的对账规则</p>
              </div>
              <div className={styles['conf-content']}>
                <div>
                  <p>允许对账单修改价格</p>
                  <p>进入定义列表</p>
                </div>
                <p>勾选并定义规则后，所定义核企与供应商允许修改对账单价格</p>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomMoConfigurationCenter {...props} />;
});
