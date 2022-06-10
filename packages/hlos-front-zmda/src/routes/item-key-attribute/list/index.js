/**
 * @Description: 物料关键属性
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-14 16:05:58
 */

import React, { useEffect, Fragment } from 'react';
import { Badge } from 'choerodon-ui';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ItemKeyAttrListDS } from '../store/ItemKeyAttributeDS';

const intlPrefix = 'zmda.itemKeyAttribute';
const itemKeyAttrListDS = () => new DataSet(ItemKeyAttrListDS());

function ZmdaItemKeyAttribute({ history }) {
  const listDS = useDataSet(itemKeyAttrListDS, ZmdaItemKeyAttribute);

  useEffect(() => {
    listDS.query();
  }, []);

  function handleCreate() {
    const pathName = `/zmda/item-key-attribute/create`;
    history.push(pathName);
  }

  function handleEdit(record) {
    const { attributeId } = record.toData();
    history.push({
      pathname: `/zmda/item-key-attribute/detail/${attributeId}`,
    });
  }

  const enableRender = (enabledFlag) => {
    switch (enabledFlag) {
      case '1':
        return <Badge status="success" text="启用" />;
      case '0':
        return <Badge status="error" text="禁用" />;
      default:
        return enabledFlag;
    }
  };

  const columns = [
    { name: 'orderNum', width: 50, align: 'center' },
    {
      name: 'attributeCode',
      width: 200,
      align: 'center',
      renderer: ({ record, value }) => <a onClick={() => handleEdit(record)}>{value}</a>,
    },
    { name: 'attributeDesc', align: 'center' },
    { name: 'attributeList', align: 'center' },
    {
      name: 'enabledFlag',
      width: 100,
      align: 'center',
      renderer: ({ value }) => enableRender(value),
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.itemKeyAttribute`).d('物料关键属性')}>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
      </Header>
      <Content>
        <Table dataSet={listDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaItemKeyAttribute);
