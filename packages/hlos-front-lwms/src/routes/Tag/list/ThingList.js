/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-25 16:17:19
 */
/**
 * @Description: 实物标签-实物列表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-26 10:35:43
 * @LastEditors: Please set LastEditors
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, PerformanceTable } from 'choerodon-ui/pro';
import intl from 'utils/intl';

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
        title: intl.get(`${commonCode}.item`).d('物料'),
        resizable: true,
        dataIndex: 'itemCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'itemDescription',
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.uom`).d('单位'),
        resizable: true,
        dataIndex: 'uomName',
        width: 70,
      },
      {
        title: intl.get(`${preCode}.quantity`).d('数量'),
        resizable: true,
        dataIndex: 'quantity',
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.lot`).d('批次'),
        resizable: true,
        dataIndex: 'lotNumber',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.traceNum`).d('批次跟踪号'),
        resizable: true,
        dataIndex: 'traceNum',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.innerTag`).d('内标签'),
        resizable: true,
        dataIndex: 'innerTagCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.warehouse`).d('仓库'),
        resizable: true,
        dataIndex: 'warehouse',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.wmArea`).d('货位'),
        resizable: true,
        dataIndex: 'wmArea',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.wmUnit`).d('货格'),
        resizable: true,
        dataIndex: 'wmUnit',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.qcStatus`).d('质量状态'),
        resizable: true,
        dataIndex: 'qcStatusMeaning',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
        resizable: true,
        dataIndex: 'ownerTypeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.owner`).d('所有者'),
        resizable: true,
        dataIndex: 'owner',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        resizable: true,
        dataIndex: 'secondUomName',
        width: 70,
      },
      {
        title: intl.get(`${preCode}.secondQuantity`).d('辅助单位数量'),
        resizable: true,
        dataIndex: 'secondQuantity',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.featureType`).d('特征值类型'),
        resizable: true,
        dataIndex: 'featureType',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.featureValue`).d('特征值'),
        resizable: true,
        dataIndex: 'featureValue',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.projectNum`).d('项目号'),
        resizable: true,
        dataIndex: 'projectNum',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.sourceNum`).d('来源编号'),
        resizable: true,
        dataIndex: 'sourceNum',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.assignedTime`).d('赋值时间'),
        resizable: true,
        dataIndex: 'assignedTime',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.madeDate`).d('生产日期'),
        resizable: true,
        dataIndex: 'madeDate',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.expireDate`).d('失效日期'),
        resizable: true,
        dataIndex: 'expireDate',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.netWeight`).d('净重'),
        resizable: true,
        dataIndex: 'netWeight',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.assignedTime`).d('总重'),
        resizable: true,
        dataIndex: 'grossWeight',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.qcRemark`).d('质量备注'),
        resizable: true,
        dataIndex: 'qcRemark',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.thingRemark`).d('实物备注'),
        resizable: true,
        dataIndex: 'thingRemark',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.tagThingType`).d('实物类型'),
        resizable: true,
        dataIndex: 'tagThingTypeMeaning',
        width: 128,
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
