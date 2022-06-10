/**
 * @Description: 工艺路线工序详情页面--资源列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:07:15
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { Table, CheckBox, Lov, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class ResourceList extends PureComponent {
  get columns() {
    const { detailDS, copyFlag } = this.props;
    return [
      {
        name: 'resourceCategoryObj',
        editor: (record) => (record.status === 'add' || copyFlag ? <Lov noCache /> : null),
        width: 128,
      },
      {
        name: 'resourceGroupObj',
        editor: (record) => (record.status === 'add' || copyFlag ? <Lov noCache /> : null),
        width: 128,
      },
      {
        name: 'resourceObj',
        editor: (record) => (record.status === 'add' || copyFlag ? <Lov noCache /> : null),
        width: 128,
      },
      {
        name: 'preferredFlag',
        editor: <CheckBox />,
        width: 80,
        align: 'center',
        renderer: yesOrNoRender,
      },
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
                onClick={() => detailDS.children.resourceList.remove(record)}
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
      dataSet: detailDS.children.resourceList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
