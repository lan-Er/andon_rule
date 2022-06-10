/**
 * @Description: 计划资源管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 19:15:08
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Button, Lov, TextField } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ApsResourceListDS from '../stores/ApsResourceListDS';

const preCode = 'lmds.apsResource';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.apsResource', 'lmds.common'],
})
@connect()
export default class ApsResource extends Component {
  tableDS = new DataSet({
    ...ApsResourceListDS(),
  });

  get columns() {
    return [
      { name: 'apsOuObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null, lock: true },
      { name: 'apsResourceCode', width: 150, editor: record => record.status === 'add'? <TextField />: null, lock: true },
      { name: 'apsResourceName', width: 150, editor: true },
      { name: 'apsResourceAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'apsGroupObj', width: 150, editor: <Lov noCache /> },
      { name: 'apsResourceType', width: 150, editor: true },
      { name: 'apsResourceCategoryObj', width: 150, editor: <Lov noCache /> },
      {
        name: 'apsMainFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'partyObj', width: 150, editor: <Lov noCache />},
      { name: 'plannerObj', width: 150, editor: <Lov noCache />},
      { name: 'calendarObj', width: 150, editor: <Lov noCache />},
      { name: 'orderByCode', width: 150, editor: true},
      { name: 'resourceQty', width: 150, editor: true},
      { name: 'meanwhileUseQty', width: 150, editor: true},
      { name: 'capacityType', width: 150, editor: true},
      { name: 'capacityValue', width: 150, editor: true},
      { name: 'activity', width: 150, editor: true},
      { name: 'fixTimeFence', width: 150, editor: true},
      { name: 'frozenTimeFence', width: 150, editor: true},
      { name: 'forwardPlanTimeFence', width: 150, editor: true},
      { name: 'releaseTimeFence', width: 150, editor: true},
      { name: 'orderTimeFence', width: 150, editor: true},
      { name: 'meOuObj', width: 150, editor: <Lov noCache />},
      { name: 'meResourceObj', width: 150, editor: <Lov noCache />},
      { name: 'externalCode', width: 150, editor: true},
      { name: 'externalId', width: 150, editor: true},
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
        <Header title={intl.get(`${preCode}.view.title.apsResource`).d('计划资源')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-resources/excel`}
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