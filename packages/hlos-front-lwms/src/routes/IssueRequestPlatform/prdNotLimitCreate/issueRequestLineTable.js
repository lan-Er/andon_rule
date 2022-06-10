/*
 * @Description: 领料单新增行表格
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-07 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-08 19:56:30
 */

import React, { useEffect, useState, useImperativeHandle } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import {
  PerformanceTable,
  Button,
  // Lov,
  NumberField,
  TextField,
  // Select,
  CheckBox,
} from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import CLov from 'components/Lov';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { requestMoComponent, getOnhandAndAvailableQty } from '@/services/issueRequestService';
import styles from './styles/index.module.less';

const intlPrefix = 'lwms.issueRequestPlatform.model';

export default function MainLineTable({
  cRef,
  pageContainer,
  queryContainer,
  dataSet,
  type,
  onChangeCheckValues,
  onLineTableQuery,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    if (type !== 'COMMON_REQUEST') {
      dataSet.fields.get('toWarehouseObj').set('required', false);
    }
  }, [type]);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    lineTableData: dataSource,
    deletValue: () => {
      setDataSource([]);
      setCheckValues([]);
      onChangeCheckValues([]);
      calcTableHeight(0);
    },
    handleRound: () => {
      const cloneDataSource = dataSource;
      cloneDataSource.forEach((item) => {
        if (
          item.minPackingQty &&
          item.minPackingQty !== 0 &&
          item.applyQty &&
          item.applyQty !== 0
        ) {
          // 最小包装数、申请数量字段若均不为空或0
          const singlePackQty = item.applyQty / item.minPackingQty;
          if (singlePackQty > 0 && !/(^[1-9]\d*$)/.test(singlePackQty)) {
            // 申请数量/最小包装数 不为正整数时,将申请数量赋值为 最小包装数*向上取整后的整数
            item.applyQty = item.minPackingQty * Math.ceil(singlePackQty);
          }
        }
      });
      setDataSource(cloneDataSource);
      const checkValuesList = [];
      cloneDataSource.forEach((item) => {
        checkValues.forEach((value) => {
          if (item.requestLineNum === value.requestLineNum) {
            checkValuesList.push(item);
          }
        });
      });
      onChangeCheckValues(checkValuesList);
    },
  }));

  const mainLineColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          onClick={(e) => {
            e.stopPropagation();
          }}
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.lineNum`).d('行号'),
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 50,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.item`).d('物料'),
      dataIndex: 'itemObj',
      key: 'itemObj',
      width: 256,
      fixed: true,
      render: ({ rowData }) => {
        return `${rowData?.componentItemCode}-${rowData?.componentDescription}`;
      },
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.uom`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      // render: ({ rowData }) => {
      //   return (
      //     <CLov
      //       className={styles['require-field']}
      //       value={rowData?.uomId}
      //       textValue={rowData?.uomName}
      //       code="LMDS.UOM"
      //       onChange={(val, item) => handleUomChange(item, rowData)}
      //     />
      //   );
      // },
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.operation`).d('工序'),
      dataIndex: 'operation',
      key: 'operation',
      width: 128,
      // render: ({ rowData, dataIndex, rowIndex }) => (
      //   <TextField
      //     value={rowData?.operation}
      //     onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
      //   />
      // ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.warehouse`).d('发出仓库'),
      dataIndex: 'warehouseObj',
      key: 'warehouseObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          className={styles['require-field']}
          value={rowData?.warehouseId}
          textValue={rowData?.warehouseName}
          code="LMDS.WAREHOUSE"
          queryParams={{
            organizationId: dataSet.parent.current.get('organizationId'),
          }}
          onChange={(val, item) => handleWarehouseChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmArea`).d('发出货位'),
      dataIndex: 'wmAreaObj',
      key: 'wmAreaObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          // className={styles['require-field']}
          value={rowData?.wmAreaId}
          textValue={rowData?.wmAreaName}
          code="LMDS.WM_AREA"
          queryParams={{
            warehouseId: rowData?.warehouseId,
          }}
          onChange={(val, item) => handleWmAreaChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 100,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          className={styles['require-field']}
          min={0}
          max={
            rowData?.documentType === 'PLANNED_MO_ISSUE_REQUEST' ||
            rowData?.documentType === 'PLANNED_REQUEST'
              ? rowData?.claimedQty
              : rowData?.componentQty
          }
          value={rowData?.applyQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
      dataIndex: 'claimedQty',
      key: 'claimedQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      key: 'demandQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.availableQty`).d('可用量'),
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.onhandQty`).d('现有量'),
      dataIndex: 'onhandQty',
      key: 'onhandQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.componentQty`).d('待执行数量'),
      dataIndex: 'componentQty',
      key: 'componentQty',
      width:
        type === 'COMMON_REQUEST' || type === 'MO_ISSUE_REQUEST' || type === 'PLANNED_REQUEST'
          ? 0
          : 100,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          min={0}
          value={rowData?.componentQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyPackQty`).d('申请包装数量'),
      dataIndex: 'applyPackQty',
      key: 'applyPackQty',
      width: 100,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          min={0}
          value={rowData?.applyPackQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.applyWeight`).d('申请重量'),
      dataIndex: 'applyWeight',
      key: 'applyWeight',
      width: 100,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          min={0}
          value={rowData?.applyWeight}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouse`).d('接收仓库'),
      dataIndex: 'toWarehouseObj',
      key: 'toWarehouseObj',
      width: type !== 'COMMON_REQUEST' ? 0 : 144,
      render: ({ rowData }) => (
        <CLov
          // className={styles['require-field']}
          value={rowData?.toWarehouseId}
          textValue={rowData?.toWarehouseName}
          code="LMDS.WAREHOUSE"
          queryParams={{
            organizationId: dataSet.parent.current.get('organizationId'),
          }}
          onChange={(val, item) => handleToWarehouseChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWMArea`).d('接收货位'),
      dataIndex: 'toWmAreaObj',
      key: 'toWmAreaObj',
      width: type !== 'COMMON_REQUEST' ? 0 : 144,
      render: ({ rowData }) => (
        <CLov
          // className={styles['require-field']}
          value={rowData?.toWmAreaId}
          textValue={rowData?.toWmAreaName}
          code="LMDS.WM_AREA"
          queryParams={{
            warehouseId: rowData?.toWarehouseId,
          }}
          onChange={(val, item) => handleToWmAreaChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toAvailableQty`).d('接收仓库可用量'),
      dataIndex: 'toAvailableQty',
      key: 'toAvailableQty',
      width: type !== 'COMMON_REQUEST' ? 0 : 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toOnhandQty`).d('接收仓库现有量'),
      dataIndex: 'toOnhandQty',
      key: 'toOnhandQty',
      width: type !== 'COMMON_REQUEST' ? 0 : 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWorkcell`).d('接收工位'),
      dataIndex: 'toWorkcellObj',
      key: 'toWorkcellObj',
      width: type !== 'COMMON_REQUEST' ? 0 : 144,
      render: ({ rowData }) => (
        <CLov
          value={rowData?.toWorkcellId}
          textValue={rowData?.toWorkcellName}
          code="LMDS.WORKCELL"
          queryParams={{
            organizationId: dataSet.parent.current.get('organizationId'),
          }}
          onChange={(val, item) => handleWorkcellChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.packingQty`).d('包装数'),
      dataIndex: 'packingQty',
      key: 'packingQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.minPackingQty`).d('最小包装数'),
      dataIndex: 'minPackingQty',
      key: 'minPackingQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.containerQty`).d('装箱数'),
      dataIndex: 'containerQty',
      key: 'containerQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.palletContainerQty`).d('托盘箱数'),
      dataIndex: 'palletContainerQty',
      key: 'palletContainerQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      dataIndex: 'wmMoveTypeObj',
      key: 'wmMoveTypeObj',
      width: 144,
      // render: ({ rowData }) => (
      //   <Select
      //     ds={dataSet}
      //     name="wmMoveTypeObj"
      //     key="wmMoveTypeObj"
      //     onChange={(val, item) => handleWmMoveTypeChange(item, rowData)}
      //   />
      // ),
      render: ({ rowData }) => (
        <CLov
          value={rowData?.wmMoveTypeId}
          textValue={rowData?.wmMoveTypeName}
          code="LMDS.WM_MOVE_TYPE"
          onChange={(val, item) => handleWmMoveTypeChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.secondUOM`).d('辅助单位'),
      dataIndex: 'secondUomName',
      key: 'secondUomName',
      width: 70,
      // render: ({ rowData, dataIndex, rowIndex }) => (
      //   <CLov
      //     value={rowData?.secondUomId}
      //     textValue={rowData?.secondUom}
      //     code="LMDS.UOM"
      //     onChange={(val, item) => handleSecondUomChange(item, dataIndex, rowData, rowIndex)}
      //   />
      // ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.secondApplyQty`).d('辅助单位数量'),
      dataIndex: 'secondApplyQty',
      key: 'secondApplyQty',
      width: 100,
      render: ({ rowData, dataIndex, rowIndex }) =>
        rowData && rowData.secondUomId ? (
          <NumberField
            className={styles['require-field']}
            value={rowData?.secondApplyQty}
            onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
          />
        ) : (
          <span>{rowData?.secondApplyQty}</span>
        ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 144,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lotNumber}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.tag`).d('指定标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 144,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.tagCode}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 90,
      render: ({ rowIndex }) => {
        return [
          <Tooltip
            key="cancel"
            placement="bottom"
            title={intl.get('hzero.common.button.cancel').d('取消')}
          >
            <Button
              icon="cancle_a"
              color="primary"
              funcType="flat"
              onClick={() => removeData(rowIndex)}
            />
          </Tooltip>,
        ];
      },
      lock: 'right',
      resizable: true,
    },
  ];

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  async function removeData(rowIndex) {
    const newDataSource = [...dataSource];
    newDataSource.splice(rowIndex, 1);
    await setDataSource(newDataSource);
    const checkValuesList = [];
    newDataSource.forEach((item, index) => {
      checkValues.forEach((v) => {
        if (item.requestLineNum === v.requestLineNum) {
          checkValuesList.push(item);
        }
      });
      item.requestLineNum = index + 1;
    });
    await setDataSource(newDataSource);
    calcTableHeight(newDataSource.length);
    setCheckValues(checkValuesList);
    onChangeCheckValues(checkValuesList);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.requestLineNum}
        checked={checkValues.findIndex((i) => i.requestLineNum === rowData.requestLineNum) !== -1}
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
        newCheckValues.findIndex((i) => i.requestLineNum === rowData.requestLineNum),
        1
      );
    }
    setCheckValues(newCheckValues);
    const checkValuesList = [];
    dataSource.forEach((item) => {
      newCheckValues.forEach((v) => {
        if (item.requestLineNum === v.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
  }

  function handleWorkcellChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        toWorkcellId: rec.workcellId || null,
        toWorkcellCode: rec.workcellCode || null,
        toWorkcellName: rec.workcellName || null,
      });
      setDataSource(cloneData);
    }
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  function handleWmMoveTypeChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        wmMoveTypeId: rec.moveTypeId || null,
        wmMoveTypeCode: rec.moveTypeCode || null,
        wmMoveTypeName: rec.moveTypeName || null,
      });
      setDataSource(cloneData);
    }
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  function handleInputChange(val, dataIndex, rec, idx) {
    const cloneData = [...dataSource];
    if (dataIndex === 'applyQty' && val > 0) {
      cloneData.splice(idx, 1, {
        ...rec,
        [`${dataIndex}`]: val,
        checked: true,
      });
      let addFlag = true;
      checkValues.forEach((value) => {
        if (rec.requestLineNum === value.requestLineNum) {
          addFlag = false;
        }
      });
      if (addFlag) {
        checkValues.push(rec);
      }
    } else {
      cloneData.splice(idx, 1, {
        ...rec,
        [`${dataIndex}`]: val,
      });
    }
    setDataSource(cloneData);
    // setCheckValues(cloneData);
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum && item.applyQty > 0) {
          checkValuesList.push(item);
        }
      });
    });
    setCheckValues(checkValuesList);
    onChangeCheckValues(checkValuesList);
  }

  async function handleWarehouseChange(rec, rowData) {
    let cloneData = [];
    // if (rec) {
    if (!isEmpty(rec) && !isEmpty(rowData.itemId)) {
      rowData.warehouseId = rec.warehouseId || null;
      rowData.warehouseCode = rec.warehouseCode || null;
      rowData.warehouseName = rec.warehouseName || null;
      rowData.wmAreaId = null;
      rowData.wmAreaCode = null;
      rowData.wmAreaName = null;
      rowData.availableQty = null;
      rowData.onhandQty = null;
      await getQty(rowData, 'from');
    } else {
      rowData.warehouseId = rec.warehouseId || null;
      rowData.warehouseCode = rec.warehouseCode || null;
      rowData.warehouseName = rec.warehouseName || null;
      rowData.wmAreaId = null;
      rowData.wmAreaCode = null;
      rowData.wmAreaName = null;
      rowData.availableQty = null;
      rowData.onhandQty = null;
    }
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
      });
    }
    setDataSource(cloneData);
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  async function handleWmAreaChange(rec, rowData) {
    let cloneData = [];
    // if (rec) {
    if (!isEmpty(rowData.itemId) && !isEmpty(rowData.warehouseId)) {
      rowData.wmAreaId = rec.wmAreaId || null;
      rowData.wmAreaCode = rec.wmAreaCode || null;
      rowData.wmAreaName = rec.wmAreaName || null;
      rowData.availableQty = null;
      rowData.onhandQty = null;
      await getQty(rowData, 'from');
    } else {
      rowData.wmAreaId = rec.wmAreaId || null;
      rowData.wmAreaCode = rec.wmAreaCode || null;
      rowData.wmAreaName = rec.wmAreaName || null;
      rowData.availableQty = null;
      rowData.onhandQty = null;
    }
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
      });
    }
    setDataSource(cloneData);
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  async function handleToWarehouseChange(rec, rowData) {
    let cloneData = [];
    // if (rec) {
    if (!isEmpty(rec) && !isEmpty(rowData.itemId)) {
      rowData.toWarehouseId = rec.warehouseId || null;
      rowData.toWarehouseCode = rec.warehouseCode || null;
      rowData.toWarehouseName = rec.warehouseName || null;
      rowData.toWmAreaId = null;
      rowData.toWmAreaCode = null;
      rowData.toWmAreaName = null;
      rowData.toAvailableQty = null;
      rowData.toOnhandQty = null;
      await getQty(rowData, 'to');
    } else {
      rowData.toWarehouseId = rec.warehouseId || null;
      rowData.toWarehouseCode = rec.warehouseCode || null;
      rowData.toWarehouseName = rec.warehouseName || null;
      rowData.toWmAreaId = null;
      rowData.toWmAreaCode = null;
      rowData.toWmAreaName = null;
      rowData.toAvailableQty = null;
      rowData.toOnhandQty = null;
    }
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
      });
    }
    setDataSource(cloneData);
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  async function handleToWmAreaChange(rec, rowData) {
    let cloneData = [];
    // if (rec) {
    if (!isEmpty(rowData.itemId) && !isEmpty(rowData.toWarehouseId)) {
      rowData.toWmAreaId = rec.wmAreaId || null;
      rowData.toWmAreaCode = rec.wmAreaCode || null;
      rowData.toWmAreaName = rec.wmAreaName || null;
      rowData.toAvailableQty = null;
      rowData.toOnhandQty = null;
      await getQty(rowData, 'to');
    } else {
      rowData.toWmAreaId = rec.wmAreaId || null;
      rowData.toWmAreaCode = rec.wmAreaCode || null;
      rowData.toWmAreaName = rec.wmAreaName || null;
      rowData.toAvailableQty = null;
      rowData.toOnhandQty = null;
    }
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
      });
    }
    setDataSource(cloneData);
    const checkValuesList = [];
    cloneData.forEach((item) => {
      checkValues.forEach((value) => {
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
    onChangeCheckValues(checkValuesList);
    // }
  }

  /**
   * 查询现有量和可用量
   *
   * @param {*} record // 当前记录
   * @param {*} dataSet // 行表格ds
   * @param {*} type // from: 接收仓库；to: 目标仓库
   */
  async function getQty(rowData, typeFlag) {
    const { organizationObj } = dataSet.parent.current.data;
    let warehouseId = '';
    let wmAreaId = '';
    if (typeFlag === 'from') {
      // 查询接收仓库的现有量和可用量
      warehouseId = rowData && rowData.warehouseId;
      wmAreaId = rowData && rowData.wmAreaId;
    } else if (typeFlag === 'to') {
      // 查询目标仓库的现有量和可用量
      warehouseId = rowData && rowData.toWarehouseId;
      wmAreaId = rowData && rowData.toWmAreaId;
    }
    const params = {
      organizationId: organizationObj.organizationId,
      itemId: rowData.itemId,
      warehouseId,
      wmAreaId,
    };
    // const availableQtyRes = await getAvailableQty(params);
    // const onhandQtyRes = await getOnhandQty(params);
    const onhandAndAvailableQtyRes = await getOnhandAndAvailableQty([params]);
    if (onhandAndAvailableQtyRes && onhandAndAvailableQtyRes[0]) {
      // record.set(typeFlag === 'from' ? 'availableQty' : 'toAvailableQty', availableQtyRes.availableQty);
      if (typeFlag === 'from') {
        rowData.availableQty = onhandAndAvailableQtyRes[0].availableQty;
        rowData.onhandQty = onhandAndAvailableQtyRes[0].quantity;
      } else {
        rowData.toAvailableQty = onhandAndAvailableQtyRes[0].availableQty;
        rowData.toOnhandQty = onhandAndAvailableQtyRes[0].quantity;
      }
    }
  }

  function calcTableHeight(dataLength) {
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 105;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 38 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 38 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  /**
   * @description: 工单同步
   * @param {*}dataSet
   */
  const handleAsync = async () => {
    const {
      organizationObj,
      moNumObj,
      toWarehouseObj,
      toWmAreaObj,
      warehouseObj,
      wmAreaObj,
      workcellObj,
      wmMoveTypeObj,
    } = dataSet.parent.current.data;
    const whName = isEmpty(warehouseObj) ? null : warehouseObj.warehouseName;
    const whId = isEmpty(warehouseObj) ? null : warehouseObj.warehouseId;
    const whCode = isEmpty(warehouseObj) ? null : warehouseObj.warehouseCode;
    const wmName = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaName;
    const wmId = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaId;
    const wmCode = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaCode;
    if (!isEmpty(organizationObj) && !isEmpty(moNumObj)) {
      const res = await requestMoComponent({
        organizationId: organizationObj.organizationId,
        moId: moNumObj.moId,
        queryQtyFlag: 1,
        warehouseId: whId,
        wmAreaId: wmId,
        toWarehouseId: toWarehouseObj?.warehouseId,
        toWmAreaId: toWmAreaObj?.wmAreaId,
        page: -1,
      });
      dataSet.reset();
      if (res && res.content && Array.isArray(res.content)) {
        // 遍历领料单行
        res.content.forEach((i, index) => {
          // if (!dataSet.filter((item) => item.data.moComponentId === i.moComponentId).length) {
          // const itemParams = {
          //   itemId: i.componentItemId,
          //   itemCode: i.componentItemCode,
          //   description: i.componentDescription,
          // };
          // const uomParams = {
          //   uomId: i.uomId,
          //   uomCode: i.uom,
          //   uomName: i.uomName,
          // };
          // const warehouseParams = {
          //   warehouseName: whName || i.supplyWarehouseName,
          //   warehouseId: whId || i.supplyWarehouseId,
          //   warehouseCode: whCode || i.supplyWarehouseCode,
          // };
          // const wmAreaParams = {
          //   wmAreaId: wmId || i.supplyWmAreaId,
          //   wmAreaName: wmName || i.supplyWmAreaName,
          //   wmAreaCode: wmCode || i.supplyWmAreaCode,
          // };
          i.itemId = i.componentItemId;
          i.itemCode = i.componentItemCode;
          i.description = i.componentDescription;
          i.requestLineNum = index + 1;
          i.applyQty = i.claimedQty < 0 ? 0 : i.claimedQty || 0;
          i.warehouseName = whName || i.supplyWarehouseName;
          i.warehouseId = whId || i.supplyWarehouseId;
          i.warehouseCode = whCode || i.supplyWarehouseCode;
          i.wmAreaId = wmId || i.supplyWmAreaId;
          i.wmAreaName = wmName || i.supplyWmAreaName;
          i.wmAreaCode = wmCode || i.supplyWmAreaCode;
          i.wmMoveTypeId = wmMoveTypeObj?.moveTypeId || null;
          i.wmMoveTypeCode = wmMoveTypeObj?.moveTypeCode || null;
          i.wmMoveTypeName = wmMoveTypeObj?.moveTypeName || null;
          i.lotNumber = i.specifyLotNumber;
          i.tagCode = i.specifyTagCode;
          i.toAvailableQty = i.receiveOnhandQty;
          i.toOnhandQty = i.receiveAvailableQty;
          i.toWorkcellId = workcellObj.workcellId;
          i.toWorkcellCode = workcellObj.workcellCode;
          i.toWorkcellName = workcellObj.workcellName;
          i.sourceDocLineId = i.moComponentId;
          i.sourceDocLineNum = i.lineNum;
          i.documentType = type;
          i._status = 'create';
          if (type === 'PLANNED_MO_ISSUE_REQUEST') {
            i.componentQty = (i.demandQty ? i.demandQty : 0) - (i.issuedQty ? i.issuedQty : 0);
          }
          // let linePara = {
          //   requestLineNum: index + 1, // i.lineNum,
          //   itemObj: itemParams.itemId ? itemParams : null,
          //   uomObj: uomParams.uomId ? uomParams : null,
          //   applyQty: i.claimedQty < 0 ? 0 : i.claimedQty || 0, // i.demandQty,
          //   claimedQty: i.claimedQty,
          //   demandQty: i.demandQty,
          //   issuedQty: i.issuedQty,
          //   availableQty: i.availableQty,
          //   onhandQty: i.onhandQty,
          //   warehouseObj:
          //     warehouseParams.warehouseId && warehouseParams.warehouseName
          //       ? warehouseParams
          //       : null,
          //   wmAreaObj: wmAreaParams.wmAreaId && wmAreaParams.wmAreaName ? wmAreaParams : null,
          //   lotNumber: i.specifyLotNumber,
          //   tagCode: i.specifyTagCode,
          //   wmMoveTypeObj,
          //   toWarehouseObj,
          //   toWmAreaObj,
          //   toAvailableQty: i.receiveOnhandQty,
          //   toOnhandQty: i.receiveAvailableQty,
          //   toWorkcellObj: workcellObj,
          //   operation: i.operation,
          //   packingQty: i.packingQty,
          //   minPackingQty: i.minPackingQty,
          //   containerQty: i.containerQty,
          //   palletContainerQty: i.palletContainerQty,
          //   sourceDocLineId: i.moComponentId,
          //   sourceDocLineNum: i.lineNum,
          //   documentType: type,
          //   _status: 'create',
          // };
          // const qty = (i.demandQty?i.demandQty:0) - (i.issuedQty?i.issuedQty:0);
          // dataSet.create(linePara);
          // 默认选中申请数量不为0的领料单行
          // if (linePara.applyQty > 0) {
          //   dataSet.select(dataSet.current);
          // }
          // if (type === 'COMMON_REQUEST' && toWarehouseObj && toWarehouseObj.warehouseId) {
          //   await getQty(dataSet.records[index], dataSet, 'to');
          // }
          // }
        });
        setDataSource(res.content);
        onLineTableQuery(res.content);
        calcTableHeight(res.content.length);
        const checkValuesArr = res.content.filter((item) => item.applyQty > 0);
        setCheckValues(checkValuesArr);
        onChangeCheckValues(checkValuesArr);
      } else if (res.failed) {
        notification.error({
          message: res.message || '操作失败，请联系管理员！',
        });
      }
    } else {
      notification.warning({
        message: '请选择组织和工单',
      });
    }
  };

  return (
    <div className={styles['bottom-table']}>
      <Button
        key="autorenew-mainLine"
        icon="autorenew"
        color="primary"
        funcType="flat"
        onClick={() => handleAsync(dataSet, type)}
      >
        查询
      </Button>
      <PerformanceTable
        virtualized
        data={dataSource}
        columns={mainLineColumns}
        shouldUpdateScroll={false}
        rowHeight={38}
        height={tableHeight}
        // loading={showLoading}
      />
    </div>
  );
}

MainLineTable.propTypes = {
  dataSet: PropTypes.object.isRequired,
};
