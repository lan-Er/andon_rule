/**
 * @Description: bom管理信息--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-22 11:06:39
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Lov,
  Form,
  Select,
  TextField,
  IntlField,
  DatePicker,
  Button,
  Modal,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';

import ComponentList from './ComponentList';
import BomDetailDS from '../stores/BomDetailDS';

const preCode = 'lmds.bom';

@connect()
@formatterCollections({
  code: ['lmds.bom'],
})
export default class DetailPage extends Component {
  detailDS = new DataSet({
    ...BomDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { bomId } = match.params;
    return !bomId;
  }

  async componentDidMount() {
    const {
      location: { state },
    } = this.props;
    if (this.isCreatePage) {
      if (state && state.mode && state.mode === 'copy') {
        await this.detailDS.create(state, 0);
      } else {
        await this.detailDS.create({});
      }
    } else {
      await this.refreshPage();
    }
  }

  @Bind()
  async refreshPage() {
    const { bomId } = this.props.match.params;
    this.detailDS.queryParameter = { bomId };
    await this.detailDS.query();
  }

  /**
   * 新建
   */
  @Bind()
  handleAdd() {
    if (this.isCreatePage) {
      Modal.confirm({
        title: '是否保存当前数据',
      }).then((button) => {
        if (button === 'ok') {
          this.handleSubmit();
        }
      });
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/lmds/bom/create',
        })
      );
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleReset() {
    this.detailDS.current.reset();
    this.detailDS.children.bomComponentList.reset();
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.detailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.detailDS.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    sessionStorage.setItem('itemBomquery', true);
    if (this.isCreatePage && res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmds/bom/detail/${res.content[0].bomId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      await this.refreshPage();
    }
  }

  @Bind()
  handleCopy() {
    const cloneData = this.detailDS.current.toData();
    cloneData.bomCode = null;
    cloneData.bomId = null;
    cloneData.bomComponentList.forEach((item) => {
      const _item = item;
      _item.bomId = null;
      _item.bomLineId = null;
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lmds/bom/create',
        state: {
          ...cloneData,
          mode: 'copy',
        },
      })
    );
  }

  render() {
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.create`).d('BOM新建')
              : intl.get(`${preCode}.view.title.BOMdetail`).d('BOM详情')
          }
          backPath="/lmds/bom/list"
        >
          <Button icon="add" color="primary" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="reset" onClick={this.handleReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button icon="save" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="content_copy" disabled={this.isCreatePage} onClick={this.handleCopy}>
            {intl.get('hzero.common.button.copy').d('复制')}
          </Button>
        </Header>
        <Content>
          <Card key="bom-header" bordered={false} className={DETAIL_CARD_CLASSNAME} title="BOM">
            <Form dataSet={this.detailDS} columns={4}>
              <Select name="bomType" disabled={!this.isCreatePage} />
              <TextField name="bomCode" disabled={!this.isCreatePage} />
              <IntlField name="description" />
              <TextField name="bomVersion" disabled={!this.isCreatePage} />
              <Lov name="organizationObj" noCache disabled={!this.isCreatePage} />
              <Lov name="itemObj" noCache disabled={!this.isCreatePage} />
              <TextField name="itemDescription" disabled />
              <TextField name="alternate" />
              <DatePicker name="startDate" />
              <DatePicker name="endDate" />
            </Form>
          </Card>
          <Card
            key="component-List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.component`).d('组件')}</h3>}
          >
            <ComponentList detailDS={this.detailDS} onItemChange={this.handleItemChange} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
