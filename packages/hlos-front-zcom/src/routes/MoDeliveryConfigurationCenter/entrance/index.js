/**
 * @Description: 送货单配置中心入口
 * @Author: yu.yang06@hand-china.com
 * @Date: 2021-04-25 12:58:01
 */

import React, { Fragment } from 'react';
import { Tabs, Menu } from 'choerodon-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.moDeliveryConfigurationCenter';

function ZcomMoDeliveryConfigurationcenter(props) {
  const goList = (path) => {
    props.history.push(path);
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.moDeliveryConfigurationCenter`).d('配置中心')}
      />
      <Content className={styles['zcom-mo-delivery-configuration-center']}>
        <Tabs defaultActiveKey="coreCompany">
          <TabPane tab="核企" key="coreCompany" className={styles['zcom-configuration-tab']}>
            <Menu defaultSelectedKeys={['coreCompany']} mode="inline" inlineCollapsed={false}>
              <Menu.Item key="coreCompany">
                <span>送货单管理</span>
              </Menu.Item>
            </Menu>
            <div>
              <div className={styles['conf-title']}>送货单配置中心</div>
              <div className={styles['conf-content']}>
                <div>
                  <p>送货单审核配置</p>
                  <p
                    onClick={() => {
                      goList('/zcom/mo-delivery-configuration-center/foundry-list');
                    }}
                  >
                    进入定义列表
                  </p>
                </div>
                <p>配置供应商不同的送货单类型审批规则</p>
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
  return <ZcomMoDeliveryConfigurationcenter {...props} />;
});
