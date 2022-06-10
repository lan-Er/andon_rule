/**
 * @Description: 工艺路线详情页面--工序列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:15
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { Table, CheckBox, Lov, Button, TextField } from 'choerodon-ui/pro';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { connect } from 'dva';

@connect()
export default class RoutingOperationList extends PureComponent {
  get columns() {
    const { detailDS, routingId } = this.props;
    return [
      {
        name: 'sequenceNum',
        // editor: !routingId,
        width: 70,
        align: 'center',
        lock: true,
        editor: (record) =>
          !routingId || record.get('sequenceNum') === undefined ? <TextField /> : null,
        // name: 'sequenceNum',
        // editor: false,
        // width: 80,
        // align: 'center',
        // lock: true,
        // renderer: ({ record }) => this.getSerialNum(record),
      },
      { name: 'operationObj', editor: <Lov noCache />, width: 128, lock: true },
      { name: 'operationName', width: 128 },
      { name: 'operationAlias', editor: true, width: 128 },
      { name: 'description', editor: true, width: 128 },
      { name: 'routingOperationType', editor: true, width: 128 },
      {
        name: 'keyOperationFlag',
        editor: <CheckBox />,
        width: 90,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'firstOperationFlag',
        editor: <CheckBox />,
        width: 90,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'lastOperationFlag',
        editor: <CheckBox />,
        width: 90,
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'executeRuleObj', editor: <Lov noCache />, width: 128 },
      { name: 'inspectionRuleObj', editor: <Lov noCache />, width: 128 },
      { name: 'preSequenceNum', editor: true, width: 128 },
      { name: 'downstreamOperation', editor: true, width: 128 },
      { name: 'operationGroup', editor: true, width: 128 },
      { name: 'reworkOperation', editor: true, width: 128 },
      { name: 'processTime', editor: true, width: 90 },
      { name: 'standardWorkTime', editor: true, width: 90 },
      { name: 'referenceDocument', width: 128 },
      { name: 'processProgram', width: 128 },
      { name: 'collectorObj', editor: <Lov noCache />, width: 128 },
      { name: 'instruction', editor: true, width: 128 },
      { name: 'dispatchRuleObj', editor: <Lov noCache />, width: 128 },
      { name: 'packingRuleObj', editor: <Lov noCache />, width: 128 },
      { name: 'reworkRuleObj', editor: <Lov noCache />, width: 128 },
      { name: 'externalId', editor: true, width: 128 },
      { name: 'externalNum', editor: true, width: 128 },
      { name: 'startDate', editor: true, width: 128, align: 'center' },
      { name: 'endDate', editor: true, width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        command: ({ record }) => {
          if (record.status !== 'add') {
            return [
              <Button
                key="edit"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToOperationPage('/lmds/routing/operation', record)}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </Button>,
            ];
          } else {
            return [
              <Button
                key="cancel"
                color="primary"
                funcType="flat"
                onClick={() => detailDS.children.routingOperationList.remove(record)}
              >
                {intl.get('hzero.common.button.cancel').d('取消')}
              </Button>,
            ];
          }
        },
        lock: 'right',
      },
    ];
  }

  /**
   *
   *跳转到工序详情
   * @param record
   * @param service
   */
  @Bind()
  handleToOperationPage(url, record) {
    const { routingId, dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `${url}/${routingId}/${record.get('routingOperationId')}`,
        state: {
          copyFlag: record.get('attribute01'),
        },
      })
    );
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.routingOperationList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
