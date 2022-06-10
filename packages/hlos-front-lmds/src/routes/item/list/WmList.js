/**
 * @Description: 物料仓储页面管理信息--Index
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
import WmListDS from '../stores/WmListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...WmListDS(),
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
      { name: 'wmOuName', width: 150, lock: true },
      { name: 'organizationObj', width: 150 },
      { name: 'itemWmType', width: 150 },
      { name: 'wmCategoryObj', width: 150 },
      { name: 'uomObj', width: 150 },
      { name: 'wmWorkerObj', width: 150 },
      { name: 'abcType', width: 150 },
      { name: 'sequenceLotControl', width: 150 },
      { name: 'tagFlag', width: 150 },
      { name: 'reservationRuleObj', width: 150 },
      { name: 'fifoRuleObj', width: 150 },
      { name: 'storageRuleObj', width: 150 },
      { name: 'pickRuleObj', width: 150 },
      { name: 'replenishRuleObj', width: 150 },
      { name: 'waveDeliveryRuleObj', width: 150 },
      { name: 'packingRuleObj', width: 150 },
      { name: 'wmInspectRuleObj', width: 150 },
      { name: 'cycleCountRuleObj', width: 150 },
      { name: 'economicQty', width: 150 },
      { name: 'storageMaxQty', width: 150 },
      { name: 'storageMinQty', width: 150 },
      { name: 'packingMaterial', width: 150 },
      { name: 'packingFormat', width: 150 },
      { name: 'minPackingQty', width: 150 },
      { name: 'packingQty', width: 150 },
      { name: 'containerQty', width: 150 },
      { name: 'palletContainerQty', width: 150 },
      { name: 'storageWarehouseObj', width: 150 },
      { name: 'storageWmAreaObj', width: 150 },
      { name: 'storageWmUnitObj', width: 150 },
      { name: 'pickWarehouseObj', width: 150 },
      { name: 'pickWmAreaObj', width: 150 },
      { name: 'pickWmUnitObj', width: 150 },
      { name: 'expireControlFlag', width: 150 },
      { name: 'expireControlType', width: 150 },
      { name: 'expireDays', width: 150 },
      { name: 'expireAlertDays', width: 150 },
      { name: 'expireLeadDays', width: 150 },
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
