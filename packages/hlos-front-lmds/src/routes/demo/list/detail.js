import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import notification from 'utils/notification';
import {
  DataSet,
  Form,
  Select,
  TextField,
  Switch,
  Button,
  Lov,
  Table,
  Tooltip,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import AndonListDetail from '../stores/AndonListDetail';

@connect()
export default class Detail extends Component {
  ds = new DataSet({
    ...AndonListDetail(),
  });

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.ds.create({ enabledFlag: true });
    } else {
      await this.refreshPage();
    }
  }

  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '数据校验失败',
      });
      return;
    }
    const res = await this.ds.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: '未修改数据',
      });
      return;
    }
    if (res && res.content && res.content[0]) {
      const pathname = `/lmds/demo/detail/${res.content[0].andonRuleId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      this.refreshPage();
    }
  }

  async refreshPage() {
    const { andonRuleId } = this.props.match.params;
    this.ds.queryParameter = { andonRuleId };
    await this.ds.query();
  }

  handleDelLine(record, type) {
    if (record.toData().lineId) {
      if (type === 'cancel') {
        this.ds.children.datas.current.reset();
      } else {
        this.ds.children.datas.delete([record]);
      }
    } else {
      this.ds.children.datas.remove(record);
    }
  }

  get isCreatePage() {
    const { match } = this.props;
    const { andonRuleId } = match.params;
    return !andonRuleId;
  }

  get columns() {
    return [
      {
        name: 'andonRankObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'relatedPositionObj', editor: true },
      { name: 'relatedUserObj', editor: true },
      { name: 'realName', label: '真实姓名', editor: false },
      { name: 'phoneNumber', editor: true },
      { name: 'email', editor: true },
      { name: 'enabledFlag', editor: true },
      {
        header: '操作',
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title="删除">
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record, 'delete')}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title="取消">
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record, 'cancel')}
              />
            </Tooltip>,
          ];
        },
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={this.isCreatePage ? '新建' : '编辑'} backPath="/lmds/demo/list">
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            保存
          </Button>
        </Header>
        <Content>
          <Card
            key="andon-rule-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>安灯规则</h3>}
          >
            <Form dataSet={this.ds} columns={4}>
              <Lov name="organizationObj" noCache disabled={!this.isCreatePage} />
              <Select name="andonRuleType" disabled={!this.isCreatePage} />
              <TextField name="andonRuleCode" disabled={!this.isCreatePage} />
              <TextField name="andonRuleName" />
              <TextField name="andonRuleAlias" />
              <TextField name="description" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="andon-rule-List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>安灯规则项</h3>}
          >
            <Table buttons={['add']} dataSet={this.ds.children.datas} columns={this.columns} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
