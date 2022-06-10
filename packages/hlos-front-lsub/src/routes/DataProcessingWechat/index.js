/**
 * 数据处理--微信公众号
 * @since: 2020-07-01 17:42:24
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import { DataSet, Table, Button, Modal, TextArea, Tooltip } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import { Button as HButton } from 'hzero-ui';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import { isUndefined } from 'lodash';
import queryString from 'query-string';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { API_HOST } from 'utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';
import { DpwDS } from '@/stores/dataProcessingWechatDS';
import { statusUpdate, remarkUpdate } from '@/services/dataProcessing';
import { queryIndependentValueSet } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';
import './index.less';

const preCode = 'lsub.dataProcessingWechat';
const { TabPane } = Tabs;
const { lsubDataProcessing } = codeConfig.code;
const { dataStatus } = statusConfig.statusValue.lsub;

export default class DataProcessingWechat extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...DpwDS,
    });
  }

  state = {
    remark: '',
    tabKey: '',
    tabsArr: [],
  };

  async componentDidMount() {
    const res = await queryIndependentValueSet({ lovCode: lsubDataProcessing.status });
    this.setState({
      tabsArr: res,
      tabKey: res[0].value,
    });
    this.tableDS.queryParameter = { status: res[0].value };
    this.tableDS.query();
  }

  ModalContent = ({ modal }) => {
    const { data, preStatusMeaning } = modal.props.children.props.record;
    modal.handleOk(async () => {
      try {
        const res = await statusUpdate(data);
        if (res.failed) {
          notification.error({
            message: res.message,
          });
          return;
        }
        notification.success({
          message: '操作成功',
        });
        this.tableDS.query();
      } catch (err) {
        console.log(err);
      }
    });
    modal.handleCancel(() => {
      modal.close();
    });
    return (
      <div className="status-modal-content">
        <div className="content-title">
          <span className="desc">当前状态</span>
          <span className="status">{preStatusMeaning}</span>
        </div>
        <div className="content-edit">
          <div className="desc">确定修改状态？</div>
        </div>
      </div>
    );
  };

  RemarkModalContent = ({ modal }) => {
    const record = modal.props.children.props.record.record.data;
    modal.handleOk(async () => {
      if (!this.state.remark) {
        notification.warning({
          message: '请先输入备注信息',
        });
        return false;
      }
      try {
        const res = await remarkUpdate([
          {
            id: record.id,
            objectVersionNumber: record.objectVersionNumber,
            remark: this.state.remark,
          },
        ]);
        if (res.failed) {
          notification.error({
            message: res.message,
          });
          return false;
        }
        notification.success({
          message: '修改成功',
        });
        modal.close();
        this.tableDS.query();
      } catch (err) {
        console.log(err);
      }
    });
    modal.handleCancel(() => {
      this.setState({
        remark: '',
      });
      modal.close();
    });
    const onChange = (e) => {
      this.setState({
        remark: e,
      });
    };
    return (
      <div className="remark-modal-content">
        <div className="title">输入备注</div>
        <TextArea
          className="remark-edit"
          rows={6}
          maxLength={200}
          placeholder="请输入备注信息"
          value={this.state.remark}
          onChange={onChange}
        />
      </div>
    );
  };

  @Bind()
  editRemark(record) {
    this.setState(
      {
        remark: '',
      },
      () => {
        Modal.open({
          key: 'edit',
          title: '修改备注',
          children: <this.RemarkModalContent record={{ record }} />,
          className: 'remark-modal',
        });
      }
    );
  }

  @Bind()
  async handleUpdateStatus(type) {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '至少选择一条数据',
      });
      return;
    }
    if (this.tableDS.selected[0].data.status === type) {
      notification.warning({
        message: '状态未改变',
      });
      return;
    }
    const data = [];
    const preStatusMeaning = this.tableDS.selected[0].data.statusMeaning;
    this.tableDS.selected.forEach((v) => {
      data.push({
        id: v.data.id,
        objectVersionNumber: v.data.objectVersionNumber,
        status: type,
      });
    });
    Modal.open({
      key: 'updateStatus',
      title: '修改状态',
      children: <this.ModalContent record={{ data, preStatusMeaning }} />,
      className: 'status-modal',
    });
  }

  // 根据不同颜色返回背景色
  getColor = (params) => {
    switch (params) {
      case '暂挂':
        return '#666666';
      case '跟进':
        return '#ff4500';
      case '发送':
        return '#66cc00';
      case '结束':
        return '#ccc';
      default:
        return '#990000';
    }
  };

  get columns() {
    return [
      { name: 'sourceType', width: 150, align: 'center', editor: false },
      {
        name: 'dataType',
        width: 150,
        align: 'center',
        editor: (record) => record.status === 'add',
        lock: 'left',
      },
      { name: 'realName', width: 150, align: 'center', editor: true },
      { name: 'companyName', width: 150, align: 'center', editor: true },
      { name: 'position', width: 150, align: 'center', editor: true },
      { name: 'phone', width: 150, align: 'center', editor: true },
      { name: 'email', width: 150, align: 'center', editor: true },
      { name: 'targetModuleList', width: 150, align: 'center', editor: true },
      { name: 'industry', width: 150, align: 'center', editor: true },
      { name: 'companySize', width: 150, align: 'center', editor: true },
      { name: 'remark', align: 'center', editor: true },
      {
        header: '操作',
        width: 250,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip key="operateResume" placement="bottom" title="操作履历">
              <Button color="primary" funcType="flat">
                操作履历
              </Button>
            </Tooltip>,
            <Tooltip key="fixRemark" placement="bottom" title="修改备注">
              <Button color="primary" funcType="flat" onClick={() => this.editRemark(record)}>
                修改备注
              </Button>
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { tableDS } = this;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  @Bind()
  handleTabChange(key) {
    this.tableDS.queryParameter = { status: key };
    this.tableDS.query();
  }

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LSUB.IMPORT.USER_DEMAND_DATA`,
      title: intl.get(`${preCode}.view.title.import`).d('导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('导入'),
      }),
    });
  }

  @Bind()
  handleCreate() {
    this.tableDS.create({}, 0);
  }

  @Bind()
  handleEdit(record) {
    record.setState('editing', true);
  }

  render() {
    const { tabKey, tabsArr } = this.state;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.dataProcessingWechat`).d('微信公众号')}>
          <ExcelExport
            requestUrl={`${API_HOST}${HLOS_LSUB}/v1/${getCurrentOrganizationId()}/userData/exportUserDemandData?sourceType='wechat_subscription'`}
            queryParams={this.getExportQueryParams}
          />
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <Button onClick={this.handleCreate} icon="add" color="primary">
            新建
          </Button>
          {/* <Button onClick={this.handleEdit} style={{ background: '#579DD5', color: '#FFFFFF' }}>编辑</Button> */}
          <Button
            onClick={() => this.handleUpdateStatus(dataStatus.send)}
            style={{ background: '#2D660F', color: '#FFFFFF' }}
          >
            发送
          </Button>
          <Button
            onClick={() => this.handleUpdateStatus(dataStatus.suspend)}
            style={{ background: '#880E0B', color: '#FFFFFF' }}
          >
            暂挂
          </Button>
          <Button
            onClick={() => this.handleUpdateStatus(dataStatus.followUp)}
            style={{ background: '#FDFFA0' }}
          >
            跟进
          </Button>
        </Header>
        <Content>
          <Tabs defaultActiveKey={tabKey} onChange={this.handleTabChange}>
            {tabsArr.map((item) => (
              <TabPane tab={item.meaning} key={item.value} />
            ))}
          </Tabs>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            queryFieldsLimit={4}
            editMode="inline"
            // queryBar="none"
          />
        </Content>
      </Fragment>
    );
  }
}
