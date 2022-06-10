/**
 * @Description: 销售实体
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-21 16:15:03
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, TextField } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { salesEntityListDS } from '../store/indexDS';

const intlPrefix = 'zplan.salesEntity';
const ListDS = new DataSet(salesEntityListDS());

function ZplanSalesEntity() {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleAdd() {
    ListDS.create({}, 0);
  }

  const columns = [
    {
      name: 'salesEntityCode',
      align: 'center',
      editor: (record) => (record.status === 'add' ? <TextField /> : null),
    },
    { name: 'salesEntityName', align: 'center', editor: true },
    { name: 'calendarObj', align: 'center', editor: true },
    { name: 'enabledFlag', align: 'center', editor: true },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.salesEntity`).d('销售实体')}>
        <Button color="primary" onClick={handleAdd}>
          新建
        </Button>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} editMode="inline" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZplanSalesEntity);
