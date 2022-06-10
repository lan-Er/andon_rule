/*
 * @Description: 新建生产领料退料单
 * @Author: leying.yan@hand-china.com
 * @Date: 2021-06-02 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-02 10:22:07
 */

import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Table, Button, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import {
  checkControlType,
  getIssueRequestLine,
  getAvailableQty,
  getOnhandQty,
  getAppliedQty,
} from '@/services/singleReturnService';

const organizationId = getCurrentOrganizationId();

const mainLineColumns = (dataSet) => {
  return [
    {
      name: 'requestLineNum',
      width: 50,
      lock: 'left',
    },
    {
      name: 'itemObj',
      width: 256,
      lock: 'left',
      renderer: ({ record }) => {
        return `${record.data?.itemObj?.itemCode}-${record.data?.itemObj?.description}`;
      },
      editor: false,
    },
    {
      name: 'itemDescription',
      width: 256,
      lock: 'left',
    },
    {
      name: 'uomObj',
      width: 70,
    },
    {
      name: 'applyQty',
      width: 100,
      editor: true,
    },
    {
      name: 'claimedQty',
      width: 100,
      editor: false,
    },
    {
      name: 'demandQty',
      width: 100,
      editor: false,
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
      editor: (record) => (
        <Lov onChange={(newValue) => handleWarehouseChange(record, newValue, dataSet)} noCache />
      ),
    },
    {
      name: 'wmAreaObj',
      width: 144,
      editor: (record) => <Lov onChange={() => handleWmAreaChange(record, dataSet)} noCache />,
      // editor: true,
    },
    {
      name: 'applyPackQty',
      width: 100,
      editor: true,
    },
    {
      name: 'applyWeight',
      width: 100,
      editor: true,
    },
    {
      name: 'toWarehouseObj',
      width: 144,
      editor: true,
    },
    {
      name: 'toWmAreaObj',
      width: 144,
      editor: true,
    },
    {
      name: 'secondUom',
      width: 70,
    },
    {
      name: 'secondApplyQty',
      width: 100,
      editor: true,
    },
    {
      name: 'lotNumber',
      width: 144,
      editor: true,
    },
    {
      name: 'tagCode',
      width: 144,
      editor: true,
    },
    {
      name: 'lineRemark',
      width: 144,
      editor: true,
    },
  ];
};

async function handleWarehouseChange(record, newValue, dataSet) {
  record.set('availableQty', null);
  record.set('onhandQty', null);
  if (!isEmpty(newValue) && !isEmpty(record.get('itemObj'))) {
    await checkType(record, newValue, 'warehouse');
    await getQty(record, dataSet);
  } else if (isEmpty(newValue)) {
    record.set('itemControlType', null);
  }
}

function handleWmAreaChange(record, dataSet) {
  record.set('availableQty', null);
  record.set('onhandQty', null);
  if (!isEmpty(record.get('itemObj')) && !isEmpty(record.get('warehouseObj'))) {
    // 获取现有量、可用量
    getQty(record, dataSet);
  }
}

/**
 * 获取可用量、待申领数量、现有量
 *
 * @param {*} record
 * @param {*} dataSet
 */
async function getQty(record, dataSet) {
  const { organizationObj } = dataSet.parent.current.data;
  const params = {
    organizationId: organizationObj.organizationId,
    itemId: record.get('itemObj') && record.get('itemObj').itemId,
    warehouseId: record.get('warehouseObj') && record.get('warehouseObj').warehouseId,
    wmAreaId: record.get('wmAreaObj') && record.get('wmAreaObj').wmAreaId,
  };
  const claimedQtyParams = {
    sourceDocId: record.get('sourceDocId'),
    sourceDocLineId: record.get('sourceDocLineId'),
    itemId: record.get('itemObj') && record.get('itemObj').itemId,
  };
  const availableQtyRes = await getAvailableQty(params);
  const onhandQtyRes = await getOnhandQty(params);
  const claimedQtyRes = await getAppliedQty(claimedQtyParams);
  if (availableQtyRes) {
    record.set('availableQty', availableQtyRes.availableQty);
  }
  if (onhandQtyRes) {
    record.set('onhandQty', onhandQtyRes.quantity);
  }
  if (claimedQtyRes) {
    record.set('claimedQty', claimedQtyRes); // - claimedQtyRes. 待申领数量展示 “需求数量”减去“已申领数量”
  }
  // 若待申领数量小于可用量，默认为待申领数量；否则带出可用量
  if (record.get('claimedQty') < record.get('availableQty')) {
    record.set('applyQty', record.get('claimedQty'));
  } else {
    record.set('applyQty', record.get('availableQty'));
  }
  // 默认选中申请数量不为0的领料单行
  if (record.get('applyQty') > 0) {
    dataSet.select(record);
  }
}

