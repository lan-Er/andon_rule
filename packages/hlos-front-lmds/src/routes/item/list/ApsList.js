/**
 * @Description: 物料计划页面管理信息--Index
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
import ApsListDS from '../stores/ApsListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...ApsListDS(),
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
      { name: 'apsOuName', width: 150, lock: true },
      { name: 'organizationObj', width: 150 },
      { name: 'itemApsType', width: 150 },
      { name: 'apsCategoryObj', width: 150 },
      { name: 'planObj', width: 150 },
      { name: 'plannerObj', width: 150 },
      { name: 'resourceRule', width: 150 },
      { name: 'apsResourceObj', width: 150 },
      { name: 'releaseRuleObj', width: 150 },
      { name: 'mtoFlag', width: 150 },
      { name: 'planFlag', width: 150 },
      { name: 'keyComponentFlag', width: 150 },
      { name: 'preProcessLeadTime', width: 150 },
      { name: 'processLeadTime', width: 150 },
      { name: 'postProcessLeadTime', width: 150 },
      { name: 'safetyLeadTime', width: 150 },
      { name: 'exceedLeadTime', width: 150 },
      { name: 'demandTimeFence', width: 150 },
      { name: 'orderTimeFence', width: 150 },
      { name: 'releaseTimeFence', width: 150 },
      { name: 'demandMergeTimeFence', width: 150 },
      { name: 'supplyMergeTimeFence', width: 150 },
      { name: 'safetyStockMethod', width: 150 },
      { name: 'safetyStockPeriod', width: 150 },
      { name: 'safetyStockValue', width: 150 },
      { name: 'minStockQty', width: 150 },
      { name: 'maxStockQty', width: 150 },
      { name: 'capacityTimeFence', width: 150 },
      { name: 'capacityValue', width: 150 },
      { name: 'assemblyShrinkage', width: 150 },
      { name: 'economicLotSize', width: 150 },
      { name: 'economicSplitParameter', width: 150 },
      { name: 'minOrderQty', width: 150 },
      { name: 'fixedLotMultiple', width: 150 },
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
