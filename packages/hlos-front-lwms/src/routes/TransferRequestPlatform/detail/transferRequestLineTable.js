/*
 * @Description: 转移单平台行表
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-02-06 17:27:09
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import { isEmpty } from 'lodash';
import { Button, Table, Tooltip, Lov } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { getAvailableQty, getOnhandQty } from '@/services/transferRequestService';
import { statusRender } from 'hlos-front/lib/utils/renderer';

const getJudgementFun = (isCreate, isHeadValid) => {
  return function isFieldsEditable(record, name) {
    // 列表界面全部返回 false
    if (isCreate === undefined) {
      return false;
    }

    // 默认不可编辑字段
    const defaultNotEditableFields = [
      'requestLineNum',
      'itemDescription',
      'requestLineStatus',
      // TODO 此处缺少接口
      // 'itemControlType',
    ];
    if (defaultNotEditableFields.includes(name)) {
      return false;
    }
    // 新增状态
    if (isCreate) {
      return isHeadValid;
    }
    const {
      dataSet: {
        parent: { current: parentCurrent },
      },
    } = record;
    if (parentCurrent) {
      // 已完成 已关闭 已取消 状态均不可编辑
      const freezeStatus = ['COMPLETED', 'CLOSED', 'CANCELLED'];
      const parentStatus = parentCurrent.get('requestStatus');
      const recordStatus = record.get('requestLineStatus');
      if (freezeStatus.includes(parentStatus) || freezeStatus.includes(recordStatus)) {
        return false;
      }

      // 新建单据可以编辑
      if (record.status === 'add') {
        return true;
      }

      // 除上述状态外 不可编辑的字段
      const notEditableWhenNew = [
        'applyQty',
        'applyPackQty',
        'applyWeight',
        'secondApplyQty',
        'lineRemark',
        'pickRuleObj',
        'reservationRuleObj',
        'fifoRuleObj',
        'wmInspectRuleObj',
        'lotNumber',
        'tagCode',
      ];
      return !notEditableWhenNew.includes(name);
    } else {
      return false;
    }
  };
};

const handleQtyChange = async (record, dataSet) => {
  record.set('availableQty', null);
  record.set('onhandQty', null);
  if (!isEmpty(record.get('itemObj'))) {
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
  } else {
    record.set('availableQty', 0);
    record.set('onhandQty', 0);
  }
};

const commandColumn = {
  header: intl.get('hzero.common.button.action').d('操作'),
  width: 120,
  command: ({ dataSet, record }) => {
    return [
      <Tooltip placement="bottom" title={intl.get('hzero.common.button.delete').d('删除')}>
        <Button
          icon="delete"
          color="primary"
          funcType="flat"
          disabled={record.status !== 'add'}
          onClick={() => dataSet.delete(record)}
        />
      </Tooltip>,
    ];
  },
  lock: 'right',
};

const mainLineColumns = (ds, isCreate, isFieldEditable, isEditPage, fieldReadOnly) => {
  const getFieldEditable = (record, name) => isFieldEditable(record, name);
  const columns = [
    {
      name: 'requestLineNum',
      width: 70,
      editor: getFieldEditable,
      lock: 'left',
    },
    {
      name: 'itemObj',
      width: 128,
      editor: (record) =>
        record.status === 'add' && <Lov onChange={() => handleQtyChange(record, ds)} noCache />,
      lock: 'left',
    },
    {
      name: 'itemDescription',
      width: 200,
      editor: getFieldEditable,
    },
    {
      name: 'uomObj',
      width: 70,
      editor: false, // (record) => record.status === 'add',
    },
    {
      name: 'applyQty',
      width: 84,
      editor: getFieldEditable,
    },
    {
      name: 'availableQty',
      width: 84,
      editor: false,
    },
    {
      name: 'onhandQty',
      width: 84,
      editor: false,
    },
    {
      name: 'requestLineStatus',
      width: 84,
      editor: getFieldEditable,
      renderer: ({ text, value }) => statusRender(value, text),
    },
    {
      name: 'wmMoveTypeObj',
      width: 128,
      editor: (record) => record.status === 'add' && !record.get('wmMoveTypeId'),
    },
    fieldReadOnly
      ? {
          name: 'warehouse',
          width: 128,
          editor: false,
        }
      : {
          name: 'warehouseObj',
          width: 128,
          editor: (record) =>
            record.status === 'add' && <Lov onChange={() => handleQtyChange(record, ds)} noCache />,
        },
    fieldReadOnly
      ? {
          name: 'wmArea',
          width: 128,
          editor: false,
        }
      : {
          name: 'wmAreaObj',
          width: 128,
          editor: (record) =>
            record.status === 'add' && <Lov onChange={() => handleQtyChange(record, ds)} noCache />,
        },
    {
      name: 'locationObj',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    fieldReadOnly
      ? {
          name: 'toWarehouse',
          width: 128,
          editor: false,
        }
      : {
          name: 'toWarehouseObj',
          width: 128,
          editor: (record) => record.status === 'add',
        },
    fieldReadOnly
      ? {
          name: 'toWmArea',
          width: 128,
          editor: false,
        }
      : {
          name: 'toWmAreaObj',
          width: 128,
          editor: (record) => record.status === 'add',
        },
    {
      name: 'toLocationObj',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    fieldReadOnly
      ? {
          name: 'viaWarehouse',
          width: 128,
          editor: false,
        }
      : {
          name: 'viaWarehouseObj',
          width: 128,
          editor: (record) => record.status === 'add',
        },
    fieldReadOnly
      ? {
          name: 'viaWmArea',
          width: 128,
          editor: false,
        }
      : {
          name: 'viaWmAreaObj',
          width: 128,
          editor: (record) => record.status === 'add',
        },
    {
      name: 'viaLocationObj',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'itemControlTypeMeaning',
      width: 84,
      // editor: getFieldEditable,
    },
    {
      name: 'applyPackQty',
      width: 84,
      editor: getFieldEditable,
    },
    {
      name: 'applyWeight',
      width: 84,
      editor: getFieldEditable,
    },
    {
      name: 'secondUomObj',
      width: 70,
      editor: false,
    },
    {
      name: 'secondApplyQty',
      width: 84,
      editor: getFieldEditable,
    },
    {
      name: 'sourceDocTypeObj',
      width: 100,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'sourceDocNumObj',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'sourceDocLineNumObj',
      width: 70,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'lineRemark',
      width: 200,
      editor: getFieldEditable,
    },
    {
      name: 'externalId',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'externalNum',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'externalLineId',
      align: 'left',
      width: 128,
      editor: (record) => record.status === 'add',
    },
    {
      name: 'externalLineNum',
      width: 70,
      editor: (record) => record.status === 'add',
    },
  ];
  if (isEditPage) {
    columns.push(commandColumn);
  }
  return columns;
};

const execLineColumns = (ds, isCreate, isFieldEditable) => {
  const getFieldEditable = (record, name) => isFieldEditable(record, name);
  return [
    {
      name: 'requestLineNum',
      width: 70,
      editor: getFieldEditable,
      lock: 'left',
    },
    {
      name: 'itemObj',
      width: 128,
      editor: getFieldEditable,
      lock: 'left',
    },
    {
      name: 'applyQty',
      width: 84,
      editor: getFieldEditable,
    },
    {
      name: 'pickedFlag',
      width: 70,
      // renderer: yesOrNoRender,
      editor: false,
    },
    {
      name: 'pickedQty',
      width: 84,
      editor: false,
    },
    {
      name: 'executedQty',
      width: 84,
      editor: false,
    },
    {
      name: 'confirmedQty',
      width: 84,
      editor: false,
    },
    {
      name: 'pickedWorkerObj',
      width: 100,
      editor: false,
    },
    {
      name: 'pickRuleObj',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'reservationRuleObj',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'fifoRuleObj',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'wmInspectRuleObj',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'lotNumber',
      width: 128,
      editor: getFieldEditable,
    },
    {
      name: 'tagCode',
      width: 128,
      editor: getFieldEditable,
    },
  ];
};

export function LineTable(props) {
  const { type, dataSet, isCreate, isHeadValid, isEditPage, fieldReadOnly } = props;
  const isFieldsEditable = getJudgementFun(isCreate, isHeadValid);
  const columns =
    type === 'main'
      ? mainLineColumns(dataSet, isCreate, isFieldsEditable, isEditPage, fieldReadOnly)
      : execLineColumns(dataSet, isCreate, isFieldsEditable);
  return <Table dataSet={dataSet} columns={columns} columnResizable="true" border={false} />;
}
