/**
 * @Description: 异常分配管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-20 09:58:10
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { DataSet, Table, Select, Button, Tooltip, Lov } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import statusConfig from '@/common/statusConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import ExceptionAssignDS from '../stores/ExceptionAssignDS';

const preCode = 'lmds.exceptionAssign';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { exceptionAssign },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.exceptionAssign'],
})
export default class ExceptionAssign extends Component {
  tableDS = new DataSet({
    ...ExceptionAssignDS(),
  });

  get columns() {
    return [
      { name: 'assignType', editor: (record) => (record.status === 'add' ? <Select /> : null) },
      { name: 'sourceObj', editor: (record) => (record.status === 'add' ? <Lov noCache /> : null) },
      { name: 'sourceName' },
      { name: 'exceptionObj', editor: <Lov noCache /> },
      { name: 'exceptionGroupObj', editor: <Lov noCache /> },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
          ];
        },
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
   * 删除
   */
  @Bind()
  async handleDelLine(record) {
    try {
      const res = await this.tableDS.delete([record]);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${exceptionAssign}`,
        title: intl.get(`${preCode}.view.title.exceptionAssignImport`).d('异常分配导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
          // tenantId: getCurrentOrganizationId(),
          // prefixPath: '/limp',
          // templateType: 'C',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.exceptionAssign`).d('异常分配')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/exception-assigns/excel`}
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
