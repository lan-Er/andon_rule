/*
 * @Description: 恒光检验判定-拣料弹框
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-10-20 11:31:35
 */
import React from 'react';
import { Button, NumberField } from 'choerodon-ui/pro';

// import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';

export default function PickModal(props) {
  return (
    <div className="pick-modal">
      <div className="modal-top">
        {props.reasons.map((ele, index) => {
          return (
            <div className="reason" key={uuidv4()}>
              <div className="modal-top-title">{ele.exceptionName}</div>
              <div className="custom-counter">
                <span
                  className="counter-button"
                  onClick={() => props.handleUpdateCount('minus', index, props.itemIndex)}
                >
                  -
                </span>
                <NumberField
                  className="counter-content"
                  value={ele.exceptionQty || 0}
                  min={0}
                  step={1}
                  onChange={(value) => props.handleChange(value, index)}
                />
                <span
                  className="counter-button"
                  onClick={() => props.handleUpdateCount('add', index, props.itemIndex)}
                >
                  +
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="modal-footer">
        <Button onClick={props.handleCloseModal}>取消</Button>
        <Button className="confirm" onClick={props.handleConfirm}>
          确定
        </Button>
      </div>
    </div>
  );
}
