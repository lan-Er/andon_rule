import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import styles from './index.less';

export default (props) => {
  return (
    <div className={styles['common-input']}>
      <NumberField
        step={props.step || 1}
        min={props.min || 0}
        defaultValue={props.defaultValue || 0}
        value={props.value || 0}
        disabled={props.disabled}
        onChange={(val) => props.onChange && props.onChange(val, props.record)}
      />
      <span className={[`${styles.sign} ${styles.left}`]}>-</span>
      <span className={[`${styles.sign} ${styles.right}`]}>+</span>
    </div>
  );
};
