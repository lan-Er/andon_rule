/*
 * @Description: 委外领料退料单新增
 * @Author: tw
 * @Date: 2021-07-27 10:27:00
 * @LastEditTime: 2021-07-27 10:27:00
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
// import { Tooltip } from 'choerodon-ui';
import CLov from 'components/Lov';
// import { getCurrentOrganizationId, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import {
  // checkControlType,
  getIssueRequestLine,
  // getAvailableQty,
  // getOnhandQty,
  // getOnhandAndAvailableQty,
  // getAppliedQty,
} from '@/services/singleReturnService';
// import { queryItemControlTypeBatch } from '@/services/api';
import styles from './index.module.less';

const intlPrefix = 'lwms.singleReturnPlatform.model';

// const organizationId = getCurrentOrganizationId();

// async function checkType(record, newValue, type) {
//   let params = { tenantId: organizationId };
//   if (type === 'item') {
//     params = {
//       ...params,
//       organizationId: record.get('warehouseObj').warehouseId,
//       itemId: newValue.itemId,
//       groupId: record.get('warehouseObj').warehouseId,
//     };
//   } else {
//     params = {
//       ...params,
//       organizationId: newValue.warehouseId,
//       itemId: record.get('itemObj').itemId,
//       groupId: newValue.warehouseId,
//     };
//   }
//   const typeRes = await checkControlType([params]);
//   if (typeRes && !typeRes.failed && typeRes[0]) {
//     record.set('itemControlType', typeRes[0].itemControlType);
//   }
// }

export default function MainLineTable({ cRef, pageContainer, dataSet, type, onChangeCheckValues }) {
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
    deletValue: () => {
      setDataSource([]);
      setCheckValues([]);
      onChangeCheckValues([]);
      calcTableHeight(0);
    },
  }));

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
      dataIndex: 'uomName',
      key: 'uomName',
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
      title: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWarehouseObj',
      key: 'toWarehouseObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          className={styles['require-field']}
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
      title: intl.get(`${intlPrefix}.toWMArea`).d('目标货位'),
      dataIndex: 'toWmAreaObj',
      key: 'toWmAreaObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
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
      title: intl.get(`${intlPrefix}.wmInspectRule`).d('仓库检验规则'),
      dataIndex: 'wmInspectRuleObj',
      key: 'wmInspectRuleObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          value={rowData?.wmInspectRuleId}
          textValue={rowData?.wmInspectRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'WM_INSPECT',
          }}
          onChange={(val, item) => handleWmInspectRuleChange(item, rowData)}
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
      title: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      minWidth: 144,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lineRemark}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
      flexGrow: true,
    },
  ];

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
      onChangeCheckValues(dataSource);
    } else {
      setCheckValues([]);
      onChangeCheckValues([]);
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
    } else {
      rowData.toWarehouseId = rec.warehouseId || null;
      rowData.toWarehouseCode = rec.warehouseCode || null;
      rowData.toWarehouseName = rec.warehouseName || null;
      rowData.toWmAreaId = null;
      rowData.toWmAreaCode = null;
      rowData.toWmAreaName = null;
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
    } else {
      rowData.toWmAreaId = rec.wmAreaId || null;
      rowData.toWmAreaCode = rec.wmAreaCode || null;
      rowData.toWmAreaName = rec.wmAreaName || null;
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

  function handleWmInspectRuleChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        wmInspectRuleId: rec.ruleId || null,
        wmInspectRule: rec.ruleName || null,
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

  function calcTableHeight(dataLength) {
    const queryContainer = document.getElementsByClassName(styles['bottom-table'])[0];
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

  /**
   * @description: 查询行数据
   * @param {*}dataSet
   */
  const handleAsync = async () => {
    // dataSet.parent.query();
    const validateValue = await dataSet.parent.validate(false, true);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const {
      organizationObj,
      issueRequestObj,
      // warehouseObj,
      // wmAreaObj,
      toWarehouseObj,
      toWmAreaObj,
    } = dataSet.parent.current.data;
    const toWhId = isEmpty(toWarehouseObj) ? null : toWarehouseObj.warehouseId;
    const toWhCode = isEmpty(toWarehouseObj) ? null : toWarehouseObj.warehouseCode;
    const toWhName = isEmpty(toWarehouseObj) ? null : toWarehouseObj.warehouseName;
    const toWmId = isEmpty(toWmAreaObj) ? null : toWmAreaObj.wmAreaId;
    const toWmCode = isEmpty(toWmAreaObj) ? null : toWmAreaObj.wmAreaCode;
    const toWmName = isEmpty(toWmAreaObj) ? null : toWmAreaObj.wmAreaName;
    const res = await getIssueRequestLine({
      organizationId: organizationObj.organizationId,
      requestId: issueRequestObj.requestId,
      // warehouseId: whId,
      // wmAreaId: wmId,
      // toWarehouseId: toWhId,
      // toWmAreaId: toWmId,
      requestOperationType: 'ISSUE',
      page: -1,
    });
    dataSet.reset();
    if (res && res.content && Array.isArray(res.content)) {
      const lineDataList = [];
      // 遍历领料单行
      res.content.forEach(async (i, index) => {
        // const typeList = itemControlTypeList.filter((key) => key.groupId === i.componentItemId);
        // if (!dataSet.filter((item) => item.data.moComponentId === i.moComponentId).length) {
        const linePara = {
          requestLineNum: index + 1, // i.lineNum,
          // itemObj: itemParams.itemId && itemParams.description ? itemParams : null,
          itemId: i.itemId,
          itemCode: i.itemCode,
          itemDescription: i.itemDescription,
          itemControlType: i.itemControlType, // isEmpty(typeList) ? null : typeList[0].itemControlType,
          // uomObj: uomParams.uomId && uomParams.uomName ? uomParams : null,
          uomId: i.uomId,
          uom: i.uom,
          uomName: i.uomName,
          applyQty: i.applyQty, // i.demandQty,
          applyPackQty: i.applyPackQty,
          applyWeight: i.applyWeight,
          secondUomId: i.secondUomId,
          secondUom: i.secondUom,
          secondApplyQty: i.secondApplyQty,
          toWarehouseId: toWhId,
          toWarehouseCode: toWhCode,
          toWarehouseName: toWhName,
          toWmAreaId: toWmId,
          toWmAreaCode: toWmCode,
          toWmAreaName: toWmName,
          // toWarehouseObj,
          // toWmAreaObj,
          wmInspectRuleId: i.wmInspectRuleId,
          wmInspectRule: i.wmInspectRule,
          lotNumber: i.lotNumber,
          tagCode: i.tagCode,
          sourceDocLineId: i.sourceDocLineId,
          sourceDocLineNum: i.sourceDocLineNum,
          documentType: type,
          _status: 'create',
        };
        lineDataList.push(linePara);
        // dataSet.create(linePara);
        // // 默认选中申请数量不为0的领料单行
        // if (linePara.applyQty > 0) {
        //   dataSet.select(dataSet.current);
        // }
      });
      setDataSource(lineDataList);
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
