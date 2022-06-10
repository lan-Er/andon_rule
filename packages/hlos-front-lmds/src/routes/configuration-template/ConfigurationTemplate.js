/*
 * @Description: 配置模版
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-03 15:58:31
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-03 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment } from 'react';
import intl from 'utils/intl';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { Table, Button, DataSet } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { configurationTemplateDS } from './stores/configurationTemplateDS';

const preCode = 'lisp.solutionPackage';
const intlPrefix = 'ldab.dashboardConfig';

const todoDataSetFactory = () => new DataSet({ ...configurationTemplateDS() });

const ConfigurationTemplatePage = (props) => {
  const listDS = useDataSet(todoDataSetFactory, ConfigurationTemplatePage);

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { name: 'templateFunction' },
      {
        name: 'templateCode',
        renderer: ({ record, value }) => <a onClick={() => handleToDetail(record)}>{value}</a>,
      },
      { name: 'templateName' },
      { name: 'enabledFlag' },
    ];
  }

  /**
   * 跳转详情页
   * @param {*} record
   */
  function handleToDetail(record) {
    const pathname = `/lmds/configuration-template/detail/${record.get('templateId')}`;
    props.history.push(pathname);
  }

  /**
   * 新增
   */
  function handleCreate() {
    const pathname = `/lmds/configuration-template/detail/create`;
    props.history.push(pathname);
  }

  // 导入
  function handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS_PAGE_TEMPLATE`,
      title: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
      }),
    });
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.drawingPlatform.editList`).d('配置模版')}>
        <Button onClick={handleCreate} color="primary">
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
};

export default ConfigurationTemplatePage;
