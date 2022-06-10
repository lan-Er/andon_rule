/**
 * @Description: 工艺路线工序详情页面--组件列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:15
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, Lov, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';

export default class ComponentList extends PureComponent {
  get columns() {
    const { detailDS, copyFlag } = this.props;
    return [
      { name: 'lineNum', editor: true, width: 80, align: 'center', lock: true },
      { name: 'componentItemObj', editor: <Lov noCache />, width: 128, lock: true },
      { name: 'itemDescription', width: 200 },
      { name: 'componentQty', editor: true, width: 90 },
      { name: 'bomObj', editor: <Lov noCache />, width: 128 },
      { name: 'bomVersion', width: 90, align: 'center' },
      { name: 'bomLineNumObj', editor: <Lov noCache />, width: 90 },
      { name: 'externalId', editor: true, width: 128 },
      { name: 'startDate', editor: true, width: 128, align: 'center' },
      { name: 'endDate', editor: true, width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        command: ({ record }) => {
          if (record.status === 'add' || copyFlag) {
            return [
              <Button
                key="cancel"
                color="primary"
                funcType="flat"
                onClick={() => detailDS.children.componentList.remove(record)}
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

  render() {
    const { detailDS } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDS.children.componentList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
