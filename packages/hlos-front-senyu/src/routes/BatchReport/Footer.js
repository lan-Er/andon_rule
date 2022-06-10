import React from 'react';
import Icons from 'components/Icons';

import styles from './style.less';

export default ({
  loginCheckArr,
  onExit,
  // onStart,
  onSubmit,
  onLogin,
  onReset,
  onRemark,
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
        {/* <div className={styles.icon} onClick={onStart}>
          <span>
            <Icons type="start" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>开工</p>
        </div> */}
        <div className={styles.icon} onClick={onReset}>
          <span>
            <Icons type="reset" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>重置</p>
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
