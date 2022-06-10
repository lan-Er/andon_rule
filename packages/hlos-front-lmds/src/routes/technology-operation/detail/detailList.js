/*
 * @Author: zhang yang
 * @Description: 工序 工序明细 detail
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:07
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, Tooltip, Button, TextField, Lov } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'lmds.operation';

export default class ContextDetail extends PureComponent {
  keyList = 'resource';

  /**
   * 新增
   */
  @Bind()
  async handleAddChildrenList() {
    if (this.keyList === 'resource') {
      this.props.detailDS.children.resourceList.create({}, 0);
    }
    if (this.keyList === 'step') {
      this.props.detailDS.children.stepList.create({}, 0);
    }
    if (this.keyList === 'component') {
      this.props.detailDS.children.componentList.create({}, 0);
    }
  }

  /**
   * 新增
   */
  @Bind()
  async handleResetChildrenList() {
    if (this.keyList === 'resource') {
      this.props.detailDS.children.resourceList.reset();
    }
    if (this.keyList === 'step') {
      this.props.detailDS.children.stepList.reset();
    }
    if (this.keyList === 'component') {
      this.props.detailDS.children.componentList.reset();
    }
  }

  get resourceColumns() {
    return [
      {
        name: 'resourceCategory',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'resourceGroup',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'resource',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      { name: 'preferredFlag', editor: true, width: 80, align: 'center', renderer: yesOrNoRender },
      { name: 'externalId', editor: true, width: 150 },
      { name: 'startDate', editor: true, width: 130, align: 'center' },
      { name: 'endDate', editor: true, width: 130, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                disabled={!record.get('operationId')}
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  get stepColumns() {
    return [
      { name: 'operationStepNum', editor: true, width: 80, lock: true },
      {
        name: 'operationStepCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 128,
        lock: true,
      },
      { name: 'operationStepName', editor: true, width: 200, lock: true },
      { name: 'operationStepAlias', editor: true, width: 128 },
      { name: 'description', editor: true, width: 200 },
      { name: 'operationStepType', editor: true, width: 128 },
      { name: 'keyStepFlag', editor: true, width: 80, align: 'center', renderer: yesOrNoRender },
      { name: 'processRule', editor: true, width: 128 },
      { name: 'collector', editor: <Lov noCache />, width: 128 },
      { name: 'remark', editor: true, width: 80 },
      { name: 'startDate', editor: true, width: 128, align: 'center' },
      { name: 'endDate', editor: true, width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                disabled={!record.get('operationId')}
                onClick={() => this.handleDelLineStep(record)}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeDataStep(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  get componentColumns() {
    return [
      { name: 'lineNum', editor: true, width: 80, lock: true },
      {
        name: 'componentItem',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 128,
      },
      { name: 'itemDescription', editor: false, width: 200 },
      { name: 'componentQty', editor: true, width: 90 },
      { name: 'bom', editor: <Lov noCache />, width: 128 },
      { name: 'bomVersion', editor: false, width: 90 },
      { name: 'bomLineObj', editor: <Lov noCache />, width: 90 },
      { name: 'externalId', editor: true, width: 128 },
      { name: 'startDate', editor: true, width: 128, align: 'center' },
      { name: 'endDate', editor: true, width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                disabled={!record.get('operationId')}
                onClick={() => this.handleDelLineCom(record)}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeDataComponent(record)}
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
    const { detailDS } = this.props;
    await detailDS.children.resourceList.delete([record]);
    detailDS.children.resourceList.query();
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { resourceList } = this.props.detailDS.children;
    if (record.toData().id) {
      resourceList.current.reset();
    } else {
      resourceList.remove(record);
    }
  }

  @Bind()
  async handleDelLineStep(record) {
    const { detailDS } = this.props;
    await detailDS.children.stepList.delete([record]);
    detailDS.children.stepList.query();
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeDataStep(record) {
    const { stepList } = this.props.detailDS.children;
    if (record.toData().operationStepId) {
      stepList.current.reset();
    } else {
      stepList.remove(record);
    }
  }

  @Bind()
  async handleDelLineCom(record) {
    const { detailDS } = this.props;
    await detailDS.children.componentList.delete([record]);
    detailDS.children.componentList.query();
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeDataComponent(record) {
    const { componentList } = this.props.detailDS.children;
    if (record.toData().id) {
      componentList.current.reset();
    } else {
      componentList.remove(record);
    }
  }

  /**
   *切换不同的表格函数变化
   * @param {*} key
   * @memberof ContextDetail
   */
  @Bind()
  handleTurnChange(key) {
    if (key === 'resource') {
      this.keyList = 'resource';
    }
    if (key === 'step') {
      this.keyList = 'step';
    }
    if (key === 'component') {
      this.keyList = 'component';
    }
  }

  render() {
    const { detailDS } = this.props;
    const tablePropsResource = {
      columns: this.resourceColumns,
      dataSet: detailDS.children.resourceList,
    };
    const tablePropsStep = {
      columns: this.stepColumns,
      dataSet: detailDS.children.stepList,
    };
    const tablePropsComponent = {
      columns: this.componentColumns,
      dataSet: detailDS.children.componentList,
    };
    return (
      <Fragment>
        <Button
          icon="playlist_add"
          funcType="flat"
          color="primary"
          onClick={this.handleAddChildrenList}
        >
          {intl.get('hzero.common.button.create').d('新增')}
        </Button>
        <Tabs defaultActiveKey="resource" onChange={this.handleTurnChange}>
          <Tabs.TabPane tab={intl.get(`${preCode}.view.title.resource`).d('资源')} key="resource">
            <Table {...tablePropsResource} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.get(`${preCode}.view.title.step`).d('步骤')} key="step">
            <Table {...tablePropsStep} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.get(`${preCode}.view.title.component`).d('组件')} key="component">
            <Table {...tablePropsComponent} />
          </Tabs.TabPane>
        </Tabs>
      </Fragment>
    );
  }
}
