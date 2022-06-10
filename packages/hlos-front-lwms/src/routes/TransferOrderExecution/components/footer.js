/*
 * @Description: 检验判定执行页面底部
 * @Author: zmt
 * @LastEditTime: 2021-03-05 09:57:07
 */

import React, { Fragment } from 'react';
import ExitImg from 'hlos-front/lib/assets/icons/exit.svg';
import ResetImg from 'hlos-front/lib/assets/icons/reset.svg';
import SendImg from 'hlos-front/lib/assets/icons/send2.svg';
import PickImg from 'hlos-front/lib/assets/icons/pick.svg';

import style from '../index.less';

export default (props) => {
  return (
    <div className={style.footer}>
      <div className={style.icon} onClick={props.onClose}>
        <img src={ExitImg} alt="" />
        <div className={style.line} />
        <p className={style.text}>退出</p>
      </div>
      <div className={style['ds-jc-around']}>
        {props.status === 'RELEASED' ? (
          <Fragment>
            <div className={style.icon} onClick={props.onReset}>
              <img src={ResetImg} alt="" />
              <div className={style.line} />
              <p className={style.text}>重置</p>
            </div>
            <div className={style.icon} onClick={props.onPick}>
              <img src={PickImg} alt="" />
              <div className={style.line} />
              <p className={style.text}>拣料</p>
            </div>
          </Fragment>
        ) : null}
        {props.status === 'PICKED' ? (
          <div className={style.icon} onClick={props.onTransfer}>
            <img src={SendImg} alt="" />
            <div className={style.line} />
            <p className={style.text}>转移</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
