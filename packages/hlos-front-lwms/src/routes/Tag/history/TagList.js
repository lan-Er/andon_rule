/**
 * @Description: 实物标签历史-标签列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { PerformanceTable } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const tableRef = React.createRef();
const preCode = 'lwms.tag.model';
const commonCode = 'lwms.common.model';

export default class ThingList extends PureComponent {
  get columns() {
    return [
      {
        title: intl.get(`${commonCode}.eventId`).d('事件ID'),
        resizable: true,
        dataIndex: 'eventId',
        width: 150,
        fixed: true,
      },
      {
        title: intl.get(`${commonCode}.eventType`).d('事件类型'),
        resizable: true,
        dataIndex: 'eventType',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.eventTime`).d('发生时间'),
        resizable: true,
        dataIndex: 'eventTime',
        width: 136,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.eventBy`).d('提交者'),
        resizable: true,
        dataIndex: 'eventByName',
        width: 100,
      },
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        resizable: true,
        dataIndex: 'organization',
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.tag`).d('标签'),
        resizable: true,
        dataIndex: 'tagCode',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.tagStatus`).d('标签状态'),
        resizable: true,
        dataIndex: 'tagStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.loadFlag`).d('装载标识'),
        resizable: true,
        dataIndex: 'loadFlag',
        width: 70,
        render: ({ rowData }) => yesOrNoRender({ value: rowData.loadFlag }),
      },
      {
        title: intl.get(`${preCode}.tagType`).d('标签类型'),
        resizable: true,
        dataIndex: 'tagTypeMeaning',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.tagCategory`).d('标签分类'),
        resizable: true,
        dataIndex: 'tagCategory',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.verificationCode`).d('校验码'),
        resizable: true,
        dataIndex: 'verificationCode',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.dCode`).d('二维码'),
        resizable: true,
        dataIndex: 'dCode',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.productTagCode`).d('产品标签'),
        resizable: true,
        dataIndex: 'productTagCode',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.outerTagCode`).d('外标签'),
        resizable: true,
        dataIndex: 'outerTagCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.resource`).d('资源'),
        resizable: true,
        dataIndex: 'resource',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.operation`).d('工序'),
        resizable: true,
        dataIndex: 'operation',
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.documentType`).d('单据类型'),
        resizable: true,
        dataIndex: 'documentType',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.documentNum`).d('单据号'),
        resizable: true,
        dataIndex: 'documentNum',
        width: 140,
      },
      {
        title: intl.get(`${commonCode}.documentLineNum`).d('单据行号'),
        resizable: true,
        dataIndex: 'documentLineNum',
        width: 70,
      },
      {
        title: intl.get(`${preCode}.containerType`).d('容器类型'),
        resizable: true,
        dataIndex: 'containerType',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.container`).d('容器'),
        resizable: true,
        dataIndex: 'container',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.containerOwnerType`).d('容器所有者类型'),
        resizable: true,
        dataIndex: 'containerOwnerTypeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.containerOwner`).d('容器所有者'),
        resizable: true,
        dataIndex: 'containerOwner',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.capacityQty`).d('满载数量'),
        resizable: true,
        dataIndex: 'capacityQty',
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.location`).d('地点位置'),
        resizable: true,
        dataIndex: 'location',
        width: 336,
      },
      {
        title: intl.get(`${preCode}.printedDate`).d('打印时间'),
        resizable: true,
        dataIndex: 'printedDate',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
        resizable: true,
        dataIndex: 'printedFlag',
        width: 70,
      },
      {
        title: intl.get(`${preCode}.printedCount`).d('打印次数'),
        resizable: true,
        dataIndex: 'printedCount',
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.remark`).d('备注'),
        resizable: true,
        dataIndex: 'remark',
        width: 150,
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <PerformanceTable
          virtualized
          data={this.props.dataSource}
          ref={tableRef}
          height={this.props.tableHeight}
          columns={this.columns}
          loading={this.props.showLoading}
        />
      </Fragment>
    );
  }
}
