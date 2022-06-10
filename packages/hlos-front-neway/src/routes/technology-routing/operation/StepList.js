/**
 * @Description: 工艺路线工序详情页面--步骤列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:15
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, CheckBox, Lov, TextField, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class StepList extends PureComponent {
  get columns() {
    const { detailDS, copyFlag } = this.props;
    return [
      { name: 'operationStepNum', editor: true, width: 80, align: 'center' },
      {
        name: 'operationStepCode',
        editor: (record) => (record.status === 'add' || copyFlag ? <TextField /> : null),
        width: 128,
      },
      { name: 'operationStepName', editor: true, width: 200 },
      { name: 'operationStepAlias', editor: true, width: 128 },
      { name: 'description', editor: true, width: 200 },
      { name: 'operationStepType', editor: true, width: 128 },
      {
        name: 'keyStepFlag',
        editor: <CheckBox />,
        width: 80,
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'processRule', editor: true, width: 128 },
      { name: 'collectorObj', editor: <Lov noCache />, width: 128 },
      { name: 'remark', editor: true, width: 200 },
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
                onClick={() => detailDS.children.stepList.remove(record)}
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
      dataSet: detailDS.children.stepList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
