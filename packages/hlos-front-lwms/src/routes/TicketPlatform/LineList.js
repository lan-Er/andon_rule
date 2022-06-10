/*
 * @Author: zhang yang
 * @Description: 送货单平台
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-02-04 16:11:04
 */

import React from 'react';
import { Table } from 'choerodon-ui/pro';
import { statusRender } from 'hlos-front/lib/utils/renderer';

const { Column } = Table;

function LineList(props) {
  function TableLine() {
    if (props.value === 'main') {
      return (
        <Table dataSet={props.tableDS} border={false} columnResizable="true" editMode="inline">
          <Column name="ticketLineNum" editor={false} width={70} lock />
          <Column name="itemCode" editor={false} width={128} lock />
          <Column name="itemDescription" editor={false} width={200} />
          <Column name="uom" editor={false} width={70} />
          <Column name="deliveryQty" editor={false} width={84} />
          <Column name="poNum" editor={false} width={128} />
          <Column name="poLineNum" editor={false} width={70} />
          <Column name="demandDate" editor={false} width={100} />
          <Column name="promiseDate" editor={false} width={100} />
          <Column
            name="ticketLineStatusMeaning"
            editor={false}
            width={84}
            renderer={({ value, record }) => statusRender(record.data.ticketLineStatus, value)}
          />
          <Column name="recieveRuleMeaning" editor={false} width={100} />
          <Column name="itemControlTypeMeaning" editor={false} width={84} />
          <Column name="secondUom" editor={false} width={70} />
          <Column name="secondDeliveryQty" editor={false} width={84} />
          <Column name="receiveToleranceTypeMeaninng" editor={false} width={84} />
          <Column name="receiveTolerance" editor={false} width={84} />
          <Column name="partyLotCode" editor={false} width={128} />
          <Column name="lotNumber" editor={false} width={128} />
          <Column name="tagCode" editor={false} width={128} />
          <Column name="packingQty" editor={false} width={84} />
          <Column name="containerQty" editor={false} width={84} />
          <Column name="sourceDocTypeName" editor={false} width={128} />
          <Column name="sourceDocNum" editor={false} width={128} />
          <Column name="sourceDocLineNum" editor={false} width={70} />
          <Column name="lineRemark" editor={false} width={200} />
          <Column name="externalId" editor={false} width={128} />
          <Column name="externalNum" editor={false} width={128} />
          <Column name="externalLineId" editor={false} width={128} />
          <Column name="externalLineNum" editor={false} width={70} />
        </Table>
      );
    } else if (props.value === 'get') {
      return (
        <Table dataSet={props.tableDS} border={false} columnResizable="true" editMode="inline">
          <Column name="ticketLineNum" editor={false} width={70} lock />
          <Column name="itemCode" editor={false} width={128} lock />
          <Column name="deliveryQty" editor={false} width={84} />
          <Column name="receivedQty" editor={false} width={84} />
          <Column name="inventoryQty" editor={false} width={84} />
          <Column name="qcOkQty" editor={false} width={84} />
          <Column name="qcNgQty" editor={false} width={84} />
          <Column name="qcNgReason" editor={false} width={200} />
          <Column name="qcDocNum" editor={false} width={128} />
          <Column name="returnedQty" editor={false} width={84} />
          {/* <Column name="demandDate" editor={false} width={136} /> */}
          <Column name="receiveWorkerName" editor={false} width={100} />
          <Column name="actualArrivalTime" editor={false} width={136} />
          <Column name="inspectorName" editor={false} width={100} />
          <Column name="inspectedTime" editor={false} width={136} />
          <Column name="inventoryWorkerName" editor={false} width={100} />
          <Column name="inventoryTime" editor={false} width={136} />
          <Column name="receiveWarehouseName" editor={false} width={128} />
          <Column name="receiveWmAreaName" editor={false} width={128} />
          <Column name="inventoryWarehouseName" editor={false} width={128} />
          <Column name="inventoryWmAreaName" editor={false} width={128} />
        </Table>
      );
    }
  }

  return (
    <React.Fragment>
      <TableLine />
    </React.Fragment>
  );
}

export default LineList;
