/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-07 11:13:39
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-07 14:15:28
 */
import React, { PureComponent } from 'react';
import { Divider } from 'hzero-ui';
import classNames from 'classnames';
import { connect } from 'dva';

import { Content } from 'components/Page';

import { Route, Switch, Link, Redirect } from 'dva/router';
import { getRoutes } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import style from './index.less';

@connect(({ global }) => ({
  routerData: global.routerData,
}))
@formatterCollections({ code: 'hpfm.orgInfo' })
export default class OrgInfo extends PureComponent {
  state = {
    commonSourceCode: 'SYSTEM',
    commonExternalSystemCode: 'SYSTEM',
  };

  render() {
    const { routerData, match, location } = this.props;
    const { commonSourceCode, commonExternalSystemCode } = this.state;
    const hpfmLeftRouter = {
      '/zmda/org-info/company': intl.get('hpfm.orgInfo.view.message.route.company').d('公司'),
      '/zmda/org-info/operation-unit': intl
        .get('hpfm.orgInfo.view.message.route.operationUnit')
        .d('业务实体'),
      '/zmda/org-info/inventory-org': intl
        .get('hpfm.orgInfo.view.message.route.inventoryOrg')
        .d('库存组织'),
      '/zmda/org-info/store-room': intl.get('hpfm.orgInfo.view.message.route.storeRoom').d('库房'),
      '/zmda/org-info/library-position': intl
        .get('hpfm.orgInfo.view.message.route.libraryPosition')
        .d('库位'),
    };
    // const spfmLeftRouter = {
    //   '/spfm/org-info/company': intl.get('hpfm.orgInfo.view.message.route.company').d('公司'),
    //   '/spfm/org-info/operation-unit': intl
    //     .get('hpfm.orgInfo.view.message.route.operationUnit')
    //     .d('业务实体'),
    //   '/spfm/org-info/inventory-org': intl
    //     .get('hpfm.orgInfo.view.message.route.inventoryOrg')
    //     .d('库存组织'),
    //   '/spfm/org-info/store-room': intl.get('hpfm.orgInfo.view.message.route.storeRoom').d('库房'),
    //   '/spfm/org-info/library-position': intl
    //     .get('hpfm.orgInfo.view.message.route.libraryPosition')
    //     .d('库位'),
    // };
    return (
      <React.Fragment>
        <Content className={style['org-info']} noCard>
          <div className={style['org-info-left']}>
            <div
              className={classNames({
                [style['orgchart-item']]: true,
                [style['orgchart-light']]:
                  location.pathname.includes('group') || location.pathname === '/zmda/org-info',
              })}
            >
              <Link to="/zmda/org-info/group" className={style.link}>
                {intl.get('hpfm.orgInfo.view.message.route.group').d('集团')}
              </Link>
            </div>
            <Divider dashed type="vertical" className={style.divider} />
            <div className={style.orgchart}>
              <div style={{ width: '100px', margin: 'auto' }}>
                {Object.keys(hpfmLeftRouter).map((item, index) => {
                  return (
                    <React.Fragment key={item}>
                      {index !== 0 && <Divider dashed type="vertical" className={style.divider} />}
                      <div
                        className={classNames({
                          [style['orgchart-item']]: true,
                          [style['orgchart-light']]: location.pathname.includes(item),
                        })}
                      >
                        <Link to={item} className={style.link}>
                          {hpfmLeftRouter[item]}
                        </Link>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={style['org-info-right']}>
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
              <Redirect form="/zmda/org-info" to="/zmda/org-info/group" />
            </Switch>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
