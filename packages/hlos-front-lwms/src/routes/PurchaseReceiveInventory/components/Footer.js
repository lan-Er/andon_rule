/**
 * @Description: 退料执行--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
// import PictureImg from 'hlos-front/lib/assets/icons/image.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';

export default ({ onSubmit, onReset, onExit }) => {
  return (
    <div className="lwms-purchase-receive-inventory-footer">
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
      {/* <div className="icon" onClick={onPicture}> */}
      {/* <img src={PictureImg} alt="" /> */}
      {/* <div className="line" /> */}
      {/* <p className="text">图片</p> */}
      {/* </div> */}
      {/* <div className="icon" onClick={onRemark}> */}
      {/* <img src={ResetImg} alt="" /> */}
      {/* <div className="line" /> */}
      {/* <p className="text">备注</p> */}
      {/* </div> */}
      <div className="icon" onClick={onSubmit}>
        <img src={SubmitImg} alt="" />
        <div className="line" />
        <p className="text">提交</p>
      </div>
    </div>
  );
};
