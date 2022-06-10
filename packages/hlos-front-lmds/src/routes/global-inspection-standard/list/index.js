/*
 * @Description: 抽样标准
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-28 18:05:09
 */
import React, { useState, useEffect, createRef } from 'react';
import { Header } from 'components/Page';
import {
  Button,
  PerformanceTable,
  Pagination,
  NumberField,
  TextField,
  CheckBox,
  Tooltip,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import {
  // userSetting,
  queryIndependentValueSet,
} from 'hlos-front/lib/services/api';
import {
  queryInspectionStandardList,
  createInspectionStandard,
  updateInspectionStandard,
  removeInspectionStandard,
} from '@/services/InspectionStandardService';
import Icons from 'components/Icons';

import styles from './index.less';

const preCode = 'lmds.inspection.standard';
const tableRef = createRef();
const keys = [
  'inspectQtyFrom',
  'inspectQtyTo',
  'sampleQty',
  'acceptQty',
  'rejectQty',
  'sampleSizeCode',
  'enabledFlag',
  'remark',
];

export default function InspectionStandard() {
  // const [userSettingRec, setUserSettingRec] = useState({});
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [originDataSource, setOriginDataSource] = useState([]);
  const [tableHeight, setTableHeight] = useState(90);
  const [totalElements, setTotalElements] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [standardList, setStandardList] = useState([]);
  const [curStandard, setCurStandard] = useState({});

  useEffect(() => {
    // async function getUserSetting() {
    //   const resp = await userSetting({ defaultFlag: 'Y' });
    //   if (getResponse(resp) && resp?.content?.length) {
    //     setUserSettingRec(resp.content[0]);
    //   }
    // }
    async function getLovData() {
      const resp = await queryIndependentValueSet({
        lovCode: 'LMDS.INSPECTION_SAMPLING_STANDARD',
      });
      if (getResponse(resp)) {
        setStandardList(resp);
        setCurStandard(resp[0]);
      }
    }
    // getUserSetting();
    getLovData();
  }, []);

  useEffect(() => {
    if (curStandard.value) {
      handleSearch();
    }
  }, [curStandard.value]);

  useEffect(() => {
    calcTableHeight(dataSource.length);
  }, [dataSource.length]);

  // 新建
  function handleAddLine() {
    const _dataSource = dataSource.slice();
    const newLine = {};
    keys.forEach((v) => {
      newLine[v] = null;
    });
    _dataSource.unshift({
      ...newLine,
      status: 'EDIT',
      id: uuidv4(),
      enabledFlag: true,
      toggleAction: true,
      toDisabled: true,
      otherQtyDisabled: true,
    });
    setDataSource(_dataSource);
  }

  const columns = [
    // {
    //   title: intl.get(`${preCode}.quantityInterval`).d('检验数量区间'),
    //   resizable: true,
    //   dataIndex: 'quantityInterval',
    //   width: 100,
    //   fixed: true,
    //   render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    // },
    {
      title: intl.get(`${preCode}.inspectQtyFrom`).d('检验数量从'),
      resizable: true,
      dataIndex: 'inspectQtyFrom',
      width: 100,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.inspectQtyTo`).d('检验数量至'),
      resizable: true,
      dataIndex: 'inspectQtyTo',
      width: 100,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.sampleQty`).d('样本数量'),
      resizable: true,
      dataIndex: 'sampleQty',
      width: 100,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.acceptQty`).d('接受数量'),
      resizable: true,
      dataIndex: 'acceptQty',
      width: 95,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.rejectQty`).d('拒绝数量'),
      resizable: true,
      dataIndex: 'rejectQty',
      width: 95,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.sampleSizeCode`).d('样品量字码'),
      resizable: true,
      dataIndex: 'sampleSizeCode',
      width: 95,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
      resizable: true,
      dataIndex: 'enabledFlag',
      width: 95,
      render: ({ rowData, dataIndex }) =>
        rowData.toggleAction
          ? editCell({ rowData, dataIndex, onChange: handleChange })
          : yesOrNoRender({ rowData, dataIndex }),
    },
    {
      title: intl.get(`${preCode}.remark`).d('备注'),
      // resizable: true,
      dataIndex: 'remark',
      // width: 260,
      flexGrow: true,
      render: ({ rowData, dataIndex }) => editCell({ rowData, dataIndex, onChange: handleChange }),
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'right',
      render: ({ rowData }) =>
        actionCell({ rowData, onEditClick: handleEditState, onDeleteClick: handleDelete }),
    },
  ];

  function editCell({ rowData, dataIndex, onChange }) {
    let _disValue = null;
    if(dataIndex === 'inspectQtyTo') {
      _disValue = rowData.toDisabled;
    }
    if(dataIndex === 'sampleQty' || dataIndex === 'acceptQty' || dataIndex === 'rejectQty') {
      _disValue = rowData.otherQtyDisabled;
    }
    const InputElement = (
      <TextField
        style={{ height: '100%' }}
        value={rowData[dataIndex]}
        onChange={(value) => {
          // eslint-disable-next-line no-unused-expressions
          onChange && onChange(rowData, dataIndex, value);
        }}
      />
    );
    const CheckBoxElement = (
      <CheckBox
        checked={rowData[dataIndex]}
        onChange={(value) => {
          // eslint-disable-next-line no-unused-expressions
          onChange && onChange(rowData, dataIndex, value);
        }}
      />
    );
    const NumberElement = (
      <NumberField
        required
        min={0}
        value={rowData[dataIndex]}
        disabled={_disValue}
        onChange={(value) => {
          // eslint-disable-next-line no-unused-expressions
          onChange && onChange(rowData, dataIndex, value);
        }}
      />
    );
    let showElement = NumberElement;
    if (dataIndex === 'enabledFlag') {
      showElement = CheckBoxElement;
    }
    if (dataIndex === 'sampleSizeCode' || dataIndex === 'remark') {
      showElement = InputElement;
    }
    return rowData.toggleAction ? showElement : rowData[dataIndex];
  }

  // 每一列赋值
  function handleChange(rowData, dataIndex, value) {
    let _dataSource = dataSource.slice();
    const inspectQtyToList = [];
    _dataSource.forEach(v => v.standardLineId && inspectQtyToList.push(v.inspectQtyTo));
    _dataSource = _dataSource.map((v) => {
      if (
        (v.id && v.id === rowData.id) ||
        (v.standardLineId && v.standardLineId === rowData.standardLineId)
      ) {
        let curRec = { ...v, [dataIndex]: value };
        if(dataIndex === 'inspectQtyFrom') {
          if(value <= Math.max(...inspectQtyToList)) {
            notification.warning({
              message: `不可小于${Math.max(...inspectQtyToList)}`,
            });
            curRec = {
              ...curRec,
              inspectQtyFrom: null,
            };
          } else if(curRec.inspectQtyFrom && !curRec.inspectQtyTo){
            curRec = {
              ...curRec,
              toDisabled: false,
            };
          } else if(curRec.inspectQtyTo && value >= curRec.inspectQtyTo) {
            notification.warning({
              message: `不可大于${curRec.inspectQtyTo}`,
            });
            curRec = {
              ...curRec,
              inspectQtyFrom: null,
            };
          }
        } else if(dataIndex === 'inspectQtyTo') {
          if(curRec.inspectQtyFrom && value <= curRec.inspectQtyFrom) {
            notification.warning({
              message: `不可小于${curRec.inspectQtyFrom}`,
            });
            curRec = {
              ...curRec,
              inspectQtyTo: null,
            };
          }
        } else if(dataIndex === 'sampleQty' || dataIndex === 'acceptQty' || dataIndex === 'rejectQty') {
          if(value > curRec.inspectQtyTo || value < curRec.inspectQtyFrom) {
            notification.warning({
              message: '录入的数量应在检验数量区间内',
            });
            curRec = {
              ...curRec,
              [dataIndex]: null,
            };
          }
        }

        if(curRec.inspectQtyFrom && curRec.inspectQtyTo) {
          curRec = {
            ...curRec,
            otherQtyDisabled: false,
          };
        } else {
          curRec = {
            ...curRec,
            otherQtyDisabled: true,
            sampleQty: null,
            acceptQty: null,
            rejectQty: null,
          };
        }
        return {
          ...curRec,
        };
      }
      return { ...v };
    });
    setDataSource(_dataSource);
  }

  // 操作
  function actionCell({ rowData, onEditClick, onDeleteClick }) {
    let element = (
      <Tooltip title="编辑">
        <Icon
          type="mode_edit"
          style={{ color: '#00B3A9' }}
          onClick={() => handleToggleAction(rowData)}
        />
      </Tooltip>
    );
    if (rowData.toggleAction) {
      element = (
        <>
          <Tooltip title="保存">
            <Icons
              type="a-ziyuan194"
              size={20}
              color="#00B3A9"
              onClick={() => onEditClick(rowData)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Icons
              type="a-ziyuan89"
              size={20}
              color="#00B3A9"
              onClick={() => onDeleteClick(rowData)}
            />
          </Tooltip>
        </>
      );
    }
    return (
      <div className={styles['ds-jc-around']} style={{ width: '100%', padding: '0 8px' }}>
        {element}
      </div>
    );
  }

  function handleToggleAction(rowData) {
    let _dataSource = dataSource.slice();
    _dataSource = _dataSource.map((v) => {
      if (
        (v.id && v.id === rowData.id) ||
        (v.standardLineId && v.standardLineId === rowData.standardLineId)
      ) {
        return {
          ...v,
          toggleAction: !v.toggleAction,
        };
      }
      return { ...v };
    });
    setDataSource(_dataSource);
  }

  // 行编辑状态变更及保存
  function handleEditState(rowData) {
    const nextData = [...dataSource];
    const activeItem = nextData.find(
      (item) =>
        (item.id && item.id === rowData.id) ||
        (item.standardLineId && item.standardLineId === rowData.standardLineId)
    );
    if (activeItem.toggleAction && activeItem.id) {
      if (
        !activeItem.inspectQtyFrom ||
        !activeItem.inspectQtyTo ||
        !activeItem.sampleQty ||
        !activeItem.acceptQty ||
        !activeItem.rejectQty
      ) {
        notification.warning({
          message: '请先完成必输字段',
        });
        return;
      }
      handleCreate(activeItem);
    }
    activeItem.toggleAction = !activeItem.toggleAction;
    if (!activeItem.toggleAction && activeItem.standardLineId) {
      handleUpdate(activeItem);
    }
    setDataSource(nextData);
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    setShowLoading(true);
    const resp = await queryInspectionStandardList({
      page: page - 1,
      size: pageSize,
      samplingStandard: curStandard.value,
    });
    if (getResponse(resp)) {
      setDataSource(resp.content);
      setOriginDataSource(resp.content);
      setTotalElements(resp.totalElements);
    }
    setShowLoading(false);
  }

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

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['inspection-standard-content'])[0];
    const maxTableHeight = pageContainer.offsetHeight - 64;
    if (dataLength === 0) {
      // 无数据时设置表格高度为90
      setTableHeight(90);
    } else if (dataLength * 40 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 40：行高度，40：表格高度, 10: 滚动条高度
      setTableHeight((dataLength + 1) * 40 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  // 新建检验标准信息
  async function handleCreate(params) {
    const resp = await createInspectionStandard({
      ...params,
      enabledFlag: params.enabledFlag || false,
      samplingStandard: curStandard.value,
      // createById: userSettingRec.workerId,
      // createBy: userSettingRec.workerCode,
      // creationDate: moment().format(DEFAULT_DATETIME_FORMAT),
    });
    if (getResponse(resp)) {
      notification.success({
        message: '创建成功',
      });
      handleSearch();
    }
  }

  // 更新检验标准信息
  async function handleUpdate(params) {
    if (handleCompare(params)) {
      // 重置修改的值
      // const _dataSource = dataSource.slice();
      // const _originRec = originDataSource.filter(v => v.standardLineId === params.standardLineId);
      // const _idx = _dataSource.findIndex(v => v.standardLineId === params.standardLineId);
      // _dataSource.splice(_idx, 1, _originRec);
      // setDataSource(_dataSource);
      return;
    }
    const resp = await updateInspectionStandard({
      ...params,
      samplingStandard: curStandard.value,
      // lastUpdatedById: userSettingRec.workerId,
      // lastUpdatedBy: userSettingRec.workerCode,
      // lastUpdateDate: moment().format(DEFAULT_DATETIME_FORMAT),
    });
    if (getResponse(resp)) {
      notification.success({
        message: '更新成功',
      });
      handleSearch();
    }
  }

  // 删除检验标准信息
  async function handleDelete(params) {
    if (params.standardLineId) {
      const resp = await removeInspectionStandard({
        ...params,
        // samplingStandard: curStandard.value,
        // // lastUpdatedById: userSettingRec.workerId,
        // lastUpdatedBy: userSettingRec.workerCode,
        // lastUpdateDate: moment().format(DEFAULT_DATETIME_FORMAT),
      });
      if (getResponse(resp)) {
        notification.success({
          message: '删除成功',
        });
        handleSearch();
      }
    } else {
      let _dataSource = dataSource.slice();
      _dataSource = _dataSource.filter((v) => v.id !== params.id);
      setDataSource(_dataSource);
    }
  }

  // 对比行数据是否有更新
  function handleCompare(record) {
    const originRecord = originDataSource.find((v) => v.standardLineId === record.standardLineId);
    const flag = keys.every((ele) => originRecord[ele] === record[ele]);
    return flag;
  }

  return (
    <div className={styles['lmds-inspection-standard']}>
      <Header title="抽样标准">
        <Button
          style={{ background: '#00B3A9', border: 'none' }}
          color="primary"
          onClick={handleAddLine}
        >
          新建
        </Button>
      </Header>
      <div className={styles['inspection-standard-content']}>
        <div className={styles.left}>
          <div className={styles.title}>抽样标准</div>
          {standardList.map((v) => (
            <p
              className={v.value === curStandard.value && `${styles.active}`}
              onClick={() => setCurStandard(v)}
            >
              {v.meaning}
            </p>
          ))}
        </div>
        <div className={styles.right}>
          <PerformanceTable
            virtualized
            rowKey="lotId"
            data={dataSource}
            headerHeight={40}
            rowHeight={40}
            ref={tableRef}
            columns={columns}
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
        </div>
      </div>
    </div>
  );
}
