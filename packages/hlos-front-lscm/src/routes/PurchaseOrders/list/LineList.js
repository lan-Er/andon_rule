/*
 * @Author: zhang yang
 * @Description: 采购订单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-01-07 18:28:49
 */
import React from 'react';
import { CheckBox, Pagination, PerformanceTable } from 'choerodon-ui/pro';
import intl from 'utils/intl';

import { statusRender } from 'hlos-front/lib/utils/renderer';

const tableRef = React.createRef();
const preCode = 'lscm.Pos.model';
const commonCode = 'lscm.common.model';

function LineList({
  type,
  lineDataSource,
  lineTableHeight,
  showLineLoading,
  lineTotalElements,
  handleLinePageChange,
  lineSize,
  lineCurrentPage,
  checkLineRecords,
  handleLineCheckAllChange,
  checkLineCell,
}) {
  const mainColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={lineDataSource.length && checkLineRecords.length === lineDataSource.length}
          onChange={handleLineCheckAllChange}
        />
      ),
      dataIndex: 'poLineId',
      key: 'poLineId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => checkLineCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.poLineNum`).d('行号'),
      resizable: true,
      dataIndex: 'poLineNum',
      editor: false,
      width: 70,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.receiveOrgName`).d('收货组织'),
      resizable: true,
      dataIndex: 'receiveOrgName',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.itemCode`).d('物料'),
      resizable: true,
      dataIndex: 'itemCode',
      width: 144,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      resizable: true,
      dataIndex: 'itemDescription',
      editor: false,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      resizable: true,
      dataIndex: 'uom',
      width: 70,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      resizable: true,
      dataIndex: 'demandQty',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      resizable: true,
      dataIndex: 'demandDate',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      resizable: true,
      dataIndex: 'promiseDate',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.receiveRuleMeaning`).d('收货类型'),
      resizable: true,
      dataIndex: 'receiveRuleMeaning',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.poLineStatus`).d('行状态'),
      resizable: true,
      dataIndex: 'poLineStatusMeaning',
      width: 84,
      align: 'center',
      render: ({ rowData }) => {
        if (rowData.poLineStatusMeaning) {
          return statusRender(rowData.poLineStatus, rowData.poLineStatusMeaning);
        } else {
          const myValue = rowData.poLineStatus === 'NEW' ? '新建' : '';
          return statusRender(rowData.poLineStatus, myValue);
        }
      },
    },
    {
      title: intl.get(`${preCode}.unitPrice`).d('单价'),
      resizable: true,
      dataIndex: 'unitPrice',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.lineAmount`).d('行总价'),
      resizable: true,
      dataIndex: 'lineAmount',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
      resizable: true,
      dataIndex: 'receiveToleranceType',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
      resizable: true,
      dataIndex: 'receiveTolerance',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      resizable: true,
      dataIndex: 'receiveWarehouseObj',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      resizable: true,
      dataIndex: 'receiveWmArea',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      resizable: true,
      dataIndex: 'inventoryWarehouseObj',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      resizable: true,
      dataIndex: 'inventoryWmArea',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      resizable: true,
      dataIndex: 'projectNum',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      resizable: true,
      dataIndex: 'secondUomObj',
      width: 80,
    },
    {
      title: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      resizable: true,
      dataIndex: 'secondDemandQty',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.supplierItemCode`).d('供应商物料'),
      resizable: true,
      dataIndex: 'supplierItemCode',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.supplierItemDesc`).d('供应商物料描述'),
      resizable: true,
      dataIndex: 'supplierItemDesc',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.itemCategory`).d('物料采购类别'),
      resizable: true,
      dataIndex: 'itemCategoryName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.lineRemark`).d('行备注'),
      resizable: true,
      dataIndex: 'lineRemark',
      width: 200,
    },
  ];

  // 收获
  const getColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={lineDataSource.length && checkLineRecords.length === lineDataSource.length}
          onChange={handleLineCheckAllChange}
        />
      ),
      dataIndex: 'poLineId',
      key: 'poLineId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => checkLineCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.poLineNum`).d('行号'),
      resizable: true,
      dataIndex: 'poLineNum',
      editor: false,
      width: 70,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      resizable: true,
      dataIndex: 'receiveOrg',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.itemCode`).d('物料'),
      resizable: true,
      dataIndex: 'itemCode',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      resizable: true,
      dataIndex: 'demandQty',
      editor: false,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      resizable: true,
      dataIndex: 'receivedQty',
      editor: false,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      resizable: true,
      dataIndex: 'inventoryQty',
      editor: false,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      resizable: true,
      dataIndex: 'qcNgQty',
      editor: false,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.returnedQty`).d('退货数量'),
      resizable: true,
      dataIndex: 'returnedQty',
      editor: false,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      resizable: true,
      dataIndex: 'receiveWarehouseObj',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      resizable: true,
      dataIndex: 'receiveWmArea',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
      resizable: true,
      dataIndex: 'inventoryWarehouseObj',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
      resizable: true,
      dataIndex: 'inventoryWmArea',
      editor: false,
      width: 128,
    },
  ];

  // 其他
  const otherColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={lineDataSource.length && checkLineRecords.length === lineDataSource.length}
          onChange={handleLineCheckAllChange}
        />
      ),
      dataIndex: 'poLineId',
      key: 'poLineId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => checkLineCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.poLineNum`).d('行号'),
      resizable: true,
      dataIndex: 'poLineNum',
      editor: false,
      width: 70,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      resizable: true,
      dataIndex: 'receiveOrg',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.itemCode`).d('物料'),
      resizable: true,
      dataIndex: 'itemCode',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      resizable: true,
      dataIndex: 'lotNumber',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('指定标签'),
      resizable: true,
      dataIndex: 'tagCode',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.packageNum`).d('包装编号'),
      resizable: true,
      dataIndex: 'packageNum',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      resizable: true,
      dataIndex: 'moNum',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.moOperation`).d('工序'),
      resizable: true,
      dataIndex: 'moOperationObj',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.relatedItem`).d('关联物料'),
      resizable: true,
      dataIndex: 'relatedItemCodeObj',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.relatedItemDesc`).d('关联物料描述'),
      resizable: true,
      dataIndex: 'relatedItemDesc',
      editor: false,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.relatedUom`).d('关联物料单位'),
      resizable: true,
      dataIndex: 'relatedUom',
      editor: false,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.relatedDemandQty`).d('关联物料数量'),
      resizable: true,
      dataIndex: 'relatedDemandQty',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      resizable: true,
      dataIndex: '',
      editor: false,
      width: 144,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      resizable: true,
      dataIndex: 'sourceDocNumObj',
      editor: false,
      width: 120,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      resizable: true,
      dataIndex: 'sourceDocLineNumObj',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalId`).d('外部ID'),
      resizable: true,
      dataIndex: 'externalId',
      editor: false,
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
      resizable: true,
      dataIndex: 'externalNum',
      editor: false,
      width: 144,
    },
  ];

  function TableLine() {
    let columns = mainColumns;
    if (type === 'get') {
      columns = getColumns;
    } else if (type === 'other') {
      columns = otherColumns;
    }
    return (
      <>
        <PerformanceTable
          virtualized
          data={lineDataSource}
          ref={tableRef}
          columns={columns}
          height={lineTableHeight}
          loading={showLineLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={lineTotalElements}
          onChange={handleLinePageChange}
          pageSize={lineSize}
          page={lineCurrentPage}
        />
        {/* <Table
          dataSet={props.tableDS}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={`${props.value}Columns`()}
        /> */}
      </>
    );

    // if (props.value === 'main') {
    //   return (
    //     <Table
    //       dataSet={props.tableDS}
    //       border={false}
    //       columnResizable="true"
    //       editMode="inline"
    //       columns={mainColumns()}
    //     />
    //   );
    // } else if (props.value === 'get') {
    //   return (
    //     <Table
    //       dataSet={props.tableDS}
    //       border={false}
    //       columnResizable="true"
    //       editMode="inline"
    //       columns={getColumns()}
    //     />
    //   );
    // } else if (props.value === 'other') {
    //   return (
    //     <Table
    //       dataSet={props.tableDS}
    //       border={false}
    //       columnResizable="true"
    //       editMode="inline"
    //       columns={otherColumns()}
    //     />
    //     // <Table dataSet={props.tableDS} border={false} columnResizable="true" editMode="inline">
    //     //   <Column name="poLineNum" editor={false} width={70} fixed />
    //     //   <Column name="receiveOrgObj" editor={false} width={128} fixed />
    //     //   <Column name="itemObj" editor={false} width={128} fixed />
    //     //   <Column name="lotNumber" editor={false} width={144} />
    //     //   <Column name="tagCode" editor={false} width={144} />
    //     //   <Column name="packageNum" editor={false} width={144} />
    //     //   <Column name="moNum" editor={false} width={144} />
    //     //   <Column name="moOperationObj" editor={false} width={128} />
    //     //   <Column name="relatedItemCodeObj" editor={false} width={144} />
    //     //   <Column name="relatedItemDesc" editor={false} width={200} />
    //     //   <Column name="relatedUom" editor={false} width={100} />
    //     //   <Column name="relatedDemandQty" editor={false} width={144} />
    //     //   <Column name="sourceDocTypeName" editor={false} width={144} />
    //     //   <Column name="sourceDocNumObj" editor={false} width={120} />
    //     //   <Column name="sourceDocLineNumObj" editor={false} width={128} />
    //     //   <Column name="externalId" editor={false} width={128} />
    //     //   <Column name="externalNum" editor={false} width={144} />
    //     // </Table>
    //   );
    // }
  }

  return (
    <React.Fragment>
      <TableLine />
    </React.Fragment>
  );
}

export default LineList;
