/**
 * @Description: 领料执行--捡料footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SendImg from 'hlos-front/lib/assets/icons/send2.svg';
import AutoSend from 'hlos-front/lib/assets/icons/pick.svg';
// import PickImg from 'hlos-front/lib/assets/icons/pick.svg';
// import RestoreImg from 'hlos-front/lib/assets/icons/revert.svg';

export default (props) => {
  if (!props.isHide) {
    return (
      <div className="footer">
        <div className="icon" onClick={props.onClose}>
          <img src={ExitImg} alt="" />
          <div className="line" />
          <p className="text">退出</p>
        </div>
        <div>
          {props.status === 'RELEASED' || props.status === 'PICKED' ? (
            <Fragment>
              <div className="icon" onClick={props.onReset}>
                <img src={ResetImg} alt="" />
                <div className="line" />
                <p className="text">重置</p>
              </div>
              <div className="icon" onClick={props.onAutoSend}>
                <img src={AutoSend} alt="" />
                <div className="line" />
                <p className="text">自动发出</p>
              </div>
            </Fragment>
          ) : // <div className="icon" onClick={props.onCancel}>
          //   <img src={RestoreImg} alt="" />
          //   <div className="line" />
          //   <p className="text">撤销</p>
          // </div>
          null}
          <div className="icon" onClick={props.onSend}>
            <img src={SendImg} alt="" />
            <div className="line" />
            <p className="text">发出</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="footer">
      <div className="icon" onClick={props.onClose}>
        <img src={ExitImg} alt="" />
        <div className="line" />
        <p className="text">退出</p>
      </div>
    </div>
  );
};
