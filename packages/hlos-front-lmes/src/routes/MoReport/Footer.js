/**
 * @Description: 任务报工--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ComponentImg from 'hlos-front/lib/assets/icons/component.svg';
import PaperImg from 'hlos-front/lib/assets/icons/image-paper.svg';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';
import ChangeImg from 'hlos-front/lib/assets/icons/change.svg';
import RemarkImg from 'hlos-front/lib/assets/icons/remark.svg';
import StartImg from 'hlos-front/lib/assets/icons/start.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import RestoreImg from 'hlos-front/lib/assets/icons/revert.svg';

export default (props) => {
  return (
    <div className="footer">
      <div className="icon" onClick={props.onClose}>
        <img src={ExitImg} alt="" />
        <div className="line" />
        <p className="text">退出</p>
      </div>
      <div>
        {props.footerExtraBtnArr.findIndex((i) => i === 'issue') !== -1 && (
          <div className="icon">
            <img src={ComponentImg} alt="" />
            <div className="line" />
            <p className="text">组件</p>
          </div>
        )}
        {props.footerExtraBtnArr.findIndex((i) => i === 'document') !== -1 && (
          <div className="icon">
            <img src={PaperImg} alt="" />
            <div className="line" />
            <p className="text">图纸</p>
          </div>
        )}
        {props.footerExtraBtnArr.findIndex((i) => i === 'report') !== -1 && (
          <div className="icon">
            <img src={CheckImg} alt="" />
            <div className="line" />
            <p className="text">报检</p>
          </div>
        )}
        <div className="icon" onClick={() => props.onChangeLogin(props.loginCheckArr)}>
          <img src={ChangeImg} alt="" />
          <div className="line" />
          <p className="text">切换</p>
        </div>
        <div className="icon" onClick={props.onRemarkClick}>
          <img src={RemarkImg} alt="" />
          <div className="line" />
          <p className="text">备注</p>
        </div>
      </div>
      <div>
        <div className="icon" onClick={props.onStart}>
          <img src={StartImg} alt="" />
          <div className="line" />
          <p className="text">开工</p>
        </div>
        <div className="icon" onClick={props.onReset}>
          <img src={ResetImg} alt="" />
          <div className="line" />
          <p className="text">重置</p>
        </div>
        <div className="icon" onClick={props.onRestore}>
          <img src={RestoreImg} alt="" />
          <div className="line" />
          <p className="text">撤销</p>
        </div>
        <div className="icon" onClick={props.onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className="line" />
          <p className="text">提交</p>
        </div>
      </div>
    </div>
  );
};
