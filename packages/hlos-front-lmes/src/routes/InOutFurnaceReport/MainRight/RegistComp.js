/**
 * @Description: 单件流报工--MainRight-注册/上线
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import ListItem from './ListItem';

import styles from './index.less';

export default ({ list = [] }) => {
  return (
    <>
      <p className={styles.total}>
        总数：<span>{list.length}</span>
      </p>
      <div className={styles.list}>
        {list.map((i) => {
          return <ListItem key={i.wipId} data={i} />;
        })}
      </div>
    </>
  );
};
