/**
 * @Description: 资源组-资源分配
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-08 15:26:29
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
import ResourceAssignDS from '../stores/ResourceAssignDS';

const preCode = 'lmds.resourceGroup';
const commonCode = 'lmds.common.model';

@connect()
@formatterCollections({
  code: ['lmds.resourceGroup', 'lmds.common'],
})
export default class ResourceAssign extends Component {
  state = {
    resourceGroupCode: '',
    resourceGroupName: '',
    organizationName: '',
  };

  tableDS = new DataSet({
    ...ResourceAssignDS(),
  });

  async componentDidMount() {
    const { location: { search }, match: { params } } = this.props;
    if(params.resourceGroupId) {
      this.tableDS.queryParameter = {
        resourceGroupId: params.resourceGroupId,
      };
      await this.tableDS.query();
    }

    const groupDataStr = new URLSearchParams(search).get('groupData');
    if (groupDataStr) {
      const groupData = JSON.parse(decodeURIComponent(groupDataStr));
      this.tableDS.fields.get('resourceObj').setLovPara('organizationId', groupData.organizationId);
      this.setState({
        resourceGroupCode: groupData.resourceGroupCode,
        resourceGroupName: groupData.resourceGroupName,
        organizationName: groupData.organizationName,
      });
    }
  }

  get columns() {
    return [
      { name: 'resourceObj', editor: this.editorRenderer },
      { name: 'resourceName'},
      { name: 'orderByCode', editor: true},
      {
        name: 'preferredFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
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
   * 判断是否为新建，新建可编辑
   * @param {*} record
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
    const { resourceGroupCode, resourceGroupName, organizationName } = this.state;
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.resourceAssign`).d('资源分配')}
          backPath="/lmds/resource-group/list"
        />
        <Content>
          <Row>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.resourceGroup`).d('资源组')}
              >
                <Input value={resourceGroupCode} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${preCode}.model.resourceGroupName`).d('资源组名称')}
              >
                <Input value={resourceGroupName} disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${commonCode}.org`).d('组织')}
              >
                <Input value={organizationName} disabled />
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
