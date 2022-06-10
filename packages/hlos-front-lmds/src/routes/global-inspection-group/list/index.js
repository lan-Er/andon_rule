/*
 * @Author: zhang yang
 * @Description: 检验项目组 - index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 14:18:54
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import withProps from 'utils/withProps';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import InspectionGroupListDs from '../stores/InspectionGroupListDs';

const preCode = 'lmds.inspectionGroup';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { inspectionGroup },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.inspectionGroup', 'lmds.common'],
})
@connect((state) => state)
@withProps(
  () => {
    const tableDS = new DataSet({
      ...InspectionGroupListDs(),
      autoQuery: true,
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
export default class inspectionGroupList extends Component {
  async componentDidMount() {
    await this.props.tableDS.query();
  }

  get columns() {
    return [
      { name: 'organizationObj', width: 128, lock: true },
      { name: 'inspectionGroupCode', width: 128, lock: true },
      { name: 'inspectionGroupName', width: 150 },
      { name: 'inspectionGroupType', width: 200 },
      { name: 'inspectionGroupAlias', width: 128 },
      { name: 'description', width: 200 },
      { name: 'inspectionGroupCategory', width: 84 },
      {
        name: 'enabledFlag',
        align: 'center',
        width: 70,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetail(`/lmds/inspection-group/detail`, record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  @Bind()
  handleToDetail(url, record, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('inspectionGroupId')}`,
      })
    );
  }

  /**
   * 新建
   */
  @Bind()
  handleCreate(url, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
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

  @Bind()
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${inspectionGroup}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.inspectionGroupImport`).d('检验项目组导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.inspectionGroupImport`).d('检验项目组导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.inspectionGroup`).d('检验项目组')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleCreate('/lmds/inspection-group/create')}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/inspection-groups/excel`}
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
