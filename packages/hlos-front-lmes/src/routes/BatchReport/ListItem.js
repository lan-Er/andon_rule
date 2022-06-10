import React, { useEffect, useState } from 'react';
import { CheckBox, NumberField, Tooltip } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';
import styles from './style.less';

const ListItem = ({ onItemClick, onNumChange, data }) => {
  const [inputArr, setInputArr] = useState([
    {
      key: 'processOk',
      color: '#2D9558',
      title: '合格',
    },
    {
      key: 'rework',
      color: '#F7B500',
      title: '返修',
    },
    {
      key: 'processNg',
      color: '#D05E3D',
      title: '不合格',
    },
    {
      key: 'scrapped',
      color: '#BFBFBF',
      title: '报废',
    },
    {
      key: 'pending',
      color: '#5E35B1',
      title: '待定',
    },
  ]);

  useEffect(() => {
    if (data.showinputArr) {
      const arr = [];
      inputArr.forEach((item) => {
        if (data.showinputArr.findIndex((i) => i === item.key) > -1) {
          arr.push(item);
        }
      });
      setInputArr(arr);
    }
  }, []);
  return (
    <div className={styles['list-item']}>
      <div className={styles['list-item-top']}>
        <div>
          <CheckBox checked={data.checked} onChange={(val) => onItemClick(val, data)} />
          <div>
            <span className={styles.num}>{data.executableQty}</span>
            <Tooltip placement="top" title={`${data.itemCode}${data.itemDescription || ''}`}>
              <span className={styles.item}>
                <span>{data.itemCode}</span>
                <span>{data.itemDescription}</span>
              </span>
            </Tooltip>
          </div>
        </div>
        <div className={styles.operation}>
          {data.firstOperationFlag && <span className={styles.flag}>首</span>}
          {data.lastOperationFlag && <span className={styles.flag}>末</span>}
          <span className={styles.name}>{data.operation}</span>
        </div>
      </div>
      <div className={styles['list-item-bottom']}>
        <div className={styles.order}>
          <div>
            <span>{data.taskNum}</span>
            <span className={styles.status}>{data.taskStatusMeaning}</span>
          </div>
          <span>{data.moNum}</span>
        </div>
        <div className={styles.progress}>
          <div>
            <span>
              {data.planStartTime}~{data.planEndTime}
            </span>
            <span className={styles.demand}>需求 {data.taskQty}</span>
          </div>
          <div>
            <Row className={styles['progress-block']}>
              {['processOk', 'processNg', 'scrapped', 'rework', 'pending'].map((i) => {
                return (
                  <Col
                    key={i}
                    span={Math.ceil(Number((data[`${i}Qty`] || 0) / data.taskQty) * 24)}
                    className={styles[i]}
                  />
                );
              })}
            </Row>
            <span className={styles.percent}>
              {Math.round(
                ((Number(data.processOkQty || 0) +
                  Number(data.processNgQty || 0) +
                  Number(data.scrappedQty || 0) +
                  Number(data.reworkQty || 0) +
                  Number(data.pendingQty || 0)) *
                  100) /
                  Number(data.taskQty || 0)
              )}
              %
            </span>
          </div>
        </div>
        <div className={styles['input-area']}>
          {inputArr.map((i) => {
            const obj = data.submitOutputLineVoList ? data.submitOutputLineVoList[0] : {};
            return (
              <div>
                <div className={styles.top}>
                  <span className={`${styles.circle} ${styles[i.key]}`} />
                  {i.title}
                </div>
                <NumberField
                  key={i.key}
                  value={obj[`${i.key}Qty`]}
                  className={styles[i.key]}
                  style={{
                    border: `1px solid ${i.color}`,
                    color: i.color,
                    width: `calc(100% - ${(16 * (inputArr.length - 1)) / inputArr.length}px)`,
                  }}
                  placeholder={i.title}
                  onChange={(val) => onNumChange(val, i.key, data)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
