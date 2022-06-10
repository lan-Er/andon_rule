/**
 * @Description: 采购接收列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-03 14:18:00
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { PurchaseAcceptListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.purchaseAccept';
const purchaseAcceptListDS = () => new DataSet(PurchaseAcceptListDS());

function ZcomPurchaseAccept({ history, dispatch }) {
  const ListDS = useDataSet(purchaseAcceptListDS);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handlePreview() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    let flag = true;
    const idList = ListDS.selected.map((item, index) => {
      if (index + 1 < ListDS.selected.length) {
        flag = flag && item.data.supplierId === ListDS.selected[index + 1].data.supplierId;
      }
      return item.data.deliveryOrderLineId;
    });
    if (!flag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.err`)
          .d('请选择来源为相同供应商的发货单进行接收'),
      });
      return;
    }
    history.push({
      pathname: `/zcom/purchase-accept/detail`,
      state: {
        idList,
        supplierName: ListDS.selected[0].data.supplierName,
      },
    });
  }

  function handleClose() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const arr = ListDS.selected.map((v) => {
        return v.toData();
      });
      Modal.confirm({
        children: <p>选中行将无法再执行收货动作，请确认！</p>,
        onOk: () => {
          dispatch({
            type: 'purchaseAccept/closeDeliveryOrderLine',
            payload: arr,
          }).then((res) => {
            if (res && !res.failed) {
              notification.success({
                message: '操作成功',
              });
              ListDS.query();
            }
            resolve();
          });
        },
      });
      resolve();
    });
  }

  const listColumns = [
    { name: 'deliveryOrderNum', width: 150, lock: 'left' },
    { name: 'deliveryOrderLineNum', width: 70, lock: 'left' },
    { name: 'customerItemCode', width: 150, lock: 'left' },
    { name: 'customerItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'customerUomName', width: 80 },
    { name: 'customerDeliveryQty', width: 100 },
    { name: 'customerAcceptableQty', width: 100 },
    {
      name: 'deliveryOrderDate',
      width: 100,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'arrivalDate',
      width: 100,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'supplierName', width: 150 },
    { name: 'customerInventoryOrgName', width: 150 },
    { name: 'consignerName', width: 150 },
    { name: 'consignerPhone', width: 150 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 100 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.purchaseAccept`).d('采购接收')}>
        <>
          <Button color="primary" onClick={handlePreview}>
            接收预览
          </Button>
          <Button onClick={handleClose}>接收关闭</Button>
        </>
      </Header>
      <Content className={styles['zcom-purchase-accept-content']}>
        <Table dataSet={ListDS} columns={listColumns} columnResizable="true" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomPurchaseAccept);
