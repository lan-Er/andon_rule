/*
 * @Description: 安灯管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 10:01:00
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { Button as HButton } from 'hzero-ui';
import { openTab } from 'utils/menuTab';
import { DataSet, Table, Lov, CheckBox, TextField, Button } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import AndonListDS from '../stores/AndonListDS';

const intlPrefix = 'lmds.andonBin';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { andon },
} = statusConfig.statusValue.lmds;
@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class Andon extends Component {
  andonListDS = new DataSet({
    ...AndonListDS(),
  });

  @Bind
  handleRelatedNameEditable(record) {
    if (record.get('andonRelType')) {
      return true;
    } else {
      return <Lov onClick={() => notification.warning({ message: '请先选择关联类型' })} />;
    }
  }

  get columns() {
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: 'left',
      },
      {
        name: 'andonBinObj',
        width: 150,
        editor: (record) =>
          record.status === 'add' ? (
            <Lov noCache disabled={!record.get('organizationObj')} />
          ) : null,
        lock: 'left',
      },
      {
        name: 'andonClassObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: 'left',
      },
      {
        name: 'andonCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: 'left',
      },
      {
        name: 'andonName',
        width: 150,
        editor: true,
      },
      {
        name: 'andonAlias',
        width: 150,
        editor: true,
      },
      {
        name: 'description',
        width: 150,
        editor: true,
      },
      {
        name: 'orderByCode',
        width: 150,
        editor: true,
      },
      {
        name: 'dataCollectType',
        width: 150,
        editor: true,
      },
      {
        name: 'andonRuleObj',
        width: 150,
        editor: () => <Lov noCache />,
      },
      {
        name: 'autoResponseFlag',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        name: 'responseRankCode',
        width: 150,
        editor: true,
      },
      {
        name: 'visibleFlag',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        name: 'defaultStatus',
        width: 150,
        editor: true,
      },
      {
        name: 'stopProductionFlag',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        name: 'affectedByStopFlag',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        name: 'andonRelType',
        width: 150,
        editor: true,
      },
      {
        name: 'relatedNameObj',
        width: 150,
        editor: this.handleRelatedNameEditable,
      },
      {
        name: 'currentStatus',
        width: 120,
        editor: false,
        align: 'center',
        renderer({ text, record }) {
          return (
            <span
              style={{
                backgroundColor: record.get('currentColor'),
                padding: '0px 10px',
                borderRadius: '4px',
                height: '0.25rem',
                lineHeight: '0.25rem',
                color: '#FFF',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        name: 'currentColor',
        width: 120,
        align: 'center',
        renderer({ value }) {
          return (
            <div
              style={{
                height: '50%',
                width: '50%',
                position: 'relative',
                top: '25%',
                left: '25%',
                backgroundColor: value,
                borderRadius: '2px',
              }}
            />
          );
        },
      },
      {
        name: 'currentExceptionGroup',
        width: 150,
      },
      {
        name: 'currentException',
        width: 150,
      },
      {
        name: 'pressedTimes',
        width: 150,
      },
      {
        name: 'processRuleObj',
        width: 150,
        editor: true,
      },
      {
        name: 'remark',
        width: 150,
        editor: true,
      },
      {
        name: 'externalCode',
        width: 150,
        editor: true,
      },
      {
        name: 'externalId',
        width: 150,
        editor: true,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : null),
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        lock: 'right',
        align: 'center',
        command: ['edit'],
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.andonListDS.create({}, 0);
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { andonListDS: ds } = this;
    const formObj = ds && ds.queryDataSet && ds.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * 导入
   */
  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${andon}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get('hzero.common.button.import').d('导入'),
      search: queryString.stringify({
        action: intl.get('hzero.common.button.import').d('导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.andon`).d('安灯')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/andons/excel`}
            queryParams={this.getExportQueryParams}
          />
          <HButton icon="download" onClick={this.handleBatchImport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
        </Header>
        <Content>
          <Table
            dataSet={this.andonListDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
