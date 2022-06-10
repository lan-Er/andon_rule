/**
 * @Description: 配置中心
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-11 17:32:15
 */

import { connect } from 'dva';
import React, { useState, Fragment } from 'react';
import { Route, Switch, Link, Redirect } from 'dva/router';
import classNames from 'classnames';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getRoutes } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const intlPrefix = 'zmda.configurationCenter';

function ZmdaConfigurationCenter({ location, match, routerData }) {
  const leftRouter = {
    '/zmda/configuration-center/delivery': intl
      .get('zmda.configuration.view.message.route.delivery')
      .d('发货管理'),
    '/zmda/configuration-center/news': intl
      .get('zmda.configuration.view.message.route.news')
      .d('消息通知'),
    '/zmda/configuration-center/template': intl
      .get('zmda.configuration.view.message.route.news')
      .d('打印模板'),
  };

  const [commonSourceCode] = useState('SYSTEM');
  const [commonExternalSystemCode] = useState('SYSTEM');

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('配置中心')} />
      <Content className={styles['zmda-configuration-center-content']}>
        <div className={styles['content-left']}>
          <div className={styles['left-area']}>
            {Object.keys(leftRouter).map((item) => {
              return (
                <React.Fragment key={item}>
                  <div
                    className={classNames({
                      [styles['left-item']]: true,
                      [styles['left-light']]: location.pathname.includes(item),
                    })}
                  >
                    <Link to={item}>{leftRouter[item]}</Link>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className={styles['content-right']}>
          <Switch>
            {getRoutes(match.path, routerData).map((item) => {
              const InfoComp = item.component;
              return (
                <Route
                  key={item.key}
                  path={item.path}
                  render={(props) => (
                    <InfoComp
                      {...props}
                      key={item.key}
                      commonSourceCode={commonSourceCode}
                      commonExternalSystemCode={commonExternalSystemCode}
                    />
                  )}
                  exact={item.exact}
                />
              );
            })}
            <Redirect form="/zmda/configuration-center" to="/zmda/configuration-center/delivery" />
          </Switch>
        </div>
      </Content>
    </Fragment>
  );
}

export default connect(({ global }) => ({
  routerData: global.routerData,
}))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZmdaConfigurationCenter)
);
