/*
 * @Description: 卡片信息
 * @Author: zmt
 * @LastEditTime: 2021-05-12 09:34:27
 */

import React from 'react';
import { CheckBox, Tooltip } from 'choerodon-ui/pro';

import Icons from 'components/Icons';

import styles from './index.less';

export default function Card(props) {
  function getHeight() {
    let height = 0;
    if (props.type === 'RQC') {
      height = 139;
    } else if (
      props.type === 'SQC' ||
      props.type === 'RQC' ||
      props.type === 'FIRST' ||
      props.type === 'FINISH' ||
      props.type === 'ROUTING' ||
      props.type === 'FQC'
    ) {
      height = 165;
    } else if (props.type === 'IQC') {
      height = 193;
    }
    return height;
  }
  return (
    <div style={{ height: getHeight() }} className={styles.card}>
      <div className={`${styles.top} ${styles['ds-jc-between']}`}>
        <CheckBox checked={props.data.checked} onChange={props.handleSingleCheck} />
        <span className={styles['item-title']}>
          <Tooltip title={props.data.item}>{props.data.item}</Tooltip>
        </span>
        {props.data.priority && <span className={styles.priority}>{props.data.priority}</span>}
        <span className={styles.time}>{props.data.duration}</span>
      </div>
      <div className={styles['card-content']} onClick={props.handleToDetails}>
        <div className={styles['header-info']}>
          <Icons type="receipts" size="14" color="#9b9b9b" />
          <span>
            {props.data.sourceDocNum && props.data.sourceDocLineNum
              ? `${props.data.sourceDocNum}-${props.data.sourceDocLineNum}`
              : props.data.sourceDocNum || props.data.sourceDocLineNum}
          </span>
        </div>
        {props.type === 'IQC' ? (
          <div className={styles['header-info']}>
            <Icons type="receipts" size="14" color="#9b9b9b" />
            <span>
              {props.data.relatedDocNum && props.data.relatedDocLineNum
                ? `${props.data.relatedDocNum}-${props.data.relatedDocLineNum}`
                : props.data.relatedDocNum || props.data.relatedDocLineNum}
            </span>
          </div>
        ) : null}
        {props.type === 'ROUTING' ||
        props.type === 'FIRST' ||
        props.type === 'FINISH' ||
        props.type === 'FQC' ? (
          <div className={`${styles['header-info']} ${styles.procedure}`}>
            <Icons type="procedure" size="14" color="#9b9b9b" />
            <span>{props.data.operation || ''}</span>
          </div>
        ) : null}
        <div className={`${styles['header-info']} ${styles.date}`}>
          <Icons type="time" size="14" color="#9b9b9b" />
          <span>{props.data.createDate || ''}</span>
        </div>
        {props.type === 'IQC' || props.type === 'SQC' ? (
          <div className={`${styles['header-info']} ${styles.quantity}`}>
            <Icons type="supplier2" size="14" color="#9b9b9b" />
            <Tooltip title={props.data.partyName}>{props.data.partyName || ''}</Tooltip>
          </div>
        ) : null}
      </div>
      <div className={`${styles['ds-jc-between']} ${styles.bottom}`}>
        <div className={styles.name}>
          {props.data.declarer ? <span>{props.data.declarer.slice(0, 1)}</span> : null}
          <span>{props.data.declarer}</span>
        </div>
        <div>
          <span>检验数量 </span>
          <span className={styles.number}>{props.data.batchQty}</span>
          <span>{`/${props.data.sampleQty}`}</span>
        </div>
        {/* <div className={styles['party-name']}>
          <Tooltip title={props.data.partyName}>{props.data.partyName}</Tooltip>
        </div> */}
      </div>
    </div>
  );
}
