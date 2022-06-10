import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import AndonList from '../stores/AndonList';

const organizationId = getCurrentOrganizationId();

@connect((state) => state)
export default class Demo extends Component {
  datas = new DataSet({
    ...AndonList(),
  });

  handleAddLine() {
    console.log(234);
  }

  @Bind()
  handleBatchImport() {
    console.log(123, this);
  }

  @Bind()
  jump(id, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: id ? `/lmds/demo/detail/${id}` : '/lmds/demo/create',
      })
    );
  }

  get columns() {
    return [
      {
        name: 'organizationName',
      },
      {
        name: 'andonRuleType',
        renderer: ({ text }) => {
          if (text === 'COMMON') {
            return '通用';
          }
        },
      },
      {
        name: 'andonRuleCode',
      },
      {
        name: 'andonRuleName',
      },
      {
        name: 'andonRuleAlias',
      },
      {
        name: 'description',
      },
      {
        name: 'enabledFlag',
        renderer: yesOrNoRender,
      },
      {
        header: '操作',
        lock: 'right',
        align: 'center',
        command: ({ record }) => {
          return [
            <Button
              funcType="flat"
              color="green"
              onClick={() => this.jump(record.get('andonRuleId'))}
            >
              编辑
            </Button>,
          ];
        },
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title="安灯规则">
          <Button icon="add" color="primary" onClick={() => this.jump()}>
            新建
          </Button>
          <ExcelExport requestUrl={`${HLOS_LMDS}/v1/${organizationId}/andon-rules/excel`} />
        </Header>
        <Content>
          <Table dataSet={this.datas} columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
