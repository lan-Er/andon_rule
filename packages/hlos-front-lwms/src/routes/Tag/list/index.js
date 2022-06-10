/**
 * @Description: 实物标签管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:54:15
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import {
  DataSet,
  Lov,
  Form,
  TextField,
  Tabs,
  Switch,
  Button,
  Select,
  Pagination,
} from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import { openTab } from 'utils/menuTab';
import { Header, Content } from 'components/Page';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { routerRedux } from 'dva/router';

import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';

import { tagHeaderDS, tagListDS } from '@/stores/tagDS';
import ThingList from './ThingList';
import TagList from './TagList';

import './style.less';

const preCode = 'lwms.tag';
const { TabPane } = Tabs;
const { common } = codeConfig.code;
const tId = getCurrentOrganizationId();

@connect(({ TagModel }) => ({
  tagDataObj: TagModel.tagDataObj || {},
}))
@formatterCollections({
  code: ['lwms.tag', 'lwms.common'],
})
@withProps(
  () => {
    const headerDS = new DataSet({
      ...tagHeaderDS(),
    });
    const tableDS = new DataSet({
      ...tagListDS(),
    });
    return {
      headerDS,
      tableDS,
    };
  },
  { cacheState: true }
)
export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
    };
  }

  async componentDidMount() {
    const {
      hidden,
      showLoading,
      currentPage,
      size,
      totalElements,
      dataSource,
      tableHeight,
    } = this.props.tagDataObj;
    if (
      this.props.location.query &&
      this.props.location.query.back === -1 &&
      dataSource.length // 考虑到刷新redux值清空
    ) {
      this.setState({
        hidden,
        showLoading,
        currentPage,
        size,
        totalElements,
        dataSource,
        tableHeight,
      });
      return;
    }

    if (this.props.headerDS.current) {
      return;
    }
    await this.props.headerDS.create({}, 0);

    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (res.content[0]) {
        this.props.headerDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  get tabsArr() {
    const { dataSource, tableHeight, showLoading } = this.state;
    return [
      {
        code: 'thing',
        title: '实物',
        component: (
          <ThingList
            dataSource={dataSource}
            tableHeight={tableHeight}
            showLoading={showLoading}
            handleToHisPage={this.handleToHisPage}
          />
        ),
      },
      {
        code: 'tag',
        title: '标签',
        component: (
          <TagList
            dataSource={dataSource}
            tableHeight={tableHeight}
            showLoading={showLoading}
            handleToHisPage={this.handleToHisPage}
          />
        ),
      },
    ];
  }

  get queryFields() {
    return [
      <Lov name="organizationObj" noCache />,
      <TextField name="tagCode" />,
      <Lov name="itemObj" noCache />,
      <Lov name="warehouseObj" noCache />,
      <Lov name="wmAreaObj" noCache />,
      <TextField name="lotNumber" />,
      <Lov name="ownerObj" noCache />,
      <TextField name="outerTag" />,
      <TextField name="productTagCode" />,
      <Lov name="resourceObj" noCache />,
      <Lov name="documentObj" noCache />,
      <Select name="tagStatusList" multiple />,
      <Select name="qcStatusList" multiple />,
      <Select name="tagType" />,
      <Lov name="poNumObj" noCache />,
      <Switch name="loadThingFlag" />,
    ];
  }

  /**
   * 切换显示隐藏
   */
  @Bind()
  handleToggle() {
    const { hidden } = this.state;
    this.setState(
      {
        hidden: !hidden,
      },
      () => this.calcTableHeight(this.state.dataSource.length)
    );
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
    const validateValue = await this.props.headerDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const obj = this.props.headerDS.current.toJSONData();
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

    this.props.tableDS.queryParameter = queryParameter;
    this.setState({ showLoading: true });
    const res = await this.props.tableDS.query();
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
   * 重置
   */
  @Bind()
  handleReset() {
    this.props.headerDS.current.clear();
  }

  // 导入

  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMES.PRODUCT_CODE_BIND`,
      title: intl.get(`${preCode}.view.title.productCodeBind`).d('产品码绑定'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.productCodeBind`).d('产品码绑定'),
      }),
    });
  }

  /**
   *导出字段
   * @returns
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.props.headerDS.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName('lwms-tag-content')[0];
    const queryContainer = document.getElementsByClassName('query-options')[0];
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

  /**
   *
   *跳转到标签历史页面
   * @param record
   * @param service
   */
  @Bind()
  handleToHisPage(url, rowData) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${rowData.tagId}`,
        search: `?tagCode=${rowData.tagCode}`,
      })
    );

    const {
      hidden,
      showLoading,
      currentPage,
      size,
      totalElements,
      dataSource,
      tableHeight,
    } = this.state;

    this.props.dispatch({
      type: 'TagModel/updateState',
      payload: {
        tagDataObj: {
          hidden,
          showLoading,
          currentPage,
          size,
          totalElements,
          dataSource,
          tableHeight,
        },
      },
    });
  }

  render() {
    const { hidden, totalElements, size, currentPage } = this.state;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.thingTag`).d('实物标签')}>
          <Button onClick={this.handleBatchImport}>
            {intl.get(`${preCode}.button.productCodeBind`).d('产品码绑定')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${tId}/tag-things/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content className="lwms-tag-content">
          <div
            className="query-options"
            style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}
          >
            <Form dataSet={this.props.headerDS} columns={4} style={{ flex: '1 1 auto' }}>
              {hidden ? this.queryFields.slice(0, 4) : this.queryFields}
            </Form>
            <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleToggle}>
                {hidden
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleQuery()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
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
