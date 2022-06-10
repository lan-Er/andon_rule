/*
 * @Description: 发货执行行组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-03 16:20:33
 * @LastEditors: Please set LastEditors
 */

import React, { useState, useEffect, useCallback, useMemo, Fragment, useRef } from 'react';
import { connect } from 'dva';
import { Modal, DataSet, Table, TextField, Lov, Tooltip, NumberField } from 'choerodon-ui/pro';
// import { Popover } from 'choerodon-ui';

import intl from 'utils/intl';
import notification from 'utils/notification';
// import Icons from 'components/Icons';
import quantityIcon from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import lotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';
import itemDescIcon from 'hlos-front/lib/assets/icons/odd-number.svg';
import positionIcon from 'hlos-front/lib/assets/icons/location.svg';
import countIcon from 'hlos-front/lib/assets/icons/quantity.svg';
import { accAdd } from '@/utils/renderer';
import { modalTableDSConfig, shipLineDSConfig } from '@/stores/deliveryExecutionDS';
import styles from '../index.module.less';

const intlPrefix = 'lwms.purchaseReceipt';

function getTableColumns(type, uom) {
  function handleSetCount(dataSet, rec, value) {
    const maxVal = rec.get('initialQty') || rec.get('quantity') || 0;
    const formattedVal = value;
    if (!isNaN(formattedVal)) {
      if (formattedVal < maxVal || formattedVal === maxVal) {
        rec.set('advisedQty', formattedVal);
        rec.set('applyQty', formattedVal);
        if (formattedVal === 0) {
          dataSet.unSelect(rec);
        } else {
          dataSet.select(rec);
        }
      }
    } else {
      rec.set('applyQty', 0);
      rec.set('advisedQty', 0);
      dataSet.unSelect(rec);
    }
  }
  const tableColumns = [
    {
      name: 'tagOrLotNumber',
      editor: false,
      width: 300,
      renderer({ record }) {
        return (
          <div className={styles['first-column']}>
            {record.get(type === 'TAG' ? 'tagCode' : 'lotNumber')}
          </div>
        );
      },
      header: (dataSet) => {
        const partialContent =
          type === 'TAG'
            ? intl.get(`${intlPrefix}.view.title.tagCount`).d('标签数')
            : intl.get(`${intlPrefix}.view.title.lotCount`).d('批次数');
        return (
          <Fragment>
            <span>{`${partialContent}：${dataSet.selected.length} / ${dataSet.records.length}`}</span>
          </Fragment>
        );
      },
    },
    {
      name: 'count',
      editor: false,
      align: 'left',
      width: 250,
      renderer({ record, dataSet }) {
        return type === 'TAG' ? (
          <span>{`${record.get('applyQty')} ${uom || ''}`}</span>
        ) : (
          <div className={styles['custom-counter']}>
            <NumberField
              className={styles['counter-content']}
              value={record.get('advisedQty') || 0}
              onChange={(value) => handleSetCount(dataSet, record, value)}
            />
          </div>
        );
      },
      header: (dataSet) => {
        const totalCount = dataSet.records.reduce((acc, rec) => {
          return accAdd(acc, rec.get('initialQty') || rec.get('quantity') || 0);
        }, 0);
        const selectedCount = dataSet.selected.reduce((acc, rec) => {
          return accAdd(acc, (type === 'LOT' ? rec.get('advisedQty') : rec.get('quantity')) || 0);
        }, 0);
        return (
          <Fragment>
            <span>{`${selectedCount} / ${totalCount} ${uom || ''}`}</span>
          </Fragment>
        );
      },
    },
    {
      name: 'wmAreaName',
      editor: false,
      width: 250,
      header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('库位')}</span>,
      renderer({ record }) {
        return (
          <div className={styles['first-column']}>
            {record.get('wmAreaName')} {record.get('wmUnitCode')}
          </div>
        );
      },
    },
  ];
  // 批次明细   展示现有量
  if (type === 'LOT') {
    tableColumns.push(
      {
        name: 'quantity',
        align: 'left',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('现有量')}</span>,
        renderer({ record }) {
          return <div className={styles['first-column']}>{record.get('quantity')}</div>;
        },
      },
      {
        name: 'receivedDate',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>,
      }
    );
  } else {
    tableColumns.push(
      {
        name: 'lotNumber',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('批次')}</span>,
        renderer({ record }) {
          return <div className={styles['first-column']}>{record.get('lotNumber')}</div>;
        },
      },
      {
        name: 'assignedTime',
        editor: false,
        width: 200,
        header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('接收时间')}</span>,
      }
    );
  }
  tableColumns.push(
    {
      name: 'expireDate',
      editor: false,
      width: 200,
      header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('失效时间')}</span>,
    },
    {
      name: 'madeDate',
      editor: false,
      width: 200,
      header: <span>{intl.get(`${intlPrefix}.view.message.invalidateDate`).d('制造时间')}</span>,
    }
  );
  return tableColumns;
}

