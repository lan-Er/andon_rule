/**
 * @Description: PSI要素初始化页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:06:38
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Select, Button, Lov, Table, CheckBox, Form } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

import InitialListDS from '../stores/InitialListDS';
import InitialHeaderDS from '../stores/InitialHeaderDS';

const preCode = 'lmds.psiElementAssign';

@connect(({ psiElementAssign, loading }) => ({
  psiElementAssign,
  submitLoading:
    loading.effects['psiElementAssign/deleteRows'] && loading.effects['psiElementAssign/create'],
}))
@formatterCollections({
  code: ['lmds.psiElementAssign'],
})
export default class DetailPage extends Component {
  state = {
    sourceId: undefined,
  };

  headerDS = new DataSet({
    ...InitialHeaderDS(),
  });

  tableDS = new DataSet({
    ...InitialListDS(),
  });

  async componentDidMount() {
    await this.headerDS.create({});
  }

  get columns() {
    return [
      { name: 'displayAreaMeaning', width: 150 },
      { name: 'elementCode', width: 150 },
      { name: 'mainCategory', width: 150 },
      { name: 'subCategory', width: 150 },
      { name: 'description', width: 150 },
      { name: 'orderByCode', editor: true, width: 150 },
      {
        name: 'displayFlag',
        align: 'center',
        editor: <CheckBox />,
        width: 100,
      },
      {
        name: 'enabledFlag',
        align: 'center',
        editor: <CheckBox />,
        width: 100,
      },
    ];
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { sourceId } = this.state;
    const validateValue = await this.headerDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }

    if (!this.tableDS.selected.length) {
      notification.error({
        message: intl
          .get('lmds.psiElementAssign.view.message.valid.select')
          .d('请至少选择一条数据'),
      });
      return;
    }

    const data = [];
    const assignType = this.headerDS.current.get('assignType');
    this.tableDS.selected.forEach((item) => {
      data.push(item.data);
    });

    data.map((item) => {
      const listItem = item;
      listItem.sourceId = sourceId;
      listItem.assignType = assignType;
      listItem.objVersion = item.objectVersionNumber;
      delete listItem.objectVersionNumber;
      return listItem;
    });

    await this.tableDS.submit(data);
  }

  /**
   * 监听来源Lov 数据变化
   * @param record 选中的来源记录
   */
  @Bind()
  handleSourceChange(record) {
    if (!isEmpty(record)) {
      this.setState({
        sourceId: record.sourceId,
      });
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.initial`).d('初始化')}
          backPath="/lmds/psi-element-assign/list"
        >
          <Button
            icon="save"
            color="primary"
            onClick={this.handleSubmit}
            loading={this.props.submitLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Form dataSet={this.headerDS} columns={4}>
            <Select name="assignType" />
            <Lov noCache name="sourceObj" onChange={this.handleSourceChange} />
          </Form>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
