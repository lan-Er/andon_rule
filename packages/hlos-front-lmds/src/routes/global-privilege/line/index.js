/**
 * @Description: 权限明细管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 14:48:15
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Button, Tooltip, Lov } from 'choerodon-ui/pro';
import { Row, Col, Form, Input } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import querystring from 'querystring';
import { Header, Content } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import PrivilegLineDS from '../stores/PrivilegLineDS';

const preCode = 'lmds.privilege';

@connect()
@formatterCollections({
  code: ['lmds.common', 'lmds.privilege'],
})
export default class PrivilegeLine extends Component {
  state = {
    privilegeId: '',
    privilegeCode: '',
    privilegeName: '',
    description: '',
  };

  tableDS = new DataSet({
    ...PrivilegLineDS(),
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
        privilegeId: privilegeData.privilegeId,
        privilegeCode: privilegeData.privilegeCode,
        privilegeName: privilegeData.privilegeName,
        description: privilegeData.description,
      });
    }
  }


  get columns() {
    return [
      { name: 'sourceType', editor: true, lock: true },
      { name: 'sourceObj', editor: <Lov noCache />, lock: true },
      { name: 'privilegeAction', editor: true },
      { name: 'orderByCode', editor: true },
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

  /**
   * 跳转到权限分配页面
   */
  @Bind()
  handleToAssignPage() {
    const { dispatch } = this.props;
    const { privilegeId, privilegeCode, privilegeName, description } = this.state;
    const privilegeData = {
      privilegeId,
      privilegeCode,
      privilegeName,
      description,
    };
    dispatch(
      routerRedux.push({
        pathname: `/lmds/privilege/assign`,
        search: querystring.stringify({
            privilegeData: encodeURIComponent( JSON.stringify(privilegeData) ),
          }),
      })
    );
  }

  render() {
    const { privilegeCode, privilegeName, description } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.privilegeLine`).d('权限明细')}
          backPath="/lmds/privilege"
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
              <Button
                key="framework"
                icon="framework"
                color="primary"
                funcType="flat"
                onClick={this.handleToAssignPage}
              >
                {intl.get('lmds.common.button.assign').d('分配')}
              </Button>,
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
