/**
 * @Description: 任务报工--content-right
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import echarts from 'echarts';
import { isEmpty } from 'lodash';
import { Select, NumberField, TextField } from 'choerodon-ui/pro';
import HistoryImg from 'hlos-front/lib/assets/icons/history.svg';
import UpImg from 'hlos-front/lib/assets/icons/down-blue.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';
import DeleteImg from 'hlos-front/lib/assets/icons/delete.svg';

import styles from './style.less';

export default (props) => {
  const [currentPage, changePage] = useState(0);
  const [list, setList] = useState([]);
  const [isUp, changeIsUp] = useState(false);
  const [currentTypeList, setCurrentTypeList] = useState([]);

  const {
    taskInfo = {},
    converseValueShow,
    makeLotNumber,
    isReturn,
    taskDS,
    showInputArr,
    showMainUom,
    tagRef,
    lotRef,
    onQtyChange,
    price,
  } = props;
  const {
    executableQty,
    processOkQty,
    reworkQty,
    processNgQty,
    scrappedQty,
    pendingQty,
    uomConversionValue,
  } = taskInfo;
  const { current } = taskDS;
  // const otherQty =
  //   (executableQty || 0) -
  //   (processOkQty || 0) -
  //   (reworkQty || 0) -
  //   (processNgQty || 0) -
  //   (scrappedQty || 0) -
  //   (pendingQty || 0);

  useEffect(() => {
    const statusChart = echarts.init(document.getElementById('left-chart'));
    let qty = !executableQty || executableQty < 0 ? 0 : executableQty;
    if (!showMainUom) {
      qty *= uomConversionValue || 0;
    }
    if (String(qty).split('.').length > 1) {
      qty = qty.toFixed(4);
    }
    const option = {
      title: {
        text: qty,
        top: 100,
        left: 'center',
        itemGap: 7,
        textStyle: {
          color: '#0CA1BF',
          fontSize: 50,
        },
        subtext: '可执行',
        subtextStyle: {
          fontSize: 18,
          color: '#999',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          label: false,
          animation: false,
          itemStyle: {
            // 此配置
            normal: {
              borderWidth: 9,
              borderColor: 'transparent',
              color(params) {
                return params.data.color;
              },
            },
          },
          data: [
            { value: processOkQty || 0, name: '合格', color: '#2D9558' },
            { value: reworkQty || 0, name: '返修', color: '#F7B500' },
            { value: processNgQty || 0, name: '不合格', color: '#DF5630' },
            { value: scrappedQty || 0, name: '报废', color: '#BFBFBF' },
            { value: pendingQty || 0, name: '待定', color: '#7F84D9' },
            { value: executableQty || 0, name: '其它', color: '#9B9B9B' },
          ],
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    statusChart.setOption(option);
  }, [taskInfo, showMainUom]);

  useEffect(() => {
    changePage(0);
    changeIsUp(false);
    setList(props.tagList.slice(0, 6));
  }, [props.tagList]);

  useEffect(() => {
    if (props.qcTypeList && props.qcTypeList.length) {
      const typeList = [];
      props.qcTypeList.forEach((i) => {
        if (showInputArr.includes(i.value.toLowerCase())) {
          typeList.push(i);
        }
      });
      if (typeList.length) {
        setCurrentTypeList(typeList);
        taskDS.current.set('qcType', typeList[0].value);
      }
    }
  }, [showInputArr]);

  function handlePageChange() {
    if (currentPage === 0 && (props.tagList.length < 6 || props.tagList.length === 6)) return;
    let _list = [];
    if (!isUp) {
      if (
        props.tagList.length < 6 * (currentPage + 2) ||
        props.tagList.length === 6 * (currentPage + 2)
      ) {
        changeIsUp(true);
      } else {
        changeIsUp(false);
      }
      if (
        props.tagList.length < 6 * (currentPage + 1) ||
        props.tagList.length === 6 * (currentPage + 1)
      ) {
        return;
      }

      changePage(currentPage + 1);
      _list = props.tagList.slice((currentPage + 1) * 6, (currentPage + 2) * 6);
    } else {
      if (currentPage === 1) {
        changeIsUp(false);
      }
      changePage(currentPage - 1);
      _list = props.tagList.slice((currentPage - 1) * 6, currentPage * 6);
    }
    setList(_list);
  }

  return (
    <div className={`${styles['report-item']} ${isReturn && styles.return}`}>
      {props.taskType !== 'QUANTITY' && !makeLotNumber && (
        <div className={`${styles['report-item-query']} ${styles[props.taskType]}`}>
          <NumberField
            dataSet={taskDS}
            className={styles.number}
            name="defaultQty"
            placeholder="请输入数量"
          />
          {props.taskType === 'TAG' ? (
            <div className={styles['scan-input']}>
              <Select
                dataSet={taskDS}
                name="qcType"
                className={styles['scan-select']}
                placeholder="请选择"
                optionsFilter={({ data }) =>
                  currentTypeList.findIndex((i) => i.value === data.value) >= 0
                }
              />
              <TextField
                dataSet={taskDS}
                name="tagInput"
                className={styles['scan-text']}
                placeholder="请输入或扫描标签编码"
                ref={tagRef}
                onEnterDown={props.onTagInput}
              />
              <img src={ScanImg} alt="" />
            </div>
          ) : (
            !makeLotNumber && (
              <div className={styles['scan-input']}>
                <TextField
                  dataSet={taskDS}
                  name="lotInput"
                  className={styles['scan-text']}
                  placeholder="请输入或扫描批次号"
                  ref={lotRef}
                  onEnterDown={props.onLotInput}
                />
                <img src={ScanImg} alt="" />
              </div>
            )
          )}
        </div>
      )}
      <div className={styles['report-item-main']}>
        <div className={styles['report-item-left']}>
          <div
            id="left-chart"
            style={{ width: 300, height: 300, marginLeft: props.taskType === 'TAG' ? -10 : 10 }}
          />
          <div className={`${styles['chart-legend']} ${styles[props.taskType]}`}>
            <p>
              <span>
                <span className={`${styles.circle} ${styles.OK}`} />
                合格
              </span>
              <span className={styles.num}>{processOkQty || 0}</span>
            </p>
            <p>
              <span>
                <span className={`${styles.circle} ${styles.REWORK}`} />
                返修
              </span>
              <span className={styles.num}>{reworkQty || 0}</span>
            </p>
            <p>
              <span>
                <span className={`${styles.circle} ${styles.NG}`} />
                不合格
              </span>
              <span className={styles.num}>{processNgQty || 0}</span>
            </p>
            <p>
              <span>
                <span className={`${styles.circle} ${styles.SCRAPPED}`} />
                报废
              </span>
              <span className={styles.num}>{scrappedQty || 0}</span>
            </p>
            <p>
              <span>
                <span className={`${styles.circle} ${styles.PENDING}`} />
                待定
              </span>
              <span className={styles.num}>{pendingQty || 0}</span>
            </p>
          </div>
        </div>
        <div className={styles['report-item-right']}>
          {props.taskType !== 'TAG' ? (
            <div className={`${styles['input-area']} ${styles[props.taskType]}`}>
              {props.taskType === 'LOT' && (
                <p
                  className={styles.history}
                  style={{ visibility: props.lotNumber || makeLotNumber ? 'visible' : 'hidden' }}
                >
                  {!makeLotNumber ? props.lotNumber : makeLotNumber}
                  {!makeLotNumber && (
                    <img
                      className={styles['delete-icon']}
                      src={DeleteImg}
                      alt=""
                      onClick={props.onDelLot}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {!makeLotNumber && (
                    <img src={HistoryImg} alt="" onClick={props.onShowHistoryModal} />
                  )}
                </p>
              )}
              <p className={styles.uom}>
                单位：
                <span>{showMainUom ? taskInfo.uomName : taskInfo.secondUomName || null}</span>
                <span style={{ marginLeft: 16 }}>
                  单价：
                  <span>{price}</span>
                </span>
              </p>
              {showInputArr.findIndex((i) => i === 'ok') !== -1 && (
                <div className={styles['input-item']}>
                  <p>
                    <span>
                      <span className={`${styles.circle} ${styles.OK}`} />
                      合格
                    </span>
                    <span className={styles['second-uom']}>
                      {props.secondUomShow &&
                        `${converseValueShow(current ? current.get('processOkQty1') : 0)}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className={styles['lmes-task-report-common-input']}>
                    <NumberField
                      dataSet={taskDS}
                      step={0.000001}
                      name="processOkQty1"
                      onChange={(value) => onQtyChange('processOkQty', value)}
                    />
                    {/* <span
                      className={`${styles.sign} ${styles.left}`}
                      onClick={() => onQtyChange('processOkQty', -1, true)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles.sign} ${styles.right}`}
                      onClick={() => onQtyChange('processOkQty', 1, true)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              )}
              {showInputArr.findIndex((i) => i === 'rework') !== -1 && (
                <div className={styles['input-item']}>
                  <p>
                    <span>
                      <span className={`${styles.circle} ${styles.REWORK}`} />
                      返修
                    </span>
                    <span className={styles['second-uom']}>
                      {props.secondUomShow &&
                        `${converseValueShow(current ? current.get('reworkQty1') : 0)}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className={styles['lmes-task-report-common-input']}>
                    <NumberField
                      dataSet={taskDS}
                      step={0.000001}
                      name="reworkQty1"
                      onChange={(value) => onQtyChange('reworkQty', value)}
                    />
                    {/* <span
                      className={`${styles.sign} ${styles.left}`}
                      onClick={() => onQtyChange('reworkQty', -1, true)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles.sign} ${styles.right}`}
                      onClick={() => onQtyChange('reworkQty', 1, true)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              )}
              {showInputArr.findIndex((i) => i === 'ng') !== -1 && (
                <div className={styles['input-item']}>
                  <p>
                    <span>
                      <span className={`${styles.circle} ${styles.NG}`} />
                      不合格
                    </span>
                    <span className={styles['second-uom']}>
                      {props.secondUomShow &&
                        `${converseValueShow(current ? current.get('processNgQty1') : 0)}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className={styles['lmes-task-report-common-input']}>
                    <NumberField
                      dataSet={taskDS}
                      step={0.000001}
                      name="processNgQty1"
                      onChange={(value) => onQtyChange('processNgQty', value)}
                    />
                    {/* <span
                      className={`${styles.sign} ${styles.left}`}
                      onClick={() => onQtyChange('processNgQty', -1, true)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles.sign} ${styles.right}`}
                      onClick={() => onQtyChange('processNgQty', 1, true)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              )}
              {showInputArr.findIndex((i) => i === 'scrapped') !== -1 && (
                <div className={styles['input-item']}>
                  <p>
                    <span>
                      <span className={`${styles.circle} ${styles.SCRAPPED}`} />
                      报废
                    </span>
                    <span className={styles['second-uom']}>
                      {props.secondUomShow &&
                        `${converseValueShow(current ? current.get('scrappedQty1') : 0)}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className={styles['lmes-task-report-common-input']}>
                    <NumberField
                      dataSet={taskDS}
                      step={0.000001}
                      name="scrappedQty1"
                      onChange={(value) => onQtyChange('scrappedQty', value)}
                    />
                    {/* <span
                      className={`${styles.sign} ${styles.left}`}
                      onClick={() => onQtyChange('scrappedQty', -1, true)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles.sign} ${styles.right}`}
                      onClick={() => onQtyChange('scrappedQty', 1, true)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              )}
              {showInputArr.findIndex((i) => i === 'pending') !== -1 && (
                <div className={styles['input-item']}>
                  <p>
                    <span>
                      <span className={`${styles.circle} ${styles.PENDING}`} />
                      待定
                    </span>
                    <span className={styles['second-uom']}>
                      {props.secondUomShow &&
                        `${converseValueShow(current ? current.get('pendingQty1') : 0)}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className={styles['lmes-task-report-common-input']}>
                    <NumberField
                      dataSet={taskDS}
                      step={0.000001}
                      name="pendingQty1"
                      onChange={(value) => onQtyChange('pendingQty', value)}
                    />
                    {/* <span
                      className={`${styles.sign} ${styles.left}`}
                      onClick={() => onQtyChange('pendingQty', -1, true)}
                    >
                      -
                    </span>
                    <span
                      className={`${styles.sign} ${styles.right}`}
                      onClick={() => onQtyChange('pendingQty', 1, true)}
                    >
                      +
                    </span> */}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles['tag-area']}>
              <div className={styles['tag-title']}>
                <p>
                  标签数：<span>{props.tagList.length}</span>
                </p>
                <p>
                  总数：<span>{props.tagTotal}</span>
                </p>
                <p>
                  单位：
                  <span>{showMainUom ? taskInfo.uomName : taskInfo.secondUomName || null}</span>
                </p>
                <p>
                  单价：
                  <span>{price}</span>
                </p>
              </div>
              <div className={styles['tag-list']} id="tag-list">
                {list &&
                  list.map((item) => {
                    return (
                      <div className={styles['tag-item']}>
                        <div>
                          <span className={`${styles.circle} ${styles[item.qcType]}`} />
                          <p className={styles['task-num']}>{item.tagCode}</p>
                          <NumberField
                            value={item.number || 0}
                            step={0.000001}
                            onChange={(value) => props.onTagInputChange(value, item.tagCode)}
                          />
                          <img src={DeleteImg} alt="" onClick={() => props.onTagDel(item)} />
                        </div>
                        <p className={styles['second-uom']}>
                          {props.secondUomShow &&
                            `${converseValueShow(item.number)}${props.secondUomShow}`}
                        </p>
                      </div>
                    );
                  })}
              </div>
              {!isEmpty(props.tagList) && !props.hideFlag && (
                <div className={styles.icon} style={{ marginTop: 12 }} onClick={handlePageChange}>
                  <img src={UpImg} alt="" style={{ transform: isUp && 'rotateX(180deg)' }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
