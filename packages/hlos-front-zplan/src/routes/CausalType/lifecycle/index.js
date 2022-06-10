/*
 * @Descripttion: 销售预测模型-因子类别列表页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, CheckBox } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import { lifecycleListDS } from '../store/indexDS';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(lifecycleListDS());

function ZplanTimePredictionModel() {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleCreate() {
    ListDS.create(
      {
        tenantId: organizationId,
      },
      0
    );
  }

  const columns = [
    {
      name: 'lifecycleCode',
      align: 'center',
      editor: (record) => !record.get('lifecycleId'),
    },
    { name: 'lifecycleName', align: 'center', editor: true },
    {
      name: 'minRate',
      align: 'center',
      editor: true,
      width: 260,
    },
    {
      name: 'maxRate',
      align: 'center',
      width: 260,
      editor: true,
    },
    {
      name: 'enabledFlag',
      align: 'center',
      editor: (record) => (record.editing ? <CheckBox /> : false),
      width: 90,
      renderer: yesOrNoRender,
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header
        backPath="/zplan/causal-type"
        title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('折扣比例定义')}
      >
        <Button color="primary" onClick={handleCreate} icon="add">
          新建
        </Button>
      </Header>
      <Content className={styles['zplan-causal-type-content']}>
        <Table dataSet={ListDS} columns={columns} editMode="inline" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
