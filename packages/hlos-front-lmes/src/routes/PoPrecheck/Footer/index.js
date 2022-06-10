/**
 * @Description: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 09:41:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Select } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import exitImg from 'hlos-front/lib/assets/icons/exit.svg';
import changeImg from 'hlos-front/lib/assets/icons/change.svg';
import submitImg from 'hlos-front/lib/assets/icons/submit.svg';
import styles from './index.less';

export default ({ hasCreated, onWorkerChange, onExit, onCreate, onJudge, onNext }) => {
  const { Option } = Select;

  return (
    <div className={styles.footer}>
      <div style={{ width: '100%' }}>
        <div className={styles.icon} onClick={onExit}>
          <img src={exitImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
        <div className={styles.icon} onClick={onWorkerChange}>
          <img src={changeImg} alt="" />
          <div className={styles.line} />
          <p className={styles.text}>切换</p>
        </div>
        <div className={styles.icon} onClick={onNext}>
          <Icons type="next" size="50" />
          <div className={styles.line} />
          <p className={styles.text}>下一张</p>
        </div>
        <div className={styles.icon} onClick={onCreate}>
          <Icons type="Group3" size="50" />
          <div className={styles.line} />
          <p className={styles.text}>创建</p>
        </div>
        {hasCreated ? (
          <div className={styles.icon}>
            <img src={submitImg} alt="" />
            <div className={styles.line} />
            <p className={styles.text}>判定</p>
            <Select
              dropdownMenuStyle={{
                fontSize: '16px',
                width: '124px',
                height: '100px',
                backgroundColor: '#E5E7E9',
                border: '2px solid rgba(255, 255, 255, 0.193318)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                position: 'absolute',
                bottom: '110px',
                textAlign: 'center',
                color: '#051E2D',
              }}
              onChange={onJudge}
            >
              <Option value="PASS">合格</Option>
              <Option value="FAILED">不合格</Option>
            </Select>
          </div>
        ) : (
          <div className={styles.icon}>
            <img src={submitImg} alt="" />
            <div className={styles.line} />
            <p className={styles.text}>判定</p>
          </div>
        )}
      </div>
    </div>
  );
};
