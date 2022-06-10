/*
 * @Author: zhang yang
 * @Description: 计划资源关系
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-10 10:22:29
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Button, Lov, Select } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ApsResourceRelationListDS from '../stores/ApsResourceRelationListDS';

const preCode = 'lmds.APSResourceRelation';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.APSResourceRelation', 'lmds.common'],
})
export default class ApsResource extends Component {
  tableDS = new DataSet({
    ...ApsResourceRelationListDS(),
  });

  get columns() {
    return [
      {
        name: 'apsOuObj',
        width: 150,
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'relationType',
        width: 150,
        editor: record => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'resource',
        width: 150,
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'relatedResource',
        width: 150,
        editor: record => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      { name: 'category', width: 150, editor: <Lov noCache /> },
      { name: 'item', width: 150, editor: <Lov noCache /> },
      { name: 'itemDescription', width: 150 },
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
        command: ['edit', 'delete'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.tableDS.submit();
    if (res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.tableDS.query();
    }
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.APSResourceRelation`).d('计划资源关系')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-resource-relations/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
