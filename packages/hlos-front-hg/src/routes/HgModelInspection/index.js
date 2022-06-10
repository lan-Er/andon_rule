/*
 * @Description: 恒光-试模检
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-21 15:07:10
 */
import React from 'react';
import {
  Button,
  Modal,
  Form,
  DataSet,
  Lov,
  DateTimePicker,
  Pagination,
  Icon,
} from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import { queryLovData } from 'hlos-front/lib/services/api';

import { inspectionQueryDS } from '../../stores/hgModelInspectionDS.js';

import Card from './components/card.js';
import './index.less';

class ModelInspection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.location.query ? this.props.location.query.active : 'NEW',
      defaultInfo: {},
      totalElements: 0,
      inspectionList: [],
      currentPage: 0,
    };
  }

  mDS = new DataSet(inspectionQueryDS());

  queryFields = [
    <Lov name="organizationObj" key="organizationObj" placeholder="请选择组织" />,
    <Lov name="inspectionObj" key="inspectionObj" placeholder="请选择检验单号" />,
    <DateTimePicker name="createDateMin" key="createDateMin" placeholder="请选择时间" />,
    <DateTimePicker name="createDateMax" key="createDateMax" placeholder="请选择时间" />,
  ];

  async componentDidMount() {
    const res = await queryLovData({
      lovCode: 'LMDS.WORKER',
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content.length) {
      this.mDS.queryDataSet.current.set('organizationId', res.content[0].organizationId);
      this.mDS.queryDataSet.current.set('organizationName', res.content[0].organizationName);
      this.setState({
        defaultInfo: res.content[0],
      });
    }
    await this.handleSearch();
  }

  // // 页签切换
  // handleChangeActive = async (active) => {
  //   await this.handleSearch(active);
  //   this.setState({
  //     active,
  //   });
  // };

  // 查询
  handleSearch = async (page = this.state.currentPage) => {
    this.mDS.setQueryParameter('inspectionTemplateType', 'FQC.NORMAL');
    this.mDS.setQueryParameter('page', page);
    // this.mDS.setQueryParameter('qcStatus', active);
    const resp = await this.mDS.query();
    if (resp && resp.content) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        totalElements: resp.totalElements,
        inspectionList: list,
      });
    }
  };

  // 筛选
  handleModal = () => {
    Modal.open({
      key: 'hg-model-inspection',
      title: '筛选',
      className: 'hg-model-inspection-filter-modal',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <div>
          <Form dataSet={this.mDS.queryDataSet}>{this.queryFields}</Form>
        </div>
      ),
      onOk: () => this.handleSearch(),
    });
  };

  // 跳转到执行页面
  handleToDetails = (record) => {
    const pathname = '/pub/hg/hg-model-inspection/execute';
    this.props.history.push({
      pathname,
      state: {
        ...record,
        ...this.state.defaultInfo,
        active: this.state.active,
      },
    });
  };

  sizeChangerRenderer = ({ text }) => {
    return `${text} 条/页`;
  };

  pagerRenderer = (page, type) => {
    switch (type) {
      case 'first':
        return <Icon type="fast_rewind" />;
      case 'last':
        return <Icon type="fast_forward" />;
      case 'prev':
        return <Icon type="navigate_before" />;
      case 'next':
        return <Icon type="navigate_next" />;
      case 'jump-prev':
      case 'jump-next':
        return '•••';
      default:
        return page;
    }
  };

  handlePageChange = async (page) => {
    this.handleSearch(page - 1);
    this.setState({
      currentPage: page - 1,
    });
  };

  render() {
    return (
      <div className="hg-model-inspection">
        <div className="header">
          {/* <div className="header-left">
            <Button
              className={this.state.active === 'NEW' ? 'active' : null}
              onClick={() => this.handleChangeActive('NEW')}
            >
              待检验
            </Button>
            <Button
              className={this.state.active === 'ONGOING' ? 'active' : null}
              onClick={() => this.handleChangeActive('ONGOING')}
            >
              待处理
            </Button>
          </div> */}
          <div className="header-right">
            <Button icon="filter2" color="primary" onClick={this.handleModal}>
              筛选
            </Button>
          </div>
        </div>
        <div className="sub-header">共搜索到 {this.state.totalElements} 条数据</div>
        <div className="hg-model-inspection-content">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 25%)',
            }}
          >
            {this.state.inspectionList.map((ele) => {
              return (
                <Card key={uuidv4()} {...ele} handleToDetails={() => this.handleToDetails(ele)} />
              );
            })}
          </div>
        </div>
        <div className="hg-model-inspection-footer">
          <Pagination
            showSizeChangerLabel={false}
            showTotal={false}
            showPager
            sizeChangerPosition="center"
            sizeChangerOptionRenderer={this.sizeChangerRenderer}
            itemRender={this.pagerRenderer}
            total={this.state.totalElements}
            onChange={this.handlePageChange}
            pageSize={100}
            page={this.state.currentPage + 1}
          />
        </div>
      </div>
    );
  }
}

export default ModelInspection;
