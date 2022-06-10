/**
 * @Description: 单件流报工--MainRight-进站/出站
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Lov } from 'choerodon-ui/pro';
import ListItem from './ListItem';
import styles from './index.less';

export default ({ ds, onChangeTab, currentTab, list = [], onWorkcellChange }) => {
  return (
    <>
      <div className={styles['tabs-wrapper']}>
        <div className={styles.tabs}>
          <div
            className={currentTab === 'inner' ? `${styles.active}` : null}
            onClick={() => onChangeTab('inner')}
          >
            站内{currentTab === 'inner' ? `（${list.length}）` : ''}
          </div>
          <div
            className={currentTab === 'attention' ? `${styles.active}` : null}
            onClick={() => onChangeTab('attention')}
          >
            关注站{currentTab === 'attention' ? `（${list.length}）` : ''}
          </div>
        </div>
        {currentTab === 'attention' && (
          <div className={styles['workcell-input']}>
            <Lov
              dataSet={ds}
              name="workcellObj"
              placeholder="请选择关注工位"
              onChange={onWorkcellChange}
            />
          </div>
        )}
      </div>
      <div className={styles.list}>
        {list.map((i) => {
          return <ListItem key={i.wipId} data={i} />;
        })}
      </div>
    </>
  );
};
