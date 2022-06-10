/*
 * @Description: 恒光检验判定
 * @Author: zmt
 * @LastEditTime: 2021-02-25 14:15:38
 */

import React, { Fragment } from 'react';
import { Header } from 'components/Page';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  DataSet,
  Button,
  Row,
  Col,
  Icon,
  Form,
  Lov,
  DateTimePicker,
  Modal,
  Pagination,
} from 'choerodon-ui/pro';

import withProps from 'utils/withProps';
import { queryLovData } from 'hlos-front/lib/services/api';
import { queryHgJudgeAreaStatus } from '../../services/hgInspectionJudgmentService.js';
import { inspectionQueryDS } from '../../stores/hgInspectionJudgmentDS';
import './index.less';

import Card from './components/card.js';

const modalKey = Modal.key();

@withProps(
  () => {
    const ds = new DataSet(inspectionQueryDS());
    return {
      ds,
    };
  },
  { cacheState: true }
)
@connect()
class Inspection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newToggle: true,
      ongoingToggle: true,
      newCount: 0,
      completedCount: 0,
      type: this.props.location.query ? this.props.location.query.type : 'IQC',
      totalElements: 0,
      inspectionList: [],
      currentPage: 1, // 当前页
      defaultInfo: {},
    };
  }

  async componentDidMount() {
    const res = await queryLovData({
      lovCode: 'LMDS.WORKER',
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content.length) {
      this.setState({
        defaultInfo: res.content[0],
      });
    }
    await this.handleSearch();
    await this.handleQueryHgJudgeAreaStatus();
  }

  lovDs = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'workerObj',
        type: 'object',
        lovCode: 'LMDS.WORKER',
        label: '判定',
        lovPara: {
          workerType: 'INSPECTOR',
        },
        ignore: 'always',
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerCode',
        type: 'string',
        bind: 'workerObj.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
      },
    ],
  });

  queryFields = [
    <Lov name="inspectionObj" key="inspectionObj" placeholder="检验单号" />,
    <Lov name="documentObj" key="documentObj" placeholder="来源单据号" />,
    <Lov name="itemObj" key="itemObj" placeholder="物料" />,
    <Lov name="workerObj" key="workerObj" placeholder="报检人" />,
    <DateTimePicker name="createDateMin" key="createDateMin" placeholder="请选择时间" />,
    <DateTimePicker name="createDateMax" key="createDateMax" placeholder="请选择时间" />,
  ];

  handleToDetails = (record) => {
    const pathname = '/pub/hg/hg-inspection-judgment/execute';
    const { workerId, workerCode, workerName } = this.state.defaultInfo;
    this.props.dispatch(
      routerRedux.push({
        pathname,
        state: {
          ...record,
          declarer: workerCode,
          declarerName: workerName,
          declarerId: workerId,
          type: this.state.type,
        },
      })
    );
  };

  // 更多 - 筛选
  handleModal = () => {
    Modal.open({
      key: modalKey,
      title: '筛选',
      className: 'hg-inspection-filter-modal',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <div>
          <Form dataSet={this.props.ds.queryDataSet}>{this.queryFields}</Form>
        </div>
      ),
      onOk: () => this.handleSearch(),
    });
  };

  // 检验单查询
  handleSearch = async () => {
    this.props.ds.setQueryParameter(
      'inspectionTemplateType',
      // 'MOLD_TEST'
      this.state.type
    );
    this.props.ds.setQueryParameter('pqcType', this.state.type === 'IQC' ? null : this.state.type);
    const resp = await this.props.ds.query();
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

  // 状态数量查询
  handleQueryHgJudgeAreaStatus = async (type = this.state.type) => {
    const res = await queryHgJudgeAreaStatus({
      qcStatusList: ['NEW', 'ONGOING', 'COMPLETED'],
      ngProcessedFlag: 0,
      inspectionTemplateType: type,
    });
    let newCount = 0;
    let completedCount = 0;
    if (res.length) {
      res.forEach((v) => {
        if (v.qcStatus === 'NEW' || v.qcStatus === 'ONGOING') {
          newCount += v.quantity;
        } else if (v.qcStatus === 'COMPLETED') {
          completedCount = v.quantity;
        }
      });
    }
    this.setState({
      newCount,
      completedCount,
    });
  };

  // 展开收起
  handleOpenToggle = (type) => {
    if (type === 'new') {
      this.setState({
        newToggle: !this.state.newToggle,
      });
    } else {
      this.setState({
        ongoingToggle: !this.state.ongoingToggle,
      });
    }
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
    const { ds } = this.props;
    ds.setQueryParameter('page', page - 1);
    const resp = await ds.query();
    if (resp && resp.content && resp.content.length) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        totalElements: resp.totalElements,
        inspectionList: list,
        currentPage: page,
      });
    }
  };

  // IQC PQC 切换
  handleChange = async (value) => {
    const { ds } = this.props;
    ds.setQueryParameter('page', 0);
    ds.setQueryParameter('inspectionTemplateType', value);
    const resp = await ds.query();
    if (resp && resp.content) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        totalElements: resp.totalElements,
        inspectionList: list,
        type: value,
        currentPage: 1,
      });
    }

    await this.handleQueryHgJudgeAreaStatus(value);
  };

  render() {
    const newList = this.state.inspectionList.filter(
      (v) => v.qcStatus === 'NEW' || v.qcStatus === 'ONGOING'
    );
    const completedList = this.state.inspectionList.filter(
      (v) => v.qcStatus === 'COMPLETED' && v.ngProcessedFlag === false && v.qcNgQty > 0
    );
    return (
      <Fragment>
        <Header>
          <Row className="row-width">
            <Col span={5} className="header-button">
              <Button
                className={this.state.type === 'IQC' ? 'tabActive' : null}
                onClick={() => this.handleChange('IQC')}
              >
                IQC
              </Button>
              <Button
                className={this.state.type === 'PQC' ? 'tabActive' : null}
                onClick={() => this.handleChange('PQC')}
              >
                PQC
              </Button>
            </Col>
            <Col span={19} className="header-right-button">
              <Button icon="filter2" onClick={this.handleModal}>
                筛选
              </Button>
            </Col>
          </Row>
        </Header>
        <div className="hg-inspection-content">
          <div className="iqc-kinds ds-ai-center" onClick={() => this.handleOpenToggle('new')}>
            <span>录入检验结果({this.state.newCount})</span>
            <Icon type={this.state.newToggle ? 'arrow_drop_down' : 'arrow_drop_up'} />
          </div>
          {this.state.newToggle ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 25%)',
                // flex: 1,
              }}
            >
              {newList.map((ele) => {
                return (
                  <Card
                    key={ele.inspectionDocId}
                    {...ele}
                    handleToDetails={() => this.handleToDetails(ele)}
                  />
                );
              })}
            </div>
          ) : null}
          <div
            style={{ marginTop: '10px' }}
            className="iqc-kinds ds-ai-center"
            onClick={() => this.handleOpenToggle('ongoing')}
          >
            <span>录入处理结果({this.state.completedCount})</span>
            <Icon type={this.state.ongoingToggle ? 'arrow_drop_down' : 'arrow_drop_up'} />
          </div>
          {this.state.ongoingToggle ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 25%)',
                // flex: 1,
              }}
            >
              {completedList.map((ele) => {
                return (
                  <Card
                    key={ele.inspectionDocId}
                    {...ele}
                    handleToDetails={() => this.handleToDetails(ele)}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="hg-inspection-footer">
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
            page={this.state.currentPage}
          />
        </div>
      </Fragment>
    );
  }
}

export default Inspection;
