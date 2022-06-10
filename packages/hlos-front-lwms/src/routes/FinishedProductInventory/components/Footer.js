/**
 * @Description: 产成品入库--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-10-07 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import RemarkImg from 'hlos-front/lib/assets/icons/remark.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';

export default ({ onSubmit, onReset, onExit, onRemark }) => {
  return (
    <div className="lwms-finished-product-inventory-footer">
      <div className="icon" onClick={onExit}>
        <img src={ExitImg} alt="" />
        <div className="line" />
        <p className="text">退出</p>
      </div>
      <div className="icon" onClick={onReset}>
        <img src={ResetImg} alt="" />
        <div className="line" />
        <p className="text">重置</p>
      </div>
      <div className="icon">
        <img src={RemarkImg} alt="" onClick={onRemark} />
        <div className="line" />
        <p className="text">备注</p>
      </div>
      <div className="icon" onClick={onSubmit}>
        <img src={SubmitImg} alt="" />
        <div className="line" />
        <p className="text">提交</p>
      </div>
    </div>
  );
};
