/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-07 21:27:42
 */
import React, { useState, useEffect } from 'react';
import intl from 'utils/intl';
import Icons from 'components/Icons';
import { getReceiveTagCode } from '@/services/itemDisassembleService';
import { DataSet, Table, Button, TextField, Form, Modal } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content } from 'components/Page';
import { itemTagTableDS, itemTagSearchDS } from '@/stores/itemDisassembleDS';
import styles from './index.less';

const tableDS = new DataSet(itemTagTableDS());
const queryDS = new DataSet(itemTagSearchDS());

const intlPrefix = 'lwms.itemDisassemble';
const commonPrefix = 'lwms.common';

function tagModal(props) {
  const [length, setLength] = useState(0);
  const [quantitySum, setQuantitySum] = useState(quantitySumFun());
  const { getLineDetail, records, itemObj, organizationObj, referenceQuantity } = props;
  useEffect(() => {
    setQuantitySum(quantitySumFun());
    setLength(tableDS.data.length);
    function getInfo() {
      getLineDetail(tableDS.data, quantitySumFun(), tableDS);
    }
    tableDS.addEventListener('update', getInfo);
    tableDS.addEventListener('create', getInfo);
    tableDS.addEventListener('remove', getInfo);
    tableDS.reset();
    queryDS.reset();
    if (records) {
      const arr = Array.from(records);
      for (let i = 0; i < arr.length; i++) {
        tableDS.create(arr[i].toJSONData());
      }
    }
    return () => {
      tableDS.removeEventListener('update', getInfo);
      tableDS.removeEventListener('create', getInfo);
      tableDS.removeEventListener('remove', getInfo);
    };
  }, []);
  function columns() {
    return [
      { name: 'tagCode', width: 120 },
      { name: 'lotNumber', width: 128 },
      { name: 'quantity', width: 128, editor: true },
      {
        header: '操作',
        width: 90,
        command: ({ record }) => {
          return [
            <Button key="delete" color="primary" onClick={() => handDeleteLine(record)}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>,
          ];
        },
      },
    ];
  }
  function quantitySumFun() {
    let sum = 0;
    if (tableDS.data.length > 0) {
      for (let i = 0; i < tableDS.data.length; i++) {
        sum += tableDS.data[i].get('quantity') || 0;
      }
    }
    return sum;
  }
  const handDeleteLine = (record) => {
    tableDS.remove(record);
  };
  const handleAddLine = async () => {
    const validate = await queryDS.validate(false, false);
    if (!validate) return;
    let addFlag = true;
    if (tableDS.data.length > 0) {
      for (let i = 0; i < tableDS.data.length; i++) {
        if (tableDS.data[i].get('tagCode') === queryDS.current.get('tagCode')) {
          addFlag = false;
          Modal.confirm({
            title: '标签号重复，是否删除？？',
          }).then((button) => {
            if (button === 'ok') {
              tableDS.remove(tableDS.data[i]);
            }
          });
        }
      }
    }
    if (addFlag) {
      tableDS.create(queryDS.current.toJSONData());
      tableDS.select(tableDS.current);
    }
  };
  const addTagCodeLine = async () => {
    const params = {
      organizationId: organizationObj.organizationId,
      itemId: itemObj.itemId,
    };
    const res = await getReceiveTagCode(params);
    tableDS.create(
      {
        ...res,
        quantity: queryDS.current.get('quantity'),
      },
      0
    );
  };
  return (
    <>
      <Content>
        <div style={{ display: 'flex' }}>
          <Form dataSet={queryDS} columns={3} style={{ flex: 1 }} labelLayout="placeholder">
            <TextField name="quantity" />
            <TextField name="tagCode" />
            <TextField name="lotNumber" />
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button
              funcType="flat"
              color="primary"
              icon="add"
              onClick={() => {
                handleAddLine();
              }}
            >
              新增
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div className={styles['lwms-itemDisassemble-green-circle']}>
              <Icons
                type="add"
                onClick={() => {
                  addTagCodeLine();
                }}
                size={12}
                style={{ cursor: 'pointer', color: '#fff' }}
              />
            </div>
            {itemObj.itemCode} {itemObj.description} ({referenceQuantity || 0})
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {`(${length}) ${quantitySum}`}
          </div>
        </div>
      </Content>
      <Table dataSet={tableDS} border={false} columns={columns()} />
    </>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(tagModal);
