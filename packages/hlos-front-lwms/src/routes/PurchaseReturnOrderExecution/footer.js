/*
 * @Description: 采购退货单底部
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-01 14:57:00
 */

import React from 'react';

import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SubmitImg from 'hlos-front/lib/assets/icons/submit.svg';
import CheckImg from 'hlos-front/lib/assets/icons/check.svg';

import style from './index.less';

export default (props) => {
  return (
    <div className={style.footer}>
      <div>
        <div className={style.icon} onClick={props.onClose}>
          <img src={ExitImg} alt="" />
          <div className={style.line} />
          <p className={style.text}>退出</p>
        </div>
      </div>
      <div>
        <div className={style.icon} onClick={props.onReset}>
          <img src={ResetImg} alt="" />
          <div className={style.line} />
          <p className={style.text}>重置</p>
        </div>
        <div className={style.icon} onClick={props.onAllChecked}>
          <img src={CheckImg} alt="" />
          <div className={style.line} />
          <p className={style.text}>全选</p>
        </div>
        <div className={style.icon} onClick={props.onSubmit}>
          <img src={SubmitImg} alt="" />
          <div className={style.line} />
          <p className={style.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