function ModalChildren({
  currentProgress,
  modalTableDS,
  type,
  itemId,
  itemCode,
  record,
  organizationId,
  pickRule,
}) {
  // const [lotOrTagNumber, setLotOrTagNumber] = useState('');
  const lotOrTagNumRef = useRef(null);
  function handleLotOrTagNumberChange(v) {
    // setLotOrTagNumber(v);
    lotOrTagNumRef.current = v;
    handleQuery();
  }
  function handleScan() {}

  function getProp(name) {
    return record[name] || '';
  }

  const handleQuery = useCallback(async () => {
    modalTableDS.setQueryParameter('itemId', itemId);
    modalTableDS.setQueryParameter('itemCode', itemCode);
    modalTableDS.setQueryParameter('itemControlType', type);
    modalTableDS.setQueryParameter('organizationId', organizationId);
    modalTableDS.setQueryParameter('warehouseId', record?.warehouseId);
    modalTableDS.setQueryParameter('wmAreaId', record?.wmAreaId);
    modalTableDS.setQueryParameter('page', -1);
    modalTableDS.setQueryParameter(
      type === 'LOT' ? 'lotNumber' : 'tagCode',
      lotOrTagNumRef.current
    );
    const arr = ['ADVISE', 'ENFORCE'];
    let _adviseFlag = 0;
    let useAdvise = false;
    if (pickRule && JSON.parse(pickRule) && arr.includes(JSON.parse(pickRule).pick_advise)) {
      useAdvise = true;
      if (JSON.parse(pickRule).pick_advise === 'ENFORCE') {
        _adviseFlag = 1;
      }
    }
    modalTableDS.setQueryParameter(
      'demandQty',
      type === 'LOT' ? (record.applyQty || 0) - (record.pickedQty || 0) : record.applyQty || 0
    );
    modalTableDS.setQueryParameter('useAdvise', useAdvise);
    modalTableDS.setQueryParameter('advisedFlag', _adviseFlag);
    const tableRes = await modalTableDS.query();
    if (tableRes && tableRes.content && tableRes.content[0]) {
      if (record.receiveList) {
        // 上次选中结果
        record.receiveList.forEach((receive) => {
          let selectIndex = -1;
          if (type === 'LOT') {
            selectIndex = tableRes.content.findIndex((i) => i.lotId === receive.lotId);
            if (selectIndex > -1) {
              modalTableDS.get(selectIndex).set('advisedQty', receive.advisedQty);
            }
          } else {
            selectIndex = tableRes.content.findIndex((i) => i.tagId === receive.tagId);
          }
          modalTableDS.select(selectIndex);
        });
      } else {
        // 默认选中结果
        tableRes.content.forEach((item, index) => {
          if (item.advisedFlag === '1') {
            modalTableDS.select(index);
          }
        });
      }
    }
  }, [modalTableDS, itemId, itemCode, type, lotOrTagNumRef, organizationId, record]);

  useEffect(() => {
    handleQuery();
  }, []);

  useEffect(() => {
    if (currentProgress === 4) {
      modalTableDS.records.forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.selectable = false;
      });
    } else {
      modalTableDS.records.forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.selectable = true;
      });
    }
  }, [modalTableDS, currentProgress]);

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-container-header']}>
        <div>
          <img src={itemDescIcon} alt="" />
          <span className={styles.content}>
            {`${getProp('itemCode')}-${getProp('itemDescription')}`}
          </span>
        </div>
        <div className={styles['header-bottom']}>
          <img src={positionIcon} alt="" />
          <span className={styles.content}>
            {`${getProp('warehouseName')}`}
            {getProp('wmAreaName') && <span> {getProp('wmAreaName')}</span>}
          </span>
          <img src={countIcon} alt="" />
          <span className={styles.content}>{`${getProp('applyQty')} ${getProp('uomName')}`}</span>
          <TextField
            value={lotOrTagNumRef.current}
            onChange={handleLotOrTagNumberChange}
            placeholder={
              type === 'LOT'
                ? intl.get(`${intlPrefix}.view.message.input.lot.number`).d('请输入/扫描批次号')
                : intl.get(`${intlPrefix}.view.message.input.tag.number`).d('请输入/扫描标签号')
            }
            suffix={
              <img
                src={scanIcon}
                alt=""
                style={{ verticalAlign: 'initial' }}
                onClick={handleScan}
              />
            }
          />
        </div>
      </div>
      <Table
        className={styles['modal-table']}
        dataSet={modalTableDS}
        columns={getTableColumns(type, getProp('uomName'))}
        rowHeight="auto"
      />
    </div>
  );
}

