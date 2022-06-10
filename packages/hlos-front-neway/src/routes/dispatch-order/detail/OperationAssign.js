/*
 * @Author: zhang yang
 * @Description: 检验项目组-行表详情
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-25 17:18:36
 */
import React, { PureComponent, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';

export default class OperationAssign extends PureComponent {
  get columns() {
    return [
      { name: 'operation', width: 100 },
      { name: 'resourceName', width: 120 },
      { name: 'attributeString1', width: 120 },
      { name: 'standardWorkTime', width: 120 },
      { name: 'processedTime', width: 128 },
    ];
  }

  render() {
    const { assignList } = this.props.detailDs.children;
    const tableProps = {
      columns: this.columns,
      dataSet: assignList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
