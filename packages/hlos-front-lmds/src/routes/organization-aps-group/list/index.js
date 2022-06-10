/*
 * @Author: zhang yang
 * @Description: 计划组 - Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 16:38:03
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DataSet, Table, CheckBox, Lov, Button, TextField } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ApsGroupListDs from '../stores/ApsGroupListDs';

const preCode = 'lmds.apsGroup';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.apsGroup', 'lmds.common'],
})
export default class apsGroup extends Component {
  tableDS = new DataSet({
    ...ApsGroupListDs(),
  });

  get columns() {
    return [
      { name: 'apsOu', width: 150, editor: record => record.status === 'add' ? <Lov noCache /> : null, lock: true },
      { name: 'apsGroupCode', width: 150, editor: record => record.status === 'add' ? <TextField /> : null, lock: true },
      { name: 'apsGroupName', width: 150, editor: true},
      { name: 'apsGroupAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'planStartTime', width: 200, editor: true, align: 'center' },
      { name: 'periodicType', width: 150, editor: true },


      { name: 'planPhaseType', width: 150, editor: true },
      { name: 'planBase', width: 150, editor: true },
      { name: 'basicAlgorithm', width: 150, editor: true },
      { name: 'extendedAlgorithm', width: 150, editor: true },
      { name: 'resourceRule', width: 150, editor: true },
      { name: 'processSequence', width: 150, editor: true },
      { name: 'planSequence', width: 150, editor: true },
      { name: 'orderByCode', width: 150, editor: true },
      { name: 'processCycleTime', width: 150, editor: true },

      { name: 'delayTimeFence', width: 200, editor: true },
      { name: 'fixTimeFence', width: 150, editor: true },
      { name: 'frozenTimeFence', width: 150, editor: true },
      { name: 'forwardPlanTimeFence', width: 150, editor: true },
      { name: 'releaseTimeFence', width: 150, editor: true },
      { name: 'orderTimeFence', width: 150, editor: true },
      { name: 'releaseRule', width: 150, editor: <Lov noCache /> },
      { name: 'collaborativeRule', width: 150, editor: <Lov noCache /> },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
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
        command: [ 'edit' ],
        lock: 'right',
        align: 'center',
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
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const {
      tableDS,
    } = this;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.apsGroup`).d('计划组')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-groups/excel`}
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