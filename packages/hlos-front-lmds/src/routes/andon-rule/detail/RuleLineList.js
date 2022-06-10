/**
 * @Description: 安灯规则详情页面--规则项列表
 * @Author: wenhao.li<wenhao.li@zone-cloud.com>
 * @Date: 2021-10-25 14:06:38
 * @LastEditors: wenhao.li
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, CheckBox, Lov, Tooltip, Button } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class DetailList extends PureComponent {
  get columns() {
    return [
      {
        name: 'andonRankObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 150,
      },
      { name: 'relatedPositionObj', editor: true, width: 150 },
      { name: 'relatedUserObj', editor: true, width: 150 },
      { name: 'realName', width: 150 },
      { name: 'phoneNumber', editor: true, width: 150 },
      { name: 'email', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        editor: <CheckBox />,
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
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
                onClick={() => this.handleDelLine(record, 'delete')}
              />
            </Tooltip>,
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record, 'cancel')}
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
  async handleDelLine(record, type) {
    const { lineList } = this.props.detailDS.children;
    if (record.toData().lineId) {
      if (type === 'cancel') {
        lineList.current.reset();
      } else {
        lineList.delete([record]);
      }
    } else {
      lineList.remove(record);
    }
  }

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.lineList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
