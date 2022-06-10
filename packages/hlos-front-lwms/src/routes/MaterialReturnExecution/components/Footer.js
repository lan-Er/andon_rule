/**
 * @Description: 退料执行--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import DeleteImg from 'hlos-front/lib/assets/icons/delete-button.svg';
import ReturnImg from 'hlos-front/lib/assets/icons/return.svg';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';

export default ({ onCheckAll, onDelete, onReturn, onReset, onExit }) => {
  return (
    <div className="lwms-material-return-execution-footer">
      <div className="icon" onClick={onCheckAll}>
        <img src={CheckImg} alt="" />
        <div className="line" />
        <p className="text">全选</p>
      </div>
      <div>
        <div className="icon" onClick={onDelete}>
          <img src={DeleteImg} alt="" />
          <div className="line" />
          <p className="text">删除</p>
        </div>
        <div className="icon" onClick={onReturn}>
          <img src={ReturnImg} alt="" />
          <div className="line" />
          <p className="text">退料</p>
        </div>
        <div className="icon" onClick={onReset}>
          <img src={ResetImg} alt="" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        <div className="icon" onClick={onExit}>
          <img src={ExitImg} alt="" />
          <div className="line" />
          <p className="text">退出</p>
        </div>
      </div>
    </div>
  );
};
