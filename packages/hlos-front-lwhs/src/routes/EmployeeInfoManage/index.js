/**
 * 员工信息管理
 * @since: 2020-07-08 14:47:48
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Content } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { EimDS } from '@/stores/employeeInfoManageDS';
import { employeeStatusUpdate } from '@/services/employeeInfo';

export default class EmployeeInfoManage extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...EimDS,
    });
  }

  componentDidMount() {
    const { companyCode } = this.props.match.params;
    this.tableDS.queryParameter = { companyCode };
    this.tableDS.query();
  }

  @Bind()
  async updateStatus(record) {
    const res = await employeeStatusUpdate(
      Object.assign({}, record.data, {
        enableFlag: record.data.enableFlag ? 0 : 1,
      })
    );
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
  }

  get columns() {
    return [
      { name: 'employeeName', width: 150, align: 'center' },
      { name: 'employeeCode', width: 150, align: 'center' },
      { name: 'companyName', align: 'center' },
      { name: 'phone', width: 150, align: 'center' },
      { name: 'email', width: 150, align: 'center' },
      { name: 'enableFlag', width: 150, align: 'center', renderer: yesOrNoRender },
      {
        header: '操作',
        width: 200,
        command: ({ record }) => {
          return [
            <Button
              key="update"
              color="primary"
              funcType="flat"
              onClick={() => this.updateStatus(record)}
              style={{
                display: 'inline-block',
                marginTop: '-6px',
              }}
            >
              {record.data.enableFlag ? '禁用' : '启用'}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
        </Content>
      </Fragment>
    );
  }
}
