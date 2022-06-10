/**
 * @Description: 批量报工--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-23 11:01:22
 */

import React from 'react';
import Icons from 'components/Icons';

import MoReturnImg from 'hlos-front/lib/assets/icons/mo-return-item.svg';
import EmployeePerformanceImg from 'hlos-front/lib/assets/icons/employee-performance.svg';

import styles from './style.less';

export default ({
  loginCheckArr,
  onExit,
  onFeeding,
  onPerformance,
  onDrawing,
  onPause,
  onRejectedMaterial,
  onStart,
  onSubmit,
  onLogin,
  onReset,
  onRemark,
  onCheckAll,
}) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={onExit}>
          <span>
            <Icons type="exit" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>退出</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={onCheckAll}>
          <span>
            <Icons type="check" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>全选</p>
        </div>
        <div className={styles.icon} onClick={onFeeding}>
          <span>
            <Icons type="component" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>组件</p>
        </div>
        <div className={styles.icon} onClick={() => onDrawing('drawing')}>
          <span>
            <Icons type="image-paper" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>图纸</p>
        </div>
        {/* {props.footerExtraBtnArr.findIndex((i) => i === 'instruction') !== -1 && ( */}
        <div className={styles.icon} onClick={() => onDrawing('esop')}>
          <span>
            <Icons type="gongyiwenjian1" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>工艺文件</p>
        </div>
        {/* )} */}
        <div className={styles['more-wrapper']}>
          <div className={styles['more-btn-wrapper']}>
            <div onClick={onPerformance}>
              <img src={EmployeePerformanceImg} alt="" />
              员工实绩
            </div>
            <div onClick={onRejectedMaterial}>
              <img src={MoReturnImg} alt="" />
              工单退料
            </div>
            <div className={styles['triangle-down']} />
          </div>
          <div className={styles.icon}>
            <span>
              <Icons type="more-btn" size="48" color="#333" />
            </span>
            <div className={styles.line} />
            <p className={styles.text}>更多</p>
          </div>
        </div>
        <div className={styles.icon} onClick={() => onLogin(loginCheckArr)}>
          <span>
            <Icons type="change" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>切换</p>
        </div>
        <div className={styles.icon} onClick={onRemark}>
          <span>
            <Icons type="remark" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>备注</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={onStart}>
          <span>
            <Icons type="start" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>开工</p>
        </div>
        <div className={styles.icon} onClick={onReset}>
          <span>
            <Icons type="reset" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>重置</p>
        </div>
        <div className={styles.icon} onClick={onPause}>
          <span>
            <Icons type="zanting1" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>暂停</p>
        </div>
        <div className={styles.icon} onClick={onSubmit}>
          <span>
            <Icons type="submit" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>提交</p>
        </div>
      </div>
    </div>
  );
};
