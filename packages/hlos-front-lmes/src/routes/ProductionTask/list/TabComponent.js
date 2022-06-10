/**
 * @Description: 生产任务管理信息--tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 15:38:04
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Button, Pagination, CheckBox } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'lmes.productionTask';

export default function TabComponent({
  tabType,
  tableRef,
  dataSource,
  showLoading,
  tableHeight,
  totalElements,
  size,
  currentPage,
  onRowChange,
  onToDetailPage,
  onPageChange,
  checkValues,
  onCheckCell,
  onCheckAllChange,
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
      dataIndex: 'taskId',
      key: 'taskId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.org`).d('组织'),
      dataIndex: 'organization',
      key: 'organization',
      width: 128,
      fixed: true,
      resizable: true,
      render: orgRender,
    },
    {
      title: intl.get(`${preCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      key: 'taskNum',
      width: 128,
      fixed: true,
      resizable: true,
      render: linkRenderer,
    },
    {
      title: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      dataIndex: 'taskStatusMeaning',
      key: 'taskStatusMeaning',
      width: 90,
      fixed: true,
      resizable: true,
      render: ({ rowData }) => statusRender(rowData.taskStatus, rowData.taskStatusMeaning),
    },
    {
      title: intl.get(`${preCode}.operation`).d('工序'),
      dataIndex: 'operation',
      key: 'operation',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentNum`).d('来源单据号'),
      dataIndex: 'documentNum',
      key: 'documentNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentLineNum`).d('来源单据行号'),
      dataIndex: 'documentLineNum',
      key: 'documentLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.documentType`).d('来源单据类型'),
      dataIndex: 'documentTypeName',
      key: 'documentTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.product`).d('产品'),
      dataIndex: 'product',
      key: 'product',
      width: 336,
      resizable: true,
      render: productRender,
    },
    {
      title: intl.get(`${preCode}.sourceTask`).d('来源任务'),
      dataIndex: 'sourceTaskNum',
      key: 'sourceTaskNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.relatedTask`).d('关联任务'),
      dataIndex: 'relatedTask',
      key: 'relatedTask',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.taskGroup`).d('任务组'),
      dataIndex: 'taskGroup',
      key: 'taskGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.description`).d('描述'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.referenceDoc`).d('参考文件'),
      dataIndex: 'referenceDocument',
      key: 'referenceDocument',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processProgram`).d('加工程序'),
      dataIndex: 'processProgram',
      key: 'processProgram',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.collector`).d('数据收集'),
      dataIndex: 'collector',
      key: 'collector',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.instruction`).d('工序说明'),
      dataIndex: 'instruction',
      key: 'instruction',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.preOperation`).d('前序工序'),
      dataIndex: 'preOperation',
      key: 'preOperation',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkOperation`).d('返修工序'),
      dataIndex: 'reworkOperation',
      key: 'reworkOperation',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.downstreamOperation`).d('下游工序'),
      dataIndex: 'downstreamOperation',
      key: 'downstreamOperation',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.firstOperation`).d('首工序'),
      dataIndex: 'firstOperationFlag',
      key: 'firstOperationFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lastOperation`).d('末工序'),
      dataIndex: 'lastOperationFlag',
      key: 'lastOperationFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.exception`).d('返修原因'),
      dataIndex: 'exceptionName',
      key: 'exceptionName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkProcessedFlag`).d('返修处理'),
      dataIndex: 'reworkProcessedFlag',
      key: 'reworkProcessedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.firstReworkFlag`).d('返修首工序'),
      dataIndex: 'firstReworkFlag',
      key: 'firstReworkFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lastReworkFlag`).d('返修末工序'),
      dataIndex: 'lastReworkFlag',
      key: 'lastReworkFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.outsideFlag`).d('外协任务'),
      dataIndex: 'outsideFlag',
      key: 'outsideFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.taskRank`).d('优先等级'),
      dataIndex: 'taskRank',
      key: 'taskRank',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.taskSpectralColor`).d('特殊任务'),
      dataIndex: 'taskSpectralColor',
      key: 'taskSpectralColor',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      key: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      key: 'printedDate',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      key: 'docProcessRule',
      width: 128,
      renderer: ruleRenderer,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalId`).d('外部ID'),
      dataIndex: 'externalId',
      key: 'externalId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      dataIndex: 'externalNum',
      key: 'externalNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalLineId`).d('外部行ID'),
      dataIndex: 'externalLineId',
      key: 'externalLineId',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.externalLineNum`).d('外部单据行号'),
      dataIndex: 'externalLineNum',
      key: 'externalLineNum',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: actionRender,
      align: 'center',
      fixed: 'right',
    },
  ];

  const executeColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'taskId',
      key: 'taskId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.org`).d('组织'),
      dataIndex: 'organization',
      key: 'organization',
      width: 128,
      fixed: true,
      resizable: true,
      render: orgRender,
    },
    {
      title: intl.get(`${preCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      key: 'taskNum',
      width: 128,
      fixed: true,
      resizable: true,
      render: linkRenderer,
    },
    {
      title: intl.get(`${preCode}.product`).d('产品'),
      dataIndex: 'product',
      key: 'product',
      width: 336,
      fixed: true,
      resizable: true,
      render: productRender,
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'produceLineName',
      key: 'produceLineName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.equipment`).d('设备'),
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.workcell`).d('工位'),
      dataIndex: 'workcellName',
      key: 'workcellName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.workGroup`).d('班组'),
      dataIndex: 'workerGroupName',
      key: 'workerGroupName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.worker`).d('操作工'),
      dataIndex: 'workerName',
      key: 'workerName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.resource`).d('资源'),
      dataIndex: 'resourceName',
      key: 'resourceName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.location`).d('地点'),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.calendarDay`).d('指定日期'),
      dataIndex: 'calendarDay',
      key: 'calendarDay',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.calendarShift`).d('指定班次'),
      dataIndex: 'calendarShiftCode',
      key: 'calendarShiftCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
      dataIndex: 'planStartTime',
      key: 'planStartTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualStartDate`).d('实际开始时间'),
      dataIndex: 'actualStartTime',
      key: 'actualStartTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.actualEndDate`).d('实际结束时间'),
      dataIndex: 'actualEndTime',
      key: 'actualEndTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      dataIndex: 'standardWorkTime',
      key: 'standardWorkTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planProcessTime`).d('计划加工时间'),
      dataIndex: 'planProcessTime',
      key: 'planProcessTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('实际加工时间'),
      dataIndex: 'processedTime',
      key: 'processedTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.transationTime`).d('累计产出时间'),
      dataIndex: 'transactionTime',
      key: 'transactionTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.executeRule`).d('执行规则'),
      dataIndex: 'executeRule',
      key: 'executeRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
      dataIndex: 'inspectionRule',
      key: 'inspectionRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      dataIndex: 'dispatchRule',
      key: 'dispatchRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('包装规则'),
      dataIndex: 'packingRule',
      key: 'packingRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.reworkRule`).d('返修规则'),
      dataIndex: 'reworkRule',
      key: 'reworkRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.priority`).d('优先级'),
      dataIndex: 'priority',
      key: 'priority',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: actionRender,
      align: 'center',
      fixed: 'right',
    },
  ];

  function orgRender({ rowData }) {
    return `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`;
  }

  function productRender({ rowData }) {
    return `${rowData.productCode || ''} ${rowData.itemDescription || ''}`;
  }

  function actionRender({ rowData }) {
    return (
      <Button
        color="primary"
        funcType="flat"
        onClick={(e) =>
          onToDetailPage(e, `/lmes/production-execution`, {
            taskNum: rowData.taskNum,
            taskId: rowData.taskId,
            organizationId: rowData.organizationId,
            organizationName: rowData.organizationName,
          })
        }
      >
        {intl.get(`${preCode}.view.button.detail`).d('执行明细')}
      </Button>
    );
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer({ rowData }) {
    return (
      <a onClick={(e) => onToDetailPage(e, `/lmes/production-task/detail/${rowData.taskId}`)}>
        {rowData.taskNum}
      </a>
    );
  }

  function ruleRenderer({ rowData }) {
    return <a>{rowData.docProcessRule}</a>;
  }

  if (tabType === 'main') {
    columns = mainColumns;
  } else if (tabType === 'execute') {
    columns = executeColumns;
  }

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        data={dataSource}
        ref={tableRef}
        columns={columns}
        height={tableHeight}
        loading={showLoading}
        onRowClick={onRowChange}
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
