/**
 * @Description: 需求工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-03 15:58:08
 * @LastEditors: yu.na
 */

import React, { createRef, Fragment } from 'react';
import { PerformanceTable, Pagination, CheckBox } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const tableRef = createRef();
const preCode = 'lsop.demandOrder';

export default function TabComponent({
  tabType,
  dataSource,
  tableHeight,
  showLoading,
  totalElements,
  size,
  currentPage,
  checkValues,
  onToDetailPage,
  onPageChange,
  onCheckAllChange,
  onCheckCell,
}) {
  let columns;

  const mainColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'demandId',
      key: 'demandId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOu',
      key: 'sopOu',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      key: 'demandNum',
      resizable: true,
      width: 128,
      render: ({ rowData }) => linkRenderer(rowData),
      lock: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      key: 'demandQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      key: 'demandDate',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.demandStatus`).d('需求状态'),
      dataIndex: 'demandStatusMeaning',
      key: 'demandStatusMeaning',
      resizable: true,
      width: 82,
      render: ({ rowData }) => statusRender(rowData.demandStatus, rowData.demandStatusMeaning),
    },
    {
      title: intl.get(`${preCode}.demandType`).d('需求类型'),
      dataIndex: 'demandType',
      key: 'demandType',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.specification`).d('规格'),
      dataIndex: 'specification',
      key: 'specification',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      dataIndex: 'secondUomName',
      key: 'secondUomName',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
      dataIndex: 'secondDemandQty',
      key: 'secondDemandQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.demandRank`).d('需求等级'),
      dataIndex: 'demandRankMeaning',
      key: 'demandRankMeaning',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.priority`).d('优先级'),
      dataIndex: 'priority',
      key: 'priority',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      key: 'promiseDate',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
      dataIndex: 'deadlineDate',
      key: 'deadlineDate',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.demandPeriod`).d('需求时段'),
      dataIndex: 'demandPeriod',
      key: 'demandPeriod',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.projectNum`).d('项目号'),
      dataIndex: 'projectNum',
      key: 'projectNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      dataIndex: 'wbsNum',
      key: 'wbsNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.completedQty`).d('完工数量'),
      dataIndex: 'completedQty',
      key: 'completedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.shippedQty`).d('发运数量'),
      dataIndex: 'shippedQty',
      key: 'shippedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.demandVersion`).d('需求版本'),
      dataIndex: 'demandVersion',
      key: 'demandVersion',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      key: 'docProcessRule',
      resizable: true,
      width: 128,
      render: ({ rowData }) => <a>{rowData.docProcessRule}</a>,
    },
    {
      title: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      dataIndex: 'sourceDocType',
      key: 'sourceDocType',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      key: 'sourceDocNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      dataIndex: 'sourceDocLineNum',
      key: 'sourceDocLineNum',
      resizable: true,
      width: 106,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      dataIndex: 'remark',
      key: 'remark',
      resizable: true,
      width: 200,
    },
  ];

  const saleColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'demandId',
      key: 'demandId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOu',
      key: 'sopOu',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      key: 'demandNum',
      resizable: true,
      width: 128,
      render: ({ rowData }) => linkRenderer(rowData),
      lock: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.salesman`).d('销售员'),
      dataIndex: 'salesMan',
      key: 'salesMan',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      key: 'soNum',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      dataIndex: 'soLineNum',
      key: 'soLineNum',
      resizable: true,
      width: 106,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      key: 'customerName',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.customerSite`).d('客户地点'),
      dataIndex: 'customerSite',
      key: 'customerSite',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerItem`).d('客户物料'),
      dataIndex: 'customerItemCode',
      key: 'customerItemCode',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
      dataIndex: 'customerItemDesc',
      key: 'customerItemDesc',
      resizable: true,
      width: 200,
    },
    {
      title: intl.get(`${preCode}.customerPo`).d('客户PO'),
      dataIndex: 'customerPo',
      key: 'customerPo',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      dataIndex: 'customerPoLine',
      key: 'customerPoLine',
      resizable: true,
      width: 70,
    },
    {
      title: intl.get(`${preCode}.customerDemandDate`).d('客户需求日期'),
      dataIndex: 'customerDemandDate',
      key: 'customerDemandDate',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.salesChannel`).d('销售渠道'),
      dataIndex: 'salesChannelMeaning',
      key: 'salesChannelMeaning',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.salesbrand`).d('销售商标'),
      dataIndex: 'salesBrandMeaning',
      key: 'salesBrandMeaning',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.currency`).d('币种'),
      dataIndex: 'currency',
      key: 'currency',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.unitPrice`).d('单价'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.totalAmount`).d('总价'),
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.customerAddress`).d('客户地址'),
      dataIndex: 'customerAddress',
      key: 'customerAddress',
      resizable: true,
      width: 200,
    },
  ];

  const planColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'demandId',
      key: 'demandId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOu',
      key: 'sopOu',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      key: 'demandNum',
      resizable: true,
      width: 128,
      render: ({ rowData }) => linkRenderer(rowData),
      lock: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.apsOu`).d('计划中心'),
      dataIndex: 'apsOu',
      key: 'apsOu',
      resizable: true,
      width: 128,
      render: ({ rowData }) => `${rowData.apsOu || ''} ${rowData.apsOuName || ''}`,
    },
    {
      title: intl.get(`${preCode}.meOu`).d('工厂'),
      dataIndex: 'meOu',
      key: 'meOu',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.resource`).d('资源'),
      dataIndex: 'resource',
      key: 'resource',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      key: 'demandQty',
      resizable: true,
      width: 82,
    },
    // { dataIndex: 'secondUomName', width: 82 },
    // { dataIndex: 'secondDemandQty', width: 106 },
    {
      title: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
      dataIndex: 'plannedQty',
      key: 'plannedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.completedQty`).d('完工数量'),
      dataIndex: 'completedQty',
      key: 'completedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.planType`).d('计划类型'),
      dataIndex: 'planTypeMeaning',
      key: 'planTypeMeaning',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.mtoFlag`).d('是否按单'),
      dataIndex: 'mtoFlagMeaning',
      key: 'mtoFlagMeaning',
      resizable: true,
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.validateStatus`).d('校验状态'),
      dataIndex: 'validateStatusMeaning',
      key: 'validateStatusMeaning',
      resizable: true,
      width: 82,
      flexGrow: true,
    },
  ];

  const shipColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'demandId',
      key: 'demandId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOu',
      key: 'sopOu',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      dataIndex: 'demandNum',
      key: 'demandNum',
      resizable: true,
      width: 128,
      render: ({ rowData }) => linkRenderer(rowData),
      lock: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      resizable: true,
      width: 128,
      lock: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      key: 'demandQty',
      resizable: true,
      width: 82,
    },
    // { dataIndex: 'secondUomName', width: 82 },
    // { dataIndex: 'secondDemandQty', width: 106 },
    {
      title: intl.get(`${preCode}.shippedQty`).d('发运数量'),
      dataIndex: 'shippedQty',
      key: 'shippedQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
      dataIndex: 'shippingMethodMeaning',
      key: 'shippingMethodMeaning',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.shipRule`).d('发运规则'),
      dataIndex: 'shipRuleName',
      key: 'shipRuleName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      dataIndex: 'packingRuleName',
      key: 'packingRuleName',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      dataIndex: 'packingFormatMeaning',
      key: 'packingFormatMeaning',
      resizable: true,
      width: 100,
    },
    {
      title: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
      dataIndex: 'packingMaterial',
      key: 'packingMaterial',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      dataIndex: 'minPackingQty',
      key: 'minPackingQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      dataIndex: 'packingQty',
      key: 'packingQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.containerQty`).d('箱数'),
      dataIndex: 'containerQty',
      key: 'containerQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.palletQty`).d('托盘数'),
      dataIndex: 'palletContainerQty',
      key: 'palletContainerQty',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.packageNum`).d('包装编号'),
      dataIndex: 'packageNum',
      key: 'packageNum',
      resizable: true,
      width: 82,
    },
    {
      title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      dataIndex: 'tagTemplate',
      key: 'tagTemplate',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      resizable: true,
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('指定标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      resizable: true,
      width: 128,
      flexGrow: true,
    },
  ];

  if (tabType === 'ship') {
    columns = shipColumns;
  } else if (tabType === 'sale') {
    columns = saleColumns;
  } else if (tabType === 'plan') {
    columns = planColumns;
  } else {
    columns = mainColumns;
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer(record) {
    return (
      <a onClick={() => onToDetailPage(`/lsop/demand-order/detail/${record.demandId}`)}>
        {record.demandNum}
      </a>
    );
  }
  return (
    <Fragment>
      {/* <Table
        dataSet={tableDS}
        columns={columns}
        border={false}
        columnResizable="true"
        editMode="inline"
      /> */}
      <PerformanceTable
        virtualized
        data={dataSource}
        ref={tableRef}
        columns={columns}
        height={tableHeight}
        loading={showLoading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={totalElements}
        onChange={onPageChange}
        pageSize={size}
        page={currentPage}
      />
    </Fragment>
  );
}
