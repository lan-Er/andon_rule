/**
 * @Description: 完工入库--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import DeleteImg from 'hlos-front/lib/assets/icons/delete-button.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import CancelImg from 'hlos-front/lib/assets/icons/cancel.svg';

export default ({ onCheckAll, onDelete, onSubmit, onReset, onExit }) => {
  return (
    <div className="lwms-wip-completion-footer">
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
        <div className="icon" onClick={onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className="line" />
          <p className="text">提交</p>
        </div>
        <div className="icon" onClick={onReset}>
          <img src={ResetImg} alt="" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        <div className="icon" onClick={onExit}>
          <img src={CancelImg} alt="" />
          <div className="line" />
          <p className="text">取消</p>
        </div>
      </div>
    </div>
  );
};
