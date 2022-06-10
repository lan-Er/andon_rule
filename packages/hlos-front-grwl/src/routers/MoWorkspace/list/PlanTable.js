/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination, CheckBox } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
// import styles from './style.less';

const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

export default function PlanTable(props) {
  const {
    loading,
    // tableScrollWidth,
    dataPlanSource,
    // handlePagination,
    linkRenderer,
    // rowSelection,
    tableRef,
    currentPage,
    size,
    tableHeight,
    totalElements,
    handlePageChange,
    checkValues,
    onCheckCell,
    onCheckAllChange,
  } = props;

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataPlanSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'moId',
      key: 'moId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organization',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 144,
      render: linkRenderer,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.apsOu`).d('计划中心'),
      dataIndex: 'apsOu',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.apsGroup`).d('计划组'),
      dataIndex: 'apsGroup',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.apsResource`).d('计划资源'),
      dataIndex: 'apsResource',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.relatedResource`).d('相关资源'),
      dataIndex: 'relatedResourceName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.resourceRule`).d('资源分配规则'),
      dataIndex: 'resourceRuleMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.makeQty`).d('制造数量'),
      dataIndex: 'makeQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planQty`).d('计划数量'),
      dataIndex: 'planQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
      dataIndex: 'deadlineDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releaseRule`).d('下达策略'),
      dataIndex: 'releaseRule',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planFlag`).d('计划标识'),
      dataIndex: 'planFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planRule`).d('计划规则'),
      dataIndex: 'planRuleMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planLevel`).d('计划层级'),
      dataIndex: 'planLevel',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planPriorty`).d('计划优先级'),
      dataIndex: 'planPriority',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.resourceFix`).d('固定资源'),
      dataIndex: 'resourceFixFlag',
      width: 128,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.capacityType`).d('能力类型'),
      dataIndex: 'capacityTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.capacityValue`).d('能力值'),
      dataIndex: 'capacityValue',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.referenceType`).d('参考类型'),
      dataIndex: 'moReferenceTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.referenceMo`).d('参考MO'),
      dataIndex: 'referenceMoNum',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.mpsLeadTime`).d('主计划提前天'),
      dataIndex: 'mpsLeadTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.earliestStartTime`).d('最早开始时间'),
      dataIndex: 'earliestStartTime',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.startTime`).d('开始时间'),
      dataIndex: 'startTime',
      width: 150,
      resizable: true,
    },
    { title: 'FPS', dataIndex: 'fpsTime', width: 150, resizable: true },
    { title: 'FPC', dataIndex: 'fpcTime', width: 150, resizable: true },
    { title: 'LPS', dataIndex: 'lpsTime', width: 150, resizable: true },
    { title: 'LPC', dataIndex: 'lpcTime', width: 150, resizable: true },
    {
      title: intl.get(`${preCode}.fulfillTime`).d('最终完成时间'),
      dataIndex: 'fulfillTime',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.exceedLeadTime`).d('最大提前周期(天)'),
      dataIndex: 'exceedLeadTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.preProcessLeadTime`).d('前处理LT(小时)'),
      dataIndex: 'preProcessLeadTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processLeadTime`).d('处理LT(小时)'),
      dataIndex: 'processLeadTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.postProcessLeadTime`).d('后处理LT(小时)'),
      dataIndex: 'postProcessLeadTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.safetyLeadTime`).d('安全周期(小时)'),
      dataIndex: 'safetyLeadTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.switchTime`).d('切换时间(小时)'),
      dataIndex: 'switchTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.releaseTimeFence`).d('下达TF(小时)'),
      dataIndex: 'releaseTimeFence',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.orderTimeFence`).d('订单TF(小时)'),
      dataIndex: 'orderTimeFence',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.scheduleReleaseTime`).d('计划下达时间'),
      dataIndex: 'scheduleReleaseTime',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.endingFlag`).d('计划尾单'),
      dataIndex: 'endingFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planWarnning`).d('计划警告'),
      dataIndex: 'planWarnningFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.specialColor`).d('颜色标注'),
      dataIndex: 'specialColor',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planRemark`).d('计划备注'),
      dataIndex: 'planRemark',
      width: 200,
      resizable: true,
    },
  ];

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        rowKey="moId"
        data={dataPlanSource}
        ref={tableRef}
        columns={columns}
        height={tableHeight}
        loading={loading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={totalElements}
        onChange={handlePageChange}
        pageSize={size}
        page={currentPage}
      />
    </Fragment>
    // <Table
    //   className={styles['lmes-mo-workspace-table']}
    //   loading={loading}
    //   rowKey="moId"
    //   bordered
    //   scroll={{ x: tableScrollWidth(columns) }}
    //   columns={columns}
    //   dataSource={dataSource}
    //   pagination={pagination}
    //   onChange={handlePagination}
    //   rowSelection={isEmpty(dataSource) ? null : rowSelection}
    // />
  );
}
