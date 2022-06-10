/**
 * @Description: MO工作台管理信息 - tab组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';

const preCode = 'zexe.moWorkspace.model';
const commonCode = 'zexe.common.model';

export default function PlanTable(props) {
  const {
    loading,
    tableScrollWidth,
    dataSource,
    pagination,
    handlePagination,
    linkRenderer,
    rowSelection,
  } = props;

  const columns = [
    {
      title: intl.get(`${commonCode}.supplier`).d('供应商编码'),
      dataIndex: 'supplierNumber',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      dataIndex: 'supplierName',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organization',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 150,
      render: linkRenderer,
      fixed: 'left',
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: intl.get(`${preCode}.apsOu`).d('计划中心'),
      dataIndex: 'moPlanList[0].apsOu',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.apsGroup`).d('计划组'),
      dataIndex: 'moPlanList[0].apsGroup',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.apsResource`).d('计划资源'),
      dataIndex: 'moPlanList[0].apsResource',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.relatedResource`).d('相关资源'),
      dataIndex: 'moPlanList[0].relatedResourceName',
      width: 150,
    },
    { title: intl.get(`${preCode}.demandQty`).d('需求数量'), dataIndex: 'demandQty', width: 150 },
    { title: intl.get(`${preCode}.makeQty`).d('制造数量'), dataIndex: 'makeQty', width: 150 },
    {
      title: intl.get(`${preCode}.planQty`).d('计划数量'),
      dataIndex: 'moPlanList[0].planQty',
      width: 150,
    },
    { title: intl.get(`${preCode}.demandDate`).d('需求日期'), dataIndex: 'demandDate', width: 150 },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'moPlanList[0].promiseDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
      dataIndex: 'moPlanList[0].deadlineDate',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planFlag`).d('计划标识'),
      dataIndex: 'moPlanList[0].planFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.planRule`).d('计划规则'),
      dataIndex: 'moPlanList[0].planRuleMeaning',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planLevel`).d('计划层级'),
      dataIndex: 'moPlanList[0].planLevel',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planPriorty`).d('计划优先级'),
      dataIndex: 'moPlanList[0].planPriority',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.resourceFix`).d('固定资源'),
      dataIndex: 'moPlanList[0].resourceFixFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.capacityType`).d('能力类型'),
      dataIndex: 'moPlanList[0].capacityTypeMeaning',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.capacityValue`).d('能力值'),
      dataIndex: 'moPlanList[0].capacityValue',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.referenceType`).d('参考类型'),
      dataIndex: 'moPlanList[0].moReferenceTypeMeaning',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.referenceMo`).d('参考MO'),
      dataIndex: 'moPlanList[0].referenceMoNum',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.earliestStartTime`).d('最早开始时间'),
      dataIndex: 'moPlanList[0].earliestStartTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.startTime`).d('开始时间'),
      dataIndex: 'moPlanList[0].startTime',
      width: 150,
    },
    { title: 'FPS', dataIndex: 'moPlanList[0].fpsTime', width: 150 },
    { title: 'FPC', dataIndex: 'moPlanList[0].fpcTime', width: 150 },
    { title: 'LPS', dataIndex: 'moPlanList[0].lpsTime', width: 150 },
    { title: 'LPC', dataIndex: 'moPlanList[0].lpcTime', width: 150 },
    {
      title: intl.get(`${preCode}.fulfillTime`).d('最终完成时间'),
      dataIndex: 'moPlanList[0].fulfillTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.exceedLeadTime`).d('最大提前周期(天)'),
      dataIndex: 'moPlanList[0].exceedLeadTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.preProcessLeadTime`).d('前处理LT(小时)'),
      dataIndex: 'moPlanList[0].preProcessLeadTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.processLeadTime`).d('处理LT(小时)'),
      dataIndex: 'moPlanList[0].processLeadTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.postProcessLeadTime`).d('后处理LT(小时)'),
      dataIndex: 'moPlanList[0].postProcessLeadTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.safetyLeadTime`).d('安全周期(小时)'),
      dataIndex: 'moPlanList[0].safetyLeadTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.switchTime`).d('切换时间(小时)'),
      dataIndex: 'moPlanList[0].switchTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.releaseTimeFence`).d('下达TF(小时)'),
      dataIndex: 'moPlanList[0].releaseTimeFence',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.orderTimeFence`).d('订单TF(小时)'),
      dataIndex: 'moPlanList[0].orderTimeFence',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.scheduleReleaseTime`).d('计划下达时间'),
      dataIndex: 'moPlanList[0].scheduleReleaseTime',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.endingFlag`).d('计划尾单'),
      dataIndex: 'moPlanList[0].endingFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.planWarnning`).d('计划警告'),
      dataIndex: 'moPlanList[0].planWarnningFlag',
      width: 100,
      renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.specialColor`).d('颜色标注'),
      dataIndex: 'moPlanList[0].specialColor',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.planRemark`).d('计划备注'),
      dataIndex: 'moPlanList[0].planRemark',
      width: 150,
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey="moId"
      bordered
      scroll={{ x: tableScrollWidth(columns) }}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handlePagination}
      rowSelection={isEmpty(dataSource) ? null : rowSelection}
    />
  );
}
