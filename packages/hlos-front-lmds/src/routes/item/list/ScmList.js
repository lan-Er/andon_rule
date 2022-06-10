/**
 * @Description: 物料采购页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
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
import ScmListDS from '../stores/ScmListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...ScmListDS(),
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
export default class ScmList extends PureComponent {
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
      { name: 'meOuObj', editor: true, width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'description', width: 150, lock: true },
      { name: 'scmOuName', width: 150, lock: true },
      { name: 'organizationObj', width: 150 },
      { name: 'itemScmType', width: 150 },
      { name: 'scmCategoryObj', width: 150 },
      { name: 'buyerObj', width: 150 },
      { name: 'uomObj', width: 150 },
      { name: 'scmPlanRule', width: 150 },
      { name: 'eoq', width: 150 },
      { name: 'minStockQty', width: 150 },
      { name: 'maxStockQty', width: 150 },
      { name: 'safetyStockQty', width: 150 },
      { name: 'roundQty', width: 150 },
      { name: 'minOrderQty', width: 150 },
      { name: 'maxOrderQty', width: 150 },
      { name: 'fixedOrderQty', width: 150 },
      { name: 'fixedLotFlag', width: 100 },
      { name: 'vmiFlag', width: 100 },
      { name: 'marketPrice', width: 150 },
      { name: 'purchasePrice', width: 150 },
      { name: 'taxable', width: 150 },
      { name: 'currencyObj', width: 150 },
      { name: 'priceTolerance', width: 150 },
      { name: 'receiveToleranceType', width: 150 },
      { name: 'receiveTolerance', width: 150 },
      { name: 'invoiceTolerance', width: 150 },
      { name: 'aslFlag', width: 100 },
      { name: 'rfqFlag', width: 100 },
      { name: 'bondedFlag', width: 100 },
      { name: 'maxDayOrder', width: 150 },
      { name: 'leadTime', width: 150 },
      { name: 'receiveRule', width: 150 },
      { name: 'receiveWarehouseObj', width: 150 },
      { name: 'receiveWmAreaObj', width: 150 },
      { name: 'inventoryWarehouseObj', width: 150 },
      { name: 'inventoryWmAreaObj', width: 150 },
      { name: 'supplierObj', width: 150 },
      { name: 'supplierItemCode', width: 150 },
      { name: 'supplierItemDesc', width: 150 },
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
