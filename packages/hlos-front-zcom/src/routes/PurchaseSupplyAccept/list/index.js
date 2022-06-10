/*
 * @Descripttion: 发货列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { DeliveryOrderListDS } from '../store/indexDS';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));

function ZcomDeliveryApply({ history, dispatch }) {
  const ListDS = useDataSet(() => deliveryOrderListDS());

  useEffect(() => {}, []);

  useDataSetEvent(ListDS.queryDataSet, 'update', ({ name, record }) => {
    if (name === 'customerObj') {
      record.set('supplierObj', null);
    }

    if (name === 'businessUnitObj') {
      record.set('supplierInventoryOrgObj', null);
    }
  });

  function handleToDetail() {
    const idList = [];
    let validateFlag = true;

    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return false;
    }

    const { supplierId } = ListDS.selected[0].data;
    ListDS.selected.forEach((item) => {
      if (supplierId !== item.data.supplierId) {
        validateFlag = false;
      }
      idList.push(item.data.deliveryOrderLineId);
    });

    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('请选择来源为相同供应商的发货单进行接收'),
      });
      return false;
    }

    history.push({
      pathname: `/zcom/purchase-supply-accept/detail`,
      state: { idList },
    });
  }

  const listColumns = [
    {
      name: 'deliveryOrderNum',
      width: 150,
      lock: 'left',
    },
    { name: 'deliveryOrderLineNum', lock: 'left' },
    {
      name: 'supplierItemCode',
      width: 150,
      lock: 'left',
    },
    { name: 'supplierItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          value &&
          value.attributeValue1 && (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('supplierItemId')}
              itemDesc={record.get('supplierItemDesc')}
              disabled
            />
          )
        );
      },
    },
    { name: 'supplierUomName' },
    { name: 'supplierDeliveryQty' },
    {
      name: 'supplierAcceptableQty',
    },
    {
      name: 'deliveryOrderDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'arrivalDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'customerName',
      width: 150,
      renderer: ({ record, value }) => {
        const { receivingType = '', recvCustomerName = '' } = record.data;
        if (receivingType === 'THIRD_SUPPLIER') {
          return recvCustomerName;
        }

        return value;
      },
    },
    { name: 'supplierName', width: 150 },
    {
      name: 'supplierBusinessUnitName',
      width: 150,
    },
    {
      name: 'supplierBusinessUnitName',
      width: 150,
    },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 120 },
  ];

  const handleClose = (validateFlag) => {
    if (validateFlag) {
      Modal.confirm({
        children: <p>选中行将无法再次执行收货动作，请确认！</p>,
        onOk: () => {
          handleClose(false);
        },
      });
      return;
    }

    return new Promise(async (resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve();
        return false;
      }

      const idList = ListDS.selected.map((item) => {
        const { deliveryOrderId, deliveryOrderLineId } = item.data;
        return {
          deliveryOrderId,
          deliveryOrderLineId,
        };
      });
      dispatch({
        type: `thirdPartyReceptionModel/closeDeliveryOrder`,
        payload: idList,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('采购方供料接收')}
      >
        <>
          <Button color="primary" onClick={handleToDetail}>
            接收预览
          </Button>
          <Button onClick={() => handleClose(true)}>接收关闭</Button>
        </>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={listColumns} columnResizable="true" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
