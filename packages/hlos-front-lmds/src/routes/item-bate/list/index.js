/**
 * @Description: 物料管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:18:24
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import statusConfig from '@/common/statusConfig';
import MainList from './MainList';
import ScmList from './ScmList';
import MeList from './MeList';
import ApsList from './ApsList';
import WmList from './WmList';
import SopList from './SopList';

const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;
const preCode = 'lmds.item';
const {
  importTemplateCode: { item },
} = statusConfig.statusValue.lmds;

@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class ItemIndex extends Component {
  get tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <MainList setExportQueryParams={this.setExportQueryParams} />,
      },
      {
        code: 'scm',
        title: '采购',
        component: <ScmList setExportQueryParams={this.setExportQueryParams} />,
      },
      {
        code: 'me',
        title: '制造',
        component: <MeList setExportQueryParams={this.setExportQueryParams} />,
      },
      {
        code: 'aps',
        title: '计划',
        component: <ApsList setExportQueryParams={this.setExportQueryParams} />,
      },
      {
        code: 'wm',
        title: '仓储',
        component: <WmList setExportQueryParams={this.setExportQueryParams} />,
      },
      {
        code: 'sop',
        title: '销售',
        component: <SopList setExportQueryParams={this.setExportQueryParams} />,
      },
    ];
  }

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

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/${item}`,
      title: intl.get(`${preCode}.view.title.import`).d('物料导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('物料导入'),
      }),
    });
  }

  // 导出
  @Bind()
  getExportQueryParams() {
    return {
      ...this.state.queryParams,
    };
  }

  @Bind()
  setExportQueryParams(queryParams) {
    this.setState({
      queryParams,
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.more.meOu.item`).d('多工厂物料')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/item-multiplant/create')}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/items/export`}
            queryParams={this.getExportQueryParams}
            exportAsync="true"
          />
        </Header>
        <Content className="item-bate-list-content" style={{ height: '100%' }}>
          <Tabs defaultActiveKey="main" animated={false}>
            {this.tabsArr.map((tab) => (
              <TabPane
                tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                key={tab.code}
              >
                {tab.component}
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
