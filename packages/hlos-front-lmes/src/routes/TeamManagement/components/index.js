/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-09-08 11:04:56
 * @LastEditTime: 2021-06-01 11:13:18
 * @Description: 班组管理
 */
import React from 'react';
import { Lov, TextField, DatePicker, Select, NumberField } from 'choerodon-ui/pro';

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
        className={`sub-input ${props.rightIcon ? '' : 'none-right-icon'}`}
        placeholder={props.placeholder}
        onChange={props.onQuery}
        noCache
      />
    </div>
  );
};

const DatePickerSelect = (props) => {
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

      <DatePicker
        dataSet={props.headerDS}
        name={props.name}
        className={`sub-input ${props.rightIcon ? '' : 'none-right-icon'}`}
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

const Selected = (props) => {
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

      <Select
        dataSet={props.headerDS}
        name={props.name}
        className="sub-input sub-scan"
        placeholder={props.placeholder}
        onChange={props.onQuery}
      />
    </div>
  );
};

const CommonInput = (props) => {
  return (
    <div className="common-input">
      <NumberField
        dataSet={props.dataSet}
        name={props.name}
        step={props.step || 1}
        min={props.min || 0}
        // max={props.existQuantity || null}
        // value={props.quantity || 0}
        // onChange={handleChangeQuantity}
      />
      <span className="sign left">-</span>
      <span className="sign right">+</span>
    </div>
  );
};

export { LovSelect, TextSelect, DatePickerSelect, Selected, CommonInput };
