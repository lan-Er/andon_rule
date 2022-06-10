/**
 * @Description: 领料执行--捡料footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import CancelImg from 'hlos-front/lib/assets/icons/cancel.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';

export default (props) => {
  return (
    <div className="footer">
      <div className="icon" onClick={props.onReceive}>
        <img src={SubmitImg} alt="" />
        <div className="line" />
        <p className="text">确认</p>
      </div>
      <div>
        <div className="icon" onClick={props.onReset}>
          <img src={ResetImg} alt="" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        <div className="icon" onClick={props.onExit}>
          <img src={CancelImg} alt="" />
          <div className="line" />
          <p className="text">取消</p>
        </div>
      </div>
    </div>
  );
};
