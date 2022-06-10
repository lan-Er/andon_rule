/*
 * @Description: 领料单新增行表格
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-07 10:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-08 19:56:30
 */

import React, { useState, useImperativeHandle, useMemo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import {
  Table,
  PerformanceTable,
  Button,
  // Lov,
  NumberField,
  TextField,
  DataSet,
  CheckBox,
} from 'choerodon-ui/pro';
import CLov from 'components/Lov';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { outSourceDetailLeftLineDS } from '@/stores/issueRequestDS';
import { getLineInfo, getOnhandAndAvailableQty } from '@/services/issueRequestService';
import styles from './styles/index.module.less';

const intlPrefix = 'lwms.issueRequestPlatform.model';

export default function MainLineTable({
  cRef,
  pageContainer,
  queryContainer,
  // leftDataSet,
  dataSet,
  type,
  onChangeCheckValues,
  onLineTableQuery,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [tableHeight, setTableHeight] = useState(80);
  const leftDS = useMemo(() => new DataSet(outSourceDetailLeftLineDS()), []);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    lineTableData: dataSource,
    deletValue: () => {
      leftDS.records.clear();
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

  const purchaseColumns = () => {
    return [
      { name: 'poLineNum', width: 50, tooltip: 'overflow', lock: 'left' },
      {
        name: 'itemCode',
        width: 200,
        tooltip: 'overflow',
        lock: 'left',
        renderer: ({ record }) =>
          `${record.get('itemCode') || ''}-${record.get('itemDescription')}`,
      },
      { name: 'itemDescription', width: 150, tooltip: 'overflow', lock: 'left' },
      { name: 'uomName', width: 70, tooltip: 'overflow' },
      { name: 'demandQty', width: 82, tooltip: 'overflow' },
      { name: 'bomObj', width: 120, tooltip: 'overflow', editor: true },
    ];
  };

  const mainLineColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
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
        return `${rowData?.itemCode}-${rowData?.itemDescription}`;
      },
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.uom`).d('单位'),
      dataIndex: 'uom',
      key: 'uom',
      width: 70,
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
          value={rowData?.applyQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.claimedQty`).d('待申领数量'),
      dataIndex: 'appliedQty',
      key: 'appliedQty',
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
      title: intl.get(`${intlPrefix}.wmMoveType`).d('移动类型'),
      dataIndex: 'wmMoveTypeObj',
      key: 'wmMoveTypeObj',
      width: 144,
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
      title: intl.get(`${intlPrefix}.secondUOM`).d('辅助单位'),
      dataIndex: 'secondUomName',
      key: 'secondUomName',
      width: 70,
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
  ];

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
        if (item.requestLineNum === value.requestLineNum) {
          checkValuesList.push(item);
        }
      });
    });
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
      await getQty(rowData);
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
      await getQty(rowData);
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

  /**
   * 查询现有量和可用量
   *
   * @param {*} record // 当前记录
   * @param {*} dataSet // 行表格ds
   * @param {*} type // from: 接收仓库；to: 目标仓库
   */
  async function getQty(rowData) {
    const { organizationObj } = dataSet.parent.current.data;
    // 查询接收仓库的现有量和可用量
    const warehouseId = rowData && rowData.warehouseId;
    const wmAreaId = rowData && rowData.wmAreaId;
    const params = {
      organizationId: organizationObj.organizationId,
      itemId: rowData.itemObj && rowData.itemObj.itemId,
      warehouseId,
      wmAreaId,
    };
    const onhandAndAvailableQtyRes = await getOnhandAndAvailableQty([params]);
    if (onhandAndAvailableQtyRes && onhandAndAvailableQtyRes[0]) {
      rowData.availableQty = onhandAndAvailableQtyRes[0].availableQty;
      rowData.onhandQty = onhandAndAvailableQtyRes[0].quantity;
    }
  }

  function calcTableHeight(dataLength) {
    // const queryContainer = document.getElementsByClassName(styles['order-right-line'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
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

  const handleQuery = async () => {
    const isValid = await dataSet.parent.validate(false, false);
    if (!isValid) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }
    leftDS.queryParameter = {
      poHeaderId: dataSet.parent.current.get('poId'),
    };
    await leftDS.query();
    leftDS.forEach((i) => {
      i.set('organizationId', dataSet.parent.current.get('organizationId'));
    });
  };

  const handleConfirm = async () => {
    const {
      organizationObj,
      poObj,
      warehouseObj,
      wmAreaObj,
      wmMoveTypeObj,
    } = dataSet.parent.current.data;
    const whId = isEmpty(warehouseObj) ? null : warehouseObj.warehouseId;
    const whCode = isEmpty(warehouseObj) ? null : warehouseObj.warehouseCode;
    const wmId = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaId;
    const wmCode = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaCode;
    const params = [];
    const leftData = leftDS.selected.map((item) => {
      return item.toData();
    });
    leftData.forEach((record) => {
      params.push({
        organizationId: organizationObj.organizationId,
        poLineId: record.poLineId,
        bomId: record.bomId,
        poHeaderId: poObj.poId,
        warehouseId: whId,
        warehouseCode: whCode,
        wmAreaId: wmId,
        wmAreaCode: wmCode,
      });
    });
    if (!isEmpty(organizationObj) && !isEmpty(poObj)) {
      const res = await getLineInfo(params);
      // await dataSet.reset();
      if (res && Array.isArray(res)) {
        const lineDataList = [];
        // 遍历领料单行
        res.forEach(async (i, index) => {
          const linePara = {
            requestLineNum: index + 1, // i.lineNum,
            itemId: i.itemId,
            itemCode: i.itemCode,
            itemDescription: i.itemDescription,
            itemControlType: i.itemControlType,
            uomId: i.uomId,
            uom: i.uom,
            uomName: i.uomName,
            applyQty: i.appliedQty, // i.demandQty,
            appliedQty: i.appliedQty,
            demandQty: i.demandQty,
            availableQty: i.availableQty,
            onhandQty: i.onhandQty,
            warehouseName: i.warehouseName,
            warehouseId: i.warehouseId,
            warehouseCode: i.warehouseCode,
            wmAreaId: i.wmAreaId,
            wmAreaName: i.wmAreaName,
            wmAreaCode: i.wmAreaCode,
            wmMoveTypeObj,
            applyPackQty: i.applyPackQty,
            applyWeight: i.applyWeight,
            secondUomId: i.secondUomId,
            secondUom: i.secondUom,
            secondApplyQty: i.secondApplyQty,
            packingQty: i.packingQty,
            minPackingQty: i.minPackingQty,
            containerQty: i.containerQty,
            palletContainerQty: i.palletContainerQty,
            lotNumber: i.lotNumber,
            tagCode: i.tagCode,
            sourceDocLineId: i.poLineId,
            sourceDocLineNum: i.poLineNum,
            documentType: type,
            _status: 'create',
          };
          lineDataList.push(linePara);
        });
        setDataSource(lineDataList);
        onLineTableQuery(lineDataList);
        calcTableHeight(lineDataList.length);
        const checkValuesArr = lineDataList
          .filter((v) => v.applyQty > 0)
          .map((item) => {
            return item;
          });
        setCheckValues(checkValuesArr);
        const checkValuesList = [];
        lineDataList.forEach((item) => {
          checkValuesArr.forEach((v) => {
            if (item.requestLineNum === v.requestLineNum) {
              checkValuesList.push(item);
            }
          });
        });
        onChangeCheckValues(checkValuesList);
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
    <div className={styles['show-table-content']}>
      <div className={styles['order-line']}>
        <div className={styles['order-title']}>
          <span>委外采购订单行</span>
          <div className={styles['order-buttons']}>
            <Button onClick={handleQuery}>查询</Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </div>
        <Table
          dataSet={leftDS}
          border={false}
          columns={purchaseColumns()}
          columnResizable="true"
          queryBar="none"
        />
      </div>
      <div className={styles['order-right-line']} style={{ width: '49%' }}>
        <PerformanceTable
          virtualized
          data={dataSource}
          columns={mainLineColumns}
          shouldUpdateScroll={false}
          rowHeight={38}
          height={tableHeight}
        />
      </div>
    </div>
  );
}

MainLineTable.propTypes = {
  dataSet: PropTypes.object.isRequired,
};
