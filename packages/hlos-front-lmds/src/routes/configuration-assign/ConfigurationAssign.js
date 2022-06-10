/*
 * @Description: 配置分配
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-05 11:24:00
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-05 11:25:49
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment } from 'react';
import { Table, Button, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { configurationAssignDS } from './stores/configurationAssignDS';

const todoDataSetFactory = () => new DataSet(configurationAssignDS());

const ConfigurationAssignPage = (props) => {
  const listDS = useDataSet(todoDataSetFactory, ConfigurationAssignPage);

  /**
   * 跳转详情页
   * @param {*} record
   */
  function handleToDetail(record) {
    const pathname = `/lmds/configuration-assign/detail/${record.get('ctgPgId')}`;
    props.history.push(pathname);
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { name: 'tenant' },
      { name: 'categoryTemplateFunction' },
      { name: 'categoryTemplateName' },
      {
        name: 'templateCode',
        renderer: ({ record, value }) => <a onClick={() => handleToDetail(record)}>{value}</a>,
      },
      { name: 'templateName' },
      { name: 'categoryTemplateDesc' },
      { name: 'enabledFlag' },
    ];
  }

  /**
   * 新增分配
   */
  function handleCreate() {
    const pathName = `/lmds/configuration-assign/detail/create`;
    props.history.push(pathName);
  }

  return (
    <Fragment>
      <Header title="配置分配">
        <Button onClick={handleCreate} color="primary">
          新增
        </Button>
      </Header>
      <Content>
        <Table dataSet={listDS} columns={columns()} border={false} columnResizable="true" />
      </Content>
    </Fragment>
  );
};

export default ConfigurationAssignPage;
