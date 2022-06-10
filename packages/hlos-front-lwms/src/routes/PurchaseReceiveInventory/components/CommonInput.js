import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import './common.less';

export default (props) => {
  return (
    <div className="common-input">
      <NumberField
        step={props.step || 1}
        min={props.min || 0}
        defaultValue={props.defaultValue || 0}
        value={props.value || 0}
        disabled={props.disabled}
        onChange={(val) => props.onChange(val, props.record)}
      />
      <span className="sign left">-</span>
      <span className="sign right">+</span>
    </div>
  );
};
