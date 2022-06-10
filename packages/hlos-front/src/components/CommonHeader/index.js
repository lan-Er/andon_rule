/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-19 16:23:29
 */
/**
 * @Description: 公共头部组件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-10-16 10:28:08
 * @LastEditors: Please set LastEditors
 */

import React, { useMemo } from 'react';
import Icons from 'components/Icons';
import Time from '../Time';
import styles from './index.less';

export default (props) => {
  const timeComponent = useMemo(() => <Time />, []);
  return (
    <div className={styles['common-header']}>
      <div className={styles['common-header-left']}>
        <Icons type="logo" size="36" color="#fffff" />
        <span>{props.title}</span>
      </div>
      {timeComponent}
    </div>
  );
};
