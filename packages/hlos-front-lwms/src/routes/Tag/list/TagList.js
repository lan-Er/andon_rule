/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-25 18:06:20
 */
/**
 * @Description: 实物标签-标签列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:35:43
 * @LastEditors: Please set LastEditors
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, PerformanceTable } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const tableRef = React.createRef();
const preCode = 'lwms.tag.model';
const commonCode = 'lwms.common.model';

@connect()
export default class ThingList extends PureComponent {
  get columns() {
    return [
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        resizable: true,
        dataIndex: 'organization',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${commonCode}.tag`).d('标签'),
        resizable: true,
        dataIndex: 'tagCode',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.tagStatus`).d('标签状态'),
        resizable: true,
        dataIndex: 'tagStatusMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.loadFlag`).d('装载标识'),
        resizable: true,
        dataIndex: 'loadThingFlag',
        width: 82,
        render: yesOrNoRender,
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
        width: 128,
      },
      {
        title: intl.get(`${preCode}.dCode`).d('二维码'),
        resizable: true,
        dataIndex: 'dCode',
        width: 128,
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
        width: 128,
      },
      {
        title: intl.get(`${preCode}.operation`).d('工序'),
        resizable: true,
        dataIndex: 'operation',
        width: 128,
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
        width: 128,
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
        width: 128,
      },
      {
        title: intl.get(`${preCode}.containerOwnerType`).d('容器所有者类型'),
        resizable: true,
        dataIndex: 'containerOwnerTypeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.containerOwner`).d('容器所有者'),
        resizable: true,
        dataIndex: 'containerOwner',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.containerWeight`).d('容器重量'),
        resizable: true,
        dataIndex: 'containerWeight',
        width: 82,
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
        width: 128,
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
        width: 200,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        render: ({ rowData }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.props.handleToHisPage('/lwms/tag/history', rowData)}
            >
              {intl.get('lwms.tag.button.his').d('历史')}
            </Button>,
          ];
        },
        fixed: 'right',
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
