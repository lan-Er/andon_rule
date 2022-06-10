/*
 * @Descripttion: 总览页签
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-30 16:15:59
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-30 20:43:05
 */

import React, { Fragment, Component } from 'react';
// import { DataSet, Button, Lov } from 'choerodon-ui/pro';
// import { Header, Content } from 'components/Page';
// import { Bind } from 'lodash-decorators';
import OrderView from './OrderView';
// import OrderExecute from './OrderExecute';
import TroubleOrder from './TroubleOrder';
import QualityChart from './QualityChart';
// import TimeChart from './TimeChart';
import OrderChart from './OrderChart';
import './index.less';

export default class SupplierOverView extends Component {
  render() {
    const { supplier } = this.props;
    return (
      <Fragment>
        <div className="supply-view-new">
          <div className="chart-content">
            <div className="content-left">
              <OrderView supplier={supplier} />
              {/* <OrderExecute supplier={supplier} /> */}
            </div>
            <div className="content-right">
              <OrderChart supplier={supplier} />
            </div>
          </div>
          <div className="chart-footer">
            <div className="content-left">
              <TroubleOrder supplier={supplier} />
            </div>
            <div className="content-right">
              <QualityChart supplier={supplier} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
