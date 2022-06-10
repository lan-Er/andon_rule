/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import DeleteImg from 'hlos-front/lib/assets/icons/delete.svg';

export default (props) => {
  return (
    <div>
      {props.lotList.length ? (
        <div className="history-list">
          {props.lotList.map((item, index) => {
            return (
              <div className="history-item-line">
                <div className="line-left">
                  <p>{item.lotNumber}</p>
                </div>
                <div className="line-right">
                  {props.showInputArr.findIndex((i) => i === 'ok') !== -1 && (
                    <div className="line-input">
                      <p>
                        <span>
                          <span className="circle OK" />
                          合格
                        </span>
                        <span className="second-uom">
                          {props.secondUomShow &&
                            `${item.processOkQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className="lmes-mo-report-common-input">
                        <NumberField
                          min={0}
                          step={0.000001}
                          defaultValue={item.processOkQty}
                          onChange={(value) =>
                            props.onHistoryQtyChange('processOkQty', value, index)
                          }
                        />
                        <span className="sign left">-</span>
                        <span className="sign right">+</span>
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'ng') !== -1 && (
                    <div className="line-input">
                      <p>
                        <span>
                          <span className="circle NG" />
                          不合格
                        </span>
                        <span className="second-uom">
                          {props.secondUomShow &&
                            `${item.processNgQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className="lmes-mo-report-common-input">
                        <NumberField
                          min={0}
                          step={0.000001}
                          defaultValue={item.processNgQty}
                          onChange={(value) =>
                            props.onHistoryQtyChange('processNgQty', value, index)
                          }
                        />
                        <span className="sign left">-</span>
                        <span className="sign right">+</span>
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'scrap') !== -1 && (
                    <div className="line-input">
                      <p>
                        <span>
                          <span className="circle SCRAPPED" />
                          报废
                        </span>
                        <span className="second-uom">
                          {props.secondUomShow &&
                            `${item.scrappedQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className="lmes-mo-report-common-input">
                        <NumberField
                          min={0}
                          step={0.000001}
                          defaultValue={item.scrappedQty}
                          onChange={(value) =>
                            props.onHistoryQtyChange('scrappedQty', value, index)
                          }
                        />
                        <span className="sign left">-</span>
                        <span className="sign right">+</span>
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'rework') !== -1 && (
                    <div className="line-input">
                      <p>
                        <span>
                          <span className="circle REWORK" />
                          返修
                        </span>
                        <span className="second-uom">
                          {props.secondUomShow && `${item.reworkQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className="lmes-mo-report-common-input">
                        <NumberField
                          min={0}
                          step={0.000001}
                          defaultValue={item.reworkQty}
                          onChange={(value) => props.onHistoryQtyChange('reworkQty', value, index)}
                        />
                        <span className="sign left">-</span>
                        <span className="sign right">+</span>
                      </div>
                    </div>
                  )}
                  {props.showInputArr.findIndex((i) => i === 'pending') !== -1 && (
                    <div className="line-input">
                      <p>
                        <span>
                          <span className="circle PENDING" />
                          待定
                        </span>
                        <span className="second-uom">
                          {props.secondUomShow &&
                            `${item.pendingQtyExchange}${props.secondUomShow}`}
                        </span>
                      </p>
                      <div className="lmes-mo-report-common-input">
                        <NumberField
                          min={0}
                          step={0.000001}
                          defaultValue={item.pendingQty}
                          onChange={(value) => props.onHistoryQtyChange('pendingQty', value, index)}
                        />
                        <span className="sign left">-</span>
                        <span className="sign right">+</span>
                      </div>
                    </div>
                  )}
                  <div className="icon" onClick={() => props.onHistoryDel(index)}>
                    <img src={DeleteImg} alt="" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ width: '100%', textAlign: 'center', fontSize: 22, marginTop: 30 }}>
          暂无历史数据
        </p>
      )}
    </div>
  );
};
