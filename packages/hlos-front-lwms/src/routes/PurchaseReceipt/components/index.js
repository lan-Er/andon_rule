/*
 * @Description: 采购接收行组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-03 16:20:28
 * @LastEditors: 赵敏捷
 */

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { getResponse } from 'utils/utils';
// import { throttle, debounce } from 'lodash';
import {
  Modal,
  DataSet,
  Table,
  TextField,
  Row,
  Col,
  Button,
  DateTimePicker,
  NumberField,
  Spin,
  CheckBox,
} from 'choerodon-ui/pro';

import intl from 'utils/intl';
import notification from 'utils/notification';
import ImgUpload from 'hlos-front/lib/components/ImgUpload';
import { BUCKET_NAME_WMS } from 'hlos-front/lib/utils/config';
// import ImgUpload from '@/components/ImgUpload';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import Icons from 'components/Icons';

import { modalFormDSConfig, modalTableDSConfig } from '@/stores/purchaseReceiptDS';
import { getReceiveLotNumber, getReceiveTagCode } from '@/services/purchaseReceiptServices';
import quantityIcon from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import lotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';
import poLineNumIcon from 'hlos-front/lib/assets/icons/odd-number.svg';
import supplierIcon from 'hlos-front/lib/assets/icons/supplier-card.svg';
import foldIcon from 'hlos-front/lib/assets/icons/up-blue.svg';
import unfoldIcon from 'hlos-front/lib/assets/icons/down-blue.svg';
import inputSuffixIcon from 'hlos-front/lib/assets/icons/input-suffix.svg';
import styles from '../index.module.less';

const intlPrefix = 'lwms.purchaseReceipt';
const modalKey = Modal.key();
const updateModalKey = Modal.key();
let modal;
let updateModal;

function getTime() {
  return moment().format(DEFAULT_DATETIME_FORMAT);
}

function handleReceivedQtychange(dataSet, record, value) {
  if (!record.get('receivedQty')) {
    record.set('receivedQty', 0);
  } else if (Number(value) <= 0) {
    record.set('receivedQty', 0);
  } else {
    record.set('receivedQty', value);
  }
}

