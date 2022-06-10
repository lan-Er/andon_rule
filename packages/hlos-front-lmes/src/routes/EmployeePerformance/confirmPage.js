/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-08 17:00:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-15 18:00:40
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  // SelectBox,
  Lov,
  DateTimePicker,
  Select,
  Switch,
  Button,
  Form,
  PerformanceTable,
  Pagination,
  CheckBox,
} from 'choerodon-ui/pro';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isUndefined } from 'lodash';
import moment from 'moment';
import notification from 'utils/notification';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';
import {
  // getLatestWorkPrice,
  saveExecuteLinePerformance,
  countSalary,
} from '@/services/employeePerformanceService';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

import { queryLovData } from 'hlos-front/lib/services/api';
import {
  employeeConfirmQueryDS,
  employeeConfirmLineDS,
  // QueryDS,
} from '../../stores/employeePerformanceDS.js';
import Style from './index.less';

const tableRef = React.createRef();
const getOrganizationId = getCurrentOrganizationId();

const calendarShift = [
  {
    title: '班次',
    resizable: true,
    dataIndex: 'calendarShiftCodeMeaning',
    width: 70,
    tooltip: 'overflow',
  },
];

const item = [
  {
    title: '物料',
    resizable: true,
    dataIndex: 'itemCode',
    width: 200,
    tooltip: 'overflow',
    render: ({ rowData }) => `${rowData.itemCode} ${rowData.itemDescription}`,
  },
];

const operationArr = [
  {
    title: '工序',
    resizable: true,
    dataIndex: 'operation',
    width: 128,
    tooltip: 'overflow',
  },
];
const mo = [
  {
    title: 'MO',
    resizable: true,
    dataIndex: 'moNum',
    width: 128,
    tooltip: 'overflow',
  },
];
const prodLine = [
  {
    title: '生产线',
    resizable: true,
    dataIndex: 'prodLine',
    width: 128,
    tooltip: 'overflow',
  },
];
const equipment = [
  {
    title: '设备',
    resizable: true,
    dataIndex: 'equipment',
    width: 128,
    tooltip: 'overflow',
  },
];

