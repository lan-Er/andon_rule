/*
 * @Descripttion: 发货列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Table,
  TextField,
  DatePicker,
  Select,
  Lov,
  Form,
  Modal,
} from 'choerodon-ui/pro';
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
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    handleTypeChange();
  }, []);

  useDataSetEvent(ListDS.queryDataSet, 'update', ({ name, record }) => {
    if (name === 'customerObj') {
      record.set('supplierObj', null);
    }

    if (name === 'receiptSource') {
      record.set('customerObj', null);
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
      pathname: `/zcom/third-party-reception/detail`,
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
      name: 'recvItemCode',
      width: 150,
      lock: 'left',
    },
    { name: 'recvItemDesc', width: 150 },
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
    { name: 'recvUomName' },
    { name: 'recvDeliveryQty' },
    {
      name: 'recvAcceptableQty',
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
      name: 'recvBusinessUnitName',
      width: 150,
      renderer: ({ record, value }) => {
        const { receivingType = '', recvSupplierBuName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return value;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierBuName;
        }

        return '';
      },
    },
    {
      name: 'recvInventoryOrgName',
      width: 150,
      renderer: ({ record, value }) => {
        const { receivingType = '', recvSupplierOrgName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return value;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierOrgName;
        }

        return '';
      },
    },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
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

  const handleTypeChange = () => {
    const receiptSource =
      ListDS.queryDataSet &&
      ListDS.queryDataSet.current &&
      ListDS.queryDataSet.current.get('receiptSource');

    if (receiptSource === 'CUSTOMER_SUPPLY') {
      ListDS.queryDataSet.fields.get('customerObj').set('lovCode', 'ZMDA.CUSTOMER');
    }

    if (receiptSource === 'BRANCH_CO_SUPPLY') {
      ListDS.queryDataSet.fields.get('customerObj').set('lovCode', 'ZMDA.COMPANY');
    }
  };

  const queryFieldList = [
    <Select name="receiptSource" key="receiptSource" onChange={handleTypeChange} />,
    <Lov name="customerObj" noCache key="customerObj" />,
    <Lov name="supplierObj" noCache key="supplierObj" />,
    <TextField name="deliveryOrderNum" key="deliveryOrderNum" />,
    <TextField name="sourceDocNum" key="sourceDocNum" />,
    <Lov name="businessUnitObj" noCache key="businessUnitObj" />,
    <Lov name="supplierInventoryOrgObj" noCache key="supplierInventoryOrgObj" />,
    <DatePicker name="deliveryOrderDateStart" key="deliveryOrderDateStart" />,
    <DatePicker name="arrivalDateStart" key="arrivalDateStart" />,
  ];

  /**
   * 切换显示隐藏
   */
  const handleToggle = () => {
    setHidden(!hidden);
  };

  /**
   * 查询
   */
  const handleSearch = async () => {
    ListDS.query();
  };

  /**
   * 重置
   */
  const handleReset = () => {
    ListDS.queryDataSet.current.reset();
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('第三方供料接收')}
      >
        <>
          <Button color="primary" onClick={handleToDetail}>
            接收预览
          </Button>
          <Button onClick={() => handleClose(true)}>接收关闭</Button>
        </>
      </Header>
      <Content>
        <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
          <Form dataSet={ListDS.queryDataSet} columns={3} style={{ flex: '1 1 auto' }}>
            {hidden ? queryFieldList.slice(0, 3) : queryFieldList}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              paddingTop: '10px',
            }}
          >
            <Button onClick={handleToggle}>
              {hidden
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Table
          dataSet={ListDS}
          columns={listColumns}
          columnResizable="true"
          queryBar="none"
          rowHeight="auto"
        />
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
