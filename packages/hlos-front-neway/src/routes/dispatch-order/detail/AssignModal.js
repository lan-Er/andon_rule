/*
 * @Author: zhang yang
 * @Description: 检验项目组-行表详情
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-25 17:18:36
 */
import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';
// import intl from 'utils/intl';

export default class AssignModal extends PureComponent {
  get columns() {
    return [
      { name: 'jobNumberObj', editor: true, width: 120 },
      { name: 'resourceName', editor: false, width: 150 },
      { name: 'attributeString1', editor: true, width: 100 },
    ];
  }

  render() {
    const { modalDs, handleSaveLine } = this.props;
    const buttons = [['add'], ['save', { onClick: handleSaveLine }]];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: modalDs,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
