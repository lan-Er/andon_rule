/**
 * @Description: 发货单平台行信息
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 18:26:40
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Table, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const commonCode = 'lwms.common.model';
const preCode = 'lwms.shipPlatform.model';

function LineTable(props) {
  const mainColumns = [
    { name: 'no', editor: false, width: 70, lock: 'left' },
    { name: 'itemCode', editor: false, width: 128, lock: 'left' },
    { name: 'itemDescription', editor: false, width: 200 },
    { name: 'uom', editor: false, width: 70 },
    { name: 'applyQty', editor: false, width: 82 },
    { name: 'soNum', editor: false, width: 128 },
    { name: 'soLineNum', editor: false, width: 70 },
    { name: 'demandNum', editor: false, width: 128 },
    { name: 'promiseDate', editor: false, width: 100 },
    {
      name: 'lineStatusMeaning',
      editor: false,
      width: 82,
      align: 'center',
      renderer: ({ value, record }) => statusRender(record.data.lineStatus, value),
    },
    { name: 'wareHouse', editor: false, width: 128 },
    { name: 'wmArea', editor: false, width: 128 },
    { name: 'toWareHouse', editor: false, width: 128 },
    { name: 'toWmArea', editor: false, width: 128 },
    { name: 'customerReceiveType', editor: false, width: 128 },
    { name: 'customerReceiveOrg', editor: false, width: 128 },
    { name: 'customerReceiveWm', editor: false, width: 128 },
    { name: 'customerInventoryWm', editor: false, width: 128 },
    { name: 'itemControlTypeMeaning', editor: false, width: 84 },
    { name: 'secondUom', editor: false, width: 70 },
    { name: 'secondApplyQty', editor: false, width: 82 },
    { name: 'customerItem', editor: false, width: 128 },
    { name: 'customerItemDesc', editor: false, width: 200 },
    { name: 'customerPo', editor: false, width: 128 },
    { name: 'customerPoLine', editor: false, width: 70 },
    { name: 'sourceDocType', editor: false, width: 100 },
    { name: 'sourceDocNum', editor: false, width: 128 },
    { name: 'sourceDocLineNum', editor: false, width: 70 },
    { name: 'lineRemark', editor: false, width: 200 },
    { name: 'externalId', editor: false, width: 128 },
    { name: 'externalNum', editor: false, width: 128 },
    { name: 'externalLineId', editor: false, width: 128 },
    { name: 'externalLineNum', editor: false, width: 70 },
    {
      header: intl.get(`${commonCode}.action`).d('操作'),
      width: 120,
      command: () => {
        return [
          <Button
            key="edit"
            color="primary"
            funcType="flat"
            // onClick={() => this.handleToDetailPage('/lmds/rule-assign/detail', record)}
          >
            {intl.get(`${preCode}.details`).d('发货明细')}
          </Button>,
        ];
      },
      lock: 'right',
    },
  ];

  const shipColumns = [
    { name: 'no', editor: false, width: 70, lock: 'left' },
    { name: 'itemCode', editor: false, width: 128, lock: 'left' },
    { name: 'pickedFlag', width: 70, renderer: yesOrNoRender, editor: false },
    { name: 'pickedQty', editor: false, width: 82 },
    { name: 'shippedQty', editor: false, width: 82 },
    { name: 'confirmedQty', editor: false, width: 82 },
    // add 合格数量	QC OK Qty
    // 不合格数量	QC NG Qty
    // 检验单号	QC Doc Num
    // 不良原因	QC NG Reason
    { name: 'qcOkQty', editor: false, width: 82 },
    { name: 'qcNgQty', editor: false, width: 82 },
    { name: 'qcDocNum', editor: false, width: 128 },
    { name: 'qcNgReason', editor: false, width: 128 },

    { name: 'pickedWorker', editor: false, width: 128 },
    { name: 'pickRule', editor: false, width: 128 },
    { name: 'reservationRule', editor: false, width: 128 },
    // add FIFO规则
    { name: 'fifoRule', editor: false, width: 128 },
    { name: 'shipRule', editor: false, width: 128 },
    { name: 'packingRule', editor: false, width: 128 },
    // add 质检规则
    { name: 'wmInspectRule', editor: false, width: 128 },
    { name: 'packingFormatMeaning', editor: false, width: 82 },
    { name: 'packingMaterial', editor: false, width: 82 },
    { name: 'minPackingQty', editor: false, width: 82 },
    { name: 'packingQty', editor: false, width: 82 },
    { name: 'containerQty', editor: false, width: 82 },
    { name: 'palletQty', editor: false, width: 82 },
    { name: 'packageNum', editor: false, width: 128 },
    { name: 'tagTemplate', editor: false, width: 128 },
    { name: 'lotNumber', editor: false, width: 128 },
    { name: 'tagCode', editor: false, width: 128 },
  ];

  return (
    <React.Fragment>
      {props.value === 'main' ? (
        <Table
          dataSet={props.tableDS}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={mainColumns}
        />
      ) : (
        <Table
          dataSet={props.tableDS}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={shipColumns}
        />
      )}
    </React.Fragment>
  );
}

export default LineTable;
