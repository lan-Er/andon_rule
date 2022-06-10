/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-10-14 11:19:02
 * @LastEditors: allen
 * @LastEditTime: 2019-10-31 18:47:47
 */
import React from 'react';

import LKIcon from '../components/Icons';
import styles from './equipmentItem.less';

const EquipmentItem = (props) => {
  const {
    equipment: { attribute6, attribute2, attribute3, taskList },
  } = props;

  function getBorderColor() {
    switch (attribute6) {
      case '运行中':
        return 'green';
      case '默认':
      case '闲置':
        return 'grey';
      default:
        return 'red';
    }
  }

  return (
    <div
      className={styles['equipment-item']}
      style={{
        borderColor: getBorderColor(attribute6),
      }}
    >
      <div className={styles['equipment-info']}>
        <div className={styles['equipment-code']}>{attribute2}</div>
        <div className={styles['equipment-name']}>{attribute3}</div>
        <div className={styles['equipment-task-num']}>
          <LKIcon type="quantity" size="14" style={{ marginRight: 5 }} />
          <span>{taskList.length}</span>
        </div>
      </div>
      <div className={styles['equipment-status']}>
        {attribute6 === '运行中' ? <LKIcon type="dengpao2" color="green" size="20" /> : null}
        {attribute6 === '默认' ? <LKIcon type="dengpao2" color="grey" size="20" /> : null}
        {attribute6 === '闲置' ? <LKIcon type="dengpao2" color="grey" size="20" /> : null}
        {attribute6 === '故障' ? <LKIcon type="dengpao2" color="red" size="20" /> : null}
        {attribute6 === '维修中' ? <LKIcon type="dengpao2" color="red" size="20" /> : null}
        {attribute6 === '转移' ? <LKIcon type="dengpao2" color="red" size="20" /> : null}
      </div>
    </div>
  );
};

export default EquipmentItem;
