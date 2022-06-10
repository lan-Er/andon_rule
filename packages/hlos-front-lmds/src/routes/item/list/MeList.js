/**
 * @Description: 物料制造页面管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-28 14:21:24
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
import MeListDS from '../stores/MeListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...MeListDS(),
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
export default class MeList extends PureComponent {
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
      { name: 'itemMeType', width: 150 },
      { name: 'meCategoryObj', width: 150 },
      { name: 'makeBuyCode', width: 150 },
      { name: 'supplyType', width: 150 },
      { name: 'outsourcingFlag', width: 150 },
      { name: 'executeRuleObj', width: 150 },
      { name: 'inspectionRuleObj', width: 150 },
      { name: 'dispatchRuleObj', width: 150 },
      { name: 'packingRuleObj', width: 150 },
      { name: 'reworkRuleObj', width: 150 },
      { name: 'lotControlType', width: 150 },
      { name: 'numberRuleObj', width: 150 },
      { name: 'issueControlType', width: 150 },
      { name: 'issueControlValue', width: 150 },
      { name: 'completeControlType', width: 150 },
      { name: 'completeControlValue', width: 150 },
      { name: 'issueWarehouseObj', width: 150 },
      { name: 'issueWmAreaObj', width: 150 },
      { name: 'completeWarehouseObj', width: 150 },
      { name: 'completeWmAreaObj', width: 150 },
      { name: 'inventoryWarehouseObj', width: 150 },
      { name: 'inventoryWmAreaObj', width: 150 },
      { name: 'tagTemplate', width: 150 },
      { name: 'referenceDocument', width: 150 },
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
