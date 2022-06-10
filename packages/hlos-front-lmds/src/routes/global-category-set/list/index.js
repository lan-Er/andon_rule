/**
 * @Description: 类别集管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-14 10:51:32
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { DataSet, Table, CheckBox, Button, Tooltip } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Button as HButton } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import querystring from 'querystring';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import CategorySetDS from '../stores/CategorySetDS';

const preCode = 'lmds.category';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { catogory },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: ['lmds.category', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...CategorySetDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect()
export default class CategorySet extends Component {
  get columns() {
    return [
      { name: 'categorySetCode', width: 200, editor: true, lock: true },
      { name: 'categorySetName', width: 200, editor: true, lock: true },
      { name: 'description', editor: true },
      { name: 'segmentNum', width: 150, editor: true },
      {
        name: 'segmentLimitFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get(`${preCode}.model.category`).d('类别')}>
              <Button
                key="category"
                icon="category"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToCategoryPage(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  @Bind()
  handleToCategoryPage(record) {
    const { dispatch } = this.props;
    const {
      categorySetId,
      categorySetCode,
      categorySetName,
      segmentNum,
      segmentLimitFlag,
      enabledFlag,
    } = record.data;
    const categorySetData = {
      categorySetId,
      categorySetCode,
      categorySetName,
      segmentNum,
      segmentLimitFlag,
      enabledFlag,
    };
    dispatch(
      routerRedux.push({
        pathname: `/lmds/category-set/detail`,
        search:
          record.data &&
          querystring.stringify({
            categorySetData: encodeURIComponent(JSON.stringify(categorySetData)),
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
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${catogory}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.categoryImport`).d('类别导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.categoryImport`).d('类别导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.categorySet`).d('类别集')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/category-sets/excel`}
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
