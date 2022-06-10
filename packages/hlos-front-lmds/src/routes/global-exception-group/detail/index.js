/**
 * @Description: 异常组-异常明细
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 12:22:03
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Lov, Button, Tooltip } from 'choerodon-ui/pro';
import { Row, Col, Form, Input } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ExceptionGroupLineDS from '../stores/ExceptionGroupLineDS';

const preCode = 'lmds.exceptionGroup';

@connect()
@formatterCollections({
  code: ['lmds.exceptionGroup'],
})
export default class exceptionGroupLine extends Component {
  state = {
    exceptionGroupCode: '',
    exceptionGroupName: '',
    exceptionGroupTypeMeaning: '',
  };

  tableDS = new DataSet({
    ...ExceptionGroupLineDS(),
  });

  async componentDidMount() {
    const { location: { search } } = this.props;

    const groupDataStr = new URLSearchParams(search).get('groupData');
    if (groupDataStr) {
      const groupData = JSON.parse(decodeURIComponent(groupDataStr));
      this.tableDS.queryParameter = {
        exceptionGroupId: groupData.exceptionGroupId,
      };
      await this.tableDS.query();
      this.setState({
        exceptionGroupCode: groupData.exceptionGroupCode,
        exceptionGroupName: groupData.exceptionGroupName,
        exceptionGroupTypeMeaning: groupData.exceptionGroupTypeMeaning,
      });
    }
  }

  get columns() {
    return [
      { name: 'exceptionObj', editor: this.editorRenderer },
      { name: 'exceptionName'},
      { name: 'orderByCode', editor: true},
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }

  /**
   * @param {*} record 判断是否为新建，新建可编辑
   */
  editorRenderer(record) {
    return record.status === 'add' ? <Lov noCache /> : null;
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }

    const res = await this.tableDS.submit();
    if(res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });

    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.tableDS.query();
    }
  }

  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    try {
      const res = await this.tableDS.delete([record]);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  render() {
    const { exceptionGroupCode, exceptionGroupName, exceptionGroupTypeMeaning } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.exceptionGroupLine`).d('异常明细')}
          backPath="/lmds/exception-group/list"
        />
        <Content>
          <Row>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.exceptionGroupType`).d('异常组类型')}
              >
                <Input value={exceptionGroupTypeMeaning} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.exceptionGroup`).d('异常组')}
              >
                <Input value={exceptionGroupCode} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.exceptionGroupName`).d('异常组名称')}
              >
                <Input value={exceptionGroupName} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Table
            dataSet={this.tableDS}
            buttons={[
              'add',
            ]}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
