/*
 * @Description: 底部按钮组件
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-09-07 17:02:15
 */

import React from 'react';

import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
// import Picture from 'hlos-front/lib/assets/icons/image.svg';
// import RemarkImg from 'hlos-front/lib/assets/icons/remark.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';

export default (props) => {
  return (
    <div className="footer">
      <div className="icon" onClick={props.onClose}>
        <img src={ExitImg} alt="" />
        <div className="line" />
        <p className="text">退出</p>
      </div>
      <div className="ds-jc-around">
        <div className="icon" onClick={props.onReset}>
          <img src={ResetImg} alt="" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        {/* <div className="icon" onClick={props.onFeeding}> */}
        {/* <img src={Picture} alt="" /> */}
        {/* <div className="line" /> */}
        {/* <p className="text">图片</p> */}
        {/* </div> */}
        {/* <div className="icon" onClick={props.onRemarkClick}> */}
        {/* <img src={RemarkImg} alt="" /> */}
        {/* <div className="line" /> */}
        {/* <p className="text">备注</p> */}
        {/* </div> */}
        <div className="icon" onClick={props.onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className="line" />
          <p className="text">提交</p>
        </div>
      </div>
    </div>
  );
};