/**
 * 表格单据行组件
 * @param {Object} props
 * @param {Object} props.dispatch - dva dispatch
 * @param {Object} props.currentProgress - 进度
 * @param {Object} props.record - 记录
 * @param {String} props.record.itemControlType - 记录类型: QUANTITY-数量 / LOT-批次 / TAG-标签
 * @param {String} props.record.applyQty - 输入框后面的数量
 * @param {String} props.record.uomName - 单位
 * @param {String} props.record.itemCode - 物料 Code
 * @param {String} props.record.itemDescription - 物料 description
 * @param {String} props.record.shipLineStatusMeaning - 行状态
 * @param {String} props.record.promiseShipDate - 承诺发货日期
 * @param {String} props.record.shipLineId - 行ID
 * @param 注释内容
 */
export const Line = connect(({ deliveryExecution: { submitData } }) => ({ submitData }))(
  ({ record, dispatch, submitData, currentProgress, detailInfo }) => {
    const {
      itemControlType,
      applyQty,
      uomName,
      itemId,
      itemCode,
      itemDescription,
      // shipLineStatusMeaning,
      // promiseShipDate,
      shipLineId,
      pickedQty,
      pickRule,
      // warehouseId,
      // wmAreaId,
    } = record;
    const { organizationId, shipOrderStatus } = detailInfo;
    const [modalKey] = useState(Modal.key());
    const [iconPath, setIconPath] = useState('');
    const [newRecord, setNewRecord] = useState(record || {});
    const [receiveCountThisTime, setReceiveCountThisTime] = useState(
      shipOrderStatus === 'PICKED' ? pickedQty : 0
    );
    const modalTableDS = useMemo(() => new DataSet(modalTableDSConfig()), []);
    const shipLineDS = useMemo(() => new DataSet(shipLineDSConfig()), []);

    const handleInput = (e) => {
      const idx = submitData.findIndex((i) => i.shipLineId === shipLineId);
      const data = submitData.slice();
      if (e.target.value === '') {
        setReceiveCountThisTime(0);
        data.splice(idx, 1, {
          ...data[idx],
          receiveList: [
            {
              pickedQty: 0,
            },
          ],
        });
        dispatch({
          type: 'deliveryExecution/updateState',
          payload: {
            submitData: data,
          },
        });
        return;
      }
      const inputValue =
        e.target.value.indexOf('.') === -1 ? Number.parseInt(e.target.value, 10) : e.target.value;
      if (!isNaN(inputValue)) {
        if (inputValue > applyQty) {
          setReceiveCountThisTime(applyQty);
          data.splice(idx, 1, {
            ...data[idx],
            receiveList: [
              {
                pickedQty: applyQty,
              },
            ],
          });
          notification.warning({
            message: '本次接收数量不可大于待接收数量',
          });
        } else {
          data.splice(idx, 1, {
            ...data[idx],
            receiveList: [
              {
                pickedQty: inputValue,
              },
            ],
          });
          setReceiveCountThisTime(inputValue);
        }
      }
      dispatch({
        type: 'deliveryExecution/updateState',
        payload: {
          submitData: data,
        },
      });
    };

    const handleIconClick = () => {
      if (itemControlType === 'QUANTITY' || currentProgress === 3 || currentProgress === 4) {
        return;
      }
      handleOpenModal();
    };

    const children = useMemo(
      () => (
        <ModalChildren
          record={newRecord}
          currentProgress={currentProgress}
          dispatch={dispatch}
          type={itemControlType}
          shipLineId={shipLineId}
          organizationId={organizationId}
          pickRule={pickRule}
          // warehouseId={warehouseId}
          // wmAreaId={wmAreaId}
          itemCode={itemCode}
          itemId={itemId}
          modalTableDS={modalTableDS}
        />
      ),
      [
        record,
        newRecord,
        currentProgress,
        dispatch,
        itemControlType,
        shipLineId,
        modalTableDS,
        itemCode,
        itemDescription,
        organizationId,
      ]
    );

    const handleOpenModal = () => {
      Modal.open({
        className: `${styles['lwms-delivery-execution-detail-modal']}`,
        key: modalKey,
        destroyOnClose: true,
        title:
          itemControlType === 'TAG'
            ? intl.get(`${intlPrefix}.view.title.tagPicking`).d('标签挑库')
            : intl.get(`${intlPrefix}.view.title.batchPicking`).d('批次挑库'),
        style: {
          width: '80%',
          top: '10px',
        },
        closable: true,
        onOk() {
          if (modalTableDS.selected.length === 0) {
            notification.warning({
              message:
                itemControlType === 'TAG'
                  ? intl.get(`${intlPrefix}.view.message.check.tag.code`).d('请勾选标签号')
                  : intl.get(`${intlPrefix}.view.message.check.lot.number`).d('请勾选批次号'),
            });
            setReceiveCountThisTime(0);
            return;
          }
          const index = submitData.findIndex((i) => i.shipLineId === shipLineId);
          const copiedSubmitData = submitData.slice();
          let _pickedQty = 0;
          modalTableDS.selected.forEach((i) => {
            const _i = i;
            // _pickedQty +=
            //   (itemControlType === 'LOT' ? _i.toJSONData().advisedQty : _i.toJSONData().applyQty) ||
            //   0;
            _pickedQty = accAdd(
              _pickedQty,
              (itemControlType === 'LOT' ? _i.toJSONData().advisedQty : _i.toJSONData().applyQty) ||
                0
            );
          });
          setReceiveCountThisTime(_pickedQty);
          const currentItem = {
            ...newRecord,
            receiveList: modalTableDS.selected.map((i) => i.toJSONData()),
          };
          if (index !== -1) {
            copiedSubmitData.splice(index, 1, currentItem);
          } else {
            copiedSubmitData.push(currentItem);
          }
          setNewRecord({
            ...newRecord,
            receiveList: currentItem.receiveList,
          });
          dispatch({
            type: 'deliveryExecution/updateState',
            payload: {
              submitData: copiedSubmitData,
            },
          });
        },
        onClose() {
          modalTableDS.loadData([]);
        },
        children,
      });
    };

    useEffect(() => {
      let _iconPath = '';
      switch (itemControlType) {
        case 'QUANTITY':
          _iconPath = quantityIcon;
          break;
        case 'LOT':
          _iconPath = lotIcon;
          break;
        case 'TAG':
          _iconPath = tagIcon;
          break;
        default:
          break;
      }
      setIconPath(_iconPath);
    }, [itemControlType]);

    useEffect(() => {
      shipLineDS.current.set('organizationId', organizationId);
      shipLineDS.current.set('warehouseObj', {
        warehouseName: record.warehouseName,
        warehouseCode: record.warehouseCode,
        warehouseId: record.warehouseId,
      });
      shipLineDS.current.set('wmAreaObj', {
        wmAreaName: record.wmAreaName,
        wmAreaCode: record.wmAreaCode,
        wmAreaId: record.wmAreaId,
      });
    }, [record, organizationId]);

    const handleChangeLine = (params) => {
      const index = submitData.findIndex((i) => i.shipLineId === shipLineId);
      const copiedSubmitData = submitData.slice();
      if (index >= 0) {
        copiedSubmitData.splice(index, 1, {
          ...submitData[index],
          ...params,
        });
        dispatch({
          type: 'deliveryExecution/updateState',
          payload: {
            submitData: copiedSubmitData,
          },
        });
      }
    };

    const handleWarehouseChange = (rec) => {
      let params = {};
      if (rec) {
        setNewRecord({
          ...newRecord,
          warehouseId: rec.warehouseId,
          warehouseCode: rec.warehouseCode,
          warehouseName: rec.warehouseName,
          wmAreaId: null,
          wmAreaCode: null,
          wmAreaName: null,
        });
        params = {
          warehouseId: rec.warehouseId,
          warehouseCode: rec.warehouseCode,
          warehouseName: rec.warehouseName,
        };
      } else {
        setNewRecord({
          ...newRecord,
          warehouseId: null,
          warehouseCode: null,
          warehouseName: null,
          wmAreaId: null,
          wmAreaCode: null,
          wmAreaName: null,
        });
        params = {
          warehouseId: null,
          warehouseCode: null,
          warehouseName: null,
        };
      }
      shipLineDS.current.set('wmAreaObj', '');
      handleChangeLine(params);
    };

    const handleWmAreaChange = (rec) => {
      let params = {};
      if (rec) {
        setNewRecord({
          ...newRecord,
          wmAreaId: rec.wmAreaId,
          wmAreaCode: rec.wmAreaCode,
          wmAreaName: rec.wmAreaName,
        });
        params = {
          wmAreaId: rec.wmAreaId,
          wmAreaCode: rec.wmAreaCode,
          wmAreaName: rec.wmAreaName,
        };
      } else {
        setNewRecord({
          ...newRecord,
          wmAreaId: null,
          wmAreaCode: null,
          wmAreaName: null,
        });
        params = {
          wmAreaId: null,
          wmAreaCode: null,
          wmAreaName: null,
        };
      }
      handleChangeLine(params);
    };

    // function moreContent() {
    //   return (
    //     <div className={styles['lwms-delivery-execute-content-more-modal']}>
    //       <Lov
    //         dataSet={shipLineDS}
    //         name="wmAreaObj"
    //         onChange={handleWmAreaChange}
    //         disabled={currentProgress !== 2}
    //       />
    //     </div>
    //   );
    // }

    return (
      <div className={`${styles['table-line']}`}>
        <img
          src={iconPath}
          alt=""
          className={styles.icon}
          draggable={false}
          onClick={handleIconClick}
        />
        <div className={styles['custom-counter']}>
          {/* {itemControlType === 'QUANTITY' && (
            <span className={styles['counter-button']} onClick={() => handeUpdateCount('minus')}>
              -
            </span>
          )} */}
          <input
            className={styles['counter-content']}
            value={receiveCountThisTime}
            onChange={handleInput}
            readOnly={
              itemControlType !== 'QUANTITY' || currentProgress === 3 || currentProgress === 4
            }
          />
          {/* {itemControlType === 'QUANTITY' && (
            <span className={styles['counter-button']} onClick={() => handeUpdateCount('add')}>
              +
            </span>
          )} */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={applyQty}>
            <span className={styles['rec-count']}>{`${applyQty || ''}`}</span>
          </Tooltip>
          <span className={styles['rec-uom']}>{`${uomName || ''}`}</span>
        </div>
        <div className={styles.item}>
          <Tooltip title={itemDescription || ''}>
            <div>{itemDescription || ''}</div>
          </Tooltip>
          <div>{itemCode || ''}</div>
        </div>
        {currentProgress !== 2 ? (
          ''
        ) : (
          <div className={styles['select-warpper']}>
            <Lov
              dataSet={shipLineDS}
              name="warehouseObj"
              prefix={currentProgress === 2 ? <span className={styles.required}>*</span> : ''}
              onChange={handleWarehouseChange}
              disabled={currentProgress !== 2}
            />
          </div>
        )}
        {currentProgress !== 2 ? (
          ''
        ) : (
          <div className={styles['select-warpper']}>
            <Lov
              dataSet={shipLineDS}
              name="wmAreaObj"
              onChange={handleWmAreaChange}
              disabled={currentProgress !== 2}
            />
          </div>
        )}
        {/* <div className={styles.other}> // 因为后端暂时没返回字段 为了上线 暂时注释
          <span className={styles.status}>{shipLineStatusMeaning || ''}</span>
          <span className={styles.date}>{promiseShipDate || ''}</span>
        </div> */}
      </div>
    );
  }
);
