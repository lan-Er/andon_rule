/*
 * @Description: 检验判定
 * @Author: zmt
 * @LastEditTime: 2021-07-05 15:42:48
 */

import React from 'react';
import { Header } from 'components/Page';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  DataSet,
  Button,
  Row,
  Col,
  Icon,
  CheckBox,
  Form,
  Lov,
  DateTimePicker,
  Modal,
  Pagination,
  Spin,
} from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';

import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';
import withProps from 'utils/withProps';
import codeConfig from '@/common/codeConfig';
import { userSetting } from 'hlos-front/lib/services/api';
import HandleChangeWidthRight from '@/utils/handleChangeWidthRight';

import down from 'hlos-front/lib/assets/icons/sort-down.svg';
import up from 'hlos-front/lib/assets/icons/sort-up.svg';
import styles from './index.less';
import Card from './card.js';
import { getTime } from './clock.js';
import { inspectionQueryDS } from '../../stores/inspectionJudgmentDS';
import { inspectionDocAutoBatchJudge } from '../../services/inspectionJudgmentService.js';

const modalKey = Modal.key();
const { common } = codeConfig.code;

@withProps(
  () => {
    const ds = new DataSet(inspectionQueryDS());
    return {
      ds,
    };
  },
  { cacheState: true }
)
@connect(({ InspectionJudgementModel }) => ({
  inspectionObj: InspectionJudgementModel.inspectionObj || {},
}))
class Inspection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeToggle: true,
      type: this.props.location.query ? this.props.location.query.type : 'IQC',
      totalElements: 0,
      inspectionList: [],
      allChecked: false,
      currentPage: 1, // 当前页
      loading: false,
      fullPage: false,
      showFullButton: false,
    };
  }

  async componentDidMount() {
    const {
      timeToggle,
      type,
      totalElements,
      inspectionList,
      allChecked,
      currentPage,
      loading,
    } = this.props.inspectionObj;
    if (
      this.props.location.query &&
      this.props.location.query.flag === false &&
      inspectionList.length // 考虑到刷新redux值清空
    ) {
      this.setState({
        timeToggle,
        type,
        totalElements,
        inspectionList,
        allChecked,
        currentPage,
        loading,
      });
      return;
    }
    const { queryDataSet } = this.props.ds;
    const res = await userSetting({
      defaultFlag: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content.length && queryDataSet.current) {
      this.lovDs.current.set('workerObj', res.content[0]);
      this.lovDs.current.set('declarerId', res.content[0].workerId);
      this.lovDs.current.set('declarer', res.content[0].workerName);
      this.lovDs.current.set('declarerCode', res.content[0].workerCode);
      queryDataSet.current.set('organizationId', res.content[0].organizationId);
      queryDataSet.current.set('organizationCode', res.content[0].organizationCode);
      queryDataSet.current.set('organizationName', res.content[0].organizationName);
      this.lovDs.fields
        .get('workerObj')
        .setLovPara('organizationId', res.content[0].organizationId);
    }
    this.handleSearch();
    this.handleShowFullButton();
  }

  @Bind()
  handleShowFullButton() {
    const deviceWidth = document.documentElement.scrollWidth;
    if (deviceWidth < 1200) {
      this.setState({ showFullButton: true });
    } else {
      this.setState({ showFullButton: false });
    }
  }

  lovDs = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
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

  handleOrgChange = (value) => {
    if (value) {
      this.lovDs.fields.get('workerObj').setLovPara('organizationId', value.organizationId);
    }
    this.props.ds.queryDataSet.current.set('warehouseObj', null);
    this.props.ds.queryDataSet.current.set('prodLineObj', null);
    this.props.ds.queryDataSet.current.set('workcellObj', null);
    this.props.ds.queryDataSet.current.set('equipmentObj', null);
  };

  handleWarehouseChange = () => {
    this.props.ds.queryDataSet.current.set('wmAreaObj', null);
  };

  commonFields = [
    <Lov
      name="organizationObj"
      key="organizationObj"
      placeholder="组织"
      onChange={this.handleOrgChange}
    />,
    <Lov name="operationObj" key="operationObj" placeholder="工序" />,
    <Lov name="itemObj" key="itemObj" placeholder="物料" />,
    <Lov name="partyObj" key="partyObj" placeholder="供应商" />,
    <Lov name="workerObj" key="workerObj" placeholder="报检人" />,
    <Lov name="prodLineObj" key="prodLineObj" placeholder="生产线" />,
    <Lov name="workcellObj" key="workcellObj" placeholder="工位" />,
    <Lov name="equipmentObj" key="equipmentObj" placeholder="设备" />,
    <Lov
      name="warehouseObj"
      key="warehouseObj"
      placeholder="仓库"
      onChange={this.handleWarehouseChange}
    />,
    <Lov name="wmAreaObj" key="wmAreaObj" placeholder="货位" />,
    <DateTimePicker name="createDateMin" key="createDateMin" placeholder="请选择时间" />,
    <DateTimePicker name="createDateMax" key="createDateMax" placeholder="请选择时间" />,
  ];

  queryFields = [
    <Lov name="documentObj" key="documentObj" placeholder="来源单据号" />,
    <Lov name="linkDocumentObj" key="linkDocumentObj" placeholder="关联单据号" />,
    <Lov name="inspectionObj" key="inspectionObj" placeholder="检验单号" />,
  ];

  handleToDetails = (record) => {
    const pathname = '/pub/lmes/inspection-judgment/execute';
    const { declarer, declarerId } = this.lovDs.current.data;
    this.props.dispatch(
      routerRedux.push({
        pathname,
        state: { ...record, declarer, declarerId, type: this.state.type },
      })
    );

    const {
      timeToggle,
      type,
      totalElements,
      inspectionList,
      allChecked,
      currentPage,
      loading,
    } = this.state;

    this.props.dispatch({
      type: 'InspectionJudgementModel/updateState',
      payload: {
        inspectionObj: {
          timeToggle,
          type,
          totalElements,
          inspectionList,
          allChecked,
          currentPage,
          loading,
        },
      },
    });
  };

  // 时间排序切换
  handleTimeToggle = async () => {
    this.setState({ loading: true });
    const { ds } = this.props;
    ds.setQueryParameter('dateSort', this.state.timeToggle ? 1 : '');
    const resp = await ds.query();
    if (resp && resp.content && resp.content.length) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        totalElements: resp.totalElements,
        inspectionList: list,
        timeToggle: !this.state.timeToggle,
      });
    }
    this.setState({ loading: false });
  };

  // 更多 - 筛选
  handleModal = () => {
    Modal.open({
      key: modalKey,
      title: '筛选',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <div>
          <HandleChangeWidthRight
            render={(limit) => (
              <Form dataSet={this.props.ds.queryDataSet}>
                {this.queryFields.slice(limit, this.queryFields.length).concat(this.commonFields)}
              </Form>
            )}
          />
        </div>
      ),
      onOk: () => this.handleSearch(),
    });
  };

  // 查询
  handleSearch = async (type = this.state.type) => {
    this.setState({ loading: true });
    this.props.ds.setQueryParameter('pqcType', type);
    this.props.ds.setQueryParameter('page', this.state.currentPage - 1);
    const resp = await this.props.ds.query();
    if (resp && resp.content) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        totalElements: resp.totalElements,
        inspectionList: list,
        type,
      });
    }
    this.setState({ loading: false });
  };

  // 全选
  handleAllCheck = () => {
    const list = this.state.inspectionList.slice();
    const allChecked = list.every((i) => i.checked);
    if (allChecked) {
      list.forEach((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.checked = false;
      });
      this.setState({
        allChecked: false,
        inspectionList: list,
      });
    } else {
      list.forEach((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.checked = true;
      });
      this.setState({
        allChecked: true,
        inspectionList: list,
      });
    }
  };

  // 单选
  handleSingleCheck = (index) => {
    const list = this.state.inspectionList.slice();
    list[index].checked = !list[index].checked;
    const allChecked = list.every((i) => i.checked);
    if (allChecked) {
      this.setState({
        allChecked: true,
      });
    } else {
      this.setState({
        allChecked: false,
      });
    }
    this.setState({
      inspectionList: list,
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
    this.setState({ loading: true });
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
    this.setState({ loading: false });
  };

  // 批量合格操作
  handleBatchOperation = async () => {
    let checkedArray = this.state.inspectionList.filter((ele) => ele.checked);
    // checkedArray = checkedArray.map((ele) => {
    //   return {
    //     ...ele,
    //     qcOkQty: ele.batchQty || ele.sampleQty,
    //     batchQty: ele.batchQty || ele.sampleQty,
    //     qcResult: 'PASS',
    //     judgedDate: getTime(),
    //     inspectorId: this.lovDs.current.data.workerObj.workerId,
    //     inspector: this.lovDs.current.data.workerObj.workerCode,
    //   };
    // });
    checkedArray = checkedArray.map((ele) => {
      return {
        inspectionDocId: ele.inspectionDocId,
        qcOkQty: ele.batchQty || ele.sampleQty,
      };
    });
    const params = {
      qcResult: 'OK',
      judgedDate: getTime(),
      inspectorId: this.lovDs.current.data.workerObj.workerId,
      inspectorCode: this.lovDs.current.data.workerObj.workerCode,
      inspectionDocParams: checkedArray,
    };
    if (checkedArray.length) {
      const res = await inspectionDocAutoBatchJudge(params);
      if (getResponse(res)) {
        notification.success({
          message: '提交成功',
        });
        this.handleSearch();
      }
    } else {
      notification.warning({
        message: '没有勾选项',
      });
    }
  };

  handleSwitchTabSearch = (type) => {
    this.setState(
      {
        currentPage: 1,
      },
      () => this.handleSearch(type)
    );
  };

  handleFullScreen = (isFullPage) => {
    const { fullPage } = this.state;
    this.setState({ fullPage: !fullPage });
    const el = document.documentElement;
    const rfs =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;

    if (rfs && !isFullPage) {
      rfs.call(el);
    } else if (typeof window.ActiveXObject !== 'undefined') {
      const { ActiveXObject } = window;
      const wscript = new ActiveXObject('WScript.Shell');
      if (wscript != null) {
        wscript.SendKeys('{F11}');
      }
    }
    if (isFullPage) {
      const exitRefs =
        document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitCancelFullScreen;
      if (exitRefs) {
        exitRefs.call(document);
      } else if (typeof window.ActiveXObject !== 'undefined') {
        const { ActiveXObject } = window;
        const wscript = new ActiveXObject('WScript.Shell');
        if (wscript != null) {
          wscript.SendKeys('{Esc}');
        }
      }
    }
  };

  render() {
    const { fullPage, showFullButton } = this.state;
    return (
      <>
        <Header>
          <Row className={styles['row-width']}>
            <Col span={10} className={styles['header-button']}>
              <Button
                className={
                  this.state.type === 'IQC'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('IQC')}
              >
                IQC
              </Button>
              <Button
                className={
                  this.state.type === 'FIRST'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('FIRST')}
              >
                首检
              </Button>
              <Button
                className={
                  this.state.type === 'FINISH'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('FINISH')}
              >
                完工检
              </Button>
              <Button
                className={
                  this.state.type === 'FQC'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('FQC')}
              >
                终检
              </Button>
              <Button
                className={
                  this.state.type === 'ROUTING'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('ROUTING')}
              >
                PQC巡检
              </Button>
              <Button
                className={
                  this.state.type === 'SQC'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('SQC')}
              >
                SQC
              </Button>
              <Button
                className={
                  this.state.type === 'RQC'
                    ? `${styles['active-button']} ${styles['default-button']}`
                    : styles['default-button']
                }
                onClick={() => this.handleSwitchTabSearch('RQC')}
              >
                RQC
              </Button>
            </Col>
            <Col className={`${styles['inspection-lov-choose']} ${styles['ds-jc-end']}`} span={14}>
              <Form labelLayout="placeholder" dataSet={this.props.ds.queryDataSet}>
                <HandleChangeWidthRight render={(limit) => this.queryFields.slice(0, limit)} />
              </Form>
              <Button
                className={`${styles['left-button']} ${styles['more-button']}`}
                icon="expand_more"
                onClick={this.handleModal}
              >
                更多
              </Button>
              <Button
                color="primary"
                className={`${styles['left-button']} ${styles['search-button']}`}
                onClick={() => this.handleSearch(this.state.type)}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Header>
        <div className={styles['total-number']}>共搜索到{this.state.totalElements}条数据</div>
        <div className={styles['content-inspection-judgment']}>
          <Row className={styles['content-header']}>
            <Col span={16} className={styles['ds-ai-center']}>
              <div
                className={styles['ds-ai-center']}
                style={{ marginRight: '20px', cursor: 'pointer' }}
                onClick={this.handleTimeToggle}
              >
                时间
                <img
                  style={{ marginLeft: '8px' }}
                  src={this.state.timeToggle ? down : up}
                  alt="down-up"
                />
              </div>
              <div className={styles['ds-ai-center']}>
                判定
                <Lov
                  style={{ marginLeft: '10px', width: '45%' }}
                  dataSet={this.lovDs}
                  name="workerObj"
                  key="workerObj"
                />
              </div>
            </Col>
            <Col span={8} style={{ textAlign: 'right', paddingRight: '12px' }}>
              <CheckBox value="全选" checked={this.state.allChecked} onChange={this.handleAllCheck}>
                全选
              </CheckBox>
              <Button className={styles['pass-button']} onClick={this.handleBatchOperation}>
                合格
              </Button>
              {showFullButton ? (
                <Button
                  style={{ marginLeft: '12px' }}
                  onClick={() => this.handleFullScreen(fullPage)}
                >
                  {fullPage ? '退出全屏' : '全屏'}
                </Button>
              ) : null}
            </Col>
          </Row>
          <div className={styles['my-content-show-is-difficult']}>
            {this.state.inspectionList.map((ele, index) => {
              return (
                <Card
                  key={uuidv4()}
                  type={this.state.type}
                  data={ele}
                  handleToDetails={() => this.handleToDetails(ele)}
                  handleSingleCheck={() => this.handleSingleCheck(index)}
                />
              );
            })}
            {this.state.loading ? (
              <div className={styles['my-loading-yes-no']}>
                <Spin tip="Loading..." />
              </div>
            ) : null}
          </div>
          {this.state.totalElements > 0 && (
            <div className={styles.footer}>
              <Pagination
                showSizeChangerLabel={false}
                showTotal={false}
                showPager
                sizeChangerPosition="center"
                sizeChangerOptionRenderer={this.sizeChangerRenderer}
                itemRender={this.pagerRenderer}
                total={this.state.totalElements}
                onChange={this.handlePageChange}
                pageSize={20}
                page={this.state.currentPage}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Inspection;
