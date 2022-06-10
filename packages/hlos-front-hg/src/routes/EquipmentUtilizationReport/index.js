/**
 * @Description: 设备稼动率报表--index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-10 09:52:33
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { ListDS } from '@/stores/equipmentUtilizationReportDS';

const preCode = 'hg.equipmentUtilizationReport';

@formatterCollections({
  code: ['hg.equipmentUtilizationReport', 'hg.common'],
})
export default class EquipmentUtilizationReport extends Component {
  state = {
    saveLoading: false,
  };

  tableDS = new DataSet({
    ...ListDS(),
  });

  get columns() {
    return [
      { name: 'equipmentCode', width: 150 },
      { name: 'equipmentName', width: 150 },
      { name: 'calendarShift', width: 150 },
      { name: 'taskNum', width: 150 },
      { name: 'operation', width: 150 },
      { name: 'itemCode', width: 150 },
      { name: 'description', width: 150 },
      { name: 'taskQty', width: 150 },
      { name: 'standardWorkTime', width: 150 },
      { name: 'startTime', width: 170 },
      { name: 'endTime', width: 170 },
      { name: 'workTime', width: 100 },
      { name: 'equipmentRate', width: 100, renderer: ({ value }) => this.rateRender(value) },
      { name: 'standardRate', width: 100, renderer: ({ value }) => this.rateRender(value) },
      { name: 'efficiency', width: 100, renderer: ({ value }) => this.rateRender(value) },
      { name: 'worker', width: 150 },
      { name: 'remark', editor: true, width: 150 },
    ];
  }

  @Bind()
  rateRender(val) {
    if (val === 0) {
      return <span>0%</span>;
    } else if (val) {
      return <span>{(Number(val) * 100).toFixed(2)}%</span>;
    }
    return '';
  }

  @Bind()
  async handleSave() {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    this.setState({
      saveLoading: true,
    });
    try {
      const res = await this.tableDS.submit(this.tableDS.selected);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
    this.setState({
      saveLoading: false,
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.index`).d('设备稼动率报表')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleSave}
            loading={this.state.saveLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
