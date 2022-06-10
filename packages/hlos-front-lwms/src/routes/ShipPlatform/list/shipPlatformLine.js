/**
 * @Description: 发货单平台行信息
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 18:26:40
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const commonCode = 'lwms.common.model';
const preCode = 'lwms.shipPlatform.model';

function LineTable({
  value,
  lineDataSource,
  lineTableHeight,
  lineLoading,
  lineTotalElements,
  lineSize,
  currentLinePage,
  onPageChange,
}) {
  const mainColumns = [
    {
      title: intl.get(`${preCode}.shipLineNum`).d('行号'),
      dataIndex: 'no',
      resizable: true,
      width: 70,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      resizable: true,
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${commonCode}.uom`).d('单位'),
      dataIndex: 'uom',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.applyQty`).d('申请数量'),
      dataIndex: 'applyQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.poNum`).d('销售订单号'),
      dataIndex: 'soNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.poLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.promiseShipDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${commonCode}.shipLineStatus`).d('行状态'),
      dataIndex: 'lineStatusMeaning',
      resizable: true,
      width: 82,
      align: 'center',
      render: ({ rowData }) => statusRender(rowData.lineStatus, rowData.lineStatusMeaning),
    },
    {
      title: intl.get(`${preCode}.warehouse`).d('发出仓库'),
      dataIndex: 'wareHouse',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.wmArea`).d('发出货位'),
      dataIndex: 'wmArea',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWareHouse',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.toWmArea`).d('目标货位'),
      dataIndex: 'toWmArea',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
      dataIndex: 'customerReceiveType',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
      dataIndex: 'customerReceiveOrg',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
      dataIndex: 'customerReceiveWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
      dataIndex: 'customerInventoryWm',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
      dataIndex: 'itemControlTypeMeaning',
      resizable: true,
      width: 84,
    },
    {
      title: intl.get(`${commonCode}.secondUOM`).d('辅助单位'),
      dataIndex: 'secondUom',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.secondApplyQty`).d('辅助单位数量'),
      dataIndex: 'secondApplyQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.customerItem`).d('客户物料'),
      dataIndex: 'customerItem',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      dataIndex: 'customerItemDesc',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.customerPO`).d('客户PO'),
      dataIndex: 'customerPo',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerPOLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${commonCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${commonCode}.lineRemark`).d('行备注'),
      dataIndex: 'lineRemark',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalLineID`).d('外部行ID'),
      dataIndex: 'externalLineId',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalLineNum`).d('外部单据行号'),
      dataIndex: 'externalLineNum',
      resizable: true,
      width: 70,
    },
    // {
    //   header: intl.get(`${commonCode}.action`).d('操作'),
    //   width: 120,
    //   command: () => {
    //     return [
    //       <Button
    //         key="edit"
    //         color="primary"
    //         funcType="flat"
    //         // onClick={() => this.handleToDetailPage('/lmds/rule-assign/detail', record)}
    //       >
    //         {intl.get(`${preCode}.details`).d('发货明细')}
    //       </Button>,
    //     ];
    //   },
    //   lock: 'right',
    // },
  ];

  const shipColumns = [
    {
      title: intl.get(`${preCode}.shipLineNum`).d('行号'),
      dataIndex: 'no',
      resizable: true,
      width: 70,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      resizable: true,
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.pickedFlag`).d('拣货标识'),
      dataIndex: 'pickedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.pickedQty`).d('拣货数量'),
      dataIndex: 'pickedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${commonCode}.shippedQty`).d('发出数量'),
      dataIndex: 'shippedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.confirmedQty`).d('收货数量'),
      dataIndex: 'confirmedQty',
      resizable: true,
      width: 82,
    },
    // add 合格数量	QC OK Qty
    // 不合格数量	QC NG Qty
    // 检验单号	QC Doc Num
    // 不良原因	QC NG Reason
    {
      title: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      dataIndex: 'qcOkQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      dataIndex: 'qcNgQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
      dataIndex: 'qcDocNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
      dataIndex: 'qcNgReason',
      resizable: true,
      width: 128,
    },

    {
      title: intl.get(`${preCode}.pickedWorker`).d('拣货员工'),
      dataIndex: 'pickedWorker',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.pickRule`).d('拣货规则'),
      dataIndex: 'pickRule',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.reservationRule`).d('预留规则'),
      dataIndex: 'reservationRule',
      resizable: true,
      width: 128,
    },
    // add FIFO规则
    {
      title: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
      dataIndex: 'fifoRule',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.shipRule`).d('发货规则'),
      dataIndex: 'shipRule',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      dataIndex: 'packingRule',
      resizable: true,
      width: 128,
    },
    // add 质检规则
    {
      title: intl.get(`${preCode}.wmInspectRule`).d('质检规则'),
      dataIndex: 'wmInspectRule',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      dataIndex: 'packingFormatMeaning',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
      dataIndex: 'packingMaterial',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      dataIndex: 'minPackingQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      dataIndex: 'packingQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.containerQty`).d('箱数'),
      dataIndex: 'containerQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.palletQty`).d('托盘数'),
      dataIndex: 'palletQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.packageNum`).d('包装编号'),
      dataIndex: 'packageNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      dataIndex: 'tagTemplate',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('指定标签'),
      dataIndex: 'tagCode',
      resizable: true,
      width: 128,
    },
  ];

  return (
    <React.Fragment>
      {value === 'main' ? (
        <>
          <PerformanceTable
            virtualized
            data={lineDataSource}
            height={lineTableHeight}
            columns={mainColumns}
            loading={lineLoading}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={lineTotalElements}
            onChange={onPageChange}
            pageSize={lineSize}
            page={currentLinePage}
          />
        </>
      ) : (
        <>
          <PerformanceTable
            virtualized
            data={lineDataSource}
            height={lineTableHeight}
            columns={shipColumns}
            loading={lineLoading}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={lineTotalElements}
            onChange={onPageChange}
            pageSize={lineSize}
            page={currentLinePage}
          />
        </>
      )}
    </React.Fragment>
  );
}

export default LineTable;
