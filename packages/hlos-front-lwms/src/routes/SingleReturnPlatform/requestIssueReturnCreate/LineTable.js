/*
 * @Description: 新建生产订单退料单
 * @Author: tw
 * @Date: 2021-07-13 10:22:07
 * @LastEditTime: 2021-07-13 10:22:07
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
  requestMoComponent,
  // getAvailableQty,
  // getOnhandQty,
  getOnhandAndAvailableQty,
  getAppliedQty,
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
      title: intl.get(`${intlPrefix}.returnQty`).d('退料数量'),
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
      title: intl.get(`${intlPrefix}.applyPackQty`).d('退料包装数量'),
      dataIndex: 'applyPackQty',
      key: 'applyPackQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.meIssuedQty`).d('已消耗数量'),
      dataIndex: 'meIssuedQty',
      key: 'meIssuedQty',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.retuenReason`).d('退货原因'),
      dataIndex: 'lineRequestReason',
      key: 'lineRequestReason',
      width: 150,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lineRequestReason}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.warehouse`).d('退货仓库'),
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
      title: intl.get(`${intlPrefix}.wmArea`).d('退货货位'),
      dataIndex: 'wmAreaObj',
      key: 'wmAreaObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
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
      title: intl.get(`${intlPrefix}.applyPackQty`).d('退料包装数量'),
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
      title: intl.get(`${intlPrefix}.applyWeight`).d('退料重量'),
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
      title: intl.get(`${intlPrefix}.pickRule`).d('拣料规则'),
      dataIndex: 'pickRuleObj',
      key: 'pickRuleObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          value={rowData?.pickRuleId}
          textValue={rowData?.pickRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'PICK',
          }}
          onChange={(val, item) => handlePickRuleChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.reservationRule`).d('预留规则'),
      dataIndex: 'reservationRuleObj',
      key: 'reservationRuleObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          value={rowData?.reservationRuleId}
          textValue={rowData?.reservationRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'RESERVATION',
          }}
          onChange={(val, item) => handleReservationRuleChange(item, rowData)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.fifoRule`).d('FIFO规则'),
      dataIndex: 'fifoRuleObj',
      key: 'fifoRuleObj',
      width: 144,
      render: ({ rowData }) => (
        <CLov
          value={rowData?.fifoRuleId}
          textValue={rowData?.fifoRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'FIFO',
          }}
          onChange={(val, item) => handleFifoRuleChange(item, rowData)}
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
      title: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      width: 144,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lineRemark}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    // {
    //   title: intl.get('hzero.common.button.action').d('操作'),
    //   width: 90,
    //   render: ({ rowData, rowIndex }) => {
    //     return [
    //       <Tooltip
    //         key="cancel"
    //         placement="bottom"
    //         title={intl.get('hzero.common.button.cancel').d('取消')}
    //       >
    //         <Button
    //           icon="cancle_a"
    //           color="primary"
    //           funcType="flat"
    //           onClick={() => removeData(rowData, rowIndex)}
    //         />
    //       </Tooltip>,
    //     ];
    //   },
    //   lock: 'right',
    //   resizable: true,
    // },
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
      if (rowData.applyQty > 0) {
        let addFlag = true;
        checkValues.forEach((value) => {
          if (rowData.requestLineNum === value.requestLineNum) {
            addFlag = false;
          }
        });
        if (addFlag) {
          checkValues.push(rowData);
        }
      }
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
      if (rowData.applyQty > 0) {
        let addFlag = true;
        checkValues.forEach((value) => {
          if (rowData.requestLineNum === value.requestLineNum) {
            addFlag = false;
          }
        });
        if (addFlag) {
          checkValues.push(rowData);
        }
      }
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

  function handlePickRuleChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        pickRuleId: rec.ruleId || null,
        pickRule: rec.ruleName || null,
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

  function handleReservationRuleChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        reservationRuleId: rec.ruleId || null,
        reservationRule: rec.ruleName || null,
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

  function handleFifoRuleChange(rec, rowData) {
    // if (rec) {
    const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
    const cloneData = [...dataSource];
    if (idx > -1) {
      cloneData.splice(idx, 1, {
        ...rowData,
        fifoRuleId: rec.ruleId || null,
        fifoRule: rec.ruleName || null,
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

  /**
   * 获取可用量、待申领数量、现有量
   *
   * @param {*} record
   * @param {*} dataSet
   */
  async function getQty(rowData) {
    const { organizationObj } = dataSet.parent.current.data;
    const params = {
      organizationId: organizationObj.organizationId,
      itemId: rowData.itemObj && rowData.itemObj.itemId,
      warehouseId: rowData.warehouseObj && rowData.warehouseObj.warehouseId,
      wmAreaId: rowData.wmAreaObj && rowData.wmAreaObj.wmAreaId,
    };
    const claimedQtyParams = {
      sourceDocId: rowData.sourceDocId,
      sourceDocLineId: rowData.sourceDocLineId,
      itemId: rowData.itemObj && rowData.itemObj.itemId,
    };
    // const availableQtyRes = await getAvailableQty(params);
    // const onhandQtyRes = await getOnhandQty(params);
    const onhandAndAvailableQtyRes = await getOnhandAndAvailableQty([params]);
    const claimedQtyRes = await getAppliedQty(claimedQtyParams);
    if (onhandAndAvailableQtyRes && onhandAndAvailableQtyRes[0]) {
      rowData.availableQty = onhandAndAvailableQtyRes[0].availableQty;
      rowData.onhandQty = onhandAndAvailableQtyRes[0].quantity;
    }
    if (claimedQtyRes) {
      rowData.claimedQty = claimedQtyRes; // - claimedQtyRes. 待申领数量展示 “需求数量”减去“已申领数量”
    }
    // 若待申领数量小于可用量，默认为待申领数量；否则带出可用量
    if (rowData.claimedQty < rowData.availableQty) {
      rowData.applyQty = rowData.claimedQty;
    } else {
      rowData.applyQty = rowData.availableQty;
    }
    // 默认选中申请数量不为0的领料单行
    if (rowData.applyQty > 0) {
      // dataSet.select(rowData);
      rowData.checked = true;
    }
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
      moNumObj,
      warehouseObj,
      wmAreaObj,
      toWarehouseObj,
      toWmAreaObj,
      // workcellObj,
      // wmMoveTypeObj,
    } = dataSet.parent.current.data;
    const whName = isEmpty(warehouseObj) ? null : warehouseObj.warehouseName;
    const whId = isEmpty(warehouseObj) ? null : warehouseObj.warehouseId;
    const whCode = isEmpty(warehouseObj) ? null : warehouseObj.warehouseCode;
    const wmName = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaName;
    const wmId = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaId;
    const wmCode = isEmpty(wmAreaObj) ? null : wmAreaObj.wmAreaCode;
    // const toWhId = isEmpty(toWarehouseObj) ? null : toWarehouseObj.warehouseId;
    // const toWmId = isEmpty(toWmAreaObj) ? null : toWmAreaObj.wmAreaId;
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
      res.content.forEach(async (i, index) => {
        // const typeList = itemControlTypeList.filter((key) => key.groupId === i.componentItemId);
        if (!dataSet.filter((item) => item.data.moComponentId === i.moComponentId).length) {
          const itemParams = {
            itemId: i.componentItemId,
            itemCode: i.componentItemCode,
            description: i.componentDescription,
          };
          const uomParams = {
            uomId: i.uomId,
            uomCode: i.uom,
            uomName: i.uomName,
          };
          const warehouseParams = {
            warehouseName: whName || i.supplyWarehouseName,
            warehouseId: whId || i.supplyWarehouseId,
            warehouseCode: whCode || i.supplyWarehouseCode,
          };
          const wmAreaParams = {
            wmAreaId: wmId || i.supplyWmAreaId,
            wmAreaName: wmName || i.supplyWmAreaName,
            wmAreaCode: wmCode || i.supplyWmAreaCode,
          };
          const linePara = {
            requestLineNum: index + 1, // i.lineNum,
            itemObj: itemParams.itemId && itemParams.description ? itemParams : null,
            itemControlType: null, // isEmpty(typeList) ? null : typeList[0].itemControlType,
            uomObj: uomParams.uomId && uomParams.uomName ? uomParams : null,
            applyQty: i.applyQty, // i.demandQty,
            returnableQty: i.returnableQty,
            appliedQty: i.appliedQty,
            meIssuedQty: i.meIssuedQty,
            lineRequestReason: i.lineRequestReason,
            availableQty: i.availableQty,
            onhandQty: i.onhandQty,
            warehouseObj:
              warehouseParams.warehouseId && warehouseParams.warehouseName ? warehouseParams : null,
            wmAreaObj: wmAreaParams.wmAreaId && wmAreaParams.wmAreaName ? wmAreaParams : null,
            // wmMoveTypeObj,
            toWarehouseObj,
            toWmAreaObj,
            applyPackQty: i.applyPackQty,
            applyWeight: i.applyWeight,
            sourceDocLineId: i.moComponentId,
            sourceDocLineNum: i.lineNum,
            documentType: type,
            _status: 'create',
          };
          dataSet.create(linePara);
          // 默认选中申请数量不为0的领料单行
          if (linePara.applyQty > 0) {
            dataSet.select(dataSet.current);
          }
        }
      });
      setDataSource(dataSet.toData());
      calcTableHeight(dataSet.toData().length);
      const checkValuesArr = dataSet.selected.map((item) => {
        return item.toData();
      });
      setCheckValues(checkValuesArr);
      const checkValuesList = [];
      dataSet.toData().forEach((item) => {
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
