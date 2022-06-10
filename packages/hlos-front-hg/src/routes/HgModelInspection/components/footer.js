/*
 * @Description: 检验判定执行页面底部
 * @Author: zmt
 * @LastEditTime: 2020-08-21 17:09:15
 */

import React from 'react';

import start from '../assets/start.svg';
import reset from '../assets/reset.svg';
import submit from '../assets/submit.svg';
import exit from '../assets/exit.svg';

export default (props) => {
  return (
    <div className="footer">
      <div className="icon" onClick={props.onClose}>
        <img src={exit} alt="exit" />
        <div className="line" />
        <p className="text">退出</p>
      </div>
      <div>
        <div className="icon" onClick={props.onStart}>
          <img src={start} alt="start" />
          <div className="line" />
          <p className="text">开始检验</p>
        </div>
        <div className="icon" onClick={props.onReset}>
          <img src={reset} alt="reset" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        <div className="icon" onClick={props.onSubmit}>
          <img src={submit} alt="submit" />
          <div className="line" />
          <p className="text">提交</p>
        </div>
      </div>
    </div>
  );
};
