/*
 * @Author: zhang yang
 * @Description: 检验项目组-行表详情
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-25 17:18:36
 */
import React, { PureComponent, Fragment } from 'react';
import { Table, Lov, Button, Tooltip } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

export default class DetailList extends PureComponent {
  /**
   * 新增
   */
  @Bind()
  async handleAddChildrenList() {
    this.props.detailDs.children.inspectionGroupLineList.create({}, 0);
  }

  get columns() {
    return [
      { name: 'orderByCode', editor: true, width: 82, lock: true },
      { name: 'inspectionItemCode', editor: false, width: 128, lock: true },
      {
        name: 'inspectionItem',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 150,
        lock: true,
      },
      { name: 'inspectionResource', editor: false, width: 128 },
      { name: 'resultTypeMeaning', editor: false, width: 84 },
      { name: 'defaultUcl', editor: false, width: 100 },
      { name: 'defaultUclAccept', editor: false, width: 70 },
      { name: 'defaultLcl', editor: false, width: 100 },
      { name: 'defaultLclAccept', editor: false, width: 70 },
      { name: 'necessaryFlag', editor: true, width: 70 },
      { name: 'inspectionSection', editor: true, width: 128 },
      { name: 'sectionOrderCode', editor: true, width: 128 },
      {
        name: 'enabledFlag',
        editor: true,
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
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
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { inspectionGroupLineList } = this.props.detailDs.children;
    if (record.toData().lineId) {
      inspectionGroupLineList.current.reset();
    } else {
      inspectionGroupLineList.remove(record);
    }
  }

  render() {
    const { detailDs } = this.props;
    const buttons = ['add'];
    const tableProps = {
      buttons,
      columns: this.columns,
      dataSet: detailDs.children.inspectionGroupLineList,
    };
    return (
      <Fragment>
        <Table {...tableProps} />
      </Fragment>
    );
  }
}
