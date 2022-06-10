/*
 * @Author: zhang yang
 * @Description:  明细 detail
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:07
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, Tooltip, Button, Lov } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

export default class BomList extends PureComponent {
  /**
   * 新增
   */
  @Bind()
  async handleAddChildrenList() {
    this.props.detailDS.children.lineList.create({}, 0);
  }

  get columns() {
    return [
      { name: 'bomLineNum', editor: true, width: 150 },
      { name: 'subResource', editor: <Lov noCache />, width: 150 },
      { name: 'bomUsage', editor: true, width: 150 },
      { name: 'spareQty', editor: true, width: 150 },
      { name: 'substituteFlag', editor: true, width: 100, align: 'center' },
      { name: 'substituteGroup', editor: true, width: 150 },
      { name: 'substitutePriority', editor: true, width: 150 },
      { name: 'supplier', editor: <Lov noCache />, width: 150 },
      { name: 'manufacturer', editor: true, width: 150 },
      { name: 'startDate', editor: true, width: 130, align: 'center' },
      { name: 'endDate', editor: true, width: 130, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'delete',
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

  /**
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    const { detailDS } = this.props;
    await detailDS.children.lineList.delete([record]);
    detailDS.children.lineList.query();
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { lineList } = this.props.detailDS.children;
    if (record.toData().bomLineId) {
      lineList.current.reset();
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
