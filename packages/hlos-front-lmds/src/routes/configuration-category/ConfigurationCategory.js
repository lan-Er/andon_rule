/*
 * @Description: 配置分类
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-05 11:24:33
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-05 11:26:06
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { Table, Button, DataSet } from 'choerodon-ui/pro';

import { configurationCategoryDS } from './stores/configurationCategoryDS';

const todoDataSetFactory = () => new DataSet(configurationCategoryDS());

const ConfigurationCategoryPage = () => {
  const listDS = useDataSet(todoDataSetFactory, ConfigurationCategoryPage);

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'categoryTemplateFunction', editor: (record) => record.status === 'add' },
      { name: 'categoryTemplateCode', editor: (record) => record.status === 'add' },
      { name: 'categoryTemplateName', editor: true },
      { name: 'categoryTemplateDesc', editor: true },
      { name: 'enabledFlag', editor: true },
      {
        header: '操作',
        lock: 'right',
        align: 'center',
        command: ['edit'],
      },
    ];
  }

  /**
   * 新增
   */
  function handleCreate() {
    listDS.create();
  }

  return (
    <Fragment>
      <Header title="配置类别">
        <Button onClick={handleCreate} color="primary">
          新增
        </Button>
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

export default ConfigurationCategoryPage;