const initColumns = [
  {
    title: '组织',
    resizable: true,
    dataIndex: 'organization',
    width: 128,
    tooltip: 'overflow',
    fixed: true,
  },
  {
    title: '员工',
    resizable: true,
    dataIndex: 'workerName',
    width: 128,
    tooltip: 'overflow',
    fixed: true,
  },
  {
    title: '班组',
    resizable: true,
    dataIndex: 'workerGroup',
    width: 128,
    tooltip: 'overflow',
    fixed: true,
  },
  {
    title: '工作日期',
    resizable: true,
    dataIndex: 'calendarDay',
    width: 86,
    tooltip: 'overflow',
    fixed: true,
  },
  {
    title: '合格数量',
    resizable: true,
    dataIndex: 'executeQty',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '单位',
    resizable: true,
    dataIndex: 'uom',
    width: 70,
    tooltip: 'overflow',
  },
  {
    title: '确认数量',
    resizable: true,
    dataIndex: 'confirmedQty',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '确认工时',
    resizable: true,
    dataIndex: 'confirmedTime',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '确认工资',
    resizable: true,
    dataIndex: 'confirmedWage',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '标准工时',
    resizable: true,
    dataIndex: 'taskStandardWorkTime',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '实际工时',
    resizable: true,
    dataIndex: 'processedTime',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '单价',
    resizable: true,
    dataIndex: 'unitPrice',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '不合格数量',
    resizable: true,
    dataIndex: 'executeNgQty',
    width: 90,
    tooltip: 'overflow',
  },
  {
    title: '报废数量',
    resizable: true,
    dataIndex: 'scrappedQty',
    width: 82,
    tooltip: 'overflow',
  },
  {
    title: '返修数量',
    resizable: true,
    dataIndex: 'reworkQty',
    width: 82,
    tooltip: 'overflow',
  },
];
export default class EmployeePerformanceConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTimeType: null,
      showLoading: false,
      currentPage: 1,
      size: 100,
      totalElements: 0,
      dataSource: [],
      tableHeight: 80,
      checkValues: [],
      checkRecords: [],
      updateScrollPosition: false,
      columns: initColumns,
    };
  }

  confirmQueryDS = new DataSet({
    ...employeeConfirmQueryDS(),
  });

  confirmLineDS = new DataSet({
    ...employeeConfirmLineDS(),
    events: {
      load: ({ dataSet }) => {
        const data = this.confirmQueryDS.toData();
        if (data[0] && data[0].savePerformanceType) {
          dataSet.forEach((record) => {
            record.set('savePerformanceType', data[0].savePerformanceType);
          });
        }
      },
      select: ({ record }) => {
        if (record.get('savePerformanceType') === 'QTY') {
          record.set('confirmedQty', record.get('executeQty'));
        } else if (record.get('savePerformanceType') === 'WORK_TIME') {
          record.set('confirmedTime', record.get('processedTime'));
        }
      },
      selectAll: ({ dataSet }) => {
        const { records } = dataSet;
        records.forEach((record) => {
          if (record.get('savePerformanceType') === 'QTY') {
            record.set('confirmedQty', record.get('executeQty'));
          } else if (record.get('savePerformanceType') === 'WORK_TIME') {
            record.set('confirmedTime', record.get('processedTime'));
          }
        });
      },
    },
  });

  @Bind()
  async componentDidMount() {
    this.confirmQueryDS.create({});
    const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (getResponse(res) && res.content && res.content[0]) {
      this.confirmQueryDS.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      });
    }
    this.handleTime('day');
    this.columns();
  }

  columns = () => {
    const { dataSource, checkValues } = this.state;
    const _initColumns = initColumns.slice();
    if (!_initColumns[0].key) {
      _initColumns.unshift({
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={this.handleCheckAllChange}
          />
        ),
        dataIndex: 'executeLineId',
        key: 'executeLineId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) =>
          this.checkCell({ rowData, dataIndex, rowIndex }),
      });
    }
    this.setState({
      columns: _initColumns,
    });
    return _initColumns;
  };

  handleCheckAllChange = (value) => {
    const savePerformanceType = this.confirmQueryDS.current.get('savePerformanceType');
    let _dataSource = this.state.dataSource;
    if (value) {
      if (savePerformanceType === 'QTY') {
        _dataSource = _dataSource.map((v) => {
          return {
            ...v,
            confirmedQty: v.executeQty,
          };
        });
      } else if (savePerformanceType === 'WORK_TIME') {
        _dataSource = _dataSource.map((v) => {
          return {
            ...v,
            confirmedTime: v.processedTime,
          };
        });
      }
      this.setState({
        checkValues: _dataSource.map((i) => i.executeLineId),
        checkRecords: _dataSource,
        dataSource: _dataSource,
        updateScrollPosition: false,
      });
    } else {
      this.setState({
        checkValues: [],
        checkRecords: [],
      });
    }
  };

  checkCell = ({ rowData, rowIndex }) => {
    const { checkValues } = this.state;
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.executeLineId}
        checked={checkValues.indexOf(rowData.executeLineId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => this.handleCheckBoxChange(rowData)}
      />
    );
  };

  handleCheckBoxChange = (rowData) => {
    const _checkValues = this.state.checkValues.slice();
    let _checkRecords = this.state.checkRecords.slice();
    let _dataSource = this.state.dataSource.slice();
    const savePerformanceType = this.confirmQueryDS.current.get('savePerformanceType');
    if (_checkValues.indexOf(rowData.executeLineId) === -1) {
      _checkValues.push(rowData.executeLineId);
      _checkRecords.push(rowData);
      if (savePerformanceType === 'QTY') {
        _dataSource = _dataSource.map((v) => {
          if (v.executeLineId === rowData.executeLineId) {
            return {
              ...v,
              confirmedQty: rowData.executeQty,
            };
          }
          return {
            ...v,
          };
        });
      } else if (savePerformanceType === 'WORK_TIME') {
        _dataSource = _dataSource.map((v) => {
          if (v.executeLineId === rowData.executeLineId) {
            return {
              ...v,
              confirmedTime: rowData.processedTime,
            };
          }
          return {
            ...v,
          };
        });
      }
      _checkRecords = _checkRecords.map((v) => {
        return {
          ..._dataSource.find((rec) => rec.executeLineId === v.executeLineId),
        };
      });
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.executeLineId), 1);
      _checkRecords.splice(
        _checkRecords.findIndex((v) => v.executeLineId === rowData.executeLineId),
        1
      );
    }
    this.setState({
      checkValues: _checkValues,
      checkRecords: _checkRecords,
      dataSource: _dataSource,
      updateScrollPosition: false,
    });
  };

  handleCollectChange = (value) => {
    let _columns = this.state.columns;
    if (value?.length) {
      if (
        value.some((v) => v === 'calendarShiftCodeGroupFlag') &&
        !_columns.filter((v) => v.dataIndex === 'calendarShiftCodeMeaning').length
      ) {
        _columns.splice(5, 0, ...calendarShift);
      } else if (value.every((v) => v !== 'calendarShiftCodeGroupFlag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'calendarShiftCodeMeaning');
      }
      if (
        value.some((v) => v === 'itemIdGroupFlag') &&
        !_columns.filter((v) => v.dataIndex === 'itemCode').length
      ) {
        _columns.splice(5, 0, ...item);
      } else if (value.every((v) => v !== 'itemIdGroupFlag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'itemCode');
      }
      if (
        value.some((v) => v === 'operationIdGroupFlag') &&
        !_columns.filter((v) => v.dataIndex === 'operation').length
      ) {
        _columns.splice(5, 0, ...operationArr);
      } else if (value.every((v) => v !== 'operationIdGroupFlag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'operation');
      }
      if (
        value.some((v) => v === 'moIdGroupFLag') &&
        !_columns.filter((v) => v.dataIndex === 'moNum').length
      ) {
        _columns.splice(5, 0, ...mo);
      } else if (value.every((v) => v !== 'moIdGroupFLag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'moNum');
      }
      if (
        value.some((v) => v === 'prodLineIdGroupFLag') &&
        !_columns.filter((v) => v.dataIndex === 'prodLine').length
      ) {
        _columns.splice(5, 0, ...prodLine);
      } else if (value.every((v) => v !== 'prodLineIdGroupFLag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'prodLine');
      }
      if (
        value.some((v) => v === 'equipmentIdGroupFLag') &&
        !_columns.filter((v) => v.dataIndex === 'equipment').length
      ) {
        _columns.splice(5, 0, ...equipment);
      } else if (value.every((v) => v !== 'equipmentIdGroupFLag')) {
        _columns = _columns.filter((v) => v.dataIndex !== 'equipment');
      }
      this.setState({
        columns: _columns,
      });
    } else if (!value?.length) {
      this.setState({
        columns: this.columns(),
      });
    }
  };

  /**
   *tab查询条件
   * @returns
   */
  @Bind()
  queryFields() {
    const { selectTimeType } = this.state;
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Select
        name="collectOptions"
        key="collectOptions"
        maxTagCount={1}
        maxTagTextLength={0}
        maxTagPlaceholder={(restValues) => `+${restValues.length}...`}
        onChange={this.handleCollectChange}
      />,
      <Select
        name="savePerformanceType"
        placeholder="请选择"
        onChange={this.handleChangePerformanceType}
      />,
      <div className={Style['chart-header']}>
        <div
          className={`${Style['time-day']} ${
            selectTimeType === 'day' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => this.handleTime('day')}
        >
          今日
        </div>
        <div
          className={`${Style['time-week']} ${
            selectTimeType === 'week' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => this.handleTime('week')}
        >
          本周
        </div>
        <div
          className={`${Style['time-month']} ${
            selectTimeType === 'month' ? Style['time-selected'] : Style.unselected
          }`}
          onClick={() => this.handleTime('month')}
        >
          本月
        </div>
      </div>,
      <DateTimePicker
        name="executeTimeMin"
        key="executeTimeMin"
        onChange={() => this.handleUpdateTime()}
      />,
      <DateTimePicker
        name="executeTimeMax"
        key="executeTimeMax"
        onChange={() => this.handleUpdateTime()}
      />,
      <Lov name="workerGroupObj" noCache key="workerGroupObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Lov name="moObj" noCache key="moObj" />,
      <Switch name="positivePriceFlag" onChange={this.handleSearch} />,
    ];
  }

  /**
   * 重置
   */
  @Bind()
  handleReset() {
    this.confirmQueryDS.current.reset();
  }

  // 计算表格展示高度
  calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(Style.content)[0];
    const queryContainer = document.getElementsByClassName(Style['query-content'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      this.setState({ tableHeight: 80 });
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      this.setState({ tableHeight: dataLength * 30 + 33 + 10 });
    } else {
      this.setState({ tableHeight: maxTableHeight });
    }
  };

  handleQuery = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.handleSearch();
      }
    );
  };

  /**
   * 查询
   */
  @Bind()
  async handleSearch(page = this.state.currentPage, pageSize = this.state.size) {
    const validateValue = await this.confirmQueryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    const data = this.confirmQueryDS.toData();
    const params = {};
    data[0].collectOptions.forEach((v) => {
      params[v] = '1';
    });
    // if (data[0].collectOptions && data[0].collectOptions.includes('PROD_LINE')) {
    //   this.confirmQueryDS.current.set('prodLineIdGroupFLag', 1);
    // } else {
    //   this.confirmQueryDS.current.set('prodLineIdGroupFLag', '');
    // }
    // if (data[0].collectOptions && data[0].collectOptions.includes('EQUIPMENT')) {
    //   this.confirmQueryDS.current.set('equipmentIdGroupFLag', 1);
    // } else {
    //   this.confirmQueryDS.current.set('equipmentIdGroupFLag', '');
    // }
    // if (data[0].collectOptions && data[0].collectOptions.includes('MO')) {
    //   this.confirmQueryDS.current.set('moIdGroupFLag', 1);
    // } else {
    //   this.confirmQueryDS.current.set('moIdGroupFLag', '');
    // }
    this.confirmLineDS.queryParameter = {
      ...this.confirmQueryDS.current.toJSONData(),
      ...params,
      page: page - 1,
      size: pageSize,
    };
    this.setState({ showLoading: true });
    const res = await this.confirmLineDS.query();
    if (getResponse(res) && res.content) {
      this.setState({
        dataSource: res.content,
        totalElements: res.totalElements || 0,
        updateScrollPosition: true,
      });
      this.calcTableHeight(res.content.length);
    }
    this.setState({
      showLoading: false,
      checkValues: [],
      checkRecords: [],
    });
  }

  /**
   * 确认类型改变
   */
  @Bind()
  handleChangePerformanceType() {
    const data = this.confirmQueryDS.toData();
    if (data[0].savePerformanceType && this.confirmLineDS.current) {
      this.confirmLineDS.records.forEach((record) => {
        record.set('savePerformanceType', data[0].savePerformanceType);
      });
    }
    this.setState({
      checkValues: [],
      checkRecords: [],
    });
  }

  /**
   * 时间修改
   */
  @Bind()
  handleUpdateTime() {
    // setSelectTimeType(null);
  }

  /**
   *时间处理
   */
  @Bind()
  handleTime(value) {
    let startTime;
    let endTime;
    if (value === 'day') {
      startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
      endTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      );
      this.confirmQueryDS.current.set(
        'executeTimeMin',
        moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      );
      this.confirmQueryDS.current.set(
        'executeTimeMax',
        moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      );
      this.setState({ selectTimeType: 'day' });
    } else if (value === 'week') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD 00:00:00');
      endTime = moment(getPrevDate(startTime, -6)).format('YYYY-MM-DD 23:59:59');
      this.confirmQueryDS.current.set('executeTimeMin', startTime);
      this.confirmQueryDS.current.set('executeTimeMax', endTime);
      this.setState({ selectTimeType: 'week' });
    } else if (value === 'month') {
      startTime = moment(new Date()).format('YYYY-MM-01 00:00:00');
      endTime = new Date(
        new Date(moment(getPrevMonth(startTime)).format('YYYY-MM-DD 00:00:00')).getTime() - 1
      );
      this.confirmQueryDS.current.set('executeTimeMin', startTime);
      this.confirmQueryDS.current.set('executeTimeMax', endTime);
      this.setState({ selectTimeType: 'month' });
    }
    // setTimeClass(value);
  }

  /**
   *计算工资
   */
  @Bind()
  async handleCalculateSalary() {
    // const { selected } = this.confirmLineDS;
    const { checkRecords } = this.state;
    // 判断所选状态
    if (!checkRecords.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const savePerformanceType = this.confirmQueryDS.current.get('savePerformanceType');
    const params = checkRecords.map((record) => {
      // const res = await getLatestWorkPrice({
      //   organizationId: record.organizationId,
      //   itemId: record.itemId,
      //   operationId: record.operationId,
      // });
      return {
        ...record,
        confirmedType: savePerformanceType === 'WORK_TIME',
      };
      // record.set('unitPrice', res);
      // if (savePerformanceType === 'QTY') {
      //   record.set('confirmedWage', record.get('unitPrice') * record.get('confirmedQty'));
      // } else if (savePerformanceType === 'WORK_TIME') {
      //   record.set('confirmedWage', record.get('unitPrice') * record.get('confirmedTime'));
      // }
    });
    const salaryRes = await countSalary(params);
    if (getResponse(salaryRes)) {
      notification.success({
        message: '计算成功',
      });
      const _dataSource = this.state.dataSource;
      let _checkRecords = this.state.checkRecords;
      const tempArr = _dataSource.map((v) => {
        if (salaryRes.findIndex((rec) => rec.executeLineId === v.executeLineId) !== -1) {
          return {
            ...salaryRes.find((rec) => rec.executeLineId === v.executeLineId),
          };
        }
        return {
          ...v,
        };
      });
      _checkRecords = _checkRecords.map((v) => {
        if (salaryRes.findIndex((rec) => rec.executeLineId === v.executeLineId) !== -1) {
          return {
            ...salaryRes.find((rec) => rec.executeLineId === v.executeLineId),
          };
        }
        return {
          ...v,
        };
      });
      this.setState({
        dataSource: tempArr,
        checkRecords: _checkRecords,
        updateScrollPosition: false,
      });
    }
  }

  /**
   *实绩确认
   */
  @Bind()
  async handleConfirmEmployee() {
    const { checkRecords } = this.state;
    if (!checkRecords.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    let confirmedFlag = false;
    checkRecords.forEach((i) => {
      if (i.confirmedWage !== undefined) {
        confirmedFlag = true;
      }
    });
    if (!confirmedFlag) {
      notification.error({
        message: '请先计算工资',
      });
      return;
    }
    // const data = this.confirmLineDS.toData();
    const savePerformanceType = this.confirmQueryDS.current.get('savePerformanceType');
    const xArr = [];
    checkRecords.forEach((i) => {
      const {
        organizationId,
        organizationCode,
        workerId,
        worker,
        workerGroupId,
        workerGroup,
        calendarDay,
        calendarShiftCode,
        prodLineId,
        prodLineCode,
        workcellId,
        workcellCode,
        equipmentId,
        equipmentCode,
        locationId,
        locationCode,
        moId,
        moNum,
        productId,
        productCode,
        taskId,
        taskNum,
        itemId,
        itemCode,
        operationId,
        operation,
        taskStandardWorkTime,
        executeTime,
        // confirmedQty: i.confirmedQty === 'QTY'?i.confirmedQty:'',
        // confirmedTime,
        unitPrice,
        confirmedWage,
        // confirmFlag,
        remark,
        validateLevel,
        executeQty,
        executeNgQty,
        scrappedQty,
        reworkQty,
        firstPassQty,
        firstPassRate,
        standardWorkTime,
      } = i;
      xArr.push({
        organizationId,
        organizationCode,
        workerId,
        worker,
        workerGroupId,
        workerGroup,
        calendarDay: moment(new Date(calendarDay)).format('YYYY-MM-DD HH:mm:ss'),
        calendarShift: calendarShiftCode,
        prodLineId,
        prodLineCode,
        workcellId,
        workcellCode,
        equipmentId,
        equipmentCode,
        locationId,
        locationCode,
        moId,
        moNum,
        productId,
        productCode,
        taskId,
        taskNum,
        itemId,
        itemCode,
        operationId,
        operation,
        taskStandardWorkTime,
        processedTime: executeTime,
        confirmedQty: savePerformanceType === 'QTY' ? i.executeQty : '',
        confirmedTime: savePerformanceType === 'WORK_TIME' ? i.executeTime : '',
        unitPrice,
        confirmedWage,
        confirmFlag: 1,
        remark,
        validateLevel,
        processOkQty: executeQty,
        processNgQty: executeNgQty,
        scrappedQty,
        reworkQty,
        firstPassQty,
        firstPassRate,
        standardWorkTime,
      });
    });
    const res = await saveExecuteLinePerformance(xArr);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '实绩确认成功',
      });
    }
  }

  handlePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== this.state.size) {
      pageValue = 1;
    }
    this.setState({
      currentPage: pageValue,
      size: pageSizeValue,
    });
    this.handleSearch(pageValue, pageSizeValue);
  };

  /**
   *导出字段
   * @returns
   */
  /**
   *导出字段
   * @returns
   */
  getExportQueryParams = () => {
    const data = this.confirmQueryDS.toData();
    const params = {};
    data[0].collectOptions.forEach((v) => {
      params[v] = '1';
    });
    const formObj = {
      ...this.confirmQueryDS.current.toJSONData(),
      ...params,
    };
    // const formObj = this.confirmQueryDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj);
    return {
      ...fieldsValue,
      confirmedType: formObj.savePerformanceType === 'WORK_TIME',
    };
  };

  render() {
    const {
      showLoading,
      dataSource,
      totalElements,
      size,
      currentPage,
      tableHeight,
      updateScrollPosition,
      columns,
    } = this.state;
    return (
      <Fragment>
        <Header title="员工实绩" backPath="/lmes/employee-performance/list">
          <ExcelExport
            requestUrl={`${HLOS_LMES}/v1/${getOrganizationId}/execute-lines/excel-export`}
            queryParams={this.getExportQueryParams}
          />
          <Button color="primary" onClick={() => this.handleCalculateSalary()}>
            计算工资
          </Button>
          <Button color="primary" onClick={() => this.handleConfirmEmployee()}>
            实绩确认
          </Button>
        </Header>
        <Content className={Style.content}>
          <div
            className={Style['query-content']}
            style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
          >
            <Form dataSet={this.confirmQueryDS} columns={4} style={{ flex: 'auto' }}>
              {this.queryFields()}
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
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => this.handleQuery()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <PerformanceTable
            virtualized
            data={dataSource}
            ref={tableRef}
            height={tableHeight}
            columns={columns}
            loading={showLoading}
            shouldUpdateScroll={updateScrollPosition}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={this.handlePageChange}
            pageSize={size}
            page={currentPage}
          />
          {/* <Table dataSet={this.confirmLineDS} columns={this.columns} queryFieldsLimit={4} /> */}
        </Content>
      </Fragment>
    );
  }
}
