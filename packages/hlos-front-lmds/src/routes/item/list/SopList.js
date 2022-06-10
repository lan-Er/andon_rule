/**
 * @Description: 物料销售页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 15:31:46
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import SopListDS from '../stores/SopListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...SopListDS(),
      autoQuery: true,
    });
    return {
      ...props,
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class ApsList extends PureComponent {
  componentDidMount() {
    this.props.tableDS.addEventListener('query', () => {
      this.props.setExportQueryParams(this.props.tableDS.queryDataSet.current.data);
    });
  }

  componentWillUnmount() {
    this.props.tableDS.removeEventListener('query', () => {
      this.props.setExportQueryParams(this.props.tableDS.queryDataSet.current.data);
    });
  }

  get columns() {
    return [
      { name: 'meOuObj', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'description', width: 150, lock: true },
      { name: 'sopOuName', width: 150, lock: true },
      { name: 'apsOuName', width: 150 },
      { name: 'itemSopType', width: 150 },
      { name: 'sopCategoryObj', width: 150 },
      { name: 'salesmanObj', width: 150 },
      { name: 'uomObj', width: 150 },
      { name: 'sopPlanRule', width: 150 },
      { name: 'forecastRuleObj', width: 150 },
      { name: 'minStockQty', width: 150 },
      { name: 'maxStockQty', width: 150 },
      { name: 'safetyStockQty', width: 150 },
      { name: 'roundQty', width: 150 },
      { name: 'minOrderQty', width: 150 },
      { name: 'maxOrderQty', width: 150 },
      { name: 'fixedOrderQty', width: 150 },
      { name: 'fixedLotFlag', width: 150 },
      { name: 'deliveryLeadTime', width: 150 },
      { name: 'shipToleranceType', width: 150 },
      { name: 'shipTolerance', width: 150 },
      { name: 'priceListFlag', width: 150 },
      { name: 'priceList', width: 150 },
      { name: 'shipRuleObj', width: 150 },
      { name: 'transportType', width: 150 },
      { name: 'maxDayOrder', width: 150 },
      { name: 'shipWarehouseObj', width: 150 },
      { name: 'shipWmAreaObj', width: 150 },
      { name: 'customerObj', width: 150 },
      { name: 'customerItemCode', width: 150 },
      { name: 'customerItemDesc', width: 150 },
      { name: 'enabledFlag', width: 100, renderer: yesOrNoRender },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetailPage('/lmds/item/detail', record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   *
   *跳转到详情
   * @param recode
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, record, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('itemId')}`,
      })
    );
  }

  render() {
    return (
      <Fragment>
        <Table
          dataSet={this.props.tableDS}
          columns={this.columns}
          columnResizable="true"
          editMode="inline"
        />
      </Fragment>
    );
  }
}
