import React, { useEffect, useState } from 'react';
import { NumberField, TextField } from 'choerodon-ui/pro';
import styles from './style.less';

const ListItem = ({ data, onTagChange, onNumberChange, isExecutedFlag }) => {
  const inputArr = [
    {
      key: 'processOkQty',
      color: '#2D9558',
      title: '合格',
      value: data.processOkQty,
    },
    // {
    //   key: 'processNgQty',
    //   color: '#D05E3D',
    //   title: '不合格',
    //   value: data.processNgQty,
    // },
    // {
    //   key: 'scrappedQty',
    //   color: '#BFBFBF',
    //   title: '报废',
    //   value: data.scrappedQty,
    // },
    // {
    //   key: 'reworkQty',
    //   color: '#F7B500',
    //   title: '返修',
    //   value: data.reworkQty,
    // },
    // {
    //   key: 'pendingQty',
    //   color: '#5E35B1',
    //   title: '待定',
    //   value: data.pendingQty,
    // },
    {
      key: 'executableQty',
      color: '#5E35B1',
      title: '可执行',
      value: data.executableQty,
    },
  ];
  const [totalValue, setTotalValue] = useState(0);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (data.dataStatus === 'WAIT') {
      if (isExecutedFlag) {
        setStatus('待更新');
      } else {
        setStatus('待录入');
      }
    } else {
      setStatus('已提交');
    }
    setTotalValue((data.processOkQty || 0) + (data.executableQty || 0) || 0);
  }, []);
  return (
    <div className={styles['list-item']}>
      <div
        className={styles.status}
        style={{
          backgroundColor: data.dataStatus === 'WAIT' ? '#039BE5' : '#558B2F',
        }}
      >
        {status}
        {/* {data.dataStatus === 'WAIT' ? (isExecutedFlag ? '待更新 ' : '待录入') : '已提交'} */}
      </div>
      <div className={styles['list-content']}>
        <div className={styles.line}>
          <span title={data.itemDescription} className={styles.item}>
            {`${data.itemDescription}`}
          </span>
          <div className={styles['quantity-data']}>
            可执行数量:
            <span className={styles.value}>{data.executableQty.toFixed(2)}</span>
            {data.uomName}
          </div>
          <div className={styles.operation}>
            {data.firstOperationFlag && data.lastOperationFlag && (
              <span className={styles['operation-status']}>首</span>
            )}
            <span>{data.operation}</span>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles['document-number']}>
            <span>{data.taskNum}</span>
            <span className={styles['doc-status']}>{data.taskStatusMeaning}</span>
          </div>
          <div className={styles['quantity-content']}>
            <span className={styles.time}>
              {data.planStartTime} ~ {data.planEndTime}
            </span>
            <span>需求 {data.taskQty}</span>
          </div>
          <div className={styles['input-area']}>
            标签编码
            <TextField value={data.tagCode} placeholder="标签编码" onChange={onTagChange} />
          </div>
        </div>
        <div className={styles.line}>
          <span className={styles['document-number']}>{data.moNum}</span>
          <div className={styles.progress}>
            <div style={{ maxWidth: '80%', width: '100%', height: '100%' }}>
              {totalValue
                ? inputArr.map((v) => (
                  <span
                    title={v.value}
                    style={{
                        display: 'inline-block',
                        width: `${v.value > totalValue ? 100 : (v.value / totalValue) * 100}%`,
                        height: '100%',
                        backgroundColor: v.color,
                      }}
                  />
                  ))
                : null}
            </div>
            <span className={styles['progress-value']}>
              {data.processOkQty ? `${((data.processOkQty / totalValue) * 100).toFixed(2)}%` : '0%'}
            </span>
          </div>
          <div className={styles['input-area']}>
            合格数量
            <NumberField
              value={data.okQty}
              placeholder="合格数量"
              min="0"
              onChange={onNumberChange}
              disabled
            />
            {data.uomName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
