/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-05 11:39:31
 */

import React, { useEffect } from 'react';
import intl from 'utils/intl';
import { DataSet, Form, Table, Lov, Button } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content } from 'components/Page';
import { onhandQtyListDS, onhandQtyHeaderDS } from '@/stores/itemDisassembleDS';

const tableDS = new DataSet(onhandQtyListDS());
const queryDS = new DataSet(onhandQtyHeaderDS());

const intlPrefix = 'lwms.itemDisassemble';
const commonPrefix = 'lwms.common';

function ItemModal(props) {
  const { getItem } = props;
  useEffect(() => {
    function emitItem() {
      getItem(tableDS.selected[0]);
    }
    tableDS.addEventListener('select', emitItem);
    queryDS.current.set('organizationId', props.organization.organizationId);
    return () => {
      tableDS.removeEventListener('select', emitItem);
    };
  }, []);
  // useEffect(() => {

  // });

  function columns() {
    return [
      { name: 'itemObj', width: 360, lock: true },
      { name: 'quantity', width: 82 },
      { name: 'lotNumber', width: 128 },
      { name: 'warehouse', width: 128, lock: true },
      { name: 'wmArea', width: 128, lock: true },
      { name: 'wmUnitCode', width: 128 },
      { name: 'secondQuantity', width: 128 },
    ];
  }
  const handleReset = () => {
    queryDS.current.reset();
  };
  const handleSearch = async () => {
    const org = JSON.parse(JSON.stringify(props.organization));
    const params = {
      ...org,
      ...queryDS.current.toJSONData(),
    };
    tableDS.queryParameter = params;
    await tableDS.query();
  };
  return (
    <>
      <Content>
        <div style={{ display: 'flex' }}>
          <Form dataSet={queryDS} columns={4} style={{ flex: 1 }} labelLayout="placeholder">
            <Lov name="itemObj" noCache />
            <Lov name="lotObj" noCache />
            <Lov name="warehouseObj" noCache />
            <Lov name="wmAreaObj" noCache />
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
      </Content>
      <Table dataSet={tableDS} border={false} queryFieldsLimit={4} columns={columns()} />
    </>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(ItemModal);
