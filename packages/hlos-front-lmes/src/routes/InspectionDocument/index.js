/**
 * @Description: 检验单平台--头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:42:14
 * @LastEditors: leying.yan
 */

import React, { Fragment, useEffect, useState } from 'react';
import {
  Lov,
  Form,
  Button,
  Select,
  DateTimePicker,
  Tabs,
  Modal,
  PerformanceTable,
  Pagination,
  CheckBox,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { isEmpty, isUndefined } from 'lodash';
import { queryLovData } from 'hlos-front/lib/services/api';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryDS, listDS, lineDS, detailDS, exceptionDS } from '@/stores/inspectionDocDS';
import { inspectionDocCancel } from '@/services/inspectionDocService';
import codeConfig from '@/common/codeConfig';
import { statusRender, resultRender } from '@/utils/renderer';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { Button as ButtonPermission } from 'components/Permission';

import LineList from './InspectionDocLine';
import styles from './index.less';

const { common } = codeConfig.code;
const tableRef = React.createRef();

const preCode = 'lmes.inspectionDoc';
const commonCode = 'lmes.common.model';
const organizationId = getCurrentOrganizationId();

const inspectionDocument = () => {
  const [inspectionDocId, setInspectionDocId] = useState(-1);
  const [showFlag, setShowFlag] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [headerTableHeight, setHeaderTableHeight] = useState(80);
  const [showLoading, setShowLoading] = useState(false);
  const [headerTotalElements, setHeaderTotalElements] = useState(0);
  const [headerSize, setHeaderSize] = useState(100);
  const [headerCurPage, setHeaderCurPage] = useState(1);
  const [checkValues, setCheckValues] = useState([]);
  const [checkRecords, setCheckRecords] = useState([]);
  const [showLineLoading, setShowLineLoading] = useState(false);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [lineSize, setLineSize] = useState(100);
  const [lineCurrentPage, setLineCurrentPage] = useState(1);
  const [detailsDataSource, setDetailsDataSource] = useState([]);
  const [detailsTableHeight, setDetailsTableHeight] = useState(80);
  const [detailsTotalElements, setDetailsTotalElements] = useState(0);
  const [detailsSize, setDetailsSize] = useState(100);
  const [detailsCurrentPage, setDetailsCurrentPage] = useState(1);
  const [expDataSource, setExpDataSource] = useState([]);
  const [expTableHeight, setExpTableHeight] = useState(80);
  const [expTotalElements, setExpTotalElements] = useState(0);
  const [expSize, setExpSize] = useState(100);
  const [expCurrentPage, setExpCurrentPage] = useState(1);
  const [curRowData, setCurRowData] = useState({});

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    queryDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res) && !isEmpty(res.content)) {
        queryDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
    defaultLovSetting();
  }, [queryDS]);

  /**
   *头tab数组
   * @returns
   */
  function headTabsArr() {
    return [
      {
        code: 'main',
        title: intl.get(`${preCode}.view.title.main`).d('主要'),
        component: (
          <>
            <PerformanceTable
              virtualized
              rowKey="inspectionDocId"
              data={headerData}
              ref={tableRef}
              columns={mainColumns()}
              height={headerTableHeight}
              loading={showLoading}
              onRowClick={handleRowChange}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={headerTotalElements}
              onChange={handlePageChange}
              pageSize={headerSize}
              page={headerCurPage}
            />
          </>
        ),
      },
      {
        code: 'judge',
        title: intl.get(`${preCode}.view.title.judge`).d('判定'),
        component: (
          <>
            <PerformanceTable
              virtualized
              rowKey="inspectionDocId"
              data={headerData}
              ref={tableRef}
              columns={judgeColumns()}
              height={headerTableHeight}
              loading={showLoading}
              onRowClick={handleRowChange}
            />
            <Pagination
              pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
              total={headerTotalElements}
              onChange={handlePageChange}
              pageSize={headerSize}
              page={headerCurPage}
            />
          </>
        ),
      },
    ];
  }

  /**
   * 主要页签列
   * @returns
   */
  function mainColumns() {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={headerData.length && checkValues.length === headerData.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'inspectionDocId',
        key: 'inspectionDocId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        resizable: true,
        dataIndex: 'organization',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
        resizable: true,
        dataIndex: 'inspectionDocNum',
        width: 144,
        render: ({ rowData }) => linkRenderer(rowData.inspectionDocNum),
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
        resizable: true,
        dataIndex: 'inspectionTemplateTypeMeaning',
        width: 128,
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
        title: intl.get(`${commonCode}.物料`).d('物料'),
        resizable: true,
        dataIndex: 'itemCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.operationName`).d('工序'),
        resizable: true,
        dataIndex: 'operationName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.samplingTypeMeaning`).d('抽样类型'),
        resizable: true,
        dataIndex: 'samplingTypeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.inspectionDocGroup`).d('检验单组'),
        resizable: true,
        dataIndex: 'inspectionDocGroup',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.inspectionGroup`).d('检验项目组'),
        resizable: true,
        dataIndex: 'inspectionGroupName',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.batchQty`).d('报检数量'),
        resizable: true,
        dataIndex: 'batchQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.secondBatchQty`).d('辅助单位数量'),
        resizable: true,
        dataIndex: 'secondBatchQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.sampleQty`).d('样品数量'),
        resizable: true,
        dataIndex: 'sampleQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.sourceDocClassMeaning`).d('来源单据大类'),
        resizable: true,
        dataIndex: 'sourceDocClassMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.sourceDocTypeName`).d('来源单据类型'),
        resizable: true,
        dataIndex: 'sourceDocTypeName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        resizable: true,
        dataIndex: 'sourceDocNum',
        width: 144,
      },
      {
        title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        resizable: true,
        dataIndex: 'sourceDocLineNum',
        width: 144,
      },
      {
        title: intl.get(`${preCode}.relatedDocTypeName`).d('关联单据类型'),
        resizable: true,
        dataIndex: 'relatedDocTypeName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.relatedDocNumAndLineNum`).d('关联单据号'),
        resizable: true,
        dataIndex: 'relatedDocNumAndLineNum',
        width: 144,
      },
      {
        title: intl.get(`${commonCode}.party`).d('商业实体'),
        resizable: true,
        dataIndex: 'party',
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.itemControlType`).d('物料控制类型'),
        resizable: true,
        dataIndex: 'itemControlTypeMeaning',
        width: 70,
      },
      {
        title: intl.get(`${commonCode}.party`).d('标签号'),
        resizable: true,
        dataIndex: 'tagCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.party`).d('批次号'),
        resizable: true,
        dataIndex: 'lotNumber',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.resource`).d('资源'),
        resizable: true,
        dataIndex: 'resource',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.relatedResource`).d('关联资源'),
        resizable: true,
        dataIndex: 'relatedResource',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.prodLineName`).d('生产线'),
        resizable: true,
        dataIndex: 'prodLineName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.workcellName`).d('工位'),
        resizable: true,
        dataIndex: 'workcellName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.equipmentName`).d('设备'),
        resizable: true,
        dataIndex: 'equipmentName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.locationName`).d('位置'),
        resizable: true,
        dataIndex: 'locationName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.workerName`).d('员工'),
        resizable: true,
        dataIndex: 'workerName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.party`).d('班组'),
        resizable: true,
        dataIndex: 'workGroupName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.supervisor`).d('管理员工'),
        resizable: true,
        dataIndex: 'supervisorName',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.calendarDay`).d('工作日期'),
        resizable: true,
        dataIndex: 'calendarDay',
        width: 100,
      },
      {
        title: intl.get(`${commonCode}.calendarShiftCodeMeaning`).d('班次'),
        resizable: true,
        dataIndex: 'calendarShiftCodeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.firstInspectionFlag`).d('首次检验'),
        resizable: true,
        dataIndex: 'firstInspectionFlag',
        width: 70,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${commonCode}.inspectionDegreeMeaning`).d('校验等级'),
        resizable: true,
        dataIndex: 'inspectionDegreeMeaning',
        width: 70,
      },
      {
        title: intl.get(`${commonCode}.priority`).d('优先级'),
        resizable: true,
        dataIndex: 'priority',
        width: 82,
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
        dataIndex: 'remark',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.docProcessRuleName`).d('处理规则'),
        resizable: true,
        dataIndex: 'docProcessRuleName',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.autoFeedbackResult`).d('是否反馈'),
        resizable: true,
        dataIndex: 'autoFeedbackResult',
        width: 70,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${preCode}.feedbackFlag`).d('反馈标识'),
        resizable: true,
        dataIndex: 'feedbackFlag',
        width: 70,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${preCode}.samplingStandardMeaning`).d('抽样标准'),
        resizable: true,
        dataIndex: 'samplingStandardMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.sampleJudgeModeMeaning`).d('样品判定模式'),
        resizable: true,
        dataIndex: 'sampleJudgeModeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.autoJudgeFlag`).d('是否自动判定'),
        resizable: true,
        dataIndex: 'autoJudgeFlag',
        width: 100,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${preCode}.aqlAcceptQty`).d('AQL接受数量'),
        resizable: true,
        dataIndex: 'aqlAcceptQty',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.aqlRejectQty`).d('AQL拒绝数量'),
        resizable: true,
        dataIndex: 'aqlRejectQty',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
        resizable: true,
        dataIndex: 'referenceDocument',
        width: 200,
        render: ({ rowData }) => pictureRenderer(rowData.referenceDocument),
      },
      {
        title: intl.get(`${preCode}.instruction`).d('操作说明'),
        resizable: true,
        dataIndex: 'instruction',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.drawingCode`).d('图纸'),
        resizable: true,
        dataIndex: 'drawingCode',
        width: 200,
        render: ({ rowData }) => pictureRenderer(rowData.drawingCode),
      },
      {
        title: intl.get(`${preCode}.traceNum`).d('跟踪号'),
        resizable: true,
        dataIndex: 'traceNum',
        width: 128,
      },
    ];
  }

  /**
   * 判定页签列
   * @returns
   */
  function judgeColumns() {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={headerData.length && checkValues.length === headerData.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'inspectionDocId',
        key: 'inspectionDocId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        resizable: true,
        dataIndex: 'organization',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
        resizable: true,
        dataIndex: 'inspectionDocNum',
        width: 128,
        render: ({ rowData }) => linkRenderer(rowData.inspectionDocNum),
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
        resizable: true,
        dataIndex: 'inspectionTemplateTypeMeaning',
        width: 128,
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
        title: intl.get(`${commonCode}.物料`).d('物料'),
        resizable: true,
        dataIndex: 'itemCode',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        resizable: true,
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.operationName`).d('工序'),
        resizable: true,
        dataIndex: 'operationName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.samplingTypeMeaning`).d('抽样类型'),
        resizable: true,
        dataIndex: 'samplingTypeMeaning',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.inspectionDocGroup`).d('检验单组'),
        resizable: true,
        dataIndex: 'inspectionDocGroup',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.inspectionGroup`).d('检验项目组'),
        resizable: true,
        dataIndex: 'inspectionGroupName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.batchQty`).d('报检数量'),
        resizable: true,
        dataIndex: 'batchQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.secondBatchQty`).d('辅助单位数量'),
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
        title: intl.get(`${preCode}.sampleQty`).d('抽样数量'),
        resizable: true,
        dataIndex: 'sampleQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.sampleOkQty`).d('抽样合格'),
        resizable: true,
        dataIndex: 'sampleOkQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.sampleNgQty`).d('抽样不合格'),
        resizable: true,
        dataIndex: 'sampleNgQty',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.declarer`).d('报检员'),
        resizable: true,
        dataIndex: 'declarerName',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.createDate`).d('报检时间'),
        resizable: true,
        dataIndex: 'creationDate',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.inspector`).d('判定员'),
        resizable: true,
        dataIndex: 'inspectorName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.qcRemark`).d('判定备注'),
        resizable: true,
        dataIndex: 'qcRemark',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.reinspector`).d('复检员'),
        resizable: true,
        dataIndex: 'reinspectorName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.reinspectionResultMeaning`).d('复检结果'),
        resizable: true,
        dataIndex: 'reinspectionResultMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.rejudgeDate`).d('复检时间'),
        resizable: true,
        dataIndex: 'rejudgeDate',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.ngProcessedFlag`).d('不合格品处理'),
        resizable: true,
        dataIndex: 'ngProcessedFlag',
        width: 70,
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${preCode}.processDocNumAndLineNum`).d('处理单号'),
        resizable: true,
        dataIndex: 'processDocNumAndLineNum',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.processedDate`).d('处理完成时间'),
        resizable: true,
        dataIndex: 'processedDate',
        width: 136,
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
        title: intl.get(`${preCode}.returnedQty`).d('退货数量'),
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
        title: intl.get(`${preCode}.processResultMeaning`).d('处理结果'),
        resizable: true,
        dataIndex: 'processResultMeaning',
        width: 100,
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
        dataIndex: 'processPictures',
        width: 200,
        render: ({ rowData }) => pictureRenderer(rowData.processPictures),
      },
      {
        title: intl.get(`${preCode}.planStartTime`).d('计划开始'),
        resizable: true,
        dataIndex: 'planStartTime',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.planEndTime`).d('计划结束'),
        resizable: true,
        dataIndex: 'planEndTime',
        width: 136,
      },
      {
        title: intl.get(`${preCode}.standardInspectTime`).d('标准时长'),
        resizable: true,
        dataIndex: 'standardInspectTime',
        width: 82,
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
        title: intl.get(`${preCode}.inspectedTime`).d('实际时长'),
        resizable: true,
        dataIndex: 'inspectedTime',
        width: 82,
      },
    ];
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(headerData.map((i) => i.inspectionDocId));
      setCheckRecords(headerData.map((i) => i));
    } else {
      setCheckValues([]);
      setCheckRecords([]);
    }
  }

  function checkCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.inspectionDocId}
        checked={checkValues.indexOf(rowData.inspectionDocId) !== -1}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  }

  function handleCheckBoxChange(rowData) {
    const _checkValues = checkValues.slice();
    const _checkRecords = checkRecords.slice();
    if (_checkValues.indexOf(rowData.inspectionDocId) === -1) {
      _checkValues.push(rowData.inspectionDocId);
      _checkRecords.push(rowData);
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.inspectionDocId), 1);
      _checkRecords.splice(
        _checkRecords.findIndex((v) => v.inspectionDocId === rowData.inspectionDocId),
        1
      );
    }
    setCheckValues(_checkValues);
    setCheckRecords(_checkRecords);
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer(value) {
    return <a>{value}</a>;
  }

  /**
   *图片显示超链接
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
    if (pictures.length > 1) {
      return (
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
      );
    } else if (pictures.length === 1) {
      return (
        <a
          onClick={() => {
            window.open(pictures[0].url);
          }}
        >
          {pictures[0].name}
        </a>
      );
    } else {
      return '';
    }
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache onChange={handleOrgChange} key="organizationObj" />,
      <Lov name="inspectionDocObj" noCache key="inspectionDocObj" />,
      <Select name="inspectionTemplateType" key="inspectionTemplateType" />,
      <Select name="qcStatus" key="qcStatus" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="resourceObj" noCache key="resourceObj" />,
      <Lov name="partyObj" noCache key="partyObj" />,
      <Lov name="relatedDocumentObj" noCache key="relatedDocumentObj" />,
      <Lov name="operationObj" noCache key="operationObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Select name="qcResult" key="qcResult" />,
      <Select name="samplingType" key="samplingType" />,
      <Lov name="declarerObj" noCache key="declarerObj" />,
      <Lov name="inspectorObj" noCache key="inspectorObj" />,
      <DateTimePicker name="createDateMin" key="createDateMin" />,
      <DateTimePicker name="createDateMax" key="createDateMax" />,
      <DateTimePicker name="judgedDateMin" key="judgedDateMin" />,
      <DateTimePicker name="judgedDateMax" key="judgedDateMax" />,
    ];
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength <= 3) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }
  function calcDetailsTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setDetailsTableHeight(80);
    } else if (dataLength <= 3) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setDetailsTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setDetailsTableHeight(maxTableHeight);
    }
  }
  function calcExpTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setExpTableHeight(80);
    } else if (dataLength <= 3) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setExpTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setExpTableHeight(maxTableHeight);
    }
  }

  // 样本行页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== lineSize) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleSearchSample(pageValue, pageSizeValue, curRowData);
  }

  // 明细行页码更改
  function handleDetailsPageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== detailsSize) {
      pageValue = 1;
    }
    setDetailsCurrentPage(pageValue);
    setDetailsSize(pageSizeValue);
    handleSearchDetails(pageValue, pageSizeValue, curRowData);
  }

  // 异常行页码更改
  function handleExpPageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== expSize) {
      pageValue = 1;
    }
    setExpCurrentPage(pageValue);
    setExpSize(pageSizeValue);
    handleSearchExp(pageValue, pageSizeValue, curRowData);
  }

  async function handleSearchSample(page, size, rowData) {
    setShowLineLoading(true);
    lineDS.queryParameter = {
      inspectionDocId: rowData.inspectionDocId,
      page: page - 1,
      size,
    };
    const res = await lineDS.query();
    if (getResponse(res) && res.content) {
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(headerData.length);
    }
    setShowLineLoading(false);
  }

  async function handleSearchDetails(page, size, rowData) {
    setShowLineLoading(true);
    detailDS.queryParameter = {
      inspectionDocId: rowData.inspectionDocId,
      page: page - 1,
      size,
    };
    const res = await detailDS.query();
    if (getResponse(res) && res.content) {
      setDetailsDataSource(res.content);
      setDetailsTotalElements(res.totalElements || 0);
      calcDetailsTableHeight(res.content.length);
      calcTableHeight(headerData.length);
    }
    setShowLineLoading(false);
  }

  async function handleSearchExp(page, size, rowData) {
    setShowLineLoading(true);
    exceptionDS.queryParameter = {
      inspectionDocId: rowData.inspectionDocId,
      page: page - 1,
      size,
    };
    const res = await exceptionDS.query();
    if (getResponse(res) && res.content) {
      setExpDataSource(res.content);
      setExpTotalElements(res.totalElements || 0);
      calcExpTableHeight(res.content.length);
      calcTableHeight(headerData.length);
    }
    setShowLineLoading(false);
  }

  /**
   *通过点击来查行,并且在此设置行颜色。
   * @param {*} { record }
   * @returns
   */
  async function handleRowChange(rowData) {
    setCurRowData(rowData);
    setInspectionDocId(rowData.inspectionDocId);
    handleSearchSample(lineCurrentPage, lineSize, rowData);
    handleSearchDetails(detailsCurrentPage, detailsSize, rowData);
    handleSearchExp(expCurrentPage, expSize, rowData);
  }

  async function handleTabChange(value) {
    if (value === 'sample') {
      await calcLineTableHeight(lineDataSource.length);
    } else if (value === 'detail') {
      await calcDetailsTableHeight(detailsDataSource.length);
    } else if (value === 'exception') {
      await calcExpTableHeight(expDataSource.length);
    }
    calcTableHeight(headerData.length);
  }

  async function handleQuery() {
    setHeaderCurPage(1);
    setInspectionDocId(-1);
    handleSearch();
  }

  /**
   * 查询
   */
  async function handleSearch(page = headerCurPage, pageSize = headerSize) {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    listDS.queryParameter = {
      ...queryDS.current.toJSONData(),
      page: page - 1,
      size: pageSize,
    };
    setShowLoading(true);
    const res = await listDS.query();
    if (getResponse(res) && res.content) {
      setHeaderData(res.content);
      setHeaderTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
      setCheckRecords([]);
    }
    setInspectionDocId(-1);
    setShowLoading(false);
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lmes-inspectionDoc-content'])[0];
    const queryContainer = document.getElementsByClassName(styles['lmes-inspectionDoc-query'])[0];
    const lineContent = document.getElementsByClassName(styles['lmes-inspectionDoc-line'])[0];
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      (lineContent?.offsetHeight ?? 0) -
      75 -
      52;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setHeaderTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setHeaderTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setHeaderTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
    queryDS.current.set('qcStatus', []);
  }

  /**
   * 切换显示隐藏
   */
  async function handleToggle() {
    await setShowFlag(!showFlag);
    calcTableHeight(headerData.length);
  }

  /**
   * 分页变化
   */
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== headerSize) {
      pageValue = 1;
    }
    setHeaderCurPage(pageValue);
    setHeaderSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  }

  function handleOrgChange(record = {}, oldRecord = {}) {
    if (record && oldRecord && record.organizationId !== oldRecord.organizationId) {
      queryDS.current.set('inspectionDocObj', null);
    }
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
      qcStatusList: fieldsValue?.qcStatus?.join(),
      inspectionTemplateTypeList: fieldsValue?.inspectionTemplateType?.join(),
    };
  }

  async function handleCancel() {
    if (checkRecords.length) {
      Modal.confirm({
        title: intl.get(`${preCode}.msg.isCancel`).d('是否取消'),
        content: '',
        async onOk() {
          const resp = await inspectionDocCancel(checkRecords);
          if (getResponse(resp)) {
            notification.success({
              message: '取消成功',
            });
            handleQuery();
          }
        },
        onCancel() {},
      });
    } else {
      notification.warning({
        message: '请至少选择一条数据',
      });
    }
  }

  const lineProps = {
    lineDataSource,
    lineTableHeight,
    showLineLoading,
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
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.inspectionDoc`).d('检验单平台')}>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/inspection-docs/excel`}
          queryParams={getExportQueryParams}
        />
        <ButtonPermission
          onClick={handleCancel}
          permissionList={[
            {
              code: 'hlos.lmes.inspection.document.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
      </Header>
      <Content className={styles['lmes-inspectionDoc-content']}>
        <div className={styles['lmes-inspectionDoc-query']}>
          <Form dataSet={queryDS} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleQuery()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="main">
          {headTabsArr().map((tab) => (
            <Tabs.TabPane
              tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
              key={tab.code}
            >
              {tab.component}
            </Tabs.TabPane>
          ))}
        </Tabs>
        <div className={styles['lmes-inspectionDoc-line']}>
          {inspectionDocId !== -1 && <LineList {...lineProps} />}
        </div>
      </Content>
    </Fragment>
  );
};
export default inspectionDocument;
