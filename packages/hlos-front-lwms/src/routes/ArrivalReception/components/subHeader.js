/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-08 11:04:56
 * @LastEditTime: 2020-09-16 14:00:00
 * @Description: 到货接收二级头部
 */
import React from 'react';
import { Lov, TextField } from 'choerodon-ui/pro';

const LovSelect = (props) => {
  return (
    <div className="lov-suffix">
      {props.leftIcon && <img className="left-icon" src={props.leftIcon} alt="" />}
      {props.rightIcon && (
        <img
          className="lock-icon"
          src={props.rightIcon}
          alt=""
          onClick={() => props.onLockChange(props.name)}
        />
      )}

      <Lov
        dataSet={props.headerDS}
        name={props.name}
        className="sub-input"
        placeholder={props.placeholder}
        onChange={props.onQuery}
        noCache
      />
    </div>
  );
};

const TextSelect = (props) => {
  return (
    <div className="lov-suffix">
      {props.leftIcon && <img className="left-icon" src={props.leftIcon} alt="" />}
      {props.rightIcon && (
        <img
          className="lock-icon"
          src={props.rightIcon}
          alt=""
          onClick={() => props.onLockChange(props.name)}
        />
      )}

      <TextField
        dataSet={props.headerDS}
        name={props.name}
        className="sub-input sub-scan"
        placeholder={props.placeholder}
        onChange={props.onQuery}
      />
    </div>
  );
};

export { LovSelect, TextSelect };
