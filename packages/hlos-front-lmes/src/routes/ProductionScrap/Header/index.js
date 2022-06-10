/**
 * @Description: 生产报废 - header
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React, { useMemo } from 'react';
import { Icon } from 'choerodon-ui';
import Icons from 'components/Icons';
import Time from 'hlos-front/lib/components/Time';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import styles from './index.less';

export default ({
  loginData: {
    fileUrl,
    workerName,
    prodLineName,
    workcellName,
    equipmentName,
    workerGroupName,
    shiftCode,
    shiftCodeMeaning,
  },
  resourceList,
  onLoginClick,
}) => {
  const timeComponent = useMemo(() => <Time style={{ color: '#F3E8E6', fontSize: 20 }} />, []);
  return (
    <div className={styles['production-scrap-header']}>
      <div className={styles['header-left']}>
        <Icons type="logo" size="32" color="#1BB8CE" />
        <Icons type="Vector" size="22" color="#fff" style={{ marginLeft: 12 }} />
      </div>
      <div className={styles['header-center']} onClick={() => onLoginClick(resourceList)}>
        <div className={styles.worker}>
          <img src={fileUrl || defaultAvatorImg} alt="" />
          <span>{workerName || '请登录'}</span>
        </div>
        <Icon type="baseline-arrow_drop_down" style={{fontSize: 48}} />
      </div>
      <div className={styles['header-right']}>
        <div className={styles.location}>{prodLineName || workcellName || equipmentName || workerGroupName}</div>
        <div className={styles.clock}>
          {timeComponent}
          {shiftCode && <span className={styles.shift}>{shiftCodeMeaning}</span>}
        </div>
      </div>
    </div>
  );
};
