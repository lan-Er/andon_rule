/**
 * @Description: 基础数据-物料
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-12 10:11:33
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { ItemListDS } from '../store/ItemMaindataDS';

const intlPrefix = 'zmda.item';
const itemListDS = () => new DataSet(ItemListDS());

function ZmdaItemMaindata({ history }) {
  const listDS = useDataSet(itemListDS, ZmdaItemMaindata);

  useEffect(() => {
    listDS.query();
  }, []);

  function handleCreate() {
    const pathName = `/zmda/item-maindata/create`;
    history.push(pathName);
  }

  function handleEdit(record) {
    const { itemId } = record.toData();
    history.push({
      pathname: `/zmda/item-maindata/detail/${itemId}`,
    });
  }

  const columns = [
    {
      name: 'itemCode',
      width: 100,
      align: 'center',
      renderer: ({ record, value }) => (
        <a onClick={() => handleEdit(record)}>{value}</a>
      ),
    },
    { name: 'itemDesc', width: 150, align: 'center' },
    { name: 'categoryCode', width: 100, align: 'center' },
    { name: 'categoryName', width: 150, align: 'center' },
    { name: 'uomName', width: 100, align: 'center' },
    { name: 'sequenceFlag', width: 100, align: 'center', renderer: yesOrNoRender },
    { name: 'batchFlag', width: 100, align: 'center', renderer: yesOrNoRender },
    { name: 'planner', width: 100, align: 'center' },
    { name: 'buyer', width: 100, align: 'center' },
    { name: 'defaultTaxRate', width: 150, align: 'center' },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.item`).d('物料')}>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns}
          columnResizable="true"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaItemMaindata);
