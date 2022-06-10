/**
 * @Description: 用户设置管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 15:26:09
 * @LastEditors: yiping.liu
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { openTab } from 'utils/menuTab';
import { Button as HButton } from 'hzero-ui';
import { DataSet, Table, Button, Tooltip, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import queryString from 'query-string';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import UserSettingDS from '../stores/UserSettingDS';

const preCode = 'lmds.userSetting';
const organizationId = getCurrentOrganizationId();
@connect()
@formatterCollections({
  code: [`${preCode}`],
})
export default class UserSetting extends Component {
  tableDS = new DataSet({
    ...UserSettingDS(),
  });

  get columns() {
    return [
      {
        name: 'userObj',
        width: 200,
        lock: 'left',
      },
      {
        name: 'meOuObj',
        width: 200,
      },
      {
        name: 'apsOuObj',
        width: 200,
      },
      {
        name: 'scmOuObj',
        width: 200,
      },
      {
        name: 'sopOuObj',
        width: 200,
      },
      {
        name: 'wmOuObj',
        width: 200,
      },
      {
        name: 'warehouseObj',
        width: 200,
      },
      {
        name: 'organizationObj',
        width: 200,
      },
      {
        name: 'prodLineObj',
        width: 200,
      },
      {
        name: 'workcellObj',
        width: 200,
      },
      {
        name: 'workerObj',
        width: 200,
      },
      {
        name: 'planStartDateFrom',
        width: 100,
      },
      {
        name: 'planStartDateTo',
        width: 100,
      },
      {
        name: 'planEndDateFrom',
        width: 100,
      },
      {
        name: 'planEndDateTo',
        width: 100,
      },
      {
        name: 'commonItems',
        width: 200,
      },
      {
        name: 'soTypeObj',
        width: 200,
      },
      {
        name: 'demandTypeObj',
        width: 200,
      },
      {
        name: 'poTypeObj',
        width: 200,
      },
      {
        name: 'moTypeObj',
        width: 200,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get(`${preCode}.view.title.edit`).d('编辑')}>
              <Button
                key="mode_edit"
                icon="mode_edit"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToDetailPage('/lmds/user-setting/detail', record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  get queryFields() {
    return {
      userObj: <Lov name="userObj" clearButton noCache />,
    };
  }

  /**
   *跳转到新建页面
   *
   * @param {*} url
   * @param {*} e
   * @memberof Qualification
   */
  @Bind()
  handleAddLine(url, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  /**
   *
   *跳转到详情
   * @param record
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('settingId')}`,
      })
    );
  }

  /**
   *导出
   *
   * @returns
   * @memberof Qualification
   */
  @Bind
  getExportQueryParams() {
    const { tableDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/LMDS.USER_SETTING`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.equipmentImport`).d('用户设置导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.equipmentImport`).d('用户设置导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.userSetting`).d('用户设置')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleAddLine('/lmds/user-setting/create')}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/user-settings/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            queryFields={this.queryFields}
          />
        </Content>
      </Fragment>
    );
  }
}
