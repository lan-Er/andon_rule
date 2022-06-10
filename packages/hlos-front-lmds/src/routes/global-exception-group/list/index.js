/**
 * @Description: 异常组管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 11:34:28
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Select, Button, Tooltip } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import querystring from 'querystring';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import statusConfig from '@/common/statusConfig';
import ExceptionGroupListDS from '../stores/ExceptionGroupListDS';

const preCode = 'lmds.exceptionGroup';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { exceptionGroup },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.exceptionGroup', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ExceptionGroupListDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect()
export default class ExceptionGroup extends Component {
  get columns() {
    return [
      {
        name: 'exceptionGroupType',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'exceptionGroupCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'exceptionGroupName', editor: true },
      { name: 'description', editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get(`${preCode}.button.detail`).d('详情')}>
              <Button
                key="format_list_bulleted"
                icon="format_list_bulleted"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToDetailPage(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 跳转到详情
   * @param record
   */
  @Bind()
  handleToDetailPage(record) {
    const { dispatch } = this.props;
    const {
      exceptionGroupId,
      exceptionGroupCode,
      exceptionGroupName,
      exceptionGroupTypeMeaning,
    } = record.data;
    const groupData = {
      exceptionGroupId,
      exceptionGroupCode,
      exceptionGroupName,
      exceptionGroupTypeMeaning,
    };
    dispatch(
      routerRedux.push({
        pathname: `/lmds/exception-group/detail`,
        search:
          record.data &&
          querystring.stringify({
            groupData: encodeURIComponent(JSON.stringify(groupData)),
          }),
      })
    );
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.props.tableDS.create({}, 0);
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { tableDS } = this.props;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  @Bind
  handleBatchExport() {
    try {
      openTab({
        // 编码是后端给出的
        key: `/himp/commentImport/${exceptionGroup}`,
        // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
        title: intl.get(`${preCode}.view.title.exceptionGroupImport`).d('异常组导入'),
        search: querystring.stringify({
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
        <Header title={intl.get(`${preCode}.view.title.exceptionGroup`).d('异常组')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/exception-groups/excel`}
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
