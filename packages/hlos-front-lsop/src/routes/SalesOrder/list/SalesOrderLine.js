/**
 * @Description: 销售订单管理信息--行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-01-10 14:18:08
 * @LastEditors: Please set LastEditors
 */

import React, { Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';

export default function LineList(props) {
  let columns;

  const mainColumns = [
    { name: 'soLineNum', width: 70, lock: true },
    { name: 'itemCode', width: 128, lock: true },
    { name: 'itemDescription', width: 200, lock: true },
    { name: 'featureCode', width: 128 },
    { name: 'featureDesc', width: 200 },
    { name: 'uomName', width: 70 },
    { name: 'demandQty', width: 82 },
    { name: 'demandDate', width: 100 },
    { name: 'promiseDate', width: 100 },
    { name: 'shipOrganizationName', width: 128 },
    { name: 'soLineTypeMeaning', width: 84 },
    {
      name: 'soLineStatusMeaning',
      width: 90,
      renderer: ({ value, record }) => statusRender(record.data.soLineStatus, value),
    },
    { name: 'unitPrice', width: 82 },
    { name: 'lineAmount', width: 82 },
    { name: 'customerItemCode', width: 128 },
    { name: 'customerItemDesc', width: 200 },
    { name: 'customerPo', width: 128 },
    { name: 'customerPoLine', width: 70 },
    { name: 'secondUomName', width: 70 },
    { name: 'secondDemandQty', width: 82 },
    { name: 'itemCategoryName', width: 128 },
    { name: 'sourceDocTypeName', width: 128 },
    { name: 'sourceDocNum', width: 128 },
    { name: 'sourceDocLineNum', width: 70 },
    { name: 'externalId', width: 128 },
    { name: 'externalNum', width: 128 },
    { name: 'lineRemark', width: 200 },
  ];
  const shipColumns = [
    { name: 'soLineNum', width: 70, lock: true },
    { name: 'itemCode', width: 128, lock: true },
    // { name: 'demandQty', width: 128 },
    { name: 'plannedQty', width: 82 },
    { name: 'shippedQty', width: 82 },
    { name: 'returnedQty', width: 82 },
    // { name: 'demandDate', width: 128 },
    // { name: 'promiseDate', width: 128 },
    { name: 'planShipDate', width: 100 },
    { name: 'applyShipDate', width: 100 },
    { name: 'lastShippedDate', width: 100 },
    { name: 'warehouse', width: 128 },
    { name: 'wmArea', width: 128 },
    { name: 'shipToSiteName', width: 128 },
    { name: 'customerReceiveOrg', width: 144 },
    { name: 'customerReceiveWm', width: 144 },
    { name: 'customerInventoryWm', width: 144 },
    { name: 'customerReceiveType', width: 144 },
    { name: 'shippingMethodMeaning', width: 100 },
    { name: 'shipRuleName', width: 128 },
    { name: 'packingRuleName', width: 128 },
    { name: 'packingFormatMeaning', width: 100 },
    { name: 'packingMaterial', width: 100 },
    { name: 'minPackingQty', width: 82 },
    { name: 'packingQty', width: 82 },
    { name: 'containerQty', width: 82 },
    { name: 'palletContainerQty', width: 82 },
    { name: 'packageNum', width: 128 },
    { name: 'tagTemplate', width: 128 },
    { name: 'lotNumber', width: 128 },
    { name: 'tagCode', width: 128 },
  ];

  if (props.tabType === 'main') {
    columns = mainColumns;
  } else if (props.tabType === 'ship') {
    columns = shipColumns;
  }

  return (
    <Fragment>
      <Table
        dataSet={props.tableDS}
        columns={columns}
        border={false}
        columnResizable="true"
        editMode="inline"
      />
    </Fragment>
  );
}
