import React from 'react';
import Icons from 'components/Icons';
import intl from 'utils/intl';
import styles from './index.less';

const preCode = 'lmes.moReturnMaterial';

const Footer = ({ onExit, onSelectAll, onReset, onSubmit }) => {
  return (
    <div className={styles['mo-return-material-footer']}>
      <div>
        <div className={styles.icon} onClick={onExit}>
          <span>
            <Icons type="exit" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get(`${preCode}.button.exit`).d('退出')}</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={onSelectAll}>
          <span>
            <Icons type="check" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get(`${preCode}.button.selectAll`).d('全选')}</p>
        </div>
        <div className={styles.icon} onClick={onReset}>
          <span>
            <Icons type="reset" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get('hzero.common.button.reset').d('重置')}</p>
        </div>
        <div className={styles.icon} onClick={onSubmit}>
          <span>
            <Icons type="submit" size="48" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get('hzero.common.button.submit').d('提交')}</p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
