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
import UpImg from 'hlos-front/lib/assets/icons/up-blue.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';
import DeleteImg from 'hlos-front/lib/assets/icons/delete.svg';

export default (props) => {
  const { moInfo = {}, moDS, converseValueShow } = props;
  const [currentPage, changePage] = useState(0);
  const [list, setList] = useState([]);
  const [isUp, changeIsUp] = useState(false);

  useEffect(() => {
    const statusChart = echarts.init(document.getElementById('left-chart'));
    const option = {
      title: {
        text: moInfo.makeQty || 0,
        top: 100,
        left: 'center',
        itemGap: 7,
        textStyle: {
          color: '#0C6B7E',
          fontSize: 50,
        },
        subtext: '生产数量',
        subtextStyle: {
          fontSize: 18,
          color: '#666',
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
              borderColor: '#fff',
              color(params) {
                return params.data.color;
              },
            },
          },
          data: [
            { value: moInfo.moExecuteList[0].processOkQty || 0, name: '合格', color: '#2D9558' },
            { value: moInfo.moExecuteList[0].reworkQty || 0, name: '返修', color: '#F7B500' },
            { value: moInfo.moExecuteList[0].processNgQty || 0, name: '不合格', color: '#DF5630' },
            { value: moInfo.moExecuteList[0].scrappedQty || 0, name: '报废', color: '#BFBFBF' },
            { value: moInfo.moExecuteList[0].pendingQty || 0, name: '待定', color: '#7F84D9' },
          ],
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    statusChart.setOption(option);
  }, [moInfo]);

  useEffect(() => {
    changePage(0);
    changeIsUp(false);
    setList(props.tagList.slice(0, 6));
  }, [props.tagList]);

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
    <div className="report-item">
      {props.taskType !== 'QUANTITY' && (
        <div className={`report-item-query ${props.taskType}`}>
          <NumberField
            dataSet={moDS}
            className="number"
            name="defaultQty"
            placeholder="请输入数量"
          />
          {props.taskType === 'TAG' ? (
            <div className="scan-input">
              <Select dataSet={moDS} name="qcType" defaultValue="OK" className="scan-select" />
              <TextField
                dataSet={moDS}
                name="tagInput"
                className="scan-text"
                placeholder="请输入或扫描标签编码"
                onEnterDown={props.onTagInput}
              />
              <img src={ScanImg} alt="" />
            </div>
          ) : (
            <div className="scan-input">
              <TextField
                dataSet={moDS}
                name="lotInput"
                className="scan-text"
                placeholder="请输入或扫描批次号"
                onEnterDown={props.onLotInput}
              />
              <img src={ScanImg} alt="" />
            </div>
          )}
        </div>
      )}
      <div className="report-item-main">
        <div className="report-item-left">
          <div
            id="left-chart"
            style={{ width: 300, height: 300, marginLeft: props.taskType === 'TAG' ? -10 : 10 }}
          />
          <div className={`chart-legend ${props.taskType}`}>
            <p>
              <span>
                <span className="circle OK" />
                合格
              </span>
              <span className="num">{moInfo.moExecuteList[0].completedQty || 0}</span>
            </p>
            <p>
              <span>
                <span className="circle REWORK" />
                返修
              </span>
              <span className="num">{moInfo.moExecuteList[0].reworkQty || 0}</span>
            </p>
            <p>
              <span>
                <span className="circle NG" />
                不合格
              </span>
              <span className="num">{moInfo.moExecuteList[0].processNgQty || 0}</span>
            </p>
            <p>
              <span>
                <span className="circle SCRAPPED" />
                报废
              </span>
              <span className="num">{moInfo.moExecuteList[0].scrappedQty || 0}</span>
            </p>
            <p>
              <span>
                <span className="circle PENDING" />
                待定
              </span>
              <span className="num">{moInfo.moExecuteList[0].pendingQty || 0}</span>
            </p>
          </div>
        </div>
        <div className="report-item-right">
          {props.taskType !== 'TAG' ? (
            <div className={`input-area ${props.taskType}`}>
              {props.taskType === 'LOT' && (
                <p
                  className="history"
                  style={{ visibility: props.lotNumber ? 'visible' : 'hidden' }}
                >
                  {props.lotNumber}
                  <img
                    className="delete-icon"
                    src={DeleteImg}
                    alt=""
                    onClick={props.onDelLot}
                    style={{ cursor: 'pointer' }}
                  />
                  <img src={HistoryImg} alt="" onClick={props.onShowHistoryModal} />
                </p>
              )}
              <p className="uom">
                单位：
                <span>{props.showMainUom ? moInfo.uomName : moInfo.secondUomName || null}</span>
              </p>
              {props.showInputArr.findIndex((i) => i === 'ok') !== -1 && (
                <div className="input-item">
                  <p>
                    <span>
                      <span className="circle OK" />
                      合格
                    </span>
                    <span className="second-uom">
                      {props.secondUomShow &&
                        `${converseValueShow(props.moDS.current.get('processOkQty'))}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className="lmes-mo-report-common-input">
                    <NumberField
                      dataSet={moDS}
                      name="processOkQty"
                      onChange={(value) => props.onQtyChange('processOkQty', value)}
                    />
                    <span className="sign left">-</span>
                    <span className="sign right">+</span>
                  </div>
                </div>
              )}
              {props.showInputArr.findIndex((i) => i === 'rework') !== -1 && (
                <div className="input-item">
                  <p>
                    <span>
                      <span className="circle REWORK" />
                      返修
                    </span>
                    <span className="second-uom">
                      {props.secondUomShow &&
                        `${converseValueShow(props.moDS.current.get('reworkQty'))}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className="lmes-mo-report-common-input">
                    <NumberField
                      dataSet={moDS}
                      name="reworkQty"
                      onChange={(value) => props.onQtyChange('reworkQty', value)}
                    />
                    <span className="sign left">-</span>
                    <span className="sign right">+</span>
                  </div>
                </div>
              )}
              {props.showInputArr.findIndex((i) => i === 'ng') !== -1 && (
                <div className="input-item">
                  <p>
                    <span>
                      <span className="circle NG" />
                      不合格
                    </span>
                    <span className="second-uom">
                      {props.secondUomShow &&
                        `${converseValueShow(props.moDS.current.get('processNgQty'))}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className="lmes-mo-report-common-input">
                    <NumberField
                      dataSet={moDS}
                      name="processNgQty"
                      onChange={(value) => props.onQtyChange('processNgQty', value)}
                    />
                    <span className="sign left">-</span>
                    <span className="sign right">+</span>
                  </div>
                </div>
              )}
              {props.showInputArr.findIndex((i) => i === 'scrap') !== -1 && (
                <div className="input-item">
                  <p>
                    <span>
                      <span className="circle SCRAPPED" />
                      报废
                    </span>
                    <span className="second-uom">
                      {props.secondUomShow &&
                        `${converseValueShow(props.moDS.current.get('scrappedQty'))}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className="lmes-mo-report-common-input">
                    <NumberField
                      dataSet={moDS}
                      name="scrappedQty"
                      onChange={(value) => props.onQtyChange('scrappedQty', value)}
                    />
                    <span className="sign left">-</span>
                    <span className="sign right">+</span>
                  </div>
                </div>
              )}
              {props.showInputArr.findIndex((i) => i === 'pending') !== -1 && (
                <div className="input-item">
                  <p>
                    <span>
                      <span className="circle PENDING" />
                      待定
                    </span>
                    <span className="second-uom">
                      {props.secondUomShow &&
                        `${converseValueShow(props.moDS.current.get('pendingQty'))}${
                          props.secondUomShow
                        }`}
                    </span>
                  </p>
                  <div className="lmes-mo-report-common-input">
                    <NumberField
                      dataSet={moDS}
                      name="pendingQty"
                      onChange={(value) => props.onQtyChange('pendingQty', value)}
                    />
                    <span className="sign left">-</span>
                    <span className="sign right">+</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="tag-area">
              <div className="tag-title">
                <p>
                  标签数：<span>{props.tagList.length}</span>
                </p>
                <p>
                  总数：<span>{props.tagTotal}</span>
                </p>
                <p>
                  单位：
                  <span>{props.showMainUom ? moInfo.uomName : moInfo.secondUomName || null}</span>
                </p>
              </div>
              <div className="tag-list" id="tag-list">
                {list &&
                  list.map((item) => {
                    return (
                      <div className="tag-item">
                        <div>
                          <span className={`circle ${item.qcType}`} />
                          <p className="task-num">{item.tagCode}</p>
                          <NumberField
                            value={item.number}
                            onChange={(value) => props.onTagInputChange(value, item.tagCode)}
                          />
                          <img src={DeleteImg} alt="" onClick={() => props.onTagDel(item)} />
                        </div>
                        <p className="second-uom">
                          {props.secondUomShow &&
                            `${converseValueShow(item.number)}${props.secondUomShow}`}
                        </p>
                      </div>
                    );
                  })}
              </div>
              {!isEmpty(props.tagList) && !props.hideFlag && (
                <div className="icon" style={{ marginTop: 12 }} onClick={handlePageChange}>
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
