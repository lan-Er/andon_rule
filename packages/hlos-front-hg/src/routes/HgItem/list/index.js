/**
 * @Description: 物料管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:18:24
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, DataSet, Table } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import withProps from 'utils/withProps';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { ListDS } from '@/stores/itemDS';

const preCode = 'hg.item';

@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ListDS(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@formatterCollections({
  code: ['hg.item', 'hg.common'],
})
export default class ItemIndex extends Component {
  /**
   * 跳转到新建页面
   * @param url
   * @param e
   */
  @Bind()
  handleCreate(url, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  get columns() {
    return [
      { name: 'itemCode', width: 150, lock: true },
      { name: 'description', width: 150, lock: true },
      { name: 'itemAlias', width: 150, lock: true },
      { name: 'itemType', width: 150 },
      { name: 'uomName', width: 150 },
      { name: 'specification', width: 150 },
      { name: 'featureCode', width: 150 },
      { name: 'featureDesc', width: 150 },
      { name: 'length', width: 150 },
      { name: 'width', width: 150 },
      { name: 'height', width: 150 },
      {
        name: 'attributeTinyint1',
        width: 100,
        align: 'center',
        renderer: this.yesOrNoRender,
      },
      { name: 'lastUpdatedName', width: 150 },
      { name: 'meOuName', width: 150 },
      { name: 'attributeBigint1', width: 150 },
      { name: 'attributeString1', width: 150 },
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
              onClick={() => this.handleToDetailPage('/hg/item/detail', record)}
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

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/HG.LMDS.ITEM`,
      title: intl.get(`${preCode}.view.title.import`).d('导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.item`).d('物料')}>
          <Button icon="add" color="primary" onClick={() => this.handleCreate('/hg/item/create')}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            buttons={this.buttons}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