function getTableColumns(type, uomName) {
  return [
    {
      name: 'numberAndSupplierLot',
      editor: false,
      width: 300,
      renderer({ record }) {
        return (
          <div
            className={
              type === 'TAG' && record.get('lotNumber') && record.get('partyLotNumber')
                ? styles['first-column-lot']
                : styles['first-column']
            }
          >
            <div className={styles.code}>
              {record.get(type === 'TAG' ? 'tagCode' : 'lotNumber')}
            </div>
            {type === 'TAG' && (
              <div className={styles['supplier-lot']}>{record.get('lotNumber')}</div>
            )}
            <div className={styles['supplier-lot']}>{record.get('partyLotNumber')}</div>
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
      name: 'info',
      ediotr: false,
      // width: 150,
      renderer({ record }) {
        const materialSupplier = record.get('materialSupplier') || '';
        const materialLotNumber = record.get('materialLotNumber') || '';
        const madeDate = record.get('madeDate')?.format(DEFAULT_DATE_FORMAT) || null;
        const expireDate = record.get('expireDate')?.format(DEFAULT_DATE_FORMAT) || null;
        return (
          <div className={styles['second-column']}>
            <div className={styles['column-one']}>
              <div>{record.get('manufacturer')}</div>
              <div>{record.get('material')}</div>
            </div>
            <div className={styles['column-two']}>
              <div>
                <span>{materialSupplier}</span>
                <span>{(materialSupplier || materialLotNumber) && '-'}</span>
                <span>{materialLotNumber}</span>
              </div>
              <div className={styles['date-range']}>
                <span>{madeDate}</span>
                <span>{(madeDate || expireDate) && '-'}</span>
                <span>{expireDate}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      name: 'count',
      ediotr: false,
      width: 250,
      renderer({ dataSet, record }) {
        return (
          <span
            style={{
              color: '#031B2A',
              fontSize: '26px',
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <NumberField
              style={{ width: '60%', height: '100%', marginTop: '17px' }}
              // dataSet={dataSet}
              // name="receivedQty"
              value={record.get('receivedQty') || 0}
              onChange={(value) => handleReceivedQtychange(dataSet, record, value)}
            />
            <span style={{ height: '40px', marginTop: '10px' }}>{` ${uomName || ''}`}</span>
          </span>
        );
      },
      header: (dataSet) => {
        const totalCount = dataSet.records.reduce((acc, rec) => {
          return acc + rec.get('receivedQty');
        }, 0);
        const selectedCount = dataSet.selected.reduce((acc, rec) => {
          return acc + rec.get('receivedQty');
        }, 0);
        return (
          <Fragment>
            <span>{`${selectedCount} / ${totalCount} ${uomName || ''}`}</span>
          </Fragment>
        );
      },
    },
  ];
}

function ModalChildren({
  modalTableDS,
  modalFormDS,
  type,
  poNum,
  poLineNum,
  uomName,
  dispatch,
  selectedKeys,
  record,
  // headerSearchDS,
  headFormDS,
}) {
  const [showMoreFields, toggleShowMoreFields] = useState(false);

  const handleToggleShowFields = () => {
    toggleShowMoreFields(!showMoreFields);
  };

  const handleAddLine = (e) => {
    if (e.key === 'Enter') {
      // input 需要在 change 之后才真正起效（赋值）
      setTimeout(async () => {
        const { current } = modalFormDS;
        const formValid = await modalFormDS.validate(false, false);
        if (formValid) {
          const code = type === 'TAG' ? 'tagCode' : 'lotNumber';
          const index = modalTableDS.records.findIndex(
            (i) => i.get(code) === modalFormDS.current.get(code)
          );
          if (index !== -1) {
            updateModal = Modal.open({
              key: updateModalKey,
              title: '标签重复录入',
              style: {
                width: '500px',
              },
              closable: true,
              children: (
                <div>
                  <p>该标签已录入，更新/删除？</p>
                </div>
              ),
              footer: (
                <div>
                  <Button
                    color="primary"
                    onClick={() =>
                      handleUpdate(
                        type,
                        modalFormDS,
                        modalTableDS,
                        index,
                        selectedKeys,
                        dispatch,
                        record
                      )
                    }
                  >
                    更新
                  </Button>
                  <Button onClick={() => handleDelete(modalTableDS, index)}>删除</Button>
                </div>
              ),
            });
          } else {
            modalTableDS.create(modalFormDS.current.toJSONData());
            modalTableDS.select(modalTableDS.current);
            dispatch({
              type: 'purchaseReceipt/updateSelectedList',
              payload: {
                selectedKeys: [...selectedKeys, record.key],
              },
            });
          }
          modalFormDS.current.set('tagCode', null);
          if (code === 'lotNumber') {
            modalFormDS.current.set('lotNumber', null);
          }
        } else {
          let message = intl.get(`${intlPrefix}.view.message.required`).d('存在必输字段未填写');
          const madeDate = current?.get('madeDate');
          const expireDate = current?.get('expireDate');
          if (madeDate && expireDate && madeDate.isAfter(expireDate)) {
            message = intl
              .get(
                `${intlPrefix}.view.message.manufacturing.date.cannot.be.earlier.than.the.expiration.date`
              )
              .d('制造日期不可早于失效日期');
          }
          notification.warning({
            description: '',
            message,
          });
        }
      });
    }
  };

  // 快速添加
  const handleAdd = () => {
    setTimeout(async () => {
      const params = {
        organizationId: headFormDS.current?.data.receiveOrgObj?.organizationId,
        itemId: record?.itemId,
        partyId: record?.supplierId, // headerSearchDS.current?.data.supplierObj?.partyId,
        partyNumber: record?.supplierNumber, // headerSearchDS.current?.data.supplierObj?.partyNumber,
      };
      if (type === 'TAG') {
        const tagRes = await getReceiveTagCode(params);
        if (getResponse(tagRes) && !tagRes.failed) {
          modalFormDS.current.set('tagCode', tagRes.tagCode);
          if (!modalFormDS.current.get('lotNumber')) {
            modalFormDS.current.set('lotNumber', tagRes.lotNumber);
          }
        }
      } else {
        const lotRes = await getReceiveLotNumber(params);
        if (getResponse(lotRes) && !lotRes.failed) {
          modalFormDS.current.set('lotNumber', lotRes.lotNumber);
        }
      }
      const { current } = modalFormDS;
      const formValid = await modalFormDS.validate(false, false);
      if (formValid) {
        const code = type === 'TAG' ? 'tagCode' : 'lotNumber';
        const index = modalTableDS.records.findIndex(
          (i) => i.get(code) === modalFormDS.current.get(code)
        );
        if (index !== -1) {
          updateModal = Modal.open({
            key: updateModalKey,
            title: '标签重复录入',
            style: {
              width: '500px',
            },
            closable: true,
            children: (
              <div>
                <p>该标签已录入，更新/删除？</p>
              </div>
            ),
            footer: (
              <div>
                <Button
                  color="primary"
                  onClick={() =>
                    handleUpdate(
                      type,
                      modalFormDS,
                      modalTableDS,
                      index,
                      selectedKeys,
                      dispatch,
                      record
                    )
                  }
                >
                  更新
                </Button>
                <Button onClick={() => handleDelete(modalTableDS, index)}>删除</Button>
              </div>
            ),
          });
        } else {
          modalTableDS.create(modalFormDS.current.toJSONData());
          modalTableDS.select(modalTableDS.current);
          dispatch({
            type: 'purchaseReceipt/updateSelectedList',
            payload: {
              selectedKeys: [...selectedKeys, record.key],
            },
          });
        }
        modalFormDS.current.set('tagCode', null);
        modalFormDS.current.set('lotNumber', null);
      } else {
        let message = intl.get(`${intlPrefix}.view.message.required`).d('存在必输字段未填写');
        const madeDate = current?.get('madeDate');
        const expireDate = current?.get('expireDate');
        if (madeDate && expireDate && madeDate.isAfter(expireDate)) {
          message = intl
            .get(
              `${intlPrefix}.view.message.manufacturing.date.cannot.be.earlier.than.the.expiration.date`
            )
            .d('制造日期不可早于失效日期');
        }
        notification.warning({
          description: '',
          message,
        });
      }
    });
  };

  return (
    <div className={styles['modal-container']}>
      <div className={styles['header-top']}>
        <div className={styles.content}>
          <img src={supplierIcon} alt="" />
          <span className={styles.content}>{poNum}</span>
        </div>
        <div className={styles.content}>
          <img src={poLineNumIcon} alt="" />
          <span className={styles.content}>{poLineNum}</span>
        </div>
        <div className={styles.buttonAdd}>
          <Button
            icon="add"
            style={{
              border: '1px solid #1C879C',
              color: '#1C879C',
              paddingBottom: '2px',
              height: '30px',
            }}
            onClick={handleAdd}
          >
            快速添加
          </Button>
        </div>
      </div>
      <div className={styles['header-bottom']}>
        {/* 第一行 */}
        <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col span={7}>
            <TextField
              dataSet={modalFormDS}
              name={type === 'TAG' ? 'tagCode' : 'lotNumber'}
              onKeyDown={handleAddLine}
              placeholder={
                type === 'TAG'
                  ? intl.get(`${intlPrefix}.model.tagCode`).d('标签号')
                  : intl.get(`${intlPrefix}.model.lot`).d('批次号')
              }
              suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              autoFocus
            />
          </Col>
          {type === 'TAG' && (
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="lotNumber"
                onKeyDown={handleAddLine}
                placeholder={intl.get(`${intlPrefix}.model.lot`).d('批次')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
          )}
          <Col span={7}>
            <NumberField
              dataSet={modalFormDS}
              name="receivedQty"
              onKeyDown={handleAddLine}
              placeholder={intl.get(`${intlPrefix}.model.number`).d('数量')}
              suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
            />
          </Col>
          {type !== 'TAG' && (
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="traceNum"
                placeholder={intl.get(`${intlPrefix}.model.traceNum`).d('追踪号')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
          )}
        </Row>
        <div style={{ display: showMoreFields ? 'block' : 'none' }}>
          {/* 第二行 */}
          <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
            {type === 'TAG' && (
              <Col span={7}>
                <TextField
                  dataSet={modalFormDS}
                  name="traceNum"
                  placeholder={intl.get(`${intlPrefix}.model.traceNum`).d('追踪号')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            )}
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="partyLotNumber"
                placeholder={intl.get(`${intlPrefix}.model.supplierLot`).d('供应商批次')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
            <Col span={7}>
              <DateTimePicker
                dataSet={modalFormDS}
                name="madeDate"
                placeholder={intl.get(`${intlPrefix}.model.createDate`).d('制造日期')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
            {type !== 'TAG' && (
              <Col span={7}>
                <DateTimePicker
                  dataSet={modalFormDS}
                  name="expireDate"
                  placeholder={intl.get(`${intlPrefix}.model.invalidateDate`).d('失效日期')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            )}
          </Row>
          {/* 第三行 */}
          <Row type="flex" align="middle" justify="space-between">
            {type === 'TAG' && (
              <Col span={7}>
                <DateTimePicker
                  dataSet={modalFormDS}
                  name="expireDate"
                  placeholder={intl.get(`${intlPrefix}.model.invalidateDate`).d('失效日期')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            )}
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="manufacturer"
                placeholder={intl.get(`${intlPrefix}.model.manufacturer`).d('制造商')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="material"
                placeholder={intl.get(`${intlPrefix}.model.item`).d('材料')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
            {type !== 'TAG' && (
              <Col span={7}>
                <TextField
                  dataSet={modalFormDS}
                  name="materialSupplier"
                  placeholder={intl.get(`${intlPrefix}.model.itemSupplier`).d('材料供应商')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            )}
          </Row>
          {/* 第四行 */}
          <Row type="flex" align="middle" justify="space-between" style={{ marginTop: '16px' }}>
            {type === 'TAG' && (
              <Col span={7}>
                <TextField
                  dataSet={modalFormDS}
                  name="materialSupplier"
                  placeholder={intl.get(`${intlPrefix}.model.itemSupplier`).d('材料供应商')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            )}
            <Col span={7}>
              <TextField
                dataSet={modalFormDS}
                name="materialLotNumber"
                placeholder={intl.get(`${intlPrefix}.model.itemLot`).d('材料批次')}
                suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
              />
            </Col>
          </Row>
          {/* {type === 'TAG' && (
            <Row type="flex" align="middle" justify="space-between" style={{ marginTop: '16px' }}>
              <Col span={7}>
                <TextField
                  dataSet={modalFormDS}
                  name="materialLotNumber"
                  placeholder={intl.get(`${intlPrefix}.model.itemLot`).d('材料批次')}
                  suffix={<img src={inputSuffixIcon} alt="" style={{ width: '.22rem' }} />}
                />
              </Col>
            </Row>
          )} */}
        </div>
        <div style={{ margin: '16px 0', textAlign: 'center' }}>
          <span onClick={handleToggleShowFields} style={{ cursor: 'pointer', userSelect: 'none' }}>
            {showMoreFields ? (
              <img src={foldIcon} alt="unfold" />
            ) : (
              <img src={unfoldIcon} alt="unfold" />
            )}
          </span>
        </div>
      </div>
      <Table
        className={styles['modal-table']}
        dataSet={modalTableDS}
        columns={getTableColumns(type, uomName)}
        rowHeight="auto"
      />
    </div>
  );
}
function handleDelete(modalTableDS, index) {
  modalTableDS.records.splice(index, 1);
  updateModal.close();
}
function handleUpdate(type, modalFormDS, modalTableDS, index, selectedKeys, dispatch, record) {
  const code =
    type === 'TAG'
      ? modalTableDS.records[index].data.tagCode
      : modalTableDS.records[index].data.lotNumber;
  modalTableDS.records.splice(index, 1);
  if (type === 'TAG') {
    modalTableDS.create({ ...modalFormDS.current.toJSONData(), tagCode: code });
  } else {
    modalTableDS.create({ ...modalFormDS.current.toJSONData(), lotNumber: code });
  }
  modalTableDS.select(modalTableDS.current);
  dispatch({
    type: 'purchaseReceipt/updateSelectedList',
    payload: {
      selectedKeys: [...selectedKeys, record.key],
    },
  });
  updateModal.close();
}

function getQtyValue(type, ds, quantityRecCount, key) {
  const res =
    type === 'QUANTITY'
      ? quantityRecCount.find?.((i) => i.key === key)?.value || 0
      : ds?.table.selected?.reduce((acc, rec) => {
          // eslint-disable-next-line no-param-reassign
          acc += rec.get('receivedQty') || 0;
          return acc;
        }, 0) || 0;
  return res;
}

/**
 * 表格单据行组件
 * @param {Object} props
 * @param {Object} props.dispatch - dva dispatch
 * @param {Object} props.record - 记录
 * @param {Object} props.record.key - 记录 uuid
 * @param {String} props.record.type - 记录类型: QUANTITY-数量 / LOT-批次 / TAG-标签
 * @param {String} props.record.demandQty - 需求数量
 * @param {String} props.record.receivedQty - 已接受数量
 * @param {String} props.record.uomName - 单位
 * @param {String} props.record.itemDescription - 物料描述
 * @param {String} props.record.itemCode - 物料 Code
 * @param {String} props.record.supplierName - 供应商
 * @param {String} props.record.poNum - 采购单号
 * @param {String} props.record.poLineNum - 采购单行号
 * @param {String} props.record.poLineStatusMeaning - 状态
 * @param {String} props.record.demandDate - 需求时间
 */
const Line = connect(
  ({ purchaseReceipt: { selectedKeys, dataSetDataArr, quantityRecCount, recList } }) => ({
    selectedKeys,
    dataSetDataArr,
    quantityRecCount,
    recList,
  })
)(
  ({
    record,
    headerSearchDS,
    headFormDS,
    dispatch,
    selectedKeys,
    dataSetDataArr,
    quantityRecCount,
    recList,
  }) => {
    const {
      key,
      itemControlType: type,
      demandQty,
      receivedQty,
      uomName,
      itemDescription,
      itemCode,
      supplierMdsName,
      poNum,
      poLineNum,
      poLineStatusMeaning,
      demandDate,
      // pictures,
    } = record;
    const ds = dataSetDataArr.find((i) => i.key === key);
    const [iconPath, setIconPath] = useState('');
    const [qty, setQty] = useState(getQtyValue(type, ds, quantityRecCount, key));
    const handleChange = useCallback(
      (v) => {
        const index = selectedKeys.findIndex((i) => i === key);
        if (v) {
          if (index === -1) {
            dispatch({
              type: 'purchaseReceipt/updateSelectedList',
              payload: {
                selectedKeys: [...selectedKeys, key],
              },
            });
          }
        } else if (index !== -1) {
          const _ids = selectedKeys.slice();
          _ids.splice(index, 1);
          dispatch({
            type: 'purchaseReceipt/updateSelectedList',
            payload: {
              selectedKeys: _ids,
            },
          });
        }
      },
      [key, dispatch, selectedKeys]
    );
    const updateFn = useCallback(
      (payload) => {
        dispatch({
          type: 'purchaseReceipt/updateQuantityRecCount',
          payload,
        });
      },
      [dispatch]
    );
    const handeUpdateCount = useCallback(
      (updateType) => {
        if (updateType === 'update') {
          updateFn({ key, value: qty });
        } else if (updateType === 'minus') {
          if (qty > 0) {
            updateFn({ key, value: qty - 1 });
          }
        } else if (qty < (demandQty || 0) - (receivedQty || 0)) {
          updateFn({ key, value: qty + 1 });
        }
      },
      [key, updateFn, qty, demandQty, receivedQty]
    );

    const handleInput = (e, recType) => {
      if (recType !== 'QUANTITY') {
        return;
      }
      if (e.target.value === '') {
        updateFn({ key, value: 0 });
        return;
      }
      const inputValue = Number.parseInt(e.target.value, 10);
      if (!isNaN(inputValue)) {
        if (inputValue > demandQty - receivedQty) {
          updateFn({ key, value: demandQty - receivedQty });
          notification.warning({
            message: '本次接收数量不可大于待接收数量',
          });
        } else {
          updateFn({ key, value: inputValue });
        }
      }
    };

    const handleIconClick = () => {
      if (type === 'QUANTITY') {
        return;
      }
      handleOpenModal();
    };

    const handleModalOk = (modalTableDS) => {
      setQty(getQtyValue(type, { table: modalTableDS }, quantityRecCount, key));
      modal.close();
    };

    const handleOpenModal = () => {
      const modalFormDS = ds?.form || new DataSet(modalFormDSConfig(type));
      const modalTableDS = ds?.table || new DataSet(modalTableDSConfig(type));
      if (!ds?.table) {
        modalTableDS.addEventListener('select', ({ dataSet, record: rec }) => {
          const selectedTotal = dataSet.selected.reduce((acc, _rec) => {
            return acc + _rec.get('receivedQty');
          }, 0);
          if (selectedTotal > demandQty - receivedQty) {
            // eslint-disable-next-line no-param-reassign
            rec.isSelected = false;
            notification.warning({
              message: intl
                .get(
                  `${intlPrefix}.view.message.quantity.received.this.time.cannot.exceed.the.quantity.to.be.received`
                )
                .d('本次接收数量不可超过待接收数量'),
            });
          }
        });
      }
      modal = Modal.open({
        key: modalKey,
        title: intl.get(`${intlPrefix}.view.title.addNumber`).d('接收明细'),
        style: {
          width: '1100px',
        },
        closable: true,
        onClose() {
          const index = dataSetDataArr.findIndex((i) => i.key === key);
          if (index === -1) {
            dispatch({
              type: 'purchaseReceipt/updateDataSetDataArr',
              payload: {
                dataSetDataArr: [
                  ...dataSetDataArr,
                  {
                    key,
                    form: modalFormDS,
                    table: modalTableDS,
                  },
                ],
              },
            });
          }
        },
        // onOk() {
        //   setQty(getQtyValue(type, { table: modalTableDS }, quantityRecCount, key));
        // },
        // footer: (okBtn) => okBtn,
        footer: (
          <div>
            <Button
              style={{ backgroundColor: '#1C879C', color: 'white' }}
              type="button"
              onClick={() => handleModalOk(modalTableDS)}
            >
              {intl.get('hzero.common.button.sure').d('确定')}
            </Button>
          </div>
        ),
        children: (
          <ModalChildren
            type={type}
            poNum={poNum}
            poLineNum={poLineNum}
            record={record}
            headerSearchDS={headerSearchDS}
            headFormDS={headFormDS}
            uomName={uomName}
            modalFormDS={modalFormDS}
            modalTableDS={modalTableDS}
            selectedKeys={selectedKeys}
            dispatch={dispatch}
          />
        ),
      });
      return null;
    };

    const ImgUploader = () => {
      return (
        <Col span={4} className={styles.upload}>
          <Icons type="ziyuan60" size="20" />
          <span>上传图片</span>
        </Col>
      );
    };

    const handleOnChange = (data) => {
      recList.forEach((item) => {
        if (item.poLineId === record.poLineId) {
          item.pictures = data;
        }
      });
      dispatch({
        type: 'purchaseReceipt/updateRecList',
        payload: {
          recList,
        },
      });
      // 无奈之举，待优化
      handeUpdateCount('update');
    };

    const handleRemark = () => {
      headFormDS.current.set('remark', record.lineRemark);
      const oldRemark = record.lineRemark;
      Modal.open({
        key: 'lwms-purchase-receive-remark-modal',
        title: '备注',
        className: 'lwms-purchase-receive-remark-modal',
        children: (
          <TextField
            dataSet={headFormDS}
            name="remark"
            style={{ marginTop: 30, height: 48, width: '100%' }}
          />
        ),
        onOk: () => setRemark(),
        onCancel: () => headFormDS.current.set('remark', oldRemark),
      });
    };

    const setRemark = () => {
      recList.forEach((item) => {
        if (item.poLineId === record.poLineId) {
          item.lineRemark = headFormDS.current.get('remark');
        }
      });
      handeUpdateCount('update');
    };

    useEffect(() => {
      let _iconPath = '';
      switch (type) {
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
    }, [type]);

    useEffect(() => {
      setQty(getQtyValue(type, ds, quantityRecCount, key));
    }, [type, ds, quantityRecCount, key]);

    return (
      <div className={styles['table-line']}>
        <div
          className={`${styles['table-line-top']} ${
            selectedKeys.includes[key] ? styles.highlight : ''
          }`}
        >
          <span>
            <CheckBox
              checked={selectedKeys.includes(key)}
              onChange={handleChange}
              style={{ justifySelf: 'center' }}
            />
          </span>
          <img
            src={iconPath}
            alt=""
            className={styles.icon}
            draggable={false}
            onClick={handleIconClick}
          />
          <div className={styles['receive-count-this-time']}>
            {type === 'QUANTITY' && (
              <span className={styles.button} onClick={() => handeUpdateCount('minus')}>
                -
              </span>
            )}
            <input
              className={styles.content}
              value={qty}
              readOnly={type !== 'QUANTITY'}
              onChange={(e) => handleInput(e, type)}
            />
            {type === 'QUANTITY' && (
              <span className={styles.button} onClick={() => handeUpdateCount('add')}>
                +
              </span>
            )}
          </div>
          <div className={styles['rec-count']}>
            <span className={styles.top}>{`${demandQty - receivedQty} ${uomName || ''}`}</span>
            <span className={styles.bottom}>
              {intl.get(`${intlPrefix}.model.toReceived`).d('待接收')}
            </span>
          </div>
          <div className={styles.item}>
            <div className={styles.top}>{itemDescription} </div>
            <div className={styles.bottom}>{itemCode} </div>
          </div>
          <div className={styles['rec-count']}>
            <span className={styles.top}>{`${demandQty} ${uomName || ''}`}</span>
            <span className={styles.bottom}>
              {intl.get(`${intlPrefix}.model.demandQty`).d('需求数量')}
            </span>
          </div>
          <div className={styles.item}>
            <div className={styles.top}>{supplierMdsName} </div>
            <div className={styles.bottom}>{`${poNum || ''}-${poLineNum || ''}`} </div>
          </div>
          <div className={styles.other}>
            <div className={styles.top}>{poLineStatusMeaning}</div>
            <div className={styles.bottom}>
              {demandDate ? moment(demandDate).format(DEFAULT_DATE_FORMAT) : ''}
            </div>
          </div>
        </div>
        <div className={styles['table-line-bottom']}>
          <ImgUpload
            modalKey={record.poLineId}
            pictures={record.pictures}
            bucketName={BUCKET_NAME_WMS}
            directory="purchase-receipt"
            onChange={handleOnChange}
            maxPicture={9}
            childrens={ImgUploader()}
          />
          <a style={{ color: '#1c879c', marginTop: '2px' }} onClick={handleRemark}>
            备注
          </a>
        </div>
      </div>
    );
  }
);

const VirtualScrollList = ({ recList = [], headerSearchDS, headFormDS, loading = false }) => {
  return (
    <div
      className={styles['virtual-scroll-list']}
      // ref={(node) => setWrapRef(node)}
    >
      <Spin spinning={loading}>
        {recList.length === 0 && (
          <div className={styles['no-data']}>
            {intl.get('hzero.common.components.noticeIcon.null').d('暂无数据')}
          </div>
        )}
        {/* <div ref={(node) => setPaddingRef(node)} /> */}
        <div
          className={styles.list}
          // ref={(node) => setContainerRef(node)}
        >
          {/* {recList.slice(scrolledItemsCount, scrolledItemsCount + 6).map((rec) => ( */}
          {recList.map((rec) => (
            <Line
              record={rec}
              headerSearchDS={headerSearchDS}
              headFormDS={headFormDS}
              key={rec.key}
            />
          ))}
        </div>
      </Spin>
    </div>
  );
};

/**
 * 时钟
 * @param {Object} props
 * */
const Clock = (props) => {
  const [time, setTime] = useState(getTime());
  useEffect(() => {
    const timeId = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <span className={styles['time-component']} {...props}>
      {time}
    </span>
  );
};

export { Clock, VirtualScrollList };
