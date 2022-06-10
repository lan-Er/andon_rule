/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-06 20:48:45
 */
/**
 * @Description: TPM任务管理信息--行table
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 11:23:15
 * @LastEditors: Please set LastEditors
 */

import React, { Fragment } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { resultRender } from '@/utils/renderer';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'lmes.tpmTask.model';

export default function LineList({
  lineDataSource,
  lineTableRef,
  lineTableHeight,
  lineLoading,
  lineTotalElements,
  lineSize,
  currentLinePage,
  onLinePageChange,
}) {
  const columns = [
    {
      title: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
      dataIndex: 'inspectionItemName',
      key: 'inspectionItemName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionItemAlias`).d('检验项目简称'),
      key: 'inspectionItemAlias',
      dataIndex: 'inspectionItemAlias',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionItemDesc`).d('检验项目描述'),
      key: 'inspectionItemDescription',
      dataIndex: 'inspectionItemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionResult`).d('判定结果'),
      key: 'inspectionResultMeaning',
      dataIndex: 'inspectionResultMeaning',
      width: 100,
      resizable: true,
      render: ({ rowData, dataIndex }) =>
        resultRender(rowData.inspectionResult, rowData[dataIndex]),
    },
    {
      title: intl.get(`${preCode}.resultType`).d('结果类型'),
      key: 'resultTypeMeaning',
      dataIndex: 'resultTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionValue`).d('检验值'),
      key: 'inspectionValue',
      dataIndex: 'inspectionValue',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.defaultUcl`).d('默认上限'),
      key: 'defaultUcl',
      dataIndex: 'defaultUcl',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.acceptUcl`).d('包含默认上限值'),
      key: 'defaultUclAccept',
      dataIndex: 'defaultUclAccept',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.defaultLcl`).d('默认下限'),
      key: 'defaultLcl',
      dataIndex: 'defaultLcl',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.acceptLcl`).d('包含默认下限值'),
      key: 'defaultLclAccept',
      dataIndex: 'defaultLclAccept',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.inspectionResource`).d('检测工具'),
      key: 'inspectionResource',
      dataIndex: 'inspectionResource',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.necessaryFlag`).d('是否必输'),
      key: 'necessaryFlag',
      dataIndex: 'necessaryFlag',
      align: 'center',
      width: 70,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.orderBy`).d('显示顺序'),
      key: 'orderByCode',
      dataIndex: 'orderByCode',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inspectionRemark`).d('检验备注'),
      key: 'remark',
      dataIndex: 'remark',
      width: 200,
      resizable: true,
      flexGrow: true,
    },
  ];

  return (
    <Fragment>
      <PerformanceTable
        virtualized
        data={lineDataSource}
        ref={lineTableRef}
        columns={columns}
        height={lineTableHeight}
        loading={lineLoading}
      />
      <Pagination
        pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
        total={lineTotalElements}
        onChange={onLinePageChange}
        pageSize={lineSize}
        page={currentLinePage}
      />
    </Fragment>
  );
}
