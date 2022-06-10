/*
 * @Description: 质量检模板检查项 -- InspectionTemLine
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */
import React, { PureComponent } from 'react';
import { Table, CheckBox, Tooltip, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

export default class InspectionTemLine extends PureComponent {
  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeDataComponent(record) {
    const { inspectionTemplateLineList } = this.props.ds.children;
    if (record.toData().templateLineId) {
      inspectionTemplateLineList.current.reset();
    } else {
      inspectionTemplateLineList.remove(record);
    }
  }

  get columns() {
    return [
      {
        name: 'inspectionItemName',
        width: 128,
        lock: true,
      },
      {
        name: 'resultTypeMeaning',
        width: 84,
      },
      { name: 'inspectionResourceObj', width: 128, editor: true },
      {
        name: 'ucl',
        editor: true,
        width: 100,
      },
      {
        name: 'uclAccept',
        editor: <CheckBox />,
        width: 70,
        align: 'center',
      },
      {
        name: 'lcl',
        editor: true,
        width: 100,
      },
      {
        name: 'lclAccept',
        editor: <CheckBox />,
        width: 70,
        align: 'center',
      },
      {
        name: 'necessaryFlag',
        editor: <CheckBox />,
        width: 70,
        align: 'center',
      },
      {
        name: 'orderByCode',
        editor: true,
        width: 82,
      },
      {
        name: 'inspectionSection',
        editor: true,
        width: 128,
      },
      {
        name: 'sectionOrderCode',
        editor: true,
        width: 128,
      },
      {
        name: 'enabledFlag',
        editor: <CheckBox />,
        width: 70,
        align: 'center',
      },
      // {
      //   header: intl.get('hzero.common.button.action').d('操作'),
      //   width: 90,
      //   command: ({ record }) => {
      //     return [
      //       <Tooltip
      //         key="cancel"
      //         placement="bottom"
      //         title={intl.get('hzero.common.button.cancel').d('取消')}
      //       >
      //         <Button
      //           icon="cancle_a"
      //           color="primary"
      //           funcType="flat"
      //           onClick={() => this.removeDataComponent(record)}
      //         />
      //       </Tooltip>,
      //     ];
      //   },
      //   lock: 'right',
      // },
    ];
  }

  render() {
    const { ds } = this.props;
    const tableProps = {
      columns: this.columns,
      dataSet: ds.children.inspectionTemplateLineList,
    };
    return <Table {...tableProps} />;
  }
}
