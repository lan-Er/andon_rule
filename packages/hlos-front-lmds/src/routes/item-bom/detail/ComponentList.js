/**
 * @Description: Bom详情页--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 12:32:42
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, TextField, Lov, Tooltip, Button } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
// import { getSerialNum } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

export default class DetailList extends PureComponent {
  get columns() {
    return [
      {
        name: 'bomLineNum',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 70,
        align: 'center',
        lock: true,
      },
      {
        name: 'organizationObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'componentObj',
        editor: (record) =>
          record.status === 'add' ? <Lov noCache onChange={this.handleItemChange} /> : null,
        width: 144,
        lock: true,
      },
      { name: 'componentItemDescription', width: 200 },
      { name: 'uomObj', width: 70 },
      { name: 'bomUsage', editor: true, width: 100 },
      { name: 'componentShrinkage', editor: true, width: 100 },
      { name: 'operation', editor: true, width: 100 },
      { name: 'supplyType', editor: true, width: 100 },
      { name: 'warehouseObj', editor: <Lov noCache />, width: 144 },
      { name: 'wmAreaObj', editor: <Lov noCache />, width: 144 },
      { name: 'ecnNum', editor: true, width: 144 },
      { name: 'substitutePolicy', editor: true, width: 100 },
      { name: 'substituteGroup', editor: true, width: 144 },
      { name: 'substitutePriority', editor: true, width: 100 },
      { name: 'substitutePercent', editor: true, width: 100 },
      { name: 'remark', editor: true, width: 200 },
      { name: 'startDate', editor: true, width: 128, align: 'center' },
      { name: 'endDate', editor: true, width: 128, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip
              placement="bottom"
              title={intl.get('hzero.common.button.cancel').d('取消')}
              key="cancel"
            >
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

  @Bind()
  handleItemChange(rec) {
    if (rec) {
      const { bomComponentList } = this.props.detailDS.children;
      const { uomId, uom, uomName } = rec;
      if (uomId) {
        bomComponentList.current.set('uomObj', {
          uomId,
          uomName,
          uomCode: uom,
        });
      }
    }
  }

  @Bind()
  removeData(record) {
    const { bomComponentList } = this.props.detailDS.children;
    if (record.toData().bomLineId) {
      bomComponentList.current.reset();
    } else {
      bomComponentList.remove(record);
    }
  }

  @Bind()
  handleAddLine() {
    const { detailDS } = this.props;
    const lineList = detailDS.children.bomComponentList;
    const { organizationObj } = detailDS.current.data;
    const bomLineNums = lineList.map((i) => i.data.bomLineNum);
    const bomLineNum = Math.max(...bomLineNums, 0) + 1;
    lineList.create({
      organizationObj,
      bomLineNum,
    });
  }

  render() {
    const { detailDS } = this.props;
    const tableProps = {
      buttons: [['add', { onClick: this.handleAddLine }]],
      columns: this.columns,
      dataSet: detailDS.children.bomComponentList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
