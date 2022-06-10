/**
 * @Description: 设备点检
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-17 11:10:35
 */

import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  DataSet,
  Button,
  Icon,
  Row,
  Col,
  Lov,
  Modal,
  Form,
  DateTimePicker,
  Select,
  CheckBox,
  Pagination,
} from 'choerodon-ui/pro';
import { Header } from 'components/Page';
import withProps from 'utils/withProps';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import up from 'hlos-front/lib/assets/icons/sort-up.svg';
import down from 'hlos-front/lib/assets/icons/sort-down.svg';
import './index.less';
import InsCard from './insCard.js';
import { equipmentInspectionQueryDS } from '../../stores/equipmentInspectionQueryDS';
import { equInsQualifieds } from '../../services/equipmentInspection';

const modalKey = Modal.key();
const { common, lmesEquipmentInspection } = codeConfig.code;
let _modal;

@withProps(
  () => {
    const ds = new DataSet(equipmentInspectionQueryDS());
    return { ds };
  },
  {
    cacheState: true,
  }
)
@connect()
export default class EquipmentInspection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      equipmentInsList: [], // 设备点检数据
      totalElements: 0, // 设备点检总数
      timeToggle: false, // 时间排序 为false表示按照创建时间降序排列
      allChecked: false, // 是否全选
      currentPage: 1, // 当前页
      filterObj: {}, // 筛选条件
      showCheckTime: false, // 筛选条件是否展示点检时间  待点检的不展示
      defaultOrgId: null,
    };
  }

  async componentDidMount() {
    const { queryDataSet } = this.props.ds;
    // 获取用户默认操作工和默认工厂
    const resp = await Promise.all([
      queryLovData({
        lovCode: common.worker,
        defaultFlag: 'Y',
        showOrganization: 'Y',
      }),
      queryLovData({
        lovCode: lmesEquipmentInspection.organization,
        defaultFlag: 'Y',
      }),
    ]);
    // 组织默认取用户默认工厂、点检人默认取用户默认操作工
    if (
      (resp[1] &&
        resp[1].content &&
        resp[1].content.length &&
        resp[1].content[0].meOuId === resp[0].content[0].organizationId) ||
      (resp[1] && resp[1].content && !resp[1].content.length)
    ) {
      if (resp[0] && resp[0].content && resp[0].content.length) {
        this.lovDs.current.set('worker', resp[0].content[0]);
        this.lovDs.current.set('workerId', resp[0].content[0].workerId);
        this.lovDs.current.set('workerCode', resp[0].content[0].workerCode);
        this.lovDs.current.set('workerName', resp[0].content[0].workerName);
      }
    }
    if (resp[1] && resp[1].content && queryDataSet.current) {
      queryDataSet.current.set('organizationObj', resp[1].content[0]);
      queryDataSet.current.set(
        'organizationId',
        resp[1].content[0] ? resp[1].content[0].meOuId : null
      );
      queryDataSet.current.set(
        'organizationCode',
        resp[1].content[0] ? resp[1].content[0].meOuCode : null
      );
      queryDataSet.current.set(
        'organizationName',
        resp[1].content[0] ? resp[1].content[0].meOuName : null
      );
      this.lovDs.current.set(
        'organizationId',
        resp[1].content[0] ? resp[1].content[0].meOuId : null
      );
      this.setState({ defaultOrgId: resp[1].content[0] ? resp[1].content[0].meOuId : null });
    }
    this.props.ds.setQueryParameter('queryFlagForPc', 'N');
    this.handleSearch();
  }

  lovDs = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'worker',
        type: 'object',
        lovCode: common.worker,
        label: '点检人',
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: getCurrentOrganizationId(),
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'worker.workerId',
      },
      {
        name: 'workerCode',
        type: 'string',
        bind: 'worker.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'worker.workerName',
      },
      {
        name: 'organizationId',
        type: 'string',
      },
    ],
  });

  handleUpdate = () => {
    if (!this.state.showCheckTime) {
      this.props.ds.queryDataSet.current.set('checkTimeMin', null);
      this.props.ds.queryDataSet.current.set('checkTimeMax', null);
      this.setState({
        filterObj: {
          ...this.state.filterObj,
          checkTimeMin: this.props.ds.queryDataSet.current.get('checkTimeMin'),
          checkTimeMax: this.props.ds.queryDataSet.current.get('checkTimeMax'),
        },
      });
    }
    _modal.update({
      children: (
        <div>
          <Form dataSet={this.props.ds.queryDataSet}>
            {this.state.showCheckTime ? this.queryFields : this.queryFieldsNoCheckTime}
          </Form>
        </div>
      ),
    });
  };

  queryFields = [
    <Lov
      name="organizationObj"
      key="organizationObj"
      placeholder="组织"
      onChange={() => {
        this.props.ds.queryDataSet.current.set('taskObj', null);
        this.props.ds.queryDataSet.current.set('equipmentObj', null);
        this.props.ds.queryDataSet.current.set('prodLineObj', null);
      }}
    />,
    <Lov name="taskObj" key="taskObj" placeholder="点检单号" />,
    <Lov name="equipmentObj" key="equipmentObj" placeholder="设备" />,
    <Lov name="prodLineObj" key="prodLineObj" placeholder="生产线" />,
    <DateTimePicker name="creationDateMin" key="creationDateMin" placeholder="请选择时间" />,
    <DateTimePicker name="creationDateMax" key="creationDateMax" placeholder="请选择时间" />,
    <DateTimePicker name="checkTimeMin" key="checkTimeMin" placeholder="请选择时间" />,
    <DateTimePicker name="checkTimeMax" key="checkTimeMax" placeholder="请选择时间" />,
    <Select
      name="taskStatus"
      key="taskStatus"
      placeholder="点检单状态"
      onChange={(e) => {
        this.setState({ showCheckTime: e !== 'RELEASED' }, () => {
          this.handleUpdate();
        });
      }}
    />,
  ];

  queryFieldsNoCheckTime = [
    <Lov
      name="organizationObj"
      key="organizationObj"
      placeholder="组织"
      onChange={() => {
        this.props.ds.queryDataSet.current.set('taskObj', null);
        this.props.ds.queryDataSet.current.set('equipmentObj', null);
        this.props.ds.queryDataSet.current.set('prodLineObj', null);
      }}
    />,
    <Lov name="taskObj" key="taskObj" placeholder="点检单号" />,
    <Lov name="equipmentObj" key="equipmentObj" placeholder="设备" />,
    <Lov name="prodLineObj" key="prodLineObj" placeholder="生产线" />,
    <DateTimePicker name="creationDateMin" key="creationDateMin" placeholder="请选择时间" />,
    <DateTimePicker name="creationDateMax" key="creationDateMax" placeholder="请选择时间" />,
    <Select
      name="taskStatus"
      key="taskStatus"
      placeholder="点检单状态"
      onChange={(e) => {
        this.setState({ showCheckTime: e !== 'RELEASED' }, () => {
          this.handleUpdate();
        });
      }}
    />,
  ];

  handleSearch = async () => {
    this.props.ds.setQueryParameter('taskClass', 'TPM_TASK');
    this.props.ds.setQueryParameter('taskTypeCode', 'EQUIPMENT_PERIOD_CHECK_TASK');
    const validateValue = await this.props.ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      this.setState({
        equipmentInsList: [],
        totalElements: 0,
      });
      return;
    }
    const resp = await this.props.ds.query();
    if (resp && resp.content) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({
          ...ele,
          checked: false,
          taskStatus: this.props.ds.queryDataSet.current.get('taskStatus'),
        });
      });
      this.setState({
        equipmentInsList: list,
        totalElements: resp.totalElements,
      });
    }
  };

  // 时间排序切换
  handleTimeToggle = async () => {
    this.props.ds.setQueryParameter('queryFlagForPc', this.state.timeToggle ? 'N' : 'Y');
    const resp = await this.props.ds.query();
    if (resp && resp.content) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        equipmentInsList: list,
        totalElements: resp.totalElements,
        timeToggle: !this.state.timeToggle,
      });
    }
  };

  // 全选
  handleAllCheck = () => {
    const list = this.state.equipmentInsList.slice();
    const allChecked = list.every((i) => i.checked);
    if (allChecked) {
      list.forEach((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.checked = false;
      });
      this.setState({
        allChecked: false,
        equipmentInsList: list,
      });
    } else {
      list.forEach((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.checked = true;
      });
      this.setState({
        allChecked: true,
        equipmentInsList: list,
      });
    }
  };

  // 批量合格操作
  handleBatchOperation = async () => {
    let checkedArray = this.state.equipmentInsList.filter((ele) => ele.checked);
    checkedArray = checkedArray.map((ele) => {
      return {
        ...ele,
        inspectedResult: true,
        workerId: this.lovDs.current.get('workerId'),
        workerCode: this.lovDs.current.get('workerCode'),
        workerName: this.lovDs.current.get('workerName'),
      };
    });
    if (checkedArray.length) {
      const res = await equInsQualifieds(checkedArray);
      if (res.length) {
        notification.success({
          message: '操作成功',
        });
        const { ds } = this.props;
        ds.setQueryParameter('queryFlagForPc', this.state.timeToggle ? 'Y' : 'N');
        const resp = await ds.query();
        if (resp && resp.content) {
          const list = [];
          resp.content.forEach((ele) => {
            list.push({ ...ele, checked: false });
          });
          this.setState({
            equipmentInsList: list,
            totalElements: resp.totalElements,
          });
        }
      }
    } else {
      notification.warning({ message: '没有勾选项' });
    }
  };

  // 单选
  handleSingleCheck = (index) => {
    const list = this.state.equipmentInsList.slice();
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
      equipmentInsList: list,
    });
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

  sizeChangerRenderer = ({ text }) => {
    return `${text} 条/页`;
  };

  handlePageChange = async (page) => {
    this.props.ds.setQueryParameter('page', page - 1);
    const resp = await this.props.ds.query();
    if (resp && resp.content && resp.content.length) {
      const list = [];
      resp.content.forEach((ele) => {
        list.push({ ...ele, checked: false });
      });
      this.setState({
        currentPage: page,
        equipmentInsList: list,
        totalElements: resp.totalElements,
      });
    }
  };

  handleFilter = () => {
    const { queryDataSet } = this.props.ds;
    const { filterObj } = this.state;
    if (filterObj.organizationObj) {
      queryDataSet.current.set('organizationObj', filterObj.organizationObj);
      queryDataSet.current.set('taskObj', filterObj.taskObj);
      queryDataSet.current.set('equipmentObj', filterObj.equipmentObj);
      queryDataSet.current.set('prodLineObj', filterObj.prodLineObj);
      queryDataSet.current.set('creationDateMin', filterObj.creationDateMin);
      queryDataSet.current.set('creationDateMax', filterObj.creationDateMax);
      queryDataSet.current.set('checkTimeMin', filterObj.checkTimeMin);
      queryDataSet.current.set('checkTimeMax', filterObj.checkTimeMax);
      queryDataSet.current.set('taskStatus', filterObj.taskStatus);
      this.setState({ showCheckTime: filterObj.taskStatus !== 'RELEASED' }, () => {
        this.handleUpdate();
      });
      this.lovDs.current.set('organizationId', filterObj.organizationObj.meOuId);
    } else {
      this.handleReset();
    }
    _modal = Modal.open({
      key: modalKey,
      title: '筛选',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <div>
          <Form dataSet={this.props.ds.queryDataSet}>
            {this.state.showCheckTime ? this.queryFields : this.queryFieldsNoCheckTime}
          </Form>
        </div>
      ),
      footer: (okBtn) => (
        <div>
          {okBtn}
          <Button onClick={this.handleReset}>重置</Button>
        </div>
      ),
      onOk: () => this.handleGoFilter(),
    });
  };

  setFilterObj = () => {
    const { queryDataSet } = this.props.ds;
    if (this.state.filterObj.organizationObj) {
      if (
        queryDataSet.current.get('organizationId') !== this.state.filterObj.organizationObj.meOuId
      ) {
        this.lovDs.current.set('worker', null);
        this.lovDs.current.set('workerId', null);
        this.lovDs.current.set('workerCode', null);
        this.lovDs.current.set('workerName', null);
      }
    }
    if (queryDataSet.current.get('organizationId') !== this.state.defaultOrgId) {
      this.lovDs.current.set('worker', null);
      this.lovDs.current.set('workerId', null);
      this.lovDs.current.set('workerCode', null);
      this.lovDs.current.set('workerName', null);
    }
    const obj = {
      organizationObj: queryDataSet.current.get('organizationObj'),
      taskObj: queryDataSet.current.get('taskObj'),
      equipmentObj: queryDataSet.current.get('equipmentObj'),
      prodLineObj: queryDataSet.current.get('prodLineObj'),
      creationDateMin: queryDataSet.current.get('creationDateMin'),
      creationDateMax: queryDataSet.current.get('creationDateMax'),
      checkTimeMin: queryDataSet.current.get('checkTimeMin'),
      checkTimeMax: queryDataSet.current.get('checkTimeMax'),
      taskStatus: queryDataSet.current.get('taskStatus'),
    };
    this.lovDs.current.set('organizationId', obj.organizationObj.meOuId);
    this.setState({ filterObj: obj });
  };

  handleGoFilter = async () => {
    const validateValue = await this.props.ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段没有填写完毕，请完善',
      });
      return false;
    }
    this.setFilterObj();
    this.handleSearch();
  };

  handleReset = async () => {
    const { queryDataSet } = this.props.ds;
    const resp = await queryLovData({
      lovCode: lmesEquipmentInspection.organization,
      defaultFlag: 'Y',
    });
    // 组织默认取用户默认工厂
    if (resp && resp.content && queryDataSet.current) {
      queryDataSet.current.set('organizationObj', resp.content[0]);
      queryDataSet.current.set('organizationId', resp.content[0] ? resp.content[0].meOuId : null);
      queryDataSet.current.set(
        'organizationCode',
        resp.content[0] ? resp.content[0].meOuCode : null
      );
      queryDataSet.current.set(
        'organizationName',
        resp.content[0] ? resp.content[0].meOuName : null
      );
    }
    queryDataSet.current.set('taskObj', null);
    queryDataSet.current.set('equipmentObj', null);
    queryDataSet.current.set('prodLineObj', null);
    queryDataSet.current.set('creationDateMin', null);
    queryDataSet.current.set('creationDateMax', null);
    queryDataSet.current.set('checkTimeMin', null);
    queryDataSet.current.set('checkTimeMax', null);
    queryDataSet.current.set('taskStatus', 'RELEASED');
  };

  handleCreate = async () => {
    const validateValue = await this.lovDs.current.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '请先选择点检人',
      });
      return;
    }
    const pathname = '/lmes/equipment-inspection/create';
    const { worker } = this.lovDs.current.data;
    this.props.dispatch(
      routerRedux.push({
        pathname,
        state: worker,
      })
    );
  };

  handleToDetails = async (record) => {
    const validateValue = await this.lovDs.current.validate(false, false);
    if (!validateValue && this.props.ds.queryDataSet.current.get('taskStatus') === 'RELEASED') {
      notification.error({
        message: '请先选择点检人',
      });
      return;
    }
    const pathname = '/pub/lmes/equipment-inspection/execute';
    const { worker } = this.lovDs.current.data;
    this.props.dispatch(
      routerRedux.push({
        pathname,
        state: { ...record, worker },
      })
    );
  };

  render() {
    const { equipmentInsList, totalElements, timeToggle, allChecked, currentPage } = this.state;
    return (
      <>
        <Header title="设备点检">
          <Button icon="filter2" color="primary" onClick={this.handleFilter}>
            筛选
          </Button>
          <Button onClick={this.handleCreate}>新建</Button>
        </Header>
        <div className="equipment-inspection-total">共搜索到{totalElements}条数据</div>
        <div className="equipment-inspection-content">
          <Row>
            <Col span={16} className="ds-ai-center">
              <div
                className="ds-ai-center"
                style={{ marginRight: '20px', cursor: 'pointer' }}
                onClick={this.handleTimeToggle}
              >
                时间
                <img style={{ marginLeft: '8px' }} src={!timeToggle ? down : up} alt="down-up" />
              </div>
              <div className="ds-ai-center">
                <span style={{ color: '#d50000' }}>*</span>点检人
                <Lov
                  style={{ marginLeft: '10px', width: '45%' }}
                  dataSet={this.lovDs}
                  name="worker"
                  key="worker"
                />
              </div>
            </Col>
            <Col span={8} style={{ textAlign: 'right', paddingRight: '4px' }}>
              <CheckBox
                value="全选"
                checked={allChecked}
                onChange={this.handleAllCheck}
                disabled={
                  this.props.ds.queryDataSet.current
                    ? this.props.ds.queryDataSet.current.get('taskStatus') === 'COMPLETED'
                    : false
                }
              >
                全选
              </CheckBox>
              <Button className="pass-button" onClick={this.handleBatchOperation}>
                合格
              </Button>
            </Col>
          </Row>
          <div className="my-content-show-is-difficult">
            {equipmentInsList.map((ele, index) => {
              return (
                <InsCard
                  data={ele}
                  key={ele.taskId}
                  handleSingleCheck={() => this.handleSingleCheck(index)}
                  handleToDetails={() => this.handleToDetails(ele)}
                />
              );
            })}
          </div>
          <div className="footer">
            <Pagination
              showPager
              showTotal={false}
              showSizeChanger={false}
              showSizeChangerLabel={false}
              itemRender={this.pagerRenderer}
              sizeChangerOptionRenderer={this.sizeChangerRenderer}
              onChange={this.handlePageChange}
              page={currentPage}
              pageSize={20}
              total={totalElements}
            />
          </div>
        </div>
      </>
    );
  }
}
