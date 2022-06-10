/**
 * @Description: 生产执行明细
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-28 10:27:24
 * @LastEditors: tw
 */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Lov,
  PerformanceTable,
  Pagination,
  Form,
  Button,
  DatePicker,
  DateTimePicker,
  TextField,
  Select,
} from 'choerodon-ui/pro';
import { isUndefined, isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';

import Store from '@/stores/productionExecutionDS';
import { executeLines } from '@/services/productionExecutionService';
import { queryLovData } from 'hlos-front/lib/services/api';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import './index.less';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;

const preCode = 'lmes.productionExecution';
const tableRef = React.createRef();

export default () => {
  const { listDS, location } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  const { state = {} } = location;

  useEffect(() => {
    /**
     *设置默认查询条件
     */
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }

    if (!isEmpty(state)) {
      if (listDS.queryDataSet.current) {
        listDS.queryDataSet.current.set('organizationObj', {
          organizationId: state.organizationId,
          organizationName: state.organizationName,
        });
        listDS.queryDataSet.current.set('taskObj', {
          taskId: state.taskId,
          taskNumber: state.taskNum,
        });
      } else {
        listDS.queryDataSet.create(
          {
            organizationObj: {
              organizationId: state.organizationId,
              organizationName: state.organizationName,
            },
            taskObj: {
              taskId: state.taskId,
              taskNumber: state.taskNum,
            },
          },
          0
        );
      }

      handleSearch();
    } else {
      defaultLovSetting();
    }
  }, [listDS, state]);

  useEffect(() => {
    calcTableHeight(0);
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lmes-production-execution')[0];
    const queryContainer = document.getElementById('productionExecutionHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  function Columns() {
    return [
      { title: '组织', dataIndex: 'organization', width: 128, fixed: true, resizable: true },
      { title: '物料', dataIndex: 'itemCode', width: 128, fixed: true, resizable: true },
      { title: '物料描述', dataIndex: 'itemDescription', width: 200, resizable: true },
      { title: '单位', dataIndex: 'uom', width: 70, resizable: true },
      { title: '单据类型', dataIndex: 'documentType', width: 128, resizable: true },
      { title: 'MO号', dataIndex: 'moNum', width: 144, resizable: true },
      { title: '任务号', dataIndex: 'taskNum', width: 144, resizable: true },
      { title: '工序', dataIndex: 'operation', width: 128, resizable: true },
      { title: '执行类型', dataIndex: 'executeTypeMeaning', width: 128, resizable: true },
      { title: '执行时间', dataIndex: 'executeTime', width: 136, resizable: true },
      { title: '执行数量', dataIndex: 'executeQty', width: 82, resizable: true },
      { title: '待处理数量', dataIndex: 'pendingQty', width: 82, resizable: true },
      { title: '在制数量', dataIndex: 'wipQty', width: 82, resizable: true },
      { title: '返修数量', dataIndex: 'reworkQty', width: 82, resizable: true },
      { title: '报废数量', dataIndex: 'scrappedQty', width: 82, resizable: true },
      { title: '不合格数量', dataIndex: 'executeNgQty', width: 82, resizable: true },
      { title: '来料不合格', dataIndex: 'rawNgQty', width: 82, resizable: true },
      { title: '辅助单位', dataIndex: 'secondUomName', width: 70, resizable: true },
      { title: '辅助执行数量', dataIndex: 'secondExecuteQty', width: 82, resizable: true },
      { title: '实际加工工时', dataIndex: 'processedTime', width: 82, resizable: true },
      { title: '装配件', dataIndex: 'assemblyItemCode', width: 128, resizable: true },
      { title: '装配件描述', dataIndex: 'assemblyItemDesctription', width: 200, resizable: true },
      { title: '装配件标签', dataIndex: 'assemblyTagCode', width: 128, resizable: true },
      { title: '批次号', dataIndex: 'lotNumber', width: 128, resizable: true },
      { title: '标签', dataIndex: 'tagCode', width: 128, resizable: true },
      { title: '项目号', dataIndex: 'projectNum', width: 128, resizable: true },
      { title: 'WBS号', dataIndex: 'wbsNum', width: 128, resizable: true },
      { title: '生产线', dataIndex: 'prodLine', width: 128, resizable: true },
      { title: '设备', dataIndex: 'equipment', width: 128, resizable: true },
      { title: '工位', dataIndex: 'workcell', width: 128, resizable: true },
      { title: '班组', dataIndex: 'workerGroup', width: 128, resizable: true },
      { title: '操作工', dataIndex: 'workerName', width: 128, resizable: true },
      { title: '地点', dataIndex: 'locationName', width: 200, resizable: true },
      { title: '工作日期', dataIndex: 'calendarDay', width: 136, resizable: true },
      { title: '班次', dataIndex: 'calendarShiftCodeMeaning', width: 82, resizable: true },
      { title: '仓库', dataIndex: 'warehouse', width: 128, resizable: true },
      { title: '货位', dataIndex: 'wmArea', width: 128, resizable: true },
      { title: '货格', dataIndex: 'wmUnitCode', width: 128, resizable: true },
      { title: '商业伙伴', dataIndex: 'partyName', width: 200, resizable: true },
      { title: '商业伙伴地点', dataIndex: 'partySite', width: 128, resizable: true },
      { title: '来源单据类型', dataIndex: 'sourceDocType', width: 128, resizable: true },
      { title: '来源单据号', dataIndex: 'sourceDocNum', width: 144, resizable: true },
      { title: '来源单据行号', dataIndex: 'sourceDocLineNum', width: 70, resizable: true },
      {
        title: '确认标识',
        dataIndex: 'confirmedFlag',
        width: 70,
        resizable: true,
        render: yesOrNoRender,
      },
      { title: '数据收集', dataIndex: 'collector', width: 128, resizable: true },
      {
        title: '图片',
        dataIndex: 'pictures',
        width: 128,
        resizable: true,
        render: pictureRenderer,
      },
      { title: '备注', dataIndex: 'remark', width: 200, resizable: true },
      { title: '事件类型', dataIndex: 'eventTypeName', width: 128, resizable: true },
      { title: '事件ID', dataIndex: 'eventId', width: 160, resizable: true },
    ];
  }
  /**
   *显示超链接
   * @returns
   */
  function pictureRenderer({ value }) {
    let pictures = [];
    if (value) {
      pictures = value.split(',');
    }
    return pictures.map((item) => <a href={item}>{item}</a>);
  }

  /**
   *tab查询条件
   * @returns
   */
  function QueryField() {
    return [
      <Lov name="organizationObj" clearButton noCache />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="moNumObj" clearButton noCache />,
      <Lov name="taskObj" clearButton noCache />,
      <Lov name="prodLineObj" clearButton noCache />,
      <Lov name="equipmentObj" clearButton noCache />,
      <Lov name="workcellObj" clearButton noCache />,
      <Select name="executeType" noCache />,
      <Lov name="workerObj" clearButton noCache />,
      <Lov name="workerGroupObj" clearButton noCache />,
      <TextField name="tagCode" />,
      <TextField name="lotNumber" />,
      <TextField name="operation" />,
      <Lov name="assemblyObj" clearButton noCache />,
      <TextField name="assemblyTagCode" />,
      <TextField name="projectNum" />,
      <DatePicker name="calendarDay" />,
      <Select name="calendarShiftCode" noCache />,
      <DateTimePicker name="executeTimeMin" />,
      <DateTimePicker name="executeTimeMax" />,
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    listDS.queryDataSet.current.set('page', page - 1);
    listDS.queryDataSet.current.set('size', pageSize);
    const res = await executeLines(listDS.queryDataSet.current.toJSONData());
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.productionExecutionDetail`).d('生产执行明细')}>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/execute-lines/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className="lmes-production-execution" id="productionExecutionTable">
        <div id="productionExecutionHeaderQuery" className="header-query">
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? QueryField().slice(0, 4) : QueryField()}
          </Form>
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginLeft: 8,
              marginTop: 10,
            }}
          >
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={Columns()}
          height={tableHeight}
          loading={showLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
};
