/**
 * @Description: 安灯灯箱管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-26 11:19:31
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Button, Select } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import AndonBinListDS from '../stores/AndonBinListDS';

const preCode = 'lmds.andonBin';
const orgId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.andonBin', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...AndonBinListDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect()
export default class AndonBin extends Component {

  get columns() {
    return [
      { name: 'organizationObj', width: 150, editor: true, lock: true },
      { name: 'andonBinType', width: 150, editor: record => record.status === 'add' ? <Select /> : null, lock: true },
      { name: 'andonBinCode', width: 150, editor: record => record.status === 'add' ? <TextField /> : null, lock: true },
      { name: 'andonBinName', width: 150, editor: true, lock: true },
      { name: 'andonBinAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'equipmentObj', width: 150, editor: true },
      { name: 'workcellObj', width: 150, editor: true },
      { name: 'prodLineObj', width: 150, editor: true },
      { name: 'macAddress', width: 150, editor: true },
      { name: 'locationObj', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.props.tableDS.create({}, 0);
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.props.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.props.tableDS.submit();
    if(res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });

    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.props.tableDS.query();
    }
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const {
      tableDS,
    } = this.props;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.andonBin`).d('安灯灯箱')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${orgId}/andon-bins/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
