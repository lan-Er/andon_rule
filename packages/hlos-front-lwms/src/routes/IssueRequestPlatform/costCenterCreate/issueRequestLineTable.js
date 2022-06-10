/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-10 11:49:21
 */

import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import intl from 'utils/intl';
import { Table, Button, Lov } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { getAvailableQty, getOnhandQty } from '@/services/issueRequestService';
// import { Divider } from 'choerodon-ui';

export default function MainLineTable(props) {
  const [nowLineNum, setNowLineNum] = useState(0);
  const { dataSet } = props;
  const mainLineColumns = [
    {
      name: 'requestLineNum',
      width: 70,
      align: 'left',
      lock: true,
      key: 'requestLineNum',
    },
    {
      name: 'itemObj',
      width: 144,
      align: 'left',
      editor: (record) => <Lov onChange={() => handleQtyChange(record)} noCache />,
      // editor: true,
      lock: true,
    },
    {
      name: 'description',
      width: 200,
      align: 'left',
    },
    {
      name: 'uom',
      width: 70,
      align: 'left',
    },
    {
      name: 'applyQty',
      width: 100,
      align: 'left',
      editor: true,
    },
    {
      name: 'availableQty',
      width: 100,
      editor: false,
    },
    {
      name: 'onhandQty',
      width: 100,
      editor: false,
    },
    {
      name: 'warehouseObj',
      width: 144,
      align: 'left',
      editor: (record) => <Lov onChange={() => handleQtyChange(record)} noCache />,
      // editor: true,
    },
    {
      name: 'wmAreaObj',
      width: 144,
      align: 'left',
      editor: (record) => <Lov onChange={() => handleQtyChange(record)} noCache />,
      // editor: true,
    },
    {
      name: 'applyPackQty',
      width: 100,
      align: 'left',
      editor: true,
    },
    {
      name: 'applyWeight',
      width: 100,
      align: 'left',
      editor: true,
    },
    {
      name: 'costCenterObj',
      width: 128,
      align: 'left',
      editor: true,
    },
    {
      name: 'projectNum',
      width: 128,
      align: 'left',
      editor: true,
    },
    {
      name: 'secondUom',
      width: 70,
      align: 'left',
    },
    {
      name: 'secondApplyQty',
      width: 100,
      align: 'left',
      editor: true,
    },
    {
      name: 'pickRuleObj',
      width: 144,
      align: 'left',
      editor: true,
    },
    {
      name: 'reservationRuleObj',
      width: 144,
      align: 'left',
      editor: true,
    },
    {
      name: 'fifoRuleObj',
      width: 144,
      align: 'left',
      editor: true,
    },
    // add
    {
      name: 'wmInspectRuleObj',
      width: 144,
      align: 'left',
      editor: true,
    },
    {
      name: 'lotNumber',
      width: 144,
      align: 'left',
      editor: true,
    },
    {
      name: 'tagCode',
      width: 144,
      align: 'left',
      editor: true,
    },
    {
      name: 'remark',
      width: 200,
      align: 'left',
      editor: true,
    },
  ];
  const buttons = [
    <Button icon="add" color="primary" funcType="flat" onClick={() => handleAddLine()}>
      {intl.get('hzero.common.button.create').d('新增')}
    </Button>,
    <Button
      icon="delete"
      color="primary"
      funcType="flat"
      // onClick={() => dataSet.remove(dataSet.selected)}
      onClick={() => handleDeleteLine()}
    >
      {intl.get('hzero.common.button.delete').d('删除')}
    </Button>,
  ];
  const handleQtyChange = async (record) => {
    record.set('availableQty', null);
    record.set('onhandQty', null);
    if (!isEmpty(record.get('itemObj')) && !isEmpty(record.get('warehouseObj'))) {
      // 获取现有量、可用量
      const { organizationObj } = dataSet.parent.current.data;
      const params = {
        organizationId: organizationObj.organizationId,
        itemId: record.get('itemObj') && record.get('itemObj').itemId,
        warehouseId: record.get('warehouseObj') && record.get('warehouseObj').warehouseId,
        wmAreaId: record.get('wmAreaObj') && record.get('wmAreaObj').wmAreaId,
      };
      const availableQtyRes = await getAvailableQty(params);
      const onhandQtyRes = await getOnhandQty(params);
      if (availableQtyRes) {
        record.set('availableQty', availableQtyRes.availableQty);
      }
      if (onhandQtyRes) {
        record.set('onhandQty', onhandQtyRes.quantity);
      }
    }
  };
  const handleDeleteLine = () => {
    dataSet.remove(dataSet.selected);
    const len = dataSet.data.length; // 根据现有的行数重新排序
    setNowLineNum(len);
    for (let i = 0; i < len; i++) {
      dataSet.data[i].set('requestLineNum', len - i);
    }
  };
  const handleAddLine = () => {
    const { organizationObj } = dataSet.parent.current.data;
    if (organizationObj && organizationObj.organizationId) {
      const len = dataSet.data.length; // 根据现有的行数重新排序
      setNowLineNum(len);
      for (let i = 0; i < len; i++) {
        dataSet.data[i].set('requestLineNum', len - i);
      }
      const fatherWarehouseObj = dataSet.parent.current.get('warehouseObj');
      const fatherWmAreaObj = dataSet.parent.current.get('wmAreaObj');
      const fatherCostCenter = dataSet.parent.current.get('costCenter');
      dataSet.create(
        {
          requestLineNum: nowLineNum + 1,
          warehouseObj: fatherWarehouseObj,
          wmAreaObj: fatherWmAreaObj,
          costCenterObj: fatherCostCenter,
        },
        0
      );
      setNowLineNum(nowLineNum + 1);
      dataSet.select(dataSet.current);
    } else {
      notification.warning({
        message: '请先选择组织信息',
      });
    }
  };
  return (
    <Table
      dataSet={dataSet}
      columns={mainLineColumns}
      columnResizable="true"
      border={false}
      buttons={buttons}
    />
  );
}

MainLineTable.propTypes = {
  dataSet: PropTypes.object.isRequired,
};
