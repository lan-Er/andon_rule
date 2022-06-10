/**
 * @Description: 资源关系管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-14 20:24:56
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Select, Lov, Button, Tooltip } from 'choerodon-ui/pro';
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
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ResourceRelationDS from '../stores/ResourceRelationDS';

const preCode = 'lmds.resourceRelation';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { resourceRelation },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.resourceRelation', 'lmds.common'],
})
export default class ResourceRelation extends Component {
  tableDS = new DataSet({
    ...ResourceRelationDS(),
  });

  get columns() {
    return [
      {
        name: 'relationType',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'resourceObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'relatedResourceObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      { name: 'thirdResourceObj', width: 150, editor: <Lov noCache /> },
      { name: 'organizationObj', width: 150, editor: <Lov noCache /> },
      { name: 'categoryObj', width: 150, editor: <Lov noCache /> },
      { name: 'itemObj', width: 150, editor: <Lov noCache /> },
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
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
              <Button
                key="delete"
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={() => this.handleDelLine(record)}
              />
            </Tooltip>,
          ];
        },
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
        key: `/himp/commentImport/${resourceRelation}`,
        title: intl.get(`${preCode}.view.title.resourceRelationImport`).d('资源关系导入'),
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
        <Header title={intl.get(`${preCode}.view.title.resourceRelation`).d('资源关系')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resource-relations/excel`}
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
