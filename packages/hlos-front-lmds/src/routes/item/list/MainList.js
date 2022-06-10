/**
 * @Description: 物料主页面管理信息--Index
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

import MainListDS from '../stores/MainListDS';

@connect((state) => state)
@withProps(
  (props) => {
    const tableDS = new DataSet({
      ...MainListDS(),
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
export default class MainList extends PureComponent {
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
      { name: 'itemCode', editor: true, width: 150, lock: true },
      { name: 'description', editor: true, width: 150, lock: true },
      { name: 'itemAlias', editor: true, width: 150 },
      { name: 'shortCode', editor: true, width: 150 },
      { name: 'itemType', editor: true, width: 150 },
      { name: 'mdsCategoryObj', editor: true, width: 150 },
      { name: 'designCode', editor: true, width: 150 },
      { name: 'specification', editor: true, width: 150 },
      { name: 'uomObj', editor: true, width: 150 },
      { name: 'secondUomObj', editor: true, width: 150 },
      { name: 'uomConversionValue', editor: true, width: 150 },
      { name: 'length', editor: true, width: 150 },
      { name: 'width', editor: true, width: 150 },
      { name: 'height', editor: true, width: 150 },
      { name: 'uolCode', editor: true, width: 150 },
      { name: 'area', editor: true, width: 150 },
      { name: 'uoaCode', editor: true, width: 150 },
      { name: 'volume', editor: true, width: 150 },
      { name: 'uovCode', editor: true, width: 150 },
      { name: 'unitWeight', editor: true, width: 150 },
      { name: 'grossWeight', editor: true, width: 150 },
      { name: 'uowCode', editor: true, width: 150 },
      { name: 'itemIdentifyCode', editor: true, width: 150 },
      { name: 'drawingCode', editor: true, width: 150 },
      { name: 'featureCode', editor: true, width: 150 },
      { name: 'featureDesc', editor: true, width: 150 },
      { name: 'packingGroup', editor: true, width: 150 },
      { name: 'hazardClass', editor: true, width: 150 },
      { name: 'unNumber', editor: true, width: 150 },
      { name: 'standardCost', editor: true, width: 150 },
      { name: 'standardSalesPrice', editor: true, width: 150 },
      { name: 'externalItemCodeObj', editor: true, width: 150 },
      { name: 'externalDescription', width: 150 },
      { name: 'fileUrl', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
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
          buttons={this.buttons}
          columnResizable="true"
          editMode="inline"
        />
      </Fragment>
    );
  }
}