async function checkType(record, newValue, type) {
  let params = { tenantId: organizationId };
  if (type === 'item') {
    params = {
      ...params,
      organizationId: record.get('warehouseObj').warehouseId,
      itemId: newValue.itemId,
      groupId: record.get('warehouseObj').warehouseId,
    };
  } else {
    params = {
      ...params,
      organizationId: newValue.warehouseId,
      itemId: record.get('itemObj').itemId,
      groupId: newValue.warehouseId,
    };
  }
  const typeRes = await checkControlType([params]);
  if (typeRes && !typeRes.failed && typeRes[0]) {
    record.set('itemControlType', typeRes[0].itemControlType);
  }
}

/**
 * @description: 查询行数据
 * @param {*}dataSet
 */
async function handleAsync(dataSet) {
  // dataSet.parent.query();
  const validateValue = await dataSet.parent.validate(false, true);
  if (!validateValue) {
    notification.error({
      message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
    });
    return;
  }
  const {
    organizationObj,
    issueRequestObj,
    warehouseObj,
    wmAreaObj,
    toWarehouseObj,
    toWmAreaObj,
  } = dataSet.parent.current.data;
  const whId = isEmpty(warehouseObj) ? null : warehouseObj.warehouseId;
  const wmId = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaId;
  const toWhId = isEmpty(toWarehouseObj) ? null : toWarehouseObj.warehouseId;
  const toWmId = isEmpty(toWmAreaObj) ? null : toWmAreaObj.wmAreaId;
  const res = await getIssueRequestLine({
    organizationId: organizationObj.organizationId,
    requestId: issueRequestObj.requestId,
    warehouseId: whId,
    wmAreaId: wmId,
    toWarehouseId: toWhId,
    toWmAreaId: toWmId,
    requestOperationType: 'ISSUE',
    page: -1,
  });
  dataSet.reset();
  if (res && res.content && Array.isArray(res.content)) {
    // 遍历领料单行
    res.content.forEach(async (i, index) => {
      const itemParams = {
        itemId: i.itemId,
        itemCode: i.itemCode,
        description: i.itemDescription,
      };
      const uomParams = {
        uomId: i.uomId,
        uomCode: i.uom,
        uomName: i.uomName,
      };

      let linePara = {
        requestLineNum: index + 1, // i.lineNum,
        itemObj: itemParams.itemId && itemParams.description ? itemParams : null,
        uomObj: uomParams.uomId && uomParams.uomName ? uomParams : null,
        applyQty: i.applyQty || 0,
        claimedQty: i.claimedQty || 0,
        demandQty: i.applyQty || 0,
        availableQty: i.availableQty || 0,
        onhandQty: i.onhandQty || 0,
        // 发出仓库、发出货位获取领料单行的目标仓库、目标货位为默认值
        warehouseId: i.toWarehouseId,
        warehouseCode: i.toWarehouseCode,
        warehouseName: i.toWarehouseName,
        wmAreaId: i.toWmAreaId,
        wmAreaCode: i.toWmAreaCode,
        wmAreaName: i.toWmAreaName,
        // 目标仓库、货位获取领料单行的发出仓库、货位为默认值
        toWarehouseId: i.warehouseId,
        toWarehouseCode: i.warehouseCode,
        toWarehouseName: i.warehouseName,
        toWmAreaId: i.wmAreaId,
        toWmAreaCode: i.wmAreaCode,
        toWmAreaName: i.wmAreaName,
        pickedQty: null,
        executedQty: null,
        pickedFlag: null,
        pickedFlagMeaning: null,
      };
      linePara = {
        ...i,
        ...linePara,
      };
      dataSet.create(linePara);
      await getQty(dataSet.records[index], dataSet);
    });
  } else if (res.failed) {
    notification.error({
      message: res.message || '操作失败，请联系管理员！',
    });
  }
}

export default function MainLineTable({ dataSet, type }) {
  useEffect(() => {
    if (type !== 'COMMON_REQUEST') {
      dataSet.fields.get('toWarehouseObj').set('required', false);
    }
  }, [type]);

  return (
    <Table
      dataSet={dataSet}
      columns={mainLineColumns(dataSet, type)}
      columnResizable="true"
      border={false}
      buttons={[
        <Button
          key="autorenew-mainLine"
          icon="autorenew"
          color="primary"
          funcType="flat"
          onClick={() => handleAsync(dataSet, type)}
        >
          查询
        </Button>,
      ]}
    />
  );
}

MainLineTable.propTypes = {
  dataSet: PropTypes.object.isRequired,
};
