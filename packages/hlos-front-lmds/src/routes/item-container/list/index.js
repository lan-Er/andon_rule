/**
 * @Description: 物料容器管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 19:15:08
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Button, Lov } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';

import ContainerListDS from '../stores/ContainerListDS';

const preCode = 'lmds.itemContainer';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { itemContainer },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.itemContainer', 'lmds.common'],
})
export default class ItemContainer extends Component {
  tableDS = new DataSet({
    ...ContainerListDS(),
  });

  get columns() {
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'containerTypeObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'containerObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'categoryObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'itemObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'itemDescription', width: 150 },
      { name: 'minQty', width: 150, editor: true },
      { name: 'maxQty', width: 150, editor: true },
      { name: 'suggestQty', width: 150, editor: true },
      {
        name: 'primaryFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'priority', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${itemContainer}`,
        title: intl.get(`${preCode}.view.title.itemContainerImport`).d('物料容器导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
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
        <Header title={intl.get(`${preCode}.view.title.itemContainer`).d('物料容器')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/container-capacitys/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            queryFieldsLimit={4}
          />
        </Content>
      </Fragment>
    );
  }
}
