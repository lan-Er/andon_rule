/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-08-21 16:22:04
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-07 16:30:54
 */

import React, { Fragment, Component } from 'react';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { Content, Header } from 'components/Page';
import { getSerialNum } from '@/utils/renderer';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import './style.less';
import { ListDS } from '@/stores/requirementReplenishmentLineDS';
import { updateAPI } from '@/services/requirementReplenishmentService';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

const commonCode = 'hzero.common.button';

@connect()
export default class RequirementReplenishmentLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
    };
  }

  listDS = new DataSet(ListDS(this.props.location.list));

  // table 列
  @Bind
  getColumns() {
    return [
      {
        header: 'No.',
        width: 70,
        lock: 'left',
        align: 'center',
        renderer: ({ record }) => getSerialNum(record),
      },
      { name: 'attribute1', value: '补货计划订单号', width: 150, lock: 'left' },
      {
        name: 'attribute2',
        value: '物料号',
        width: 150,
        lock: 'left',
        align: 'center',
        renderer({ record }) {
          return (
            <div>
              <p style={{ wordWrap: 'break-word' }}>{record.get('attribute2')}</p>
              <p style={{ wordWrap: 'break-word' }}>{record.get('attribute11')}</p>
            </div>
          );
        },
      },
      { name: 'attribute3', value: '是否紧急采购', width: 150, lock: 'left', align: 'center' },
      { name: 'attribute4', value: '供应商名称', width: 150, lock: 'left', align: 'center' },
      { name: 'attribute5', value: '库存现有量', width: 150, lock: 'left', align: 'center' },
      { name: 'attribute6', value: '补货数量', width: 150, editor: true, align: 'center' },
      { name: 'attribute7', value: '要求到货时间', width: 150, editor: true, align: 'center' },
      { name: 'attribute8', value: '单位', width: 150, align: 'center' },
      { name: 'attribute9', value: '送货地点', width: 150, align: 'center' },
      {
        name: 'attribute10',
        value: '状态',
        width: 150,
        align: 'center',
        renderer({ record }) {
          const attribute10 = record.get('attribute10');
          let bgColor;
          let fontColor;
          switch (attribute10) {
            case '新建':
              bgColor = 'rgba(0,180,216, .1)';
              fontColor = 'rgba(0,180,216)';
              break;
            case '已发布':
              bgColor = 'rgba(221,223,3, .1)';
              fontColor = 'rgba(221,223,3)';
              break;
            default:
              bgColor = 'rgba(72,202,228, .1)';
              fontColor = '#48CAE4';
          }
          return (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                backgroundColor: bgColor,
                textAlign: 'center',
                color: fontColor,
              }}
            >
              {attribute10}
            </span>
          );
        },
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   *补货计划订单生成
   * @returns
   */
  async create(ds) {
    if (ds.selected.length) {
      if (ds.selected.every((i) => i.data.attribute10 === undefined || i.data.attribute10 === '')) {
        const changedItems = ds.selected.map((i) => ({
          ...i.toJSONData(),
          attribute10: '新建',
        }));
        const res = await updateAPI(changedItems);
        if (getResponse(res) && !res.failed) {
          notification.success();
          await this.listDS.query();
        }
      } else {
        notification.warning({
          message: '所选订单中有已生成订单',
        });
      }
    } else {
      notification.warning({
        message: '请先选择一条数据',
      });
    }
  }

  /**
   * 补货计划订单发布
   */
  async release(ds) {
    if (ds.selected.length) {
      if (ds.selected.every((i) => i.data.attribute10 === '新建')) {
        const changedItems = ds.selected.map((i) => ({
          ...i.toJSONData(),
          attribute10: '已发布',
        }));
        const res = await updateAPI(changedItems);
        if (getResponse(res) && !res.failed) {
          notification.success();
          await this.listDS.query();
        }
      } else {
        notification.warning({
          message: '所选订单中有未生成的订单',
        });
      }
    } else {
      notification.warning({
        message: '请先选择一条数据',
      });
    }
  }

  /**
   * 返回
   */
  @Bind
  async goBack() {
    const pathname = '/lisp/requirement-replenishment';
    this.props.dispatch(
      routerRedux.push({
        pathname,
      })
    );
  }

  render() {
    return (
      <div className="requirement-replenishment-line">
        <Fragment>
          <Header title="补货订单生成" backPath="/lisp/requirement-replenishment/header" />
          <div className="sub-header">
            <Button onClick={() => this.create(this.listDS)}>补货计划订单生成</Button>
            <Button onClick={() => this.release(this.listDS)}>补货计划订单发布</Button>
          </div>
          <Content>
            <Table
              dataSet={this.listDS}
              columns={this.state.columns}
              border={false}
              editMode="inline"
              queryBar="none"
              columnResizable="true"
              rowHeight="auto"
              queryFieldsLimit={4}
            />
          </Content>
        </Fragment>
      </div>
    );
  }
}
