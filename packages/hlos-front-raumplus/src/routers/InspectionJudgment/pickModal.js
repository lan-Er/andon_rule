/*
 * @Description: 不良原因Modal
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-01-31 11:24:49
 */
import React, { useState } from 'react';
import { Button, NumberField } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import uuidv4 from 'uuid/v4';
import styles from './index.less';

export default function PickModal(props) {
  const [reasonList, setReasonList] = useState(props.reasons);

  const handleUpdateCount = (type, index) => {
    const _reasonList = reasonList.slice();
    if (type === 'add') {
      if (_reasonList[index].exceptionQty >= props.maxQuantity) {
        notification.warning({
          message: '不可大于批次数量',
        });
        return;
      }
      _reasonList[index].exceptionQty++;
    } else {
      if (_reasonList[index].exceptionQty <= 0) {
        return;
      }
      _reasonList[index].exceptionQty--;
    }
    setReasonList(_reasonList);
  };

  const handleChange = (value, index) => {
    const _reasonList = reasonList.slice();
    if (value > props.maxQuantity) {
      notification.warning({
        message: '不可大于批次数量',
      });
      _reasonList[index].exceptionQty = 0;
    } else {
      _reasonList[index].exceptionQty = value;
    }
    setReasonList(_reasonList);
  };
  return (
    <div className={styles['pick-modal']}>
      <div className={styles['modal-top']}>
        {reasonList.map((ele, index) => {
          return (
            <div className={styles.reason} key={uuidv4()}>
              <div className={styles['modal-top-title']}>{ele.exceptionName}</div>
              <div className={styles['custom-counter']}>
                <span
                  className={styles['counter-button']}
                  onClick={() => handleUpdateCount('minus', index)}
                >
                  -
                </span>
                <NumberField
                  className={styles['counter-content']}
                  value={ele.exceptionQty || 0}
                  min={0}
                  step={1}
                  onChange={(value) => handleChange(value, index)}
                />
                <span
                  className={styles['counter-button']}
                  onClick={() => handleUpdateCount('add', index)}
                >
                  +
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles['modal-footer']}>
        <Button onClick={props.onCloseModal}>取消</Button>
        <Button className={styles.confirm} onClick={() => props.onConfirm(reasonList)}>
          确定
        </Button>
      </div>
    </div>
  );
}
