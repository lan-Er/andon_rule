/**
 * @Description: 权限分配管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 15:27:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Tooltip, Button, Lov } from 'choerodon-ui/pro';
import { Row, Col, Form, Input } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import { Header, Content } from 'components/Page';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import PrivilegAssignDS from '../stores/PrivilegAssignDS';

const preCode = 'lmds.privilege';

@connect()
@formatterCollections({
  code: ['lmds.common', 'lmds.privilege'],
})
export default class PrivilegeLine extends Component {
  state = {
    privilegeCode: '',
    privilegeName: '',
    description: '',
  };

  tableDS = new DataSet({
    ...PrivilegAssignDS(),
  });

  async componentDidMount() {
    const { location: { search } } = this.props;

    // 从类别集页面接收到的参数
    const privilegeDataStr = new URLSearchParams(search).get('privilegeData');
    if (privilegeDataStr) {
      const privilegeData = JSON.parse(decodeURIComponent(privilegeDataStr));

      this.tableDS.queryParameter = {
        privilegeId: privilegeData.privilegeId,
      };
      await this.tableDS.query();

      this.setState({
        privilegeCode: privilegeData.privilegeCode,
        privilegeName: privilegeData.privilegeName,
        description: privilegeData.description,
      });
    }
  }


  get columns() {
    return [
      { name: 'roleObj', editor: <Lov noCache />, lock: true },
      { name: 'userObj', editor: <Lov noCache />, lock: true },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
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
        lock: 'right',
      },
    ];
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
    const { privilegeCode, privilegeName, description } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.privilegeAssign`).d('权限分配')}
          backPath={() => { this.props.history.back();}}
        />
        <Content>
          <Row>
            <Col span={6}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.privilege`).d('权限')}
              >
                <Input value={privilegeCode} disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.privilegeName`).d('权限名称')}
              >
                <Input value={privilegeName} disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.privilegeDesc`).d('描述')}
              >
                <Input value={description} disabled />
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
            queryBar="normal"
            queryFieldsLimit={2}
          />
        </Content>
      </Fragment>
    );
  }
}
