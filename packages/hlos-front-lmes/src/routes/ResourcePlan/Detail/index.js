/*
 * @Descripttion:
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Table, Form, Lov, Select, Button, TextField, Switch } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { HeaderDS } from '@/stores/resourcePlanConfigDS';
import './style.less';

const promptCode = 'lmes.resourcePlan';
@formatterCollections({ code: promptCode })
export default class ResourcePlanConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addDisabledFlag: false,
      codeDisabled: false,
    };

    this.headerDS = new DataSet(HeaderDS());
  }

  get columns() {
    return [
      { name: 'sequence', width: 100, editor: true },
      { name: 'resourceObj', editor: true },
      { name: 'resourceName' },
    ];
  }

  componentDidMount() {
    this.refreshPage();
  }

  @Bind()
  async refreshPage() {
    const res = (await this.headerDS.query()) || {};
    if (!res.configId) {
      if (res.failed && res.message) {
        notification.error({
          message: res.message,
        });
        return;
      }
      this.headerDS.create({}, 0);
    } else {
      this.setState({
        codeDisabled: true,
      });
    }
  }

  // 删除资源表格行
  @Bind()
  async handlDelLine(ds) {
    const selectedList = ds.selected;
    if (!selectedList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (selectedList.every((i) => !i.data.lineId)) {
      ds.remove(selectedList);
      return;
    }
    const res = await ds.delete(selectedList);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: intl.get('hzero.common.notification.success').d('操作成功'),
      });
      await ds.query();
    }
  }

  // 提交
  @Bind()
  async handleSubmit() {
    const validateValue = await this.headerDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    if (
      !this.headerDS.children.fromList.length &&
      this.headerDS.current.get('fromResourceClass') !== 'ORGANIZATION'
    ) {
      notification.error({
        message: '来源资源不能为空',
      });
      return;
    }
    const res = await this.headerDS.submit(false, false);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else if (!isEmpty(res) && res.configId) {
      notification.success({
        message: intl.get('hzero.common.notification.success').d('操作成功'),
      });
      this.refreshPage();
    }
  }

  // 取消
  @Bind()
  handleBack() {
    this.props.history.push({
      pathname: `/lmes/resource-plan/list`,
    });
  }

  // 应用
  @Bind()
  handleApply() {
    this.handleSubmit();
    this.handleBack();
  }

  // 来源分类下拉框change
  @Bind()
  async handleFromResourceChange(value) {
    if (value === 'ORGANIZATION') {
      this.setState({
        addDisabledFlag: true,
      });
    } else {
      this.setState({
        addDisabledFlag: false,
      });
    }
    this.headerDS.children.fromList.queryParameter = {
      resourceClass: value,
    };
    await this.headerDS.children.fromList.query();
  }

  // 目标分类下拉框change
  @Bind()
  async handleToResourceChange(value) {
    this.headerDS.children.toList.queryParameter = {
      resourceClass: value,
    };
    await this.headerDS.children.toList.query();
  }

  @Bind()
  handleFromAdd() {
    if (!this.headerDS.children.fromList.length) {
      this.headerDS.children.fromList.create(
        {
          resourceClass: this.headerDS.current.get('fromResourceClass'),
          essentialFlag: 1,
        },
        0
      );
    }
  }

  @Bind()
  handleToAdd() {
    this.headerDS.children.toList.create(
      {
        resourceClass: this.headerDS.current.get('toResourceClass'),
      },
      0
    );
  }

  render() {
    const { addDisabledFlag, codeDisabled } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${promptCode}.view.message.title.config`).d('资源计划配置')}
          backPath="/lmes/resource-plan/list"
        >
          <Button onClick={this.handleApply}>
            {intl.get('hzero.common.button.apply').d('应用')}
          </Button>
          <Button onClick={this.handleBack}>
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content className="lmes-resource-plan-config-content">
          <div className="lmes-resource-plan-config-form">
            <Form dataSet={this.headerDS} columns={2}>
              <Lov name="organizationObj" />
              <TextField name="configCode" disabled={codeDisabled} />
              <Select name="fromResourceClass" onChange={this.handleFromResourceChange} />
              <Select name="toResourceClass" onChange={this.handleToResourceChange} />
              <Switch name="dateScheduledControl" />
            </Form>
          </div>
          <div className="lmes-resource-plan-config-table">
            <Table
              dataSet={this.headerDS.children.fromList}
              columns={this.columns}
              columnResizable="true"
              buttons={[
                ['add', { disabled: addDisabledFlag, onClick: this.handleFromAdd }],
                ['delete', { onClick: () => this.handlDelLine(this.headerDS.children.fromList) }],
              ]}
            />
            <Table
              dataSet={this.headerDS.children.toList}
              columns={this.columns}
              columnResizable="true"
              buttons={[
                ['add', { onClick: this.handleToAdd }],
                ['delete', { onClick: () => this.handlDelLine(this.headerDS.children.toList) }],
              ]}
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}
