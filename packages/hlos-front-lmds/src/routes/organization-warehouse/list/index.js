/**
 * @Description: 仓库管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 16:53:08
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Lov, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import WarehouseListDS from '../stores/WarehouseListDS';

const preCode = 'lmds.warehouse';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { warehouse },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.warehouse', 'lmds.common'],
})
export default class WareHouse extends Component {
  tableDS = new DataSet({
    ...WarehouseListDS(),
  });

  get columns() {
    return [
      {
        name: 'wmOuObj',
        lock: true,
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'organizationName',
        width: 150,
        lock: true,
      },
      {
        name: 'warehouseCategoryObj',
        width: 150,
        editor: <Lov noCache />,
      },
      {
        name: 'warehouseCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'warehouseName',
        width: 150,
        editor: true,
      },
      {
        name: 'warehouseAlias',
        width: 150,
        editor: true,
      },
      {
        name: 'description',
        width: 150,
        editor: true,
      },
      {
        name: 'warehouseGroup',
        width: 150,
        editor: true,
      },
      {
        name: 'onhandFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'negativeFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'wmAreaFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'wmUnitFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'tagFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'lotFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'planFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'locationObj',
        width: 150,
        editor: <Lov noCache />,
      },
      {
        name: 'externalOrganization',
        width: 150,
        editor: true,
      },
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
        lock: 'right',
        command: ['edit'],
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

  @Bind()
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${warehouse}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.wmImport`).d('仓库导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.wmImport`).d('仓库导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.warehouse`).d('仓库')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/warehouses/excel`}
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
