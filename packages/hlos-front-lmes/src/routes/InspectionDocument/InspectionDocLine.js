/**
 * @Description: 检验单平台--行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:50:02
 * @LastEditors: leying.yan
 */

import React, { Fragment } from 'react';
import { Tabs, Modal, PerformanceTable, Pagination } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import intl from 'utils/intl';
import { statusRender, resultRender } from '@/utils/renderer';
import styles from './index.less';

const preCode = 'lmes.inspectionDoc';
const tableRef = React.createRef();

export default function LineList({
  showLineLoading,
  lineDataSource,
  lineTableHeight,
  lineTotalElements,
  lineSize,
  lineCurrentPage,
  detailsDataSource,
  detailsTableHeight,
  detailsTotalElements,
  detailsSize,
  detailsCurrentPage,
  expDataSource,
  expTableHeight,
  expTotalElements,
  expSize,
  expCurrentPage,
  handleLinePageChange,
  handleDetailsPageChange,
  handleExpPageChange,
  handleTabChange,
}) {
  /**
   *显示超链接
   * @returns
   */
  function pictureRenderer(value) {
    const pictures = [];
    if (value) {
      value.split('#').forEach((item) => {
        pictures.push({
          url: item,
          uid: uuidv4(),
          name: item.split('@')[1],
          status: 'done',
        });
      });
    }
    return pictures.length > 0 ? (
      <a
        onClick={() => {
          Modal.open({
            key: 'lmes-inspection-doc-pic-modal',
            title: intl.get(`${preCode}.view.title.lookpicture`).d('查看图片'),
            className: styles['lmes-inspection-doc-pic-modal'],
            children: (
              <div className={styles.wrapper}>
                <div className={styles['img-list']}>
                  <Upload
                    disabled
                    listType="picture-card"
                    onPreview={(file) => {
                      if (!file.url) return;
                      window.open(file.url);
                    }}
                    fileList={pictures}
                  />
                </div>
              </div>
            ),
            footer: null,
            movable: true,
            closable: true,
          });
        }}
      >
        查看图片
      </a>
    ) : (
      ''
    );
  }

  /**
   * 行tab数组
   *
   * @returns
   */
  function lineTabsArr() {
    return [
      {
        code: 'sample',
        title: intl.get(`${preCode}.view.title.sample`).d('样本'),
        component: (
          <>
            <PerformanceTable
              virtualized
              data={lineDataSource}
              ref={tableRef}
              columns={sampleColumns}
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
          </>
        ),
      },
      {
        code: 'detail',
        title: intl.get(`${preCode}.view.title.detail`).d('明细'),
        component: (
          <>
            <PerformanceTable
              virtualized
              data={detailsDataSource}
              ref={tableRef}
              columns={detailColumns}
              height={detailsTableHeight}
              loading={showLineLoading}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={detailsTotalElements}
              onChange={handleDetailsPageChange}
              pageSize={detailsSize}
              page={detailsCurrentPage}
            />
          </>
        ),
      },
      {
        code: 'exception',
        title: intl.get(`${preCode}.view.title.abnormal`).d('异常'),
        component: (
          <>
            <PerformanceTable
              virtualized
              data={expDataSource}
              ref={tableRef}
              columns={exceptionColumns}
              height={expTableHeight}
              loading={showLineLoading}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={expTotalElements}
              onChange={handleExpPageChange}
              pageSize={expSize}
              page={expCurrentPage}
            />
          </>
        ),
      },
    ];
  }

  const sampleColumns = [
    {
      title: intl.get(`${preCode}.sampleNumber`).d('样本编码'),
      resizable: true,
      dataIndex: 'sampleNumber',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.qcResult`).d('判定结果'),
      resizable: true,
      dataIndex: 'qcResultMeaning',
      width: 100,
      fixed: true,
      render: ({ rowData }) => resultRender(rowData.qcResult, rowData.qcResultMeaning),
    },
    {
      title: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
      resizable: true,
      dataIndex: 'inspectionItem',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.inspectionItemAlias`).d('检验项目简称'),
      resizable: true,
      dataIndex: 'inspectionItemAlias',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inspectionItemDescription`).d('检验项目描述'),
      resizable: true,
      dataIndex: 'inspectionItemDescription',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.resultTypeMeaning`).d('结果类型'),
      resizable: true,
      dataIndex: 'resultTypeMeaning',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inspectionResource`).d('检验设备'),
      resizable: true,
      dataIndex: 'inspectionResource',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.qcValue`).d('检验值'),
      resizable: true,
      dataIndex: 'qcValue',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.ucl`).d('默认上限'),
      resizable: true,
      dataIndex: 'ucl',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.uclAccept`).d('包含默认上限值'),
      resizable: true,
      dataIndex: 'uclAccept',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.lcl`).d('默认下限'),
      resizable: true,
      dataIndex: 'lcl',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.lclAccept`).d('包含默认下限值'),
      resizable: true,
      dataIndex: 'lclAccept',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.referenceValue`).d('参考值'),
      resizable: true,
      dataIndex: 'referenceValue',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.valueUomName`).d('单位'),
      resizable: true,
      dataIndex: 'valueUomName',
      width: 70,
    },
    {
      title: intl.get(`${preCode}.standardTypeMeaning`).d('标准类型'),
      resizable: true,
      dataIndex: 'standardTypeMeaning',
      width: 84,
    },
    {
      title: intl.get(`${preCode}.standardValue`).d('标准值'),
      resizable: true,
      dataIndex: 'standardValue',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      resizable: true,
      dataIndex: 'qcOkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      resizable: true,
      dataIndex: 'qcNgQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.inspector`).d('判定员'),
      resizable: true,
      dataIndex: 'inspectorName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.lastInspectedDate`).d('最后检验时间'),
      resizable: true,
      dataIndex: 'lastInspectedDate',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.reinspectionValue`).d('复检值'),
      resizable: true,
      dataIndex: 'reinspectionValue',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
      resizable: true,
      dataIndex: 'reinspectionResultMeaning',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.reinspector`).d('复检员'),
      resizable: true,
      dataIndex: 'reinspectorName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
      resizable: true,
      dataIndex: 'lastRejudgeDate',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.necessaryFlag`).d('是否必输'),
      resizable: true,
      dataIndex: 'necessaryFlag',
      width: 70,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.orderByCode`).d('排序编码'),
      resizable: true,
      dataIndex: 'orderByCode',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.inspectionSection`).d('检验项目分段'),
      resizable: true,
      dataIndex: 'inspectionSection',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.sectionOrderCode`).d('分段排序'),
      resizable: true,
      dataIndex: 'sectionOrderCode',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.relatedGroup`).d('检验项关联组'),
      resizable: true,
      dataIndex: 'relatedGroup',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
      resizable: true,
      dataIndex: 'referenceDocument',
      width: 200,
      render: ({ rowData }) => linkRenderer(rowData.referenceDocument),
    },
    {
      title: intl.get(`${preCode}.instruction`).d('操作说明'),
      resizable: true,
      dataIndex: 'instruction',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.drawingCode`).d('图纸编码'),
      resizable: true,
      dataIndex: 'drawingCode',
      width: 128,
      render: ({ rowData }) => linkRenderer(rowData.drawingCode),
    },
    {
      title: intl.get(`${preCode}.picture`).d('图片'),
      resizable: true,
      dataIndex: 'pictures',
      width: 200,
      render: ({ rowData }) => pictureRenderer(rowData.pictures),
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      resizable: true,
      dataIndex: 'lineRemark',
      width: 200,
    },
  ];

  const detailColumns = [
    {
      title: intl.get(`${preCode}.tagCode`).d('标签'),
      resizable: true,
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('批次'),
      resizable: true,
      dataIndex: 'lotNumber',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.qcStatus`).d('状态'),
      resizable: true,
      dataIndex: 'qcStatusMeaning',
      width: 82,
      render: ({ rowData }) => statusRender(rowData.qcStatus, rowData.qcStatusMeaning),
    },
    {
      title: intl.get(`${preCode}.qcResult`).d('判定结果'),
      resizable: true,
      dataIndex: 'qcResultMeaning',
      width: 100,
      render: ({ rowData }) => resultRender(rowData.qcResult, rowData.qcResultMeaning),
    },
    {
      title: intl.get(`${preCode}.batchQty`).d('报检数量'),
      resizable: true,
      dataIndex: 'batchQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.secondBatchQty`).d('辅单位数量'),
      resizable: true,
      dataIndex: 'secondBatchQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
      resizable: true,
      dataIndex: 'qcOkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
      resizable: true,
      dataIndex: 'qcNgQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcSecondOkQty`).d('辅单位合格'),
      resizable: true,
      dataIndex: 'qcSecondOkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.qcSecondNgQty`).d('辅单位不合格'),
      resizable: true,
      dataIndex: 'qcSecondNgQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.warehouse`).d('仓库'),
      resizable: true,
      dataIndex: 'warehouseName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.wmArea`).d('货位'),
      resizable: true,
      dataIndex: 'wmAreaName',
      width: 150,
    },
    {
      title: intl.get(`${preCode}.wmUnit`).d('货格'),
      resizable: true,
      dataIndex: 'wmUnitCode',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.startDate`).d('开始时间'),
      resizable: true,
      dataIndex: 'startDate',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.judgedDate`).d('判定时间'),
      resizable: true,
      dataIndex: 'judgedDate',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
      resizable: true,
      dataIndex: 'qcNgReasonName',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
      resizable: true,
      dataIndex: 'reinspectionResultMeaning',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.reinspector`).d('复检员'),
      resizable: true,
      dataIndex: 'reinspectorName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
      resizable: true,
      dataIndex: 'rejudgeDate',
      width: 136,
    },
    {
      title: intl.get(`${preCode}.processResultMeaning`).d('处理结果'),
      resizable: true,
      dataIndex: 'processResultMeaning',
      width: 100,
    },
    {
      title: intl.get(`${preCode}.processorName`).d('处理人'),
      resizable: true,
      dataIndex: 'processorName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.concessionQty`).d('让步接收数量'),
      resizable: true,
      dataIndex: 'concessionQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.returnedQty`).d('退回数量'),
      resizable: true,
      dataIndex: 'returnedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      resizable: true,
      dataIndex: 'reworkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      resizable: true,
      dataIndex: 'scrappedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.processedOkQty`).d('处理合格'),
      resizable: true,
      dataIndex: 'processedOkQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.ngInventoryQty`).d('不合格入库'),
      resizable: true,
      dataIndex: 'ngInventoryQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.processRemark`).d('处理备注'),
      resizable: true,
      dataIndex: 'processRemark',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.processPictures`).d('处理图片'),
      resizable: true,
      dataIndex: 'processLotPictures',
      width: 200,
      render: ({ rowData }) => pictureRenderer(rowData.processLotPictures),
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      resizable: true,
      dataIndex: 'lotRemark',
      width: 200,
    },
  ];

  const exceptionColumns = [
    {
      title: intl.get(`${preCode}.exceptionName`).d('异常'),
      resizable: true,
      dataIndex: 'exceptionName',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${preCode}.exceptionGroupName`).d('异常组'),
      resizable: true,
      dataIndex: 'exceptionGroupName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.exceptionQty`).d('异常数量'),
      resizable: true,
      dataIndex: 'exceptionQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.picture`).d('图片'),
      resizable: true,
      dataIndex: 'exceptionPictures',
      width: 200,
      render: ({ rowData }) => pictureRenderer(rowData.exceptionPictures),
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('批次'),
      resizable: true,
      dataIndex: 'lotNumber',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('标签'),
      resizable: true,
      dataIndex: 'tagCode',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.sampleNumber`).d('样本编码'),
      resizable: true,
      dataIndex: 'sampleNumber',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.inspectionItemName`).d('检验项目名称'),
      resizable: true,
      dataIndex: 'inspectionItemName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.exceptionRemark`).d('判定备注'),
      resizable: true,
      dataIndex: 'exceptionRemark',
      width: 200,
      // flexGrow: true,
    },
  ];

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer(value) {
    return <a>{value}</a>;
  }

  return (
    <Fragment>
      <Tabs defaultActiveKey="sample" onChange={handleTabChange}>
        {lineTabsArr().map((tab) => (
          <Tabs.TabPane
            tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
            key={tab.code}
          >
            {tab.component}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Fragment>
  );
}
