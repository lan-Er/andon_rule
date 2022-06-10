/**
 * @Description: 非生产任务--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-22 10:05:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState, createRef } from 'react';
import {
  Button,
  PerformanceTable,
  DataSet,
  Modal,
  Form,
  Pagination,
  Icon,
  DateTimePicker,
  Lov,
  Select,
  CheckBox,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import { userSetting } from 'hlos-front/lib/services/api';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { ListDS } from '@/stores/nonProductionTaskDS';
import { releaseTask, cancelTask, closeTask } from '@/services/taskService';

import styles from './index.less';

const preCode = 'lmes.nonProductionTask';
const tpmCode = 'lmes.tpmTask';
const tId = getCurrentOrganizationId();
const tableRef = createRef();

const listFactory = () => new DataSet(ListDS());

const NonProductionTask = ({ history, dispatch, taskList, paginations }) => {
  const listDS = useDataSet(listFactory, NonProductionTask);

  const [dataSource, setDataSource] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [showFlag, setShowFlag] = useState(false);
  const [checkValues, setCheckValues] = useState([]);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId, organizationCode, organizationName } = res.content[0];
        listDS.queryDataSet.current.set('organizationObj', {
          organizationId,
          organizationCode,
          organizationName,
        });
      }
    }
    queryUserSetting();
  }, []);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('nonProductionTaskQuery') || false;
    if (myQuery) {
      listDS.query().then((res) => {
        sessionStorage.removeItem('nonProductionTaskQuery');
        if (res && res.content) {
          setDataSource(res.content);
          setTotalElements(res.totalElements || 0);
          calcTableHeight(res.content.length);
        }
      });
    } else {
      setDataSource(taskList);
      setTotalElements(paginations.totalElements || 0);
      setCurrentPage(paginations.currentPage || 1);
      setSize(paginations.size || 100);
      setTableHeight(paginations.tableHeight || 80);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  useDataSetEvent(listDS.queryDataSet, 'update', ({ record, name }) => {
    if (name === 'organizationObj') {
      record.set('taskObj', null);
      record.set('workerGroupObj', null);
      record.set('workerObj', null);
      record.set('prodLineObj', null);
      record.set('workcellObj', null);
    }
  });

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'taskId',
      key: 'taskId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.org`).d('组织'),
      dataIndex: 'organization',
      key: 'organization',
      width: 128,
      fixed: true,
      resizable: true,
      render: ({ rowData }) =>
        `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`,
    },
    {
      title: intl.get(`${preCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      key: 'taskNum',
      width: 128,
      fixed: true,
      resizable: true,
      render: ({ rowData }) => numRender(rowData),
    },
    {
      title: intl.get(`${preCode}.taskType`).d('任务类型'),
      dataIndex: 'taskTypeName',
      key: 'taskTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.taskStatus`).d('任务状态'),
      dataIndex: 'taskStatusMeaning',
      key: 'taskStatusMeaning',
      width: 84,
      resizable: true,
      render: ({ rowData, dataIndex }) => statusRender(rowData.taskStatus, rowData[dataIndex]),
    },
    {
      title: intl.get(`${preCode}.desc`).d('描述'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.workerGroup`).d('班组'),
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
      title: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      dataIndex: 'standardWorkTime',
      key: 'standardWorkTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('实际工时'),
      dataIndex: 'processedTime',
      key: 'processedTime',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.startTime`).d('开始时间'),
      dataIndex: 'actualStartTime',
      key: 'actualStartTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.endTime`).d('结束时间'),
      dataIndex: 'actualEndTime',
      key: 'actualEndTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      dataIndex: 'planStartTime',
      key: 'planStartTime',
      width: 136,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 136,
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
      title: intl.get(`${preCode}.calendarShiftCode`).d('指定班次'),
      dataIndex: 'calendarShiftCodeMeaning',
      key: 'calendarShiftCodeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.prodLine`).d('生产线'),
      dataIndex: 'prodLineName',
      key: 'prodLineName',
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
      title: intl.get(`${preCode}.location`).d('地点'),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
      dataIndex: 'outsideLocation',
      key: 'outsideLocation',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.supervisor`).d('管理员工'),
      dataIndex: 'supervisorName',
      key: 'supervisorName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.picture`).d('图片'),
      dataIndex: 'pictureIds',
      key: 'pictureIds',
      width: 200,
      render: ({ rowData, dataIndex }) => referenceRender(rowData, dataIndex),
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
      title: intl.get(`${preCode}.executeRule`).d('执行规则'),
      dataIndex: 'executeRuleName',
      key: 'executeRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
      dataIndex: 'dispatchRuleName',
      key: 'dispatchRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      dataIndex: 'docProcessRule',
      key: 'docProcessRule',
      width: 128,
      render: ({ rowData, dataIndex }) => ruleRender(rowData, dataIndex),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.referenceDocument`).d('参考文件'),
      dataIndex: 'referenceDocument',
      key: 'referenceDocument',
      width: 200,
      render: ({ rowData, dataIndex }) => referenceRender(rowData, dataIndex),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.instruction`).d('操作说明'),
      dataIndex: 'instruction',
      key: 'instruction',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      key: 'printedFlag',
      width: 82,
      align: 'center',
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
  ];

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.taskId}
        onClick={(e) => {
          e.stopPropagation();
        }}
        checked={checkValues.findIndex((i) => i.taskId === rowData.taskId) !== -1}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.taskId === rowData.taskId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  function numRender(record) {
    return (
      <a onClick={() => handleToOtherPage(`/lmes/non-production-task/detail/${record.taskId}`)}>
        {record.taskNum}
      </a>
    );
  }

  function ruleRender(record, dataIndex) {
    return <a onClick={() => handleRule(record.docProcessRuleId)}>{record[dataIndex]}</a>;
  }

  function referenceRender(record, dataIndex) {
    return (
      <a href={record[dataIndex]} target="_blank" rel="noopener noreferrer">
        {record[dataIndex]}
      </a>
    );
  }

  function handleRule(id) {
    history.push({
      pathname: `/lmds/rule/detail/${id}`,
    });
  }

  function handleToOtherPage(url) {
    dispatch({
      type: 'npTask/updateState',
      payload: {
        taskList: dataSource,
        paginations: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
      },
    });
    history.push(url);
  }

  /**
   *下达
   */
  function handleRelease() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.taskStatus === 'NEW')) {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.submitLimit`)
          .d('只有新增状态的任务才允许下达！'),
      });
      return;
    }
    const ids = checkValues.map((item) => item.taskId);
    releaseTask(ids).then((res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: '下达成功',
        });
        handleSearch(0, size, true);
      }
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) =>
          item.taskStatus !== 'CANCELLED' &&
          item.taskStatus !== 'CLOSED' &&
          item.taskStatus !== 'COMPLETED'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.cancelTask`).d('是否取消任务？')}</p>,
        onOk: () =>
          cancelTask(ids).then((res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: '取消成功',
              });
              handleSearch(0, size, true);
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.cancelLimit`)
          .d('已完成、已关闭、已取消状态的任务不允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    const ids = checkValues.map((item) => item.taskId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) =>
          (item.taskStatus !== 'CANCELLED' && item.taskStatus !== 'CLOSED') ||
          item.taskStatus !== 'NEW'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.closeTask`).d('是否关闭任务？')}</p>,
        onOk: () =>
          closeTask(ids).then((res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: '关闭成功',
              });
              handleSearch(0, size, true);
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.closeLimit`)
          .d('新增、已取消、已关闭状态的任务不允许关闭！'),
      });
    }
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
      taskStatusList: fieldsValue?.taskStatus?.join(),
      taskStatus: undefined,
      taskClass: 'NP_TASK',
    };
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="taskObj" noCache key="taskObj" />,
      <Lov name="taskTypeObj" noCache key="taskTypeObj" />,
      <Select name="taskStatus" key="taskStatus" />,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="workcellObj" noCache key="workcellObj" />,
      <DateTimePicker name="planStartTimeLeft" key="planStartTimeLeft" />,
      <DateTimePicker name="planStartTimeRight" noCache key="planStartTimeRight" />,
      <DateTimePicker name="planEndTimeLeft" noCache key="planEndTimeLeft" />,
      <DateTimePicker name="planEndTimeRight" key="planEndTimeRight" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    listDS.queryParameter = {
      ...listDS.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    if (flag) {
      setCurrentPage(1);
    }
    setListLoading(true);
    setCheckValues([]);
    const res = await listDS.query();
    setListLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lmes-nonProduction-content'])[0];
    const queryContainer = document.getElementById('npTaskHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
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
    handleSearch(pageValue - 1, pageSizeValue);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  return (
    <Fragment key="lmes-non-production-task">
      <Header title={intl.get(`${preCode}.view.title.index`).d('非生产任务')}>
        <Button
          color="primary"
          onClick={() => handleToOtherPage('/lmes/non-production-task/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button onClick={() => handleToOtherPage('/lmes/non-production-task/batch-create')}>
          {intl.get('lmes.common.button.batchCreate').d('批量新建')}
        </Button>
        <Button onClick={handleRelease}>{intl.get('lmes.common.button.release').d('下达')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${tId}/tasks/np-task-query/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className={styles['lmes-nonProduction-content']}>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}
          id="npTaskHeaderQuery"
        >
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.1rem 0',
            }}
          >
            <Button onClick={handleToggle} className={styles['more-btn']}>
              {intl.get('hzero.common.button.more').d('更多')}
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="reservationId"
          data={dataSource}
          ref={tableRef}
          columns={columns}
          height={tableHeight}
          loading={listLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        {/* <Table dataSet={listDS} columns={columns} columnResizable="true" queryFieldsLimit={4} /> */}
      </Content>
    </Fragment>
  );
};

export default connect(({ npTask }) => ({
  taskList: npTask?.taskList || [],
  lineList: npTask?.lineList || [],
  paginations: npTask?.paginations || {},
  linePaginations: npTask?.linePaginations || {},
}))(NonProductionTask);
