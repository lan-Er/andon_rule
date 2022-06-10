/**
 * @Description: 实物标签-历史列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { Tabs, DataSet, Lov, Form, Button, Pagination } from 'choerodon-ui/pro';
import querystring from 'querystring';
import { routerRedux } from 'dva/router';

import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { hisHeaderDS, tagHisListDS } from '@/stores/tagDS';
import ThingList from './ThingList';
import TagList from './TagList';
import './index.less';

const preCode = 'lwms.tag';
const { TabPane } = Tabs;

@formatterCollections({
  code: ['lwms.tag', 'lwms.common'],
})
export default class TagHisList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dsDirty: false,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    };
    this.headerDS = new DataSet({
      ...hisHeaderDS(),
    });
    this.tableDS = new DataSet({
      ...tagHisListDS(),
    });
  }

  updateState = (ds) => {
    this.setState({
      dsDirty: ds.dsDirty,
    });
  };

  async componentDidMount() {
    const {
      match,
      location: { search },
    } = this.props;
    const { tagId } = match.params;
    const extraParams = querystring.parse(search.substring(1));
    const { tagCode } = extraParams;
    const { currentPage, size } = this.state;
    if (tagId) {
      this.tableDS.queryParameter = {
        tagId,
        page: currentPage - 1,
        size,
      };
      if (tagCode) {
        this.headerDS.create(
          {
            tagObj: {
              tagId,
              tagCode,
            },
          },
          0
        );
      }
      this.setState({ showLoading: true });
      const res = await this.tableDS.query();
      if (getResponse(res) && res.content) {
        this.setState({
          dataSource: res.content,
          totalElements: res.totalElements || 0,
        });
        this.calcTableHeight(res.content.length);
      }
      this.setState({ showLoading: false });
    } else {
      this.headerDS.addEventListener('update', () => this.updateState(this.headerDS));
      this.headerDS.addEventListener('create', () => this.createState(this.headerDS));
      this.headerDS.addEventListener('remove', () => this.removeState(this.headerDS));
      this.tableDS.addEventListener('update', () => this.updateState(this.tableDS));
      this.tableDS.addEventListener('create', () => this.createState(this.tableDS));
      this.tableDS.addEventListener('remove', () => this.removeState(this.tableDS));
    }
  }

  componentWillUnmount() {
    this.headerDS.removeEventListener('update');
    this.headerDS.removeEventListener('create');
    this.headerDS.removeEventListener('remove');
    this.tableDS.removeEventListener('update');
    this.tableDS.removeEventListener('create');
    this.tableDS.removeEventListener('remove');
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lwms/tag/list',
        query: {
          back: -1,
        },
      })
    );
  }

  get tabsArr() {
    const { dataSource, tableHeight, showLoading } = this.state;
    return [
      {
        code: 'thing',
        title: '实物',
        component: (
          <ThingList dataSource={dataSource} tableHeight={tableHeight} showLoading={showLoading} />
        ),
      },
      {
        code: 'tag',
        title: '标签',
        component: (
          <TagList dataSource={dataSource} tableHeight={tableHeight} showLoading={showLoading} />
        ),
      },
    ];
  }

  handleQuery = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.handleSearch();
      }
    );
  };

  /**
   * 查询
   */
  @Bind()
  async handleSearch(page = this.state.currentPage, pageSize = this.state.size) {
    const { tagId } = this.headerDS.current.toJSONData() || {};
    if (!tagId) {
      return;
    }
    const obj = this.headerDS.current.toJSONData();
    let queryParameter = {};
    Object.keys(obj).forEach((key) => {
      if (key.indexOf('_') !== -1) {
        return;
      }
      queryParameter = {
        ...queryParameter,
        [key]: obj[key],
        page: page - 1,
        size: pageSize,
      };
    });

    this.tableDS.queryParameter = queryParameter;
    this.setState({ showLoading: true });
    const res = await this.tableDS.query();
    if (getResponse(res) && res.content) {
      this.setState({
        dataSource: res.content,
        totalElements: res.totalElements || 0,
      });
      this.calcTableHeight(res.content.length);
    }
    this.setState({ showLoading: false });
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.headerDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName('wms-tag-history')[0];
    const queryContainer = document.getElementsByClassName('wms-tag-query')[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 127;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      this.setState({ tableHeight: 80 });
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      this.setState({ tableHeight: dataLength * 30 + 33 + 10 });
    } else {
      this.setState({ tableHeight: maxTableHeight });
    }
  };

  handlePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== this.state.size) {
      pageValue = 1;
    }
    this.setState({
      currentPage: pageValue,
      size: pageSizeValue,
    });
    this.handleSearch(pageValue, pageSizeValue);
  };

  render() {
    const { match } = this.props;
    const { tagId } = match.params;
    const { totalElements, size, currentPage } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.tagHistory`).d('实物标签历史')}
          backPath={tagId ? '/lwms/tag/list' : ''}
          isChange={this.state.dsDirty}
        >
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-hiss/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content className="wms-tag-history">
          <div
            className="wms-tag-query"
            style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}
          >
            <Form dataSet={this.headerDS} columns={3} style={{ flex: '1 1 auto' }}>
              <Lov name="tagObj" noCache disabled={tagId} />
            </Form>
            <Button color="primary" onClick={this.handleQuery}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
          <Tabs defaultActiveKey="thing">
            {this.tabsArr.map((tab) => (
              <TabPane
                tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                key={tab.code}
              >
                {tab.component}
              </TabPane>
            ))}
          </Tabs>
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={this.handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </Content>
      </Fragment>
    );
  }
}
