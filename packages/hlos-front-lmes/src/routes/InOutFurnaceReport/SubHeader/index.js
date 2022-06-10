/**
 * @Description: 进出炉报工--SubHeader
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import prodlineIcon from 'hlos-front/lib/assets/icons/prodline-gray.svg';
import operationIcon from 'hlos-front/lib/assets/icons/operation-gray.svg';
import classessIcon from 'hlos-front/lib/assets/icons/classess-gray.svg';
import carIcon from 'hlos-front/lib/assets/icons/car-gray.svg';
import styles from './index.less';

export default ({ data, shiftList }) => {
  const obj = shiftList.find((i) => i.value === data.calendarShiftCode);

  return (
    <div className={styles['sub-header']}>
      <div className={styles.worker}>
        <img src={data.fileUrl ? data.fileUrl : defaultAvatorImg} alt="" />
        <span>{data.workerName}</span>
      </div>
      <div>
        <img src={carIcon} alt="" />
        <span>{data.workcellName}</span>
      </div>
      <div>
        <img src={prodlineIcon} alt="" />
        <span>{data.prodLineName}</span>
      </div>
      <div>
        <img src={operationIcon} alt="" />
        <span>{data.organizationName}</span>
      </div>
      <div>
        <img src={classessIcon} alt="" />
        <span>{data.calendarDay}</span>
        <span style={{ marginLeft: 16 }}>{obj && obj.meaning}</span>
      </div>
    </div>
  );
};
