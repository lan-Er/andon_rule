/**
 * @Description: 生产入库执行--Footer
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import React from 'react';
import Icons from 'components/Icons';
import intl from 'utils/intl';

import styles from './index.less';

const preCode = 'lwms.productionWarehousingExecution';

export default ({ lineDisabled = false, onExit, onReset, onSubmit }) => {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.icon} onClick={() => onExit(-1)}>
          <span>
            <Icons type="exit" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get(`${preCode}.button.exit`).d('退出')}</p>
        </div>
      </div>
      <div>
        <div className={styles.icon} onClick={onReset}>
          <span>
            <Icons type="reset" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>{intl.get('hzero.common.button.reset').d('重置')}</p>
        </div>
        <div className={styles.icon} onClick={onSubmit}>
          <span>
            <Icons type="submit" size="48" color="#333" />
          </span>
          <div className={styles.line} />
          <p className={styles.text}>
            {lineDisabled
              ? intl.get(`${preCode}.button.sure`).d('确认')
              : intl.get(`${preCode}.button.receive`).d('接收')}
          </p>
        </div>
      </div>
    </div>
  );
};
