/**
 * @Description: 平台级数据分发详情定义
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:35:14
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Table, Button, Form, TextField, Lov, Switch, Select } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { TransferDetailDS, DetailCreateFormDS } from '@/stores/transferDetailDS';
import { addTransferDetail, editTransferDetail } from '@/services/transferDetail';
import './index.less';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'ldtt.transfer.platform.detail';
const { Sidebar } = Modal;

@connect()
export default class TransferDetail extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TransferDetailDS(),
    });
    this.formDS = new DataSet({
      ...DetailCreateFormDS(),
    });
  }

  state = {
    visible: false,
    // serviceCode: null,
    // transferPlatformId: null,
  };

  async componentDidMount() {
    await this.formDS.create({});
    if (this.props.location.state) {
      const { transferPlatformId } = this.props.location.state;
      if (transferPlatformId) {
        this.tableDS.setQueryParameter('transferPlatformId', transferPlatformId);
        // this.setState({
        //   transferPlatformId,
        // });
      }
    }
    this.tableDS.query();
  }

  get columns() {
    return [
      { name: 'serviceCode', align: 'center' },
      { name: 'serviceName', align: 'center' },
      { name: 'datasourceCode', align: 'center' },
      { name: 'description', align: 'center' },
      { name: 'datasourceUrl', align: 'center' },
      { name: 'whiteList', align: 'center' },
      { name: 'blackList', align: 'center' },
      { name: 'filterModeMeaning', align: 'center' },
      { name: 'enabledFlag', width: 150, align: 'center', renderer: yesOrNoRender },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button key="edit" color="primary" funcType="flat" onClick={() => this.edit(record)}>
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
   *编辑
   * @param recode
   */
  @Bind()
  edit(record) {
    this.formDS.current.reset();
    this.formDS.current.set('transferDetailId', record.data.transferDetailId);
    this.formDS.current.set('transferPlatformId', record.data.transferPlatformId);
    this.formDS.current.set('serviceCode', record.data.serviceCode);
    this.formDS.current.set('serviceName', record.data.serviceName);
    this.formDS.current.set('datasourceId', record.data.datasourceId);
    this.formDS.current.set('description', record.data.description);
    this.formDS.current.set('whiteList', record.data.whiteList);
    this.formDS.current.set('blackList', record.data.blackList);
    this.formDS.current.set('filterMode', record.data.filterMode);
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.formDS.current.set('enabledFlag', record.data.enabledFlag === 1);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    const { transferPlatformId } = this.props.location.state;
    this.formDS.current.set('enabledFlag', true);
    this.formDS.current.set('transferPlatformId', transferPlatformId);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    // const { transferTenantId } = this.props.location.state;
    // const { tenantId } = this.props.location.state;

    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const obj = {
        transferDetailId: this.formDS.current.get('transferDetailId'),
        transferPlatformId: this.formDS.current.get('transferPlatformId'),
        serviceCode: this.formDS.current.get('serviceCode'),
        serviceName: this.formDS.current.get('serviceName'),
        datasourceId: this.formDS.current.get('datasourceId'),
        whiteList: this.formDS.current.get('whiteList'),
        blackList: this.formDS.current.get('blackList'),
        filterMode: this.formDS.current.get('filterMode'),
        _token: this.formDS.current.get('_token'),
        objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
        enabledFlag: this.formDS.current.get('enabledFlag') ? 1 : 0,
      };
      let res = null;
      if (obj.transferDetailId != null) {
        res = await editTransferDetail(obj);
      } else {
        res = await addTransferDetail(obj);
      }
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '创建成功',
      });
      this.setState({
        visible: false,
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.service`).d('平台数据分发详情定义')}
          backPath="/ldtt/transfer-platform"
        >
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
          <Sidebar
            title="新增租户分发详情"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            zIndex="999"
            closable
            mask={false}
          >
            <Form dataSet={this.formDS}>
              <TextField name="serviceCode" />
              <TextField name="serviceName" />
              <Lov name="datasourceObj" />
              <TextField name="whiteList" />
              <TextField name="blackList" />
              <Select name="filterMode" key="filterMode" />
              <Switch name="enabledFlag" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
